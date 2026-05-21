"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { IoIosLock } from "react-icons/io";
import Stepper, { Step } from "@/components/ui/Stepper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/element/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { LoaderTwo } from "@/components/ui/loader";
import { FaUserDoctor } from "react-icons/fa6";
import { MdAdminPanelSettings } from "react-icons/md";

const LoginSchema = z.object({
  username: z.string().min(3, { message: "Username is required" }),
  password: z.string().min(4, { message: "Password is required" }),
});

const OtpSchema = z.object({
  code: z.string().min(6, { message: "Must be exactly 6 digits" }),
});

export type Role = "DOCTOR" | "ADMIN" | "GUEST" | null;

// إضافة الـ Props للتواصل مع صفحة الهيرو
interface LoginFormProps {
  onLoginSuccess: (role: Role) => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const router = useRouter();

  // States
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [tempSecret, setTempSecret] = useState<string>("");

  // Data States
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [otpCode, setOtpCode] = useState("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [actionResult, setActionResult] = useState<"SIGN_IN_SUCCESS" | null>(
    null
  );
  const [userData, setUserData] = useState<{ name: string } | null>(null);

  // Forms
  const loginForm = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { username: "", password: "" },
  });

  const otpForm = useForm<z.infer<typeof OtpSchema>>({
    resolver: zodResolver(OtpSchema),
    defaultValues: { code: "" },
  });

  const playSound = (type: "success" | "error") => {
    try {
      const audio = new Audio(
        type === "success"
          ? "/sounds/success-48018.mp3"
          : "/sounds/error-03-125761.mp3"
      );
      audio.play().catch((e) => console.log("Audio play failed", e));
    } catch (error) {
      console.log("Audio not supported");
    }
  };

  // تعديل الدالة لكي تتخطى تسجيل الدخول للـ Guest
  const handleRoleSelection = (role: Role) => {
    if (role === "GUEST") {
      // إرسال النجاح فوراً للهيرو ليخفي صفحة تسجيل الدخول ويعرض صفحة الـ Guest
      onLoginSuccess("GUEST");
      return;
    }

    setSelectedRole(role);
    setErrorMsg("");
    setCurrentStep(2);
  };

  const resetSystem = () => {
    loginForm.reset();
    otpForm.reset();
    setSelectedRole(null);
    setOtpCode("");
    setUserExists(null);
    setActionResult(null);
    setUserData(null);
    setErrorMsg("");
    setCurrentStep(1);
  };

  const checkCredentials = async (values: z.infer<typeof LoginSchema>) => {
    setLoading(true);
    setErrorMsg("");
    setUserExists(null);
    setQrCodeUrl("");
    setOtpCode("");

    try {
      const res = await fetch("/api/auth/check-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
          role: selectedRole,
        }),
      });

      const data = await res.json();

      if (data.isAllowed === false) {
        setErrorMsg(data.message || "Invalid credentials. Please try again.");
        playSound("error");
        setLoading(false);
        return;
      }

      startTransition(() => {
        setUserExists(data.exists);
        if (!data.exists) {
          setQrCodeUrl(data.qrCode);
          setTempSecret(data.secret);
        } else {
          setTempSecret("");
        }
        setCurrentStep(3);
      });
    } catch (error) {
      setErrorMsg("Server connection error.");
      playSound("error");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtpAndLogin = async (value?: string) => {
    if (otpCode.length < 6) {
      setErrorMsg("Please enter the full 6-digit code.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/verify-totp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginForm.getValues("username"),
          code: otpCode,
          secret: tempSecret,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setUserData(data.user);
        setActionResult("SIGN_IN_SUCCESS");
        playSound("success");
        setCurrentStep(4);

        // إعطاء المستخدم فرصة لرؤية رسالة "Login Successful" لمدة ثانيتين ثم إخفاء الهيرو
        setTimeout(() => {
          if (selectedRole) onLoginSuccess(selectedRole);
        }, 2000);
      } else {
        setErrorMsg("Invalid code. Please try again.");
        playSound("error");
      }
    } catch (error) {
      setErrorMsg("An error occurred during verification.");
      playSound("error");
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 2) {
      loginForm.handleSubmit(checkCredentials)();
    } else if (currentStep === 3) {
      verifyOtpAndLogin();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (currentStep !== 1) handleNextStep();
    }
  };

  return (
    <div
      className="dark:bg-neutral-950 flex justify-center items-center w-full mx-auto my-auto text-sm"
      onKeyDown={handleKeyDown}
    >
      <Stepper
        currentStep={currentStep}
        backButtonText={currentStep === 4 || currentStep === 1 ? "" : "Back"}
        nextButtonText={
          loading
            ? "Verifying..."
            : currentStep === 2
            ? "Next"
            : currentStep === 3
            ? "Verify & Login"
            : ""
        }
        onStepChange={(step) => {
          if (step < currentStep && currentStep !== 4) setCurrentStep(step);
        }}
        nextButtonProps={{
          onClick: (e) => {
            e.preventDefault();
            handleNextStep();
          },
          disabled: loading || (currentStep === 3 && otpCode.length < 6),
          className:
            currentStep === 1 || currentStep === 4 ? "hidden" : "w-full",
        }}
      >
        {/* Step 1: Role Selection */}
        <Step>
          <div className="flex flex-col items-center w-full max-w-sm mx-auto space-y-4 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                NeuroCast Platform 
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                Please select your role to access the system
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 w-full">
              <button
                onClick={() => handleRoleSelection("DOCTOR")}
                disabled={loading}
                className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-2xl transition-all active:scale-95 group shadow-sm hover:shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-600 text-white rounded-xl transition-transform group-hover:scale-105 shadow-sm">
                    <FaUserDoctor className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold text-blue-900 text-lg">
                      Doctor Portal
                    </span>
                    <span className="block text-xs text-blue-700 mt-0.5">
                      Patient management & reports
                    </span>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleRoleSelection("ADMIN")}
                disabled={loading}
                className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl transition-all active:scale-95 group shadow-sm hover:shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-800 text-white rounded-xl transition-transform group-hover:scale-105 shadow-sm">
                    <MdAdminPanelSettings className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold text-slate-900 text-lg">
                      System Admin
                    </span>
                    <span className="block text-xs text-slate-600 mt-0.5">
                      Analytics & access control
                    </span>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleRoleSelection("GUEST")}
                disabled={loading}
                className="flex items-center justify-between p-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-2xl transition-all active:scale-95 group shadow-sm hover:shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-500 text-white rounded-xl transition-transform group-hover:scale-105 shadow-sm">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div className="text-left">
                    <span className="block font-bold text-emerald-900 text-lg">
                      Patients
                    </span>
                    <span className="block text-xs text-emerald-700 mt-0.5">
                      Exploration & assessment
                    </span>
                  </div>
                </div>
              </button>
            </div>
            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200 w-full text-center font-medium mt-4">
                {errorMsg}
              </div>
            )}
          </div>
        </Step>

        {/* Step 2: Login Form */}
        <Step>
          <div className="w-full max-w-sm mx-auto mb-6 text-center">
            <h3 className="text-lg font-bold text-slate-800">
              {selectedRole === "DOCTOR" && "Doctor Login"}
              {selectedRole === "ADMIN" && "Admin Login"}
            </h3>
          </div>
          <Form {...loginForm}>
            <div className="space-y-4">
              <FormField
                disabled={isPending || loading}
                control={loginForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isPending || loading}
                        placeholder="Username"
                        type="text"
                        className="text-center text-lg"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          setErrorMsg("");
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm mt-1 text-center font-bold" />
                  </FormItem>
                )}
              />

              <FormField
                disabled={isPending || loading}
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isPending || loading}
                        placeholder="Password"
                        type="password"
                        className="text-center text-lg"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          setErrorMsg("");
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm mt-1 text-center font-bold" />
                  </FormItem>
                )}
              />
            </div>
          </Form>
          {errorMsg && (
            <p className="text-red-500 text-center mt-4 text-sm font-bold">
              {errorMsg}
            </p>
          )}
        </Step>

        <Step>
          {loading ? (
            <div className="flex items-center justify-center w-full py-10">
              <LoaderTwo text={"Verifying OTP..."} />
            </div>
          ) : (
            <div className="flex flex-col items-center w-full max-w-md mx-auto animate-in fade-in zoom-in duration-300">
              {/* Header */}
              <div className="text-center space-y-2 mb-6">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Verification Code
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enter the 6-digit code
                </p>
              </div>

              {/* OTP Input */}
              <div dir="ltr" className=" mb-6">
                <InputOTP
                  autoFocus
                  maxLength={6}
                  value={otpCode}
                  onChange={(val) => {
                    setOtpCode(val);
                    if (errorMsg) setErrorMsg("");
                  }}
                  onComplete={(value) => verifyOtpAndLogin(value)}
                  // Accessibility
                  aria-label="One-time password input"
                >
                  <InputOTPGroup className="text-black">
                    <InputOTPSlot index={0} className="w-12 h-12 text-lg" />
                    <InputOTPSlot index={1} className="w-12 h-12 text-lg" />
                    <InputOTPSlot index={2} className="w-12 h-12 text-lg" />
                    <InputOTPSlot index={3} className="w-12 h-12 text-lg" />
                    <InputOTPSlot index={4} className="w-12 h-12 text-lg" />
                    <InputOTPSlot index={5} className="w-12 h-12 text-lg" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="w-full mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400 text-center">
                    {errorMsg}
                  </p>
                </div>
              )}

              {/* Paste hint (optional) */}
              {otpCode.length === 0 && (
                <p className="text-xs text-gray-400 mt-4">
                  Tip: You can paste the code directly
                </p>
              )}
            </div>
          )}
        </Step>

        {/* Step 4: Success Result */}
        <Step>
          <div className="flex flex-col items-center justify-center py-6 animate-in zoom-in duration-300">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-100">
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h2 className="text-3xl font-extrabold text-green-600 mb-2">
              Login Successful
            </h2>

            <p className="text-lg text-gray-700 font-medium mb-1">
              {userData?.name || "Welcome to NeuroCast"}
            </p>
          </div>
        </Step>
      </Stepper>
    </div>
  );
}
