"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { Heart, Activity, Lock, User } from "lucide-react";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState({ bpm: 0, spo2: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (isLoggedIn) {
      const statsRef = ref(db, "sensor_data");
      const unsubscribe = onValue(statsRef, (snapshot) => {
        const val = snapshot.val();
        if (val) setData({ bpm: val.bpm || 0, spo2: val.spo2 || 0 });
      });
      return () => unsubscribe();
    }
  }, [isLoggedIn]);

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple check for now to test the UI
    if (email === "admin@curaide.com" && password === "curaide2026") {
      setIsLoggedIn(true);
    } else {
      alert("Invalid credentials. Try admin@curaide.com");
    }
  };

  if (!isClient) return null;

  // --- LOGIN UI ---
  if (!isLoggedIn) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={{ marginBottom: "20px" }}>
            <Lock size={40} color="#3b82f6" />
            <h2 style={{ margin: "10px 0" }}>Curaide Login</h2>
            <p style={{ color: "#64748b", fontSize: "0.9rem" }}>Secure Access for Medical Personnel</p>
          </div>
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <input 
              type="email" placeholder="Email" required 
              style={inputStyle} onChange={(e) => setEmail(e.target.value)} 
            />
            <input 
              type="password" placeholder="Password" required 
              style={inputStyle} onChange={(e) => setPassword(e.target.value)} 
            />
            <button type="submit" style={buttonStyle}>Login to Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  // --- DASHBOARD UI ---
  return (
    <div style={containerStyle}>
      <header style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "#1e293b", margin: 0 }}>Patient Live Monitor</h1>
        <p style={{ color: "#64748b" }}>Device ID: ESP32-C3-PNS-01</p>
      </header>
      
      <div style={{ display: "flex", gap: "25px", flexWrap: "wrap", justifyContent: "center" }}>
        <div style={cardStyle}>
          <Heart color="#ef4444" size={48} style={{ marginBottom: "10px" }} />
          <h3 style={labelStyle}>Heart Rate</h3>
          <div style={valueStyle}>{data.bpm} <span style={unitStyle}>BPM</span></div>
        </div>

        <div style={cardStyle}>
          <Activity color="#3b82f6" size={48} style={{ marginBottom: "10px" }} />
          <h3 style={labelStyle}>Blood Oxygen</h3>
          <div style={valueStyle}>{data.spo2}<span style={unitStyle}>%</span></div>
        </div>
      </div>
      <button onClick={() => setIsLoggedIn(false)} style={{ marginTop: "40px", color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}>Logout</button>
    </div>
  );
}

// --- STYLES ---
const containerStyle = { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", backgroundColor: "#f1f5f9" };
const cardStyle = { background: "white", padding: "40px", borderRadius: "20px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", textAlign: "center", width: "100%", maxWidth: "350px" };
const inputStyle = { padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "1rem" };
const buttonStyle = { padding: "12px", borderRadius: "8px", border: "none", backgroundColor: "#3b82f6", color: "white", fontWeight: "bold", cursor: "pointer", fontSize: "1rem" };
const labelStyle = { color: "#64748b", margin: "5px 0", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" };
const valueStyle = { fontSize: "3rem", fontWeight: "bold", color: "#1e293b" };
const unitStyle = { fontSize: "1.2rem", color: "#94a3b8" };