export const runtime = "nodejs";

import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { authenticator } from "otplib";
import QRCode from "qrcode";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const { username, password, role } = await request.json();

    if (!username || !password || !role) {
      return NextResponse.json(
        { isAllowed: false, message: "Username, password, and role are required." },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json({
        isAllowed: false,
        message: "Invalid username or password.",
      });
    }

    if (user.role !== role) {
      return NextResponse.json({
        isAllowed: false,
        message: "You do not have permission to access this portal.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({
        isAllowed: false,
        message: "Invalid username or password.",
      });
    }

    // 5. Check if 2FA is already set up
    if (user.totpSecret) {
      return NextResponse.json({
        exists: true, // Tells the frontend to show the OTP input directly
        isAllowed: true,
        user: { name: user.name },
        message: "Please enter your authentication code.",
      });
    }

    // 6. First-Time Setup: Generate Secret & QR Code
    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(
      username,
      "NeuroCast System", // The app name that will appear in Google Authenticator
      secret
    );

    const qrCodeUrl = await QRCode.toDataURL(otpauth);

    return NextResponse.json({
      exists: false, 
      isAllowed: true,
      qrCode: qrCodeUrl,
      secret: secret,
      name: user.name,
      message: `Welcome ${user.name}, please scan the code to link your device.`,
    });
  } catch (e: any) {
    console.error("Check Credentials Error:", e);
    return NextResponse.json({ error: "System Error" }, { status: 500 });
  }
}