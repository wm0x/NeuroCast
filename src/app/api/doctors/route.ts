import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password, name } = body;

    if (!username || !password || !name) {
      return NextResponse.json(
        { error: "Enter All Values" }, 
        { status: 400 }
      );
    }

    const existingUser = await db.user.findUnique({ where: { username } });
    if (existingUser) {
      return NextResponse.json({ error: "user name already use" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = await db.user.create({
      data: {
        username,
        name,
        password: hashedPassword,
        role: 'DOCTOR',
      },
    });

    const { password: _, ...doctorData } = doctor;

    return NextResponse.json(doctorData, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error:"Error on the server" }, { status: 500 });
  }
}

export async function GET() {
    const doctors = await db.user.findMany({
      where: { role: 'DOCTOR' },
      select: { id: true, name: true, username: true, createdAt: true } 
    });
    return NextResponse.json(doctors);
  }