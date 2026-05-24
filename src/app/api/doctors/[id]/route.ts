import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    // Extract ID from the query string (?id=...)
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Id of doctor was missing" }, { status: 400 });
    }

    const doctor = await db.user.findUnique({
      where: { 
        id: id 
      },
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
      }
    });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor Not Found" }, { status: 404 });
    }

    const totalPatients = await db.patient.count({
      where: {
        doctorId: id,
      },
    });

    const aiPredictions = 856; 
    const pendingReports = 12; 

    return NextResponse.json({ 
      doctorInfo: {
        id: doctor.id,
        name: doctor.name,
        username: doctor.username,
        role: doctor.role,
        specialization: "Neurologist", 
      },
      stats: {
        totalPatients,
        aiPredictions,
        pendingReports
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching doctor data:", error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function DELETE(
    req: Request, 
    { params }: { params: Promise<{ id: string }> } 
  ) {
    try {
      const { id } = await params;
  
      if (!id) {
        return NextResponse.json({ error: "Id of doctor was missing" }, { status: 400 });
      }
  
      const existingDoctor = await db.user.findUnique({
        where: { id: id }
      });
  
      if (!existingDoctor) {
        return NextResponse.json({ error: "Doctor Not Found" }, { status: 404 });
      }
  
      await db.user.delete({
        where: { id: id }
      });
  
      return NextResponse.json({ 
        success: true, 
        message: "Doctor was deleted"
      }, { status: 200 });
  
    } catch (error) {
      console.error("Error deleting doctor:", error);
      return NextResponse.json({ error: "Error deleting doctor" }, { status: 500 });
    }
  }

  export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    try {
      const { id } = await params;
  
      if (!id) {
        return NextResponse.json({ error: "Id of doctor was missing" }, { status: 400 });
      }
  
      const body = await req.json();
      const { name, username, password } = body;
  
      const updateData: any = {
        name: name,
        username: username,
      };
  
      if (password && password.trim() !== "") {
        updateData.password = password; 
      }
  
      const updatedDoctor = await db.user.update({
        where: { id: id },
        data: updateData,
      });
  
      return NextResponse.json({ 
        success: true, 
        message: "Information was editing",
        doctor: updatedDoctor
      }, { status: 200 });
  
    } catch (error) {
      console.error("Error updating doctor:", error);
      return NextResponse.json({ error: "Error updating doctor:" }, { status: 500 });
    }
  }