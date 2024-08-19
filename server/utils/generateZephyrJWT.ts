import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import {
  JIRA_ACCOUNT_ID_NAME,
  ZEPHYR_ACCESS_API_COOKIE_NAME,
  ZEPHYR_SHARED_API_COOKIE_NAME
} from '~~/constants/cookieName';
import type { H3Event } from 'h3';

export const generateZephyrJWT = (event: H3Event, method: string, relativePath: string, querystring: string) => {
  const accountId = getCookie(event, JIRA_ACCOUNT_ID_NAME);
  const sharedKey = getCookie(event, ZEPHYR_SHARED_API_COOKIE_NAME);
  const accessKey = getCookie(event, ZEPHYR_ACCESS_API_COOKIE_NAME);

  if (!accountId || !sharedKey || !accessKey) {
    throw createError({
      statusCode: 400,
      // statusMessage: 'Jira Account ID, Zephyr Shared Key, and Zephyr Access Key are required.'
      statusMessage: 'Please Login.'
    });
  }

  // 현재 시간 (초 단위)
  const now = Math.floor(Date.now() / 1000);

  // JWT 헤더
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };
  const qsh = crypto.createHash('sha256').update(`${method}&${relativePath}&${querystring}`).digest('hex');

  // JWT 페이로드
  const payload = {
    iss: accessKey, // 발급자
    iat: now, // 발급 시간
    exp: now + 3600, // 만료 시간 (1시간 후)
    qsh: qsh, // query string hash
    sub: accountId, // 사용자 ID
    context: { user: { accountId: accountId } } // 사용자 컨텍스트
  };

  // JWT 생성
  return jwt.sign(payload, sharedKey, { header: header });
};
