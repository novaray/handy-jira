import ffmpeg, { FfprobeData } from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeStatic from 'ffprobe-static';
import fs from 'fs';
import path from 'path';
import { tmpdir } from 'os';

ffmpeg.setFfmpegPath(ffmpegInstaller.path); // ffmpeg binary path 설정
ffmpeg.setFfprobePath(ffprobeStatic.path); // ffprobe binary path 설정
const targetSizeBytes = 10 * 1024 * 1024; //10MB 제한.

export default defineEventHandler(async (event) => {
  // 파일 업로드 처리
  const form = await readMultipartFormData(event);

  if (!form || !form.length) {
    throw createError({
      statusCode: 400,
      statusMessage: 'NO_FILE_UPLOADED'
    });
  }

  const videoFile = form.find((file) => file.filename);

  if (!videoFile) {
    throw createError({
      statusCode: 400,
      statusMessage: 'NO_FILE_UPLOADED'
    });
  }

  const inputVideoPath = path.join(tmpdir(), videoFile.filename!);
  const outputVideoPath = path.join(tmpdir(), `output-${Date.now()}.mp4`);

  // 임시로 파일 저장
  fs.writeFileSync(inputVideoPath, videoFile.data);

  try {
    // 비디오 파일 메타데이터 분석
    const metadata: FfprobeData = await new Promise((resolve, reject) => {
      ffmpeg.ffprobe(inputVideoPath, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });

    const duration = metadata.format.duration!;
    const targetBitrate = (targetSizeBytes * 8) / duration;

    // 비디오 압축 처리
    await compressVideo(inputVideoPath, outputVideoPath, targetBitrate);

    // 최종 파일 크기 확인
    const stats = fs.statSync(outputVideoPath);
    const fileSizeInBytes = stats.size;

    if (fileSizeInBytes > targetSizeBytes) {
      fs.unlinkSync(inputVideoPath);
      if (fs.existsSync(outputVideoPath)) {
        fs.unlinkSync(outputVideoPath);
      }
      throw new Error('FILE_SIZE_EX');
    }

    // 압축된 비디오 파일을 클라이언트로 전송
    const stream = fs.createReadStream(outputVideoPath);
    return sendStream(event, stream).finally(() => {
      // 스트림이 끝나면 임시 파일 삭제
      fs.unlinkSync(inputVideoPath);
      if (fs.existsSync(outputVideoPath)) {
        fs.unlinkSync(outputVideoPath);
      }
    });
  } catch (error: any) {
    console.error('Video processing error:', error);
    const message = error.message || error.statusMessage;
    throw createError({
      statusCode: 500,
      statusMessage: typeof message === 'string' ? message : 'Video processing error'
    });
  }
});

// 비디오 파일 메타데이터 분석 및 압축
const compressVideo = (input: string, output: string, bitrate: number) => {
  return new Promise((resolve, reject) => {
    ffmpeg(input)
      .videoCodec('libx264')
      .videoBitrate(`${bitrate / 1000}k`)
      .outputOptions(['-preset fast', '-crf 23'])
      .on('end', () => resolve(undefined))
      .on('error', (err: Error) => reject(err))
      .save(output);
  });
};
