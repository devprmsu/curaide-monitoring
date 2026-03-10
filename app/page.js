"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import Activity from "lucide-react/dist/esm/icons/activity";
import Heart from "lucide-react/dist/esm/icons/heart";
export default function Dashboard() {
  const [data, setData] = useState({ bpm: 0, spo2: 0 });

  useEffect(() => {
    // Connect to the specific path in your Firebase Realtime Database
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

  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <h1 style={{ color: "#2c3e50" }}>Curaide Live Monitor</h1>
      
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "2rem" }}>
        {/* BPM Card */}
        <div style={cardStyle}>
          <Heart color="#e74c3c" size={48} />
          <h2>{data.bpm}</h2>
          <p>Beats Per Minute</p>
        </div>

        {/* SpO2 Card */}
        <div style={cardStyle}>
          <Activity color="#3498db" size={48} />
          <h2>{data.spo2}%</h2>
          <p>Oxygen Saturation</p>
        </div>
      </div>
    </main>
  );
}

const cardStyle = {
  background: "#fff",
  padding: "2rem",
  borderRadius: "15px",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  width: "200px"
};