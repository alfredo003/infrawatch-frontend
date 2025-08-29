"use client";
import { useState } from "react"; 
import dynamic from "next/dynamic";

export default function GeomapPage() {
 const Map = dynamic(() => import("./map"), { ssr: false });
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        
     <div className="mb-6">
         <Map />
      </div>
      </div>
    </div>
  );
}
