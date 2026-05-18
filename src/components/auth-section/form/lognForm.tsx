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

type Role = "DOCTOR" | "ADMIN" | "GUEST" | null;

function LoginForm() {
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

  const [actionResult, setActionResult] = useState<"SIGN_IN_SUCCESS" | null>(null);
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

  // Function to handle role selection and move to the next step immediately
  const handleRoleSelection = (role: Role) => {
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

  // Function to verify login credentials
  const checkCredentials = async (values: z.infer<typeof LoginSchema>) => {
    setLoading(true);
    setErrorMsg("");
    setUserExists(null);
    setQrCodeUrl("");
    setOtpCode("");

    try {
      // Update the URL or body according to your API endpoint
      const res = await fetch("/api/auth/check-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: values.username, 
          password: values.password,
          role: selectedRole 
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
        setCurrentStep(3); // Move to OTP step
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
        setCurrentStep(4); // Move to the final success step
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
    } else if (currentStep === 4) {
      resetSystem();
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (currentStep === 4) {
      timer = setTimeout(() => {
        resetSystem();
        // router.push("/dashboard"); // Uncomment this to redirect automatically after success
      }, 5000);
    }

    return () => clearTimeout(timer);
  }, [currentStep]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (currentStep !== 1) handleNextStep(); // Ignore Enter key on the role selection step
    }
  };

  return (
    <div
      className="dark:bg-neutral-950 flex justify-center items-center overflow-hidden h-screen mx-auto my-auto text-sm"
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
          // Hide the next button on the first and last steps
          className: currentStep === 1 || currentStep === 4 ? "hidden" : "w-full",
        }}
      >
        {/* Step 1: Role Selection */}
        <Step>
          <div className="flex flex-col items-center w-full max-w-sm mx-auto space-y-4 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                NeuroCast Platform 🧠
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
                    <span className="block font-bold text-blue-900 text-lg">Doctor Portal</span>
                    <span className="block text-xs text-blue-700 mt-0.5">Patient management & reports</span>
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
                    <span className="block font-bold text-slate-900 text-lg">System Admin</span>
                    <span className="block text-xs text-slate-600 mt-0.5">Analytics & access control</span>
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
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <span className="block font-bold text-emerald-900 text-lg">Patients</span>
                    <span className="block text-xs text-emerald-700 mt-0.5">Exploration & assessment</span>
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
              {selectedRole === "GUEST" && "Guest Login"}
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
            <p className="text-red-500 text-center mt-4 text-sm font-bold">{errorMsg}</p>
          )}
        </Step>

        {/* Step 3: OTP Verification */}
        <Step>
          {loading ? (
            <div className="flex items-center justify-center w-full py-10">
              <LoaderTwo text={"........"} />
            </div>
          ) : (
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
              {userExists === false && (
                <>
                  <p className="text-lg text-gray-500 text-center mb-4 max-w-xs">
                    Your First Time Login
                    <br />
                    Scan the QR code to link your device
                  </p>
                  <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-300 mb-6">
                    {qrCodeUrl ? (
                      <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48 object-contain" />
                    ) : (
                      <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">QR Code</div>
                    )}
                  </div>
                </>
              )}

              {userExists === true && (
                <>
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mt-2 ">
                    <IoIosLock className="h-10 w-10" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">Two-Factor Authentication (2FA)</h2>
                  <p className="flex text-sm text-gray-500 mb-1 text-center">
                    Enter the 6-digit verification code
                  </p>
                  <p className="mb-4 text-black">
                    From your device 
                  </p>
                </>
              )}

              <div dir="ltr" className="mb-4">
                <InputOTP
                  autoFocus={true}
                  maxLength={6}
                  value={otpCode}
                  onChange={(val) => {
                    setOtpCode(val);
                    setErrorMsg("");
                  }}
                  onComplete={(value: string) => verifyOtpAndLogin(value)}
                >
                  <InputOTPGroup className="text-black">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded border border-red-200 w-full text-center">
                  {errorMsg}
                </div>
              )}
            </div>
          )}
        </Step>

        {/* Step 4: Success Result */}
        <Step>
          <div className="flex flex-col items-center justify-center py-6 animate-in zoom-in duration-300">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-100">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-3xl font-extrabold text-green-600 mb-2">
              Login Successful
            </h2>
            
            <p className="text-lg text-gray-700 font-medium mb-1">
              {userData?.name || "Welcome to NeuroCast"}
            </p>
            
            <p className="text-sm text-gray-500 text-center mt-2 bg-gray-100 px-4 py-2 rounded-lg">
              Granted Role: <strong className="text-blue-600">
                {selectedRole === "DOCTOR" && "Doctor Portal"}
                {selectedRole === "ADMIN" && "System Admin"}
                {selectedRole === "GUEST" && "Guest Access"}
              </strong>
            </p>
          </div>
        </Step>
      </Stepper>
    </div>
  );
}

export default LoginForm;