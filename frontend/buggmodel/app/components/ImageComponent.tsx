'use client';
import { useEffect, useRef } from "react";

export default function ClayComponent() {
    const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
      if (typeof window !== "undefined" && containerRef.current) {
       
         }}, []);
    

    return (
      <div
        className={`fixed top-0 left-0 w-full h-full`}
        ref={containerRef}
      ></div>
    );
    }