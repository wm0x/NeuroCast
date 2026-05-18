export const runtime = "nodejs";

import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import * as otplib from "otplib";
const { authenticator } = otplib;

export async function POST(request: Request) {
  try {
    const { username, code, secret } = await request.json();

    // 1. Validate Input
    if (!username || !code) {
      return NextResponse.json(
        { success: false, message: "Missing username or verification code." },
        { status: 400 }
      );
    }

    // 2. Find the user in the database
    const user = await db.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found in the system." },
        { status: 404 }
      );
    }

    // 3. Determine which secret to verify against
    let secretToVerify = "";

    if (user.totpSecret) {
      // Returning User: Use the secret permanently saved in the DB
      secretToVerify = user.totpSecret;
    } else {
      // First-Time Setup: Use the temporary secret passed from the frontend QR code step
      if (!secret) {
        return NextResponse.json(
          { success: false, message: "Missing setup secret for new device linking." },
          { status: 400 }
        );
      }
      secretToVerify = secret;
    }

    // 4. Verify the 6-digit OTP code
    try {
      const isValid = authenticator.check(code, secretToVerify);
      if (!isValid) {
        return NextResponse.json(
          { success: false, message: "Invalid verification code." },
          { status: 400 }
        );
      }
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Invalid verification code format." },
        { status: 400 }
      );
    }

    // 5. If this was their very first time logging in, save the secret to the DB permanently!
    if (!user.totpSecret) {
      await db.user.update({
        where: { username },
        data: {
          totpSecret: secretToVerify,
        },
      });
    }

    // 6. Return Success 
    return NextResponse.json({
      success: true,
      user: { name: user.name, role: user.role },
    });

  } catch (error: any) {
    console.error("Verify OTP Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error: " + error.message },
      { status: 500 }
    );
  }
}