import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: process.env.S3_REGION || 'eu-central-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
  },
})

const BUCKET = process.env.S3_BUCKET || ''
const PUBLIC_URL_BASE = process.env.S3_PUBLIC_URL_BASE || ''

export async function uploadToS3(file: Buffer, key: string, contentType: string | undefined) {
  if (!process.env.S3_ACCESS_KEY_ID || !process.env.S3_SECRET_ACCESS_KEY || !BUCKET) {
    throw new Error('S3 credentials or bucket not configured')
  }

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: file,
    ContentType: contentType || 'application/octet-stream',
    // Do not set ACL when Bucket Owner Enforced is enabled
  })

  await s3Client.send(command)
  const base = PUBLIC_URL_BASE || inferPublicBase()
  return `${base}/${key}`
}

export async function deleteFromS3(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: key,
  })

  await s3Client.send(command)
}

export function getS3Url(key: string) {
  const base = PUBLIC_URL_BASE || inferPublicBase()
  return `${base}/${key}`
}

export function extractS3KeyFromUrl(url: string): string | null {
  try {
    // Prefer configured base if provided
    if (PUBLIC_URL_BASE) {
      if (!url.startsWith(`${PUBLIC_URL_BASE}/`)) return null
      return url.slice(PUBLIC_URL_BASE.length + 1)
    }

    // Otherwise, infer current bucket base and try to strip it
    const inferred = inferPublicBase()
    if (url.startsWith(`${inferred}/`)) {
      return url.slice(inferred.length + 1)
    }

    // As a fallback, handle common S3 patterns
    // Pattern 1: https://<bucket>.s3.<region>.amazonaws.com/<key>
    const m1 = url.match(/^https:\/\/([^\.]+)\.s3\.[^\/]+\.amazonaws\.com\/(.*)$/)
    if (m1 && m1[2]) return m1[2]
    // Pattern 2: https://s3.<region>.amazonaws.com/<bucket>/<key>
    const m2 = url.match(/^https:\/\/s3\.[^\/]+\.amazonaws\.com\/([^\/]+)\/(.*)$/)
    if (m2 && m2[2]) return m2[2]

    return null
  } catch {
    return null
  }
}

function inferPublicBase() {
  const bucket = BUCKET
  const region = process.env.S3_REGION || 'eu-central-1'
  if (!bucket) throw new Error('Missing S3_BUCKET for URL base inference')
  // us-east-1 special case
  if (region === 'us-east-1') return `https://${bucket}.s3.amazonaws.com`
  return `https://${bucket}.s3.${region}.amazonaws.com`
}
