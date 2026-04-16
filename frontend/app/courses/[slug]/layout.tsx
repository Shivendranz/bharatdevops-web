"use client";
import React from "react";

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  // Bas children return karo, sidebar hum page.tsx mein handle kar rahe hain
  return (
    <div className="w-full">
      {children}
    </div>
  );
}