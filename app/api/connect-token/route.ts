import { NextResponse } from 'next/server'
import { PluggyClient } from 'pluggy-sdk'

export async function POST(request: Request) {
  const pluggyClient = new PluggyClient({
    clientId: process.env.PLUGGY_CLIENT_ID || '',
    clientSecret: process.env.PLUGGY_CLIENT_SECRET || ''
  })
  const { accessToken } = await pluggyClient.createConnectToken()
  return NextResponse.json({ connectToken: accessToken })
}
