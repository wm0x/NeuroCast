"use client";
import React, { useEffect, useState } from "react";
import CallToAction from "./top-button";
import { ScrollToExplore } from "./ScrollToExplore";
import NeumorphButton from "../ui/neumorph-button";
import { IoIosArrowForward } from "react-icons/io";
import {
  ExpandableScreen,
  ExpandableScreenContent,
  ExpandableScreenTrigger,
} from "../ui/expandable-screen";

import LoginForm, { Role } from "../auth-section/form/lognForm";
import AdminForm from "../ui/form/admin-form/adminForm";
import ClinicalSystem from "../clinical/ClinicalSystem";
import InfoPanel from "../clinical/InfoPanel";
import GusetForm from "../ui/form/guest-form/gusettForm";
import GuestForm from "../ui/form/guest-form/gusettForm";

export default function Hero() {
  const [activeRole, setActiveRole] = useState<Role>(null);
  useEffect(() => {
    const trackVisit = async () => {
      try {
        await fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: window.location.pathname }),
        });
      } catch (error) {
        console.error("Error sending tracking data:", error);
      }
    };

    trackVisit();
  }, []);
  // دالة مساعدة لتحديد المحتوى الذي سيظهر داخل الشاشة البيضاء (النافذة المتمددة)
  const renderExpandedContent = () => {
    switch (activeRole) {
      case "ADMIN":
        // يختفي تسجيل الدخول والإحصائيات وتظهر صفحة الآدمن
        return (
          <div className="w-full p-6 lg:p-16 min-h-[80vh] flex flex-col items-center justify-center relative z-10 animate-in fade-in zoom-in duration-500">
            <AdminForm />
          </div>
        );

      case "DOCTOR":
        // تظهر الواجهة الطبية للطبيب
        return (
          <div className="w-full p-6 lg:p-16 min-h-[80vh] flex flex-col items-center justify-center relative z-10 animate-in fade-in zoom-in duration-500">
            {/* إذا أردت إبقاء الإحصائيات للطبيب يمكنك إعادة <InfoPanel /> هنا، ولكن بناءً على طلبك جعلناها تختفي */}
            <ClinicalSystem />
          </div>
        );

        case "GUEST":
          return (
            <div className="relative z-10 flex flex-col lg:flex-row w-full max-w-[1400px] mx-auto items-start animate-in fade-in duration-500">
              <InfoPanel />
              <GuestForm onBackToLogin={() => setActiveRole(null)} />
            </div>
          );

      default:
        return (
          <div className="relative z-10 flex flex-col lg:flex-row w-full max-w-[1400px] mx-auto items-start">
            <InfoPanel />
            <div className="w-full lg:flex-1 p-6 sm:p-10 lg:p-16 lg:min-h-screen flex flex-col justify-center border-l border-[#EAE5D9]">
              <LoginForm onLoginSuccess={(role) => setActiveRole(role)} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen items-center justify-center px-10 bg-black w-full rounded-2xl mt-10 pb-32">
      <CallToAction />
      
      <div className="text-white mt-10 text-4xl text-center items-center">
        Empowering Early Alzheimer’s Detection with AI
        <span className="flex mt-5 text-xl text-neutral-400 justify-center">
          Leveraging advanced deep learning algorithms to predict and analyze
          Alzheimer&apos;s trajectory.
        </span>
        
        <div className="mt-10 items-center justify-center flex flex-row w-full">
          <ExpandableScreen layoutId="cta-card" triggerRadius="100px" contentRadius="32px">
            
            <ExpandableScreenTrigger>
              <NeumorphButton
                intent="secondary"
                className="cursor-pointer flex flex-row shadow-lg hover:shadow-xl transition-all"
              >
                Access Clinical System <IoIosArrowForward className="inline size-5 mb-0.5 ml-2" />
              </NeumorphButton>
            </ExpandableScreenTrigger>

            <ExpandableScreenContent className="bg-[#FDFBF7] shadow-2xl border border-[#EAE5D9] overflow-y-auto">
              {renderExpandedContent()}
            </ExpandableScreenContent>
            
          </ExpandableScreen>
        </div>
      </div>
      
      <ScrollToExplore />
      <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
}