import { ArrowRightIcon } from "lucide-react";

export default function CallToAction() {
  return (
    <button
      type="button"
      className="group relative flex flex-row items-center p-1 pr-3 mt-10 md:mt-0 gap-2 rounded-full border border-[#112069]/15 hover:border-[#112069]/30 shadow-2xs hover:shadow-2xs overflow-hidden focus-visible:outline-hidden focus-visible:ring-[#ed40b3] focus-visible:ring-2 focus-visible:rounded-full transition duration-100 bg-[#112069]/5 hover:bg-[#112069]/10 md:text-lg text-xs text-white"
    >
      <div className="inline-flex items-center border border-[#adfa1e]/40 px-3 rounded-full text-sm py-1 bg-[#adfa1e]/20 text-[#ffffff]">
        Beta v1.0
      </div>
      <span className="text-[#ffffff]">
        Get Started
      </span>
      <ArrowRightIcon className="text-[#367c66] size-5 group-hover:translate-x-1 transition-transform duration-100" />
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-[#ffe77a] to-[#ff9a1f] opacity-70 group-hover:opacity-100 transition-opacity overflow-hidden rounded-full backdrop-blur-md" />
    </button>
  );
}