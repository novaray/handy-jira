import ffmpeg, { FfprobeData } from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeStatic from 'ffprobe-static';
import fs from 'fs';
import path from 'path';
import { tmpdir } from 'os';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

ffmpeg.setFfmpegPath(ffmpegInstaller.path); // ffmpeg binary path 설정
ffmpeg.setFfprobePath(ffprobeStatic.path); // ffprobe binary path 설정
const targetSizeBytes = 10 * 1024 * 1024; //10MB 제한.

export default defineEventHandler(async (event) => {
  const { fileKey } = getQuery(event);
  if (!fileKey) {
    throw createError({
      statusCode: 400,
      statusMessage: 'PARAMETER_MISSING'
    });
  }

  const r2BucketName = useRuntimeConfig(event).public || process.env.R2_BUCKET_NAME;
  const s3Client = generateS3Client(event);

  const fullFileName = fileKey as string;
  const fileExtension = fullFileName.split('.').pop() as string;
  const params = {
    Bucket: r2BucketName,
    Key: fullFileName
  };

  const getCommand = new GetObjectCommand(params);
  const inputVideoPath = path.join(tmpdir(), fullFileName);

  const newFileName = `${uuidv4()}.${fileExtension}`;
  const outputVideoPath = path.join(tmpdir(), newFileName);
  try {
    const response = await s3Client.send(getCommand);
    const fileString = await response.Body!.transformToByteArray();

    // 임시로 파일 저장
    fs.writeFileSync(inputVideoPath, fileString);

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

    const putParams = {
      Bucket: r2BucketName,
      Key: newFileName
    };
    const putCommand = new PutObjectCommand(putParams);
    const signedUrl = await getSignedUrl(s3Client, putCommand);

    await $fetch(signedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'video/*',
        'Content-Length': fs.statSync(outputVideoPath).size.toString()
      },
      body: fs.createReadStream(outputVideoPath)
    });

    return {
      downloadFileName: newFileName
    };
  } catch (error: any) {
    console.dir(error);
    const message = error.message || error.statusMessage;
    throw createError({
      statusCode: 500,
      statusMessage: typeof message === 'string' ? message : 'Video processing error'
    });
  } finally {
    fs.unlinkSync(inputVideoPath);
    if (fs.existsSync(outputVideoPath)) {
      fs.unlinkSync(outputVideoPath);
    }
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
