"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";

// Import directly from the icons folder to prevent "undefined" errors
import Heart from "lucide-react/dist/esm/icons/heart";
import Activity from "lucide-react/dist/esm/icons/activity";

export default function Dashboard() {
  const [data, setData] = useState({ bpm: 0, spo2: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Signal that we are now in the browser
    
    const statsRef = ref(db, "sensor_data"); 
    const unsubscribe = onValue(statsRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        setData({
          bpm: val.bpm || 0,
          spo2: val.spo2 || 0
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // During the build (server-side), this will prevent the crash
  if (!mounted) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading Curaide...</div>;
  }

  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
       {/* Rest of your UI code with <Heart /> and <Activity /> */}
    </main>
  );
}