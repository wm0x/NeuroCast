import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // تحديد تاريخ قبل 7 أيام
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // 1. جلب جميع البيانات الحقيقية من الداتابيز في وقت واحد
    const [
      totalPredictions,
      activePatients,
      recentPatientsData,
      doctorsData,
      riskGroupData,
      trafficLogs // <-- جلبنا الزيارات الحقيقية من الداتابيز!
    ] = await Promise.all([
      prisma.visit.count({ where: { prediction: { not: null } } }),
      prisma.patient.count(),
      prisma.patient.findMany({
        orderBy: { createdAt: 'desc' },
        take: 4,
        include: { visits: { orderBy: { visitDate: 'desc' }, take: 1 } }
      }),
      prisma.user.findMany({
        where: { role: "DOCTOR" },
        take: 4,
        include: { _count: { select: { patients: true } } }
      }),
      prisma.visit.groupBy({
        by: ['prediction'],
        _count: { prediction: true },
        where: { prediction: { not: null } }
      }),
      prisma.platformTraffic.findMany({
        where: { createdAt: { gte: sevenDaysAgo } },
        select: { createdAt: true }
      })
    ]);

    // 2. معالجة وتنسيق البيانات
    const riskColors: Record<string, string> = {
      "Low Risk": "#10B981",
      "Moderate": "#F59E0B",
      "High Risk": "#EF4444",
      "Critical": "#991B1B",
    };

    const mappedRiskData = riskGroupData.map((item) => ({
      name: item.prediction || "Unknown",
      value: item._count.prediction,
      color: riskColors[item.prediction || ""] || "#cbd5e1"
    }));

    const formattedRecentPatients = recentPatientsData.map(p => {
      const latestVisit = p.visits[0];
      return {
        id: p.patientId,
        name: p.fullName || "Unknown Patient",
        age: latestVisit?.ageAtVisit || 0,
        mmse: latestVisit?.mmse || 0,
        risk: latestVisit?.prediction || "Pending",
        date: latestVisit?.visitDate 
          ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(latestVisit.visitDate) 
          : "No visits yet"
      };
    });

    const formattedDoctors = doctorsData.map(d => ({
      id: d.id,
      name: d.name,
      spec: "Neurologist",
      status: "Online",
      patients: d._count.patients
    }));

    // 3. بناء بيانات الرسم البياني (Traffic) من الداتابيز الحقيقية
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    // إنشاء كائن (Object) لحساب الزيارات لكل يوم بصفر كبداية
    let visitsPerDay = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
    
    // زيادة العدد بناءً على الزيارات المسجلة في الداتابيز
    trafficLogs.forEach(log => {
      const dayName = daysOfWeek[log.createdAt.getDay()];
      visitsPerDay[dayName as keyof typeof visitsPerDay]++;
    });

    // تحويلها لمصفوفة تناسب الرسم البياني
    const trafficData = daysOfWeek.map(day => ({
      name: day,
      visits: visitsPerDay[day as keyof typeof visitsPerDay] || 0,
      api_calls: (visitsPerDay[day as keyof typeof visitsPerDay] || 0) * 2 // محاكاة لعدد استدعاءات الخادم بناءً على الزيارات
    }));

    // 4. الإرسال للواجهة
    const dashboardData = {
      stats: {
        totalPredictions: totalPredictions,
        activePatients: activePatients,
        apiUptime: "99.98%",
        securityStatus: "Secured",
      },
      trafficData: trafficData,
      riskData: mappedRiskData.length > 0 ? mappedRiskData : [{ name: "No Data", value: 1, color: "#cbd5e1" }],
      recentPatients: formattedRecentPatients,
      doctorsList: formattedDoctors,
    };

    return NextResponse.json(dashboardData, { status: 200 });

  } catch (error) {
    console.error("Dashboard Fetch Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}