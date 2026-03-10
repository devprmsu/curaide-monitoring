"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
// Using standard imports - if this fails, we will remove icons entirely to test
import { Heart, Activity } from "lucide-react";

export default function Dashboard() {
  const [data, setData] = useState({ bpm: 0, spo2: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const statsRef = ref(db, "sensor_data");
    const unsubscribe = onValue(statsRef, (snapshot) => {
      const val = snapshot.val();
      if (val) setData({ bpm: val.bpm || 0, spo2: val.spo2 || 0 });
    });
    return () => unsubscribe();
  }, []);

  // Prevent white screen by showing a loading state until the browser is ready
  if (!isClient) return <div style={{ padding: "20px" }}>Loading Dashboard...</div>;

  return (
    <main style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem" }}>
      <h1 style={{ color: "#1e293b" }}>Curaide Real-Time Monitoring</h1>
      
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        {/* Heart Rate Card */}
        <div style={cardStyle}>
          <Heart color="#ef4444" size={48} />
          <h2>{data.bpm} <span style={unitStyle}>BPM</span></h2>
          <p>Heart Rate</p>
        </div>

        {/* SpO2 Card */}
        <div style={cardStyle}>
          <Activity color="#3b82f6" size={48} />
          <h2>{data.spo2}<span style={unitStyle}>%</span></h2>
          <p>Blood Oxygen</p>
        </div>
      </div>
    </main>
  );
}

const cardStyle = {
  background: "white",
  padding: "30px",
  borderRadius: "15px",
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  width: "200px",
  textAlign: "center"
};

const unitStyle = { fontSize: "1rem", color: "#64748b", marginLeft: "5px" };