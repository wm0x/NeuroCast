import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get('id');

  console.log(" API received request for ID:", patientId);

  if (!patientId) {
    return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 });
  }

  try {
    const patient = await prisma.patient.findUnique({
      where: { patientId: patientId },
      include: {
        visits: {
          orderBy: {
            visitDate: 'asc', 
          },
        },
      },
    });

    if (!patient) {
      return NextResponse.json({ exists: false, message: 'New patient detected' });
    }

    return NextResponse.json({
      exists: true,
      data: patient,
    });
  } catch (error) {
    console.error(' Search API Database Error:', error); 
    return NextResponse.json({ error: 'Internal Server Error', details: error }, { status: 500 });
  }
}