"use client";
import Image from "next/image";
import { useState } from "react";


import { Calendar, CalendarDays, CalendarRange, History } from "lucide-react";
import LoginForm from "./form/lognForm";
import NeumorphButton from "../ui/neumorph-button";
import { ExpandedTabs } from "../ui/expanded-tabs";
import { useKeypress } from "@/hooks/use-keypress";
import { Button } from "../ui/button";
const tabs = [
  { title: "يوم", icon: Calendar },
  { title: "اسبوع", icon: CalendarDays },
  { title: "شهر", icon: CalendarRange },
];
export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [showUploadeCM, setShowUploadeCM] = useState(false);
  const [showDownloadData, setShowDownloadData] = useState(false);

  const [isOnBreak, setIsOnBreak] = useState(true);
  const [loading, setLoading] = useState(false);
  const handleClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };
  useKeypress({
    combo: ["ctrl+m"],
    callback: (e) => {
      setShowUploadeCM((prev) => !prev);
      setShowDownloadData(false);
    },
    preventDefault: true,
  });

  useKeypress({
    combo: ["ctrl+d"],
    callback: (e) => {
      setShowUploadeCM(false);
      setShowDownloadData((prev) => !prev);
    },
    preventDefault: true,
  });

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-amber-50 font-sans overflow-hidden">
      <div className="relative w-full max-w-md p-4">
        <div className="relative z-10">
          <LoginForm />
        </div>
        {showUploadeCM && (
          <div
            onClick={() => setShowUploadeCM(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white p-8 rounded-2xl shadow-2xl border-2 border-amber-500 animate-in fade-in zoom-in duration-200 min-w-2xl justify-center items-center text-center"
            >
              <h2 className="text-xl font-bold mb-4">رفع بيانات المتدربين</h2>

              <div
                className="w-full overflow-hidden border border-gray-200 rounded-lg mb-6 shadow-sm"
                dir="ltr"
              >
                <h1 className="bg-orange-700 text-white p-2">
                  يرجى رفع الملف بنفس الصيغة التاليه
                </h1>
                <table className="w-full text-sm text-right text-gray-500">
                  <thead className="text-xs text-amber-800 uppercase bg-amber-50">
                    <tr>
                      <th className="px-4 py-3 border-b">PF number</th>
                      <th className="px-4 py-3 border-b">الاسم</th>
                      <th className="px-4 py-3 border-b">رقم الهوية</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white border-b hover:bg-gray-50">
                      <td className="px-4 py-2 border-l italic text-gray-400">
                        800XXXXXX
                      </td>
                      <td className="px-4 py-2 border-l italic text-gray-400">
                        علي الشهري
                      </td>
                      <td className="px-2 py-2 border-l italic text-gray-400">
                        1120XXXXXX
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="flex justify-between px-10 items-center py-2 bg-white/50 rounded-xl">
                  <h1 className="font-bold text-amber-900">
                    لتحميل الصيغة الرسمية
                  </h1>
                  <Button className="bg-white hover:bg-orange-50 text-orange-600 border-2 border-orange-500 shadow-md transition-all gap-2 px-6 py-2 hover:cursor-pointer">
                    <Image
                      src="/logo.png"
                      alt="download"
                      width={50}
                      height={50}
                      className="object-contain"
                    />
                    <span className="font-bold">اضغط هنا</span>
                  </Button>
                </div>
              </div>
              <div>
                <div className="relative ">
                  <div className="absolute inset-0 flex items-center ">
                    <span className="w-full border-t border-amber-200"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-amber-500 font-bold">
                      تحديث البيانات
                    </span>
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-4 mt-4">
                  تحديث بيانات المتدربين
                </h2>
                <p className="border border-amber-400 rounded-2xl py-4 bg-amber-100 mb-10 text-sm">
                  ⚠️ في حال رفع ملف يحتوي على بيانات خاطئه لن تتمكن من العوده
                  للاسماء السابقه ⚠️
                </p>
              </div>
              <button
                onClick={() => setShowUploadeCM(false)}
                className="absolute top-4 left-4 text-gray-400 hover:text-red-500 hover:bg-red-50 p-1 rounded-full transition-all duration-200"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="w-full flex justify-center mt-4">
                <NeumorphButton
                  intent="primary"
                  loading={loading}
                  onClick={handleClick}
                  className="w-[80%]"
                >
                  {loading ? "جاري التعديل " : "تعديل البيانات"}
                </NeumorphButton>
              </div>
            </div>
          </div>
        )}
        {showDownloadData && (
          <div
            onClick={() => setShowDownloadData(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white p-8 rounded-2xl shadow-2xl border-2 border-amber-500 animate-in fade-in zoom-in duration-200 min-w-2xl justify-center items-center text-center"
            >
              <h2 className="text-xl font-bold mb-4">بيانات المتدربين</h2>

              <div>
                <div className="container mx-auto py-10">
                    show him this page
                </div>
              </div>
              <div
                className="flex justify-between items-center border p-2 rounded-2xl"
                dir="rtl"
              >
                <h1>اختر المده الزمنيه لتحميل البيانات</h1>
                <ExpandedTabs tabs={tabs} />
              </div>
              <button
                onClick={() => setShowDownloadData(false)}
                className="absolute top-4 left-4 text-gray-400 hover:text-red-500 hover:bg-red-50 p-1 rounded-full transition-all duration-200"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="w-full flex justify-center mt-4">
                <NeumorphButton
                  intent="primary"
                  loading={loading}
                  onClick={handleClick}
                  className="w-[80%]"
                >
                  {loading ? "جاري النحميل " : "تحميل البيانات"}
                </NeumorphButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
