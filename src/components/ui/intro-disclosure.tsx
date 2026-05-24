"use client"

import * as React from "react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

interface CustomDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: string; // لا يزال اختيارياً
  children: React.ReactNode;
}

export function CustomDrawer({
  open,
  setOpen,
  title,
  children,
}: CustomDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="max-h-[100vh] flex flex-col mx-auto max-w-6xl">
        
        {/* التعديل هنا: دائمًا نضع DrawerTitle لحل مشكلة Radix */}
        {title ? (
          <DrawerHeader className="text-left pb-4">
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
        ) : (
          /* في حال عدم تمرير عنوان، نضع عنوان مخفي ليقرأه قارئ الشاشة فقط */
          <DrawerTitle className="sr-only">Doctor Management Menu</DrawerTitle>
        )}
        
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default CustomDrawer