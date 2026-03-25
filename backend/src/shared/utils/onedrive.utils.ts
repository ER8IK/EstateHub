import https from 'https';
import querystring from 'querystring';

let cachedAccessToken: string | null = null;
let tokenExpiry: number = 0;

async function httpRequest(options: https.RequestOptions, body?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

export async function getAccessToken(): Promise<string> {
  if (cachedAccessToken && Date.now() < tokenExpiry) {
    return cachedAccessToken;
  }

  const body = querystring.stringify({
    client_id: process.env.MS_CLIENT_ID!,
    client_secret: process.env.MS_CLIENT_SECRET!,
    refresh_token: process.env.MS_REFRESH_TOKEN!,
    grant_type: 'refresh_token',
    scope: 'Files.ReadWrite offline_access User.Read',
  });

  const response = await httpRequest({
    hostname: 'login.microsoftonline.com',
    path: '/common/oauth2/v2.0/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(body),
    },
  }, body);

  const data = JSON.parse(response);

  if (data.error) {
    throw new Error(`Token error: ${data.error_description}`);
  }

  cachedAccessToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;

  // Обновляем refresh token если пришёл новый
  if (data.refresh_token) {
    process.env.MS_REFRESH_TOKEN = data.refresh_token;
  }

  return cachedAccessToken!;
}

export async function uploadToOneDrive(
  fileName: string,
  content: string
): Promise<string> {
  const token = await getAccessToken();
  const folder = process.env.ONEDRIVE_FOLDER || 'EstateHub/tickets';
  const path = `/me/drive/root:/${folder}/${fileName}:/content`;
  const bodyBuffer = Buffer.from(content, 'utf-8');

  const response = await httpRequest({
    hostname: 'graph.microsoft.com',
    path: `/v1.0${path}`,
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Content-Length': bodyBuffer.length,
    },
  }, bodyBuffer.toString());

  const data = JSON.parse(response);

  if (!data.webUrl) {
    throw new Error(`OneDrive upload failed: ${JSON.stringify(data)}`);
  }

  return data.webUrl;
}