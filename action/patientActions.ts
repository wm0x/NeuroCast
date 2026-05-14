'use server'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

export async function checkPatientHistory(patientId: string) {
  const patient = await prisma.patient.findUnique({
    where: { patientId },
    include: { visits: { orderBy: { visitDate: 'asc' } } }
  })
  return patient;
}

export async function savePatientVisit(data: any) {

  const patient = await prisma.patient.upsert({
    where: { patientId: data.patientId },
    update: {},
    create: {
      patientId: data.patientId,
      fullName: data.fullName,
      gender: parseInt(data.gender),
      educationYears: parseInt(data.education)
    }
  })

  const newVisit = await prisma.visit.create({
    data: {
      patientId: data.patientId,
      ageAtVisit: parseFloat(data.age),
      mmse: parseFloat(data.mmse),
      cdrsb: parseFloat(data.cdrsb),
      hippocampusVol: parseFloat(data.hippocampus_vol),
      abeta: parseFloat(data.abeta),
      tau: parseFloat(data.tau),
      maeAtVisit: 0.3907 
    }
  })

  return { success: true, visitId: newVisit.id };
}