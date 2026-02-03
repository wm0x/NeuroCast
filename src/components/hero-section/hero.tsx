"use client";
import React, { useState } from "react";
import CallToAction from "./top-button";
import { ScrollToExplore } from "./ScrollToExplore";
import NeumorphButton from "../ui/neumorph-button";
import { IoIosArrowForward } from "react-icons/io";
import {
  ExpandableScreen,
  ExpandableScreenContent,
  ExpandableScreenTrigger,
} from "../ui/expandable-screen";
import { Button } from "../ui/button";
import { Label } from "@radix-ui/react-label";
import FileUpload from "../ui/file-upload";

interface PredictionResult {
  prediction: string;
  confidence: string;
  probabilities?: Record<string, string>;
}

function Hero() {
  const [loading, setLoading] = useState(false);
  
  const [result, setResult] = useState<PredictionResult | null>(null);
  
  const [file, setFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    patient_id: "",
    age: "",
    gender: "", 
    education_years: "",
    mmse: "",
    bmi: "", 
    apoe: false,
    family_history: false,
    hypertension: false,
    clinical_notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const generateCSVString = () => {
      const vector = [
      formData.age || 65,            // 1. Age
      formData.gender || 0,          // 2. Gender
      formData.bmi || 25,            // 3. BMI
      formData.education_years || 0, // 4. Education
      0, 0, 0, 0, 0,                 // Fillers
      formData.hypertension ? 1 : 0, // Hypertension
      formData.family_history ? 1 : 0, // Family History
      formData.apoe ? 1 : 0,         // APOE
      formData.mmse || 25,           // MMSE
    ];

    while (vector.length < 30) vector.push(0);

    return vector.join(",");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload an MRI image first.");
      return;
    }

    setLoading(true);
    const data = new FormData();

    data.append("file", file);
    data.append("age", formData.age);
    data.append("bmi", formData.bmi || "24.5");
    data.append("clinical_csv_string", generateCSVString());

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
        },
        body: JSON.stringify(data), 
      });

      const json = await response.json();
      setResult(json); 
      console.log("Prediction:", json);
      
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to connect to AI server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen items-center justify-center px-10 bg-black w-full rounded-2xl mt-10 pb-32">
      <CallToAction />

      <div className="text-white mt-10 text-4xl text-center items-center">
        Empowering Early Alzheimer’s Detection with AI
        <span className="flex mt-5 text-xl text-neutral-400 justify-center">
          Leveraging advanced deep learning algorithms to predict and analyze
          Alzheimer&apos;s risk with high accuracy.
        </span>
        <div className="mt-10 items-center justify-center flex flex-row">
          <ExpandableScreen
            layoutId="cta-card"
            triggerRadius="100px"
            contentRadius="24px"
          >
            <ExpandableScreenTrigger>
              <NeumorphButton
                intent="secondary"
                className=" cursor-pointer flex flex-row"
              >
                Try It Now{" "}
                <span>
                  <IoIosArrowForward className=" inline size-5 mb-0.5 ml-2" />
                </span>{" "}
              </NeumorphButton>
            </ExpandableScreenTrigger>
            <ExpandableScreenContent className="bg-[#121212]">
              <div className="relative z-10 flex flex-col lg:flex-row w-full max-w-[1400px] mx-auto items-start">
                <div className="w-full lg:flex-1 lg:sticky lg:top-0 lg:h-screen flex flex-col justify-center p-6 sm:p-10 lg:p-16 space-y-6 bg-[#121212] z-20">
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium leading-none tracking-[-0.03em]">
                    Predicting the Course of Alzheimer&apos;s
                  </h2>
                  <div className="space-y-5 sm:space-y-6 pt-4">
                    <div className="flex gap-3 sm:gap-4">
                      <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
                        <svg
                          className="w-5 h-5 sm:w-6 sm:h-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm sm:text-base leading-[150%]">
                          <strong>Multimodal Fusion:</strong> Analysis of
                          cognitive scores, biomarkers, and clinical notes.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-primary-foreground/20">
                    <p className="text-lg sm:text-xl lg:text-2xl leading-[150%] mb-4">
                      &quot;From reactive to predictive neurology.&quot;
                    </p>
                    <div className="flex flex-col items-center gap-2 sm:gap-4 w-full text-center">
                      <p className="text-base sm:text-lg lg:text-xl">
                        NeuroCast System
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full lg:flex-1 p-6 sm:p-10 lg:p-16 lg:min-h-screen flex flex-col justify-center">
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4 sm:space-y-5 text-start w-full"
                  >
                    {result && (
                      <div className="bg-green-900/20 border border-green-500/50 p-4 rounded-lg mb-4 text-white">
                        <h3 className="font-bold text-lg">
                          🧠 AI Prediction Result:
                        </h3>
                        <p className="text-2xl mt-1 text-green-400 font-mono">
                          {result.prediction}
                        </p>
                        <p className="text-sm opacity-70">
                          Confidence: {result.confidence}
                        </p>
                      </div>
                    )}

                    <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-lg p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <span className="text-xl">⚠️</span>
                        <div>
                          <h4 className="text-sm font-semibold text-white">
                            Guest Access Mode
                          </h4>
                          <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                            Data entered here is ephemeral and{" "}
                            <strong>will not be saved</strong>.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6 border-b border-primary-foreground/20 pb-4">
                      <h3 className="text-xl font-medium text-white">
                        New Patient Assessment
                      </h3>
                    </div>

                    {/* Row 1: ID + Age */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <Label className="block text-[10px] font-mono font-normal mb-2 tracking-[0.5px] uppercase">
                          PATIENT ID / REFERENCE
                        </Label>
                        <input
                          type="text"
                          name="patient_id"
                          value={formData.patient_id}
                          onChange={handleChange}
                          placeholder="e.g. 1014275225"
                          className="w-full px-4 py-2.5 text-black rounded-lg bg-card border-0 focus:ring-2 focus:ring-primary-foreground/20 transition-all text-sm h-10 placeholder:text-gray-500"
                        />
                      </div>
                      <div className="sm:w-32 w-full">
                        <Label className="block text-[10px] font-mono font-normal mb-2 tracking-[0.5px] uppercase">
                          AGE *
                        </Label>
                        <input
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleChange}
                          required
                          placeholder="Yrs"
                          className="w-full px-4 py-2.5 text-black rounded-lg bg-card border-0 focus:ring-2 focus:ring-primary-foreground/20 transition-all text-sm h-10 placeholder:text-gray-500"
                        />
                      </div>
                    </div>

                    {/* Row 2: Gender + BMI */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <Label className="block text-[10px] font-mono font-normal mb-2 tracking-[0.5px] uppercase">
                          GENDER *
                        </Label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-lg bg-card border-0 text-black focus:ring-2 focus:ring-primary-foreground/20 transition-all text-sm h-10 appearance-none"
                        >
                          <option value="" className="bg-[#121212] text-white">
                            Select Gender
                          </option>
                          <option value="1" className="bg-[#121212] text-white">
                            Female
                          </option>
                          <option value="0" className="bg-[#121212] text-white">
                            Male
                          </option>
                        </select>
                      </div>

                      <div className="sm:w-32 w-full">
                        <Label className="block text-[10px] font-mono font-normal mb-2 tracking-[0.5px] uppercase">
                          BMI
                        </Label>
                        <input
                          type="number"
                          name="bmi"
                          value={formData.bmi}
                          onChange={handleChange}
                          placeholder="e.g. 24"
                          className="w-full px-4 py-2.5 rounded-lg text-black bg-card border-0 focus:ring-2 focus:ring-primary-foreground/20 transition-all text-sm h-10 placeholder:text-gray-500"
                        />
                      </div>
                    </div>

                    {/* Row 3: Education + MMSE */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <Label className="block text-[10px] font-mono font-normal mb-2 tracking-[0.5px] uppercase">
                          EDUCATION (YEARS)
                        </Label>
                        <input
                          type="number"
                          name="education_years"
                          value={formData.education_years}
                          onChange={handleChange}
                          placeholder="e.g. 16"
                          className="w-full px-4 py-2.5 rounded-lg text-black bg-card border-0 focus:ring-2 focus:ring-primary-foreground/20 transition-all text-sm h-10 placeholder:text-gray-500"
                        />
                      </div>

                      <div className="sm:w-32 w-full">
                        <Label className="block text-[10px] font-mono font-normal mb-2 tracking-[0.5px] uppercase">
                          MMSE SCORE *
                        </Label>
                        <input
                          type="number"
                          name="mmse"
                          value={formData.mmse}
                          onChange={handleChange}
                          required
                          placeholder="0-30"
                          min="0"
                          max="30"
                          className="w-full px-4 py-2.5 text-black rounded-lg bg-card border-0 focus:ring-2 focus:ring-primary-foreground/20 transition-all text-sm h-10 placeholder:text-gray-500"
                        />
                      </div>
                    </div>

                    {/* Checkboxes */}
                    <div className="flex flex-col gap-4 pt-2">
                      <Label className="block text-[10px] font-mono font-normal tracking-[0.5px] uppercase">
                        RISK FACTORS & HISTORY
                      </Label>
                      <div className="flex gap-4 flex-wrap text-black">
                        <label className="flex items-center gap-2 cursor-pointer bg-card px-3 py-2 rounded-lg border border-transparent hover:border-primary-foreground/20 transition-all">
                          <input
                            type="checkbox"
                            name="apoe"
                            checked={formData.apoe}
                            onChange={handleChange}
                            className="accent-primary w-4 h-4"
                          />
                          <span className="text-white text-sm">APOE ε4 Carrier</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer bg-card px-3 py-2 rounded-lg border border-transparent hover:border-primary-foreground/20 transition-all">
                          <input
                            type="checkbox"
                            name="family_history"
                            checked={formData.family_history}
                            onChange={handleChange}
                            className="accent-primary w-4 h-4"
                          />
                          <span className="text-white text-sm">Family History</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer bg-card px-3 py-2 rounded-lg border border-transparent hover:border-primary-foreground/20 transition-all">
                          <input
                            type="checkbox"
                            name="hypertension"
                            checked={formData.hypertension}
                            onChange={handleChange}
                            className="accent-primary w-4 h-4"
                          />
                          <span className="text-white text-sm">Hypertension</span>
                        </label>
                      </div>
                    </div>

                    {/* Clinical Notes */}
                    <div className="pt-2">
                      <Label className="block text-[10px] font-mono font-normal mb-2 tracking-[0.5px] uppercase">
                        CLINICAL NOTES & SYMPTOMS
                      </Label>
                      <textarea
                        name="clinical_notes"
                        value={formData.clinical_notes}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Describe memory decline..."
                        className="w-full px-4 py-3 rounded-lg bg-card border-0 text-black focus:ring-2 focus:ring-primary-foreground/20 transition-all resize-none text-sm placeholder:text-gray-500"
                      />
                    </div>

                    {/* File Upload */}
                    <div>
                      <FileUpload
                        onFileSelect={(selectedFile) => setFile(selectedFile)}
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full px-8 py-2.5 rounded-full bg-primary-foreground text-primary font-medium hover:bg-primary-foreground/90 transition-colors tracking-[-0.03em] h-12 mt-4"
                    >
                      {loading ? "Processing..." : "Run Progression Prediction"}
                    </Button>
                  </form>
                </div>
              </div>
            </ExpandableScreenContent>
          </ExpandableScreen>
        </div>
        
        {/* Footer cards */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-16 px-4">
          <div className="group w-full md:w-64 h-64 border border-white/10 p-8 flex flex-col items-start justify-center rounded-sm hover:border-white/30 transition-all duration-300 bg-black">
            <span className="text-4xl mb-6 block group-hover:scale-110 transition-transform duration-300">
              🧠
            </span>
            <div className="text-xl font-medium text-white mb-2 text-left">
              Understanding Alzheimer&apos;s
            </div>
            <span className="text-sm text-neutral-500 font-light text-left group-hover:text-neutral-300 transition-colors">
              Symptoms, Stages & Research
            </span>
          </div>
          <div className="group w-full md:w-64 h-64 border border-white/10 p-8 flex flex-col items-start justify-center rounded-sm hover:border-white/30 transition-all duration-300 bg-black">
            <span className="text-4xl mb-6 block group-hover:scale-110 transition-transform duration-300">
              🤝
            </span>
            <div className="text-xl font-medium text-white mb-2 text-left">
              Caregiver Support
            </div>
            <span className="text-sm text-neutral-500 font-light text-left group-hover:text-neutral-300 transition-colors">
              Resources & Community
            </span>
          </div>
          <div className="group w-full md:w-64 h-64 border border-white/10 p-8 flex flex-col items-start justify-center rounded-sm hover:border-white/30 transition-all duration-300 bg-black">
            <span className="text-4xl mb-6 block group-hover:scale-110 transition-transform duration-300">
              🌱
            </span>
            <div className="text-xl font-medium text-white mb-2 text-left">
              Brain Wellness
            </div>
            <span className="text-sm text-neutral-500 font-light text-left group-hover:text-neutral-300 transition-colors">
              Lifestyle & Activities
            </span>
          </div>
          <div className="group w-full md:w-64 h-64 border border-white/10 p-8 flex flex-col items-start justify-center rounded-sm hover:border-white/30 transition-all duration-300 bg-black">
            <span className="text-4xl mb-6 block group-hover:scale-110 transition-transform duration-300">
              🕰️
            </span>
            <div className="text-xl font-medium text-white mb-2 text-left">
              Future Planning
            </div>
            <span className="text-sm text-neutral-500 font-light text-left group-hover:text-neutral-300 transition-colors">
              Legal & Financial Guidance
            </span>
          </div>
        </div>
      </div>
      <ScrollToExplore />
      <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
}

export default Hero;