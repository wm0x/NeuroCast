"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  FaUserDoctor,
  FaUserPlus,
  FaUsers,
  FaPencil,
  FaTrashCan,
  FaCircleCheck, 
} from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";
import { FiAlertTriangle } from "react-icons/fi";
import CustomDrawer from "../../intro-disclosure";

type Doctor = {
  id: string;
  name: string;
  username: string;
};

type ToastData = {
  message: string;
  type: "success" | "error";
};

export default function DoctorManagementDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<"menu" | "add" | "list" | "edit">("menu");

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [toast, setToast] = useState<ToastData | null>(null);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    username: "",
    password: "",
  });

  // NEW: State to hold validation errors for each field
  const [formErrors, setFormErrors] = useState({
    name: "",
    username: "",
    password: "",
  });

  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    doctorId: "",
    doctorName: "",
  });
  const [confirmDeleteChecked, setConfirmDeleteChecked] = useState(false);

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchDoctors = async () => {
    try {
      setIsFetching(true);
      const res = await fetch("/api/doctors");
      if (res.ok) {
        const data = await res.json();
        setDoctors(data);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (view === "list") {
      fetchDoctors();
    }
  }, [view]);

  // NEW: Validation Function
  const validateForm = () => {
    let isValid = true;
    const errors = { name: "", username: "", password: "" };

    // Name Validation (Min 3 chars, letters, spaces, dots, and hyphens only)
    if (!formData.name.trim()) {
      errors.name = "Full Name is required.";
      isValid = false;
    } else if (formData.name.trim().length < 3) {
      errors.name = "Name must be at least 3 characters long.";
      isValid = false;
    } else if (!/^[a-zA-Z\u0600-\u06FF\s.\-]+$/.test(formData.name)) {
      // Note: \u0600-\u06FF allows Arabic characters in case your doctors use Arabic names
      errors.name = "Name can only contain letters, spaces, dots, and hyphens.";
      isValid = false;
    }

    // Username Validation (Min 4 chars, alphanumeric and underscores only)
    if (!formData.username.trim()) {
      errors.username = "Username is required.";
      isValid = false;
    } else if (formData.username.trim().length < 4) {
      errors.username = "Username must be at least 4 characters.";
      isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = "Only letters, numbers, and underscores are allowed (no spaces).";
      isValid = false;
    }

    // Password Validation (Required on add, strong password rules)
    if (view === "add" && !formData.password) {
      errors.password = "Password is required.";
      isValid = false;
    } else if (formData.password) {
      if (formData.password.length < 8) {
        errors.password = "Password must be at least 8 characters.";
        isValid = false;
      } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(formData.password)) {
        errors.password = "Password must contain at least one letter and one number.";
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // NEW: Run validation before doing anything else
    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMsg("");

    try {
      const url =
        view === "add" ? "/api/doctors" : `/api/doctors/${formData.id}`;
      const method = view === "add" ? "POST" : "PATCH";

      const bodyData = { ...formData };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      showToast(
        view === "add"
          ? "Doctor added successfully!"
          : "Doctor updated successfully!"
      );

      setFormData({ id: "", name: "", username: "", password: "" });
      setFormErrors({ name: "", username: "", password: "" }); // Clear errors
      setView("list");
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const openEdit = (doctor: Doctor) => {
    setFormData({
      id: doctor.id,
      name: doctor.name,
      username: doctor.username,
      password: "",
    });
    setFormErrors({ name: "", username: "", password: "" }); // Clear errors
    setErrorMsg("");
    setView("edit");
  };

  const confirmDelete = async () => {
    if (!confirmDeleteChecked) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/doctors/${deleteDialog.doctorId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json();
        showToast(errorData.error || "Error deleting doctor", "error");
      } else {
        setDoctors(doctors.filter((d) => d.id !== deleteDialog.doctorId));
        showToast("Doctor deleted successfully!");
      }
    } catch (error) {
      console.error(error);
      showToast("Something went wrong", "error");
    } finally {
      setIsLoading(false);
      setDeleteDialog({ isOpen: false, doctorId: "", doctorName: "" });
      setConfirmDeleteChecked(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setTimeout(() => {
        setView("menu");
        setDeleteDialog({ isOpen: false, doctorId: "", doctorName: "" });
        setFormErrors({ name: "", username: "", password: "" }); // Clear errors
        setToast(null); 
      }, 300);
    }
  };

  // Helper to clear specific error when user starts typing
  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors({ ...formErrors, [field]: "" });
    }
  };

  return (
    <div className="flex items-center justify-center p-10">
      <Button
        onClick={() => setIsOpen(true)}
        className="group relative flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:bg-blue-700 transition-all duration-300"
      >
        <FaUserDoctor className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
        <span>Open Doctor Management</span>
      </Button>

      <CustomDrawer open={isOpen} setOpen={handleOpenChange}>
        <div className="w-full max-w-md mx-auto min-h-[450px] flex flex-col overflow-hidden relative rounded-2xl bg-white">
          {/* TOAST AND DELETE DIALOG REMAIN EXACTLY THE SAME */}
          {toast && (
            <div
              className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-60 px-5 py-3 w-full rounded-full shadow-lg text-sm font-medium flex items-center gap-2 animate-in slide-in-from-bottom-8 fade-in duration-300 ${
                toast.type === "success"
                  ? "bg-green-800 text-white shadow-emerald-500/20"
                  : "bg-red-600 text-white shadow-red-500/20"
              }`}
            >
              {toast.type === "success" ? (
                <FaCircleCheck className="w-4 h-4 text-emerald-400" />
              ) : (
                <FiAlertTriangle className="w-4 h-4" />
              )}
              {toast.message}
            </div>
          )}

          {deleteDialog.isOpen && (
            <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-in fade-in duration-200">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                <FiAlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Delete Doctor?
              </h3>
              <p className="text-sm text-slate-500 text-center mb-6">
                Are you sure you want to delete{" "}
                <span className="font-bold text-slate-700">
                  {deleteDialog.doctorName}
                </span>
                ?
              </p>

              <label className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-xl cursor-pointer mb-6 w-full">
                <input
                  type="checkbox"
                  className="mt-0.5 w-4 h-4 text-red-600 rounded border-red-300 focus:ring-red-500"
                  checked={confirmDeleteChecked}
                  onChange={(e) => setConfirmDeleteChecked(e.target.checked)}
                />
                <span className="text-xs font-medium text-red-800">
                  I understand this action cannot be undone and all access for
                  this doctor will be revoked.
                </span>
              </label>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => {
                    setDeleteDialog({
                      isOpen: false,
                      doctorId: "",
                      doctorName: "",
                    });
                    setConfirmDeleteChecked(false);
                  }}
                  className="flex-1 py-3 rounded-xl font-bold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  disabled={!confirmDeleteChecked || isLoading}
                  onClick={confirmDelete}
                  className="flex-1 py-3 rounded-xl font-bold text-sm  text-white bg-red-600 hover:bg-red-700 transition-all disabled:opacity-50 shadow-lg shadow-red-600/20"
                >
                  {isLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          )}

          {view === "menu" && (
            <div className="p-6 flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="text-center mb-2 mt-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <FaUserDoctor className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-slate-800">
                  Doctor Management
                </h2>
                <p className="text-sm text-slate-500 font-medium mt-1">
                  What would you like to do today?
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => {
                    setFormData({
                      id: "",
                      name: "",
                      username: "",
                      password: "",
                    });
                    setFormErrors({ name: "", username: "", password: "" });
                    setView("add");
                  }}
                  className="flex items-center p-4 bg-white border border-slate-200 hover:border-blue-300 rounded-2xl transition-all hover:shadow-lg hover:shadow-blue-500/10 group text-left"
                >
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <FaUserPlus className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-slate-800 text-lg">
                      Add New Doctor
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Register a new medical staff member
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setView("list")}
                  className="flex items-center p-4 bg-white border border-slate-200 hover:border-emerald-300 rounded-2xl transition-all hover:shadow-lg hover:shadow-emerald-500/10 group text-left"
                >
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <FaUsers className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-slate-800 text-lg">
                      View & Manage Staff
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Edit or remove existing doctors
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {(view === "add" || view === "edit") && (
            <div className="p-6 flex flex-col h-full animate-in slide-in-from-right-8 fade-in duration-300">
              <div className="flex items-center mb-6">
                <button
                  onClick={() => setView("menu")}
                  className="p-2 -ml-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <IoIosArrowBack className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-bold text-slate-800 ml-2">
                  {view === "add" ? "Add New Doctor" : "Edit Doctor Details"}
                </h2>
              </div>

              {errorMsg && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100 font-medium flex items-center gap-2">
                  <FiAlertTriangle className="w-4 h-4 shrink-0" />
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 flex-1">
                <div className="space-y-1.5">
                  <label className={`text-[11px] font-bold tracking-widest uppercase ${formErrors.name ? 'text-red-500' : 'text-slate-500'}`}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g. Dr. Khalid Saad"
                    className={`w-full px-4 py-3 rounded-xl border bg-white outline-none transition-all text-sm font-medium ${
                      formErrors.name 
                        ? 'border-red-400 focus:ring-2 focus:ring-red-100' 
                        : 'border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400'
                    }`}
                  />
                  {formErrors.name && <p className="text-[11px] text-red-500 font-medium mt-1">{formErrors.name}</p>}
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4 mt-4">
                  <div className="space-y-1.5">
                    <label className={`text-[10px] font-bold tracking-widest uppercase ${formErrors.username ? 'text-red-500' : 'text-slate-400'}`}>
                      Username (Login ID)
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      placeholder="dr_khalid"
                      className={`w-full px-3 py-2 rounded-lg border bg-white outline-none text-sm font-mono ${
                        formErrors.username ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-blue-400'
                      }`}
                    />
                    {formErrors.username && <p className="text-[11px] text-red-500 font-medium mt-1">{formErrors.username}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className={`text-[10px] font-bold tracking-widest uppercase ${formErrors.password ? 'text-red-500' : 'text-slate-400'}`}>
                      {view === "add" ? "Password" : "New Password (Optional)"}
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      placeholder={
                        view === "add"
                          ? "••••••••"
                          : "Leave blank to keep current"
                      }
                      className={`w-full px-3 py-2 rounded-lg border bg-white outline-none text-sm font-mono placeholder:text-xs ${
                        formErrors.password ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-blue-400'
                      }`}
                    />
                     {formErrors.password && <p className="text-[11px] text-red-500 font-medium mt-1">{formErrors.password}</p>}
                  </div>
                </div>

                <div className="pt-4 mt-auto">
                  <button
                    disabled={isLoading}
                    type="submit"
                    className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                  >
                    {isLoading
                      ? "Saving..."
                      : view === "add"
                      ? "Create Account"
                      : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* LIST VIEW REMAINS EXACTLY THE SAME */}
          {view === "list" && (
             <div className="p-6 flex flex-col h-full pb-20 animate-in slide-in-from-right-8 fade-in duration-300">
             <div className="flex items-center justify-between mb-6">
               <div className="flex items-center">
                 <button
                   onClick={() => setView("menu")}
                   className="p-2 -ml-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
                 >
                   <IoIosArrowBack className="w-5 h-5" />
                 </button>
                 <h2 className="text-xl font-bold text-slate-800 ml-2">
                   Active Staff
                 </h2>
               </div>
               <button
                 onClick={() => {
                   setFormData({
                     id: "",
                     name: "",
                     username: "",
                     password: "",
                   });
                   setFormErrors({ name: "", username: "", password: "" }); // Clear errors on add
                   setView("add");
                 }}
                 className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-100 transition-colors"
               >
                 + Add New
               </button>
             </div>
             <div className="flex flex-col gap-3 overflow-y-auto pr-2 pb-4 relative">
               {isFetching ? (
                 Array.from({ length: 3 }).map((_, i) => (
                   <div
                     key={i}
                     className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-100 shadow-sm animate-pulse"
                   >
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                       <div className="space-y-2">
                         <div className="h-3 w-24 bg-slate-200 rounded-full"></div>
                         <div className="h-2 w-16 bg-slate-100 rounded-full"></div>
                       </div>
                     </div>
                     <div className="flex gap-2">
                       <div className="w-8 h-8 rounded-lg bg-slate-100"></div>
                       <div className="w-8 h-8 rounded-lg bg-slate-100"></div>
                     </div>
                   </div>
                 ))
               ) : doctors.length === 0 ? (
                 <p className="text-center text-sm text-slate-400 py-8 animate-in fade-in">
                   No doctors found. Add one!
                 </p>
               ) : (
                 doctors.map((doc, idx) => (
                   <div
                     key={doc.id}
                     className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all animate-in fade-in slide-in-from-bottom-4 fill-mode-both"
                     style={{
                       animationDelay: `${idx * 50}ms`,
                       animationDuration: "400ms",
                     }}
                   >
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold text-sm">
                         {doc.name.charAt(0).toUpperCase()}
                       </div>
                       <div>
                         <h4 className="text-sm font-bold text-slate-800">
                           {doc.name}
                         </h4>
                         <p className="text-[10px] text-slate-400 font-mono">
                           @{doc.username}
                         </p>
                       </div>
                     </div>

                     <div className="flex items-center gap-1">
                       <button
                         onClick={() => openEdit(doc)}
                         className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                         title="Edit Doctor"
                       >
                         <FaPencil className="w-3.5 h-3.5" />
                       </button>
                       <button
                         onClick={() =>
                           setDeleteDialog({
                             isOpen: true,
                             doctorId: doc.id,
                             doctorName: doc.name,
                           })
                         }
                         className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                         title="Delete Doctor"
                       >
                         <FaTrashCan className="w-3.5 h-3.5" />
                       </button>
                     </div>
                   </div>
                 ))
               )}
             </div>
           </div>
          )}
        </div>
      </CustomDrawer>
    </div>
  );
}