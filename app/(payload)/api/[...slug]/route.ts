/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
import type { NextRequest } from 'next/server'

import config from '@payload-config'
import { REST_DELETE, REST_GET, REST_PATCH, REST_POST } from '@payloadcms/next/routes'

export async function GET(req: NextRequest) {
  return REST_GET(req, { config })
}

export async function POST(req: NextRequest) {
  return REST_POST(req, { config })
}

export async function DELETE(req: NextRequest) {
  return REST_DELETE(req, { config })
}

export async function PATCH(req: NextRequest) {
  return REST_PATCH(req, { config })
}