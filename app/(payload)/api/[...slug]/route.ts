/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
import type { NextRequest } from 'next/server'

import config from '@payload-config'
import { REST_DELETE, REST_GET, REST_PATCH, REST_POST } from '@payloadcms/next/routes'

export const GET = async (req: NextRequest) => {
  return REST_GET(req, { config })
}

export const POST = async (req: NextRequest) => {
  return REST_POST(req, { config })
}

export const DELETE = async (req: NextRequest) => {
  return REST_DELETE(req, { config })
}

export const PATCH = async (req: NextRequest) => {
  return REST_PATCH(req, { config })
}

