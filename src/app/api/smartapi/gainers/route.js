import { NextResponse } from 'next/server';
import { ensureSession } from '@/lib/smartapi';


export async function POST(req) {
  try {
    // const { symbolToken } = await req.json();

    const smartAPI = await ensureSession();

    const margin = await smartAPI.getProfile();

    console.log(margin)

    return NextResponse.json(margin);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to get margin' }, { status: 500 });
  }
}
