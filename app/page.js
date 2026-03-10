"use client";
import React, { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { Heart, Activity, LayoutDashboard, LogOut, ShieldCheck, Zap, Bell, Radio } from "lucide-react";

export default function CuraidePro() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState({ bpm: 0, spo2: 0 });
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (user) {
      const statsRef = ref(db, "sensor_data");
      const unsubscribeData = onValue(statsRef, (snapshot) => {
        const val = snapshot.val();
        if (val) setData({ bpm: val.bpm || 0, spo2: val.spo2 || 0 });
      });
      return () => unsubscribeData();
    }
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert("Unauthorized Access: Please verify medical credentials.");
    }
  };

  if (!isClient || loading) return <div style={loadingOverlay}>Initializing Secure Terminal...</div>;

  if (!user) {
    return (
      <div style={authContainer}>
        <div style={loginCard}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={logoIcon}><ShieldCheck size={32} color="white" /></div>
            <h1 style={{ fontSize: "1.75rem", color: "#0f172a", marginTop: "16px", fontWeight: "800" }}>Curaide Terminal</h1>
            <p style={{ color: "#64748b", marginTop: "8px" }}>Secure Bio-Data Monitoring Access</p>
          </div>
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={inputGroup}>
              <input type="email" placeholder="Medical ID / Email" style={inputStyle} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div style={inputGroup}>
              <input type="password" placeholder="Terminal Password" style={inputStyle} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" style={loginButton}>Authorize & Enter</button>
          </form>
          <p style={footerNote}>Authorized Personnel Only • 2026 Protocol</p>
        </div>
      </div>
    );
  }

  return (
    <div style={appLayout}>
      {/* Sidebar Navigation */}
      <aside style={sidebar}>
        <div style={brandSection}>
          <Zap size={24} fill="#3b82f6" color="#3b82f6" />
          <span style={brandText}>CURAIDE</span>
        </div>
        
        <nav style={navSection}>
          <div style={navLinkActive}><LayoutDashboard size={20} /> Dashboard</div>
          <div style={navLink}><Radio size={20} /> Live Feeds</div>
          <div style={navLink}><Bell size={20} /> Alerts</div>
        </nav>

        <div style={userProfile}>
          <div style={userAvatar}>{user.email[0].toUpperCase()}</div>
          <div style={userInfo}>
            <span style={userName}>Medical Staff</span>
            <button onClick={() => signOut(auth)} style={logoutAction}>Sign Out</button>
          </div>
        </div>
      </aside>

      {/* Main Monitoring Area */}
      <main style={mainContent}>
        <header style={contentHeader}>
          <div>
            <h2 style={greeting}>Patient Vital Stream</h2>
            <p style={subGreeting}>Monitoring: <span style={{color: '#3b82f6', fontWeight: 'bold'}}>ESP32-C3-PNS</span></p>
          </div>
          <div style={liveBadge}><div style={pulseDot}></div> LIVE DATA</div>
        </header>

        <div style={statsGrid}>
          {/* BPM Card */}
          <div style={glassCard}>
            <div style={cardTop}>
              <span style={cardTitle}>Heart Rate</span>
              <Heart size={24} color="#ef4444" fill="#ef4444" className="animate-pulse" />
            </div>
            <div style={cardValue}>{data.bpm} <span style={cardUnit}>BPM</span></div>
            <div style={statusPill(data.bpm > 60 && data.bpm < 100)}>
              {data.bpm > 60 && data.bpm < 100 ? "• Normal Sinus" : "• Check Vitals"}
            </div>
          </div>

          {/* SpO2 Card */}
          <div style={glassCard}>
            <div style={cardTop}>
              <span style={cardTitle}>Blood Oxygen</span>
              <Activity size={24} color="#3b82f6" />
            </div>
            <div style={cardValue}>{data.spo2}<span style={cardUnit}>%</span></div>
            <div style={statusPill(data.spo2 > 94)}>
              {data.spo2 > 94 ? "• Stable Saturation" : "• Oxygen Alert"}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- MODERN STYLING SYSTEM ---
const authContainer = {
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
  fontFamily: "Inter, sans-serif"
};

const loginCard = {
  background: "rgba(255, 255, 255, 0.95)",
  padding: "48px",
  borderRadius: "24px",
  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
  width: "100%",
  maxWidth: "420px",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.3)"
};

const logoIcon = { width: "64px", height: "64px", background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", borderRadius: "18px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.3)" };
const inputStyle = { width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "1rem", outline: "none", transition: "all 0.2s" };
const loginButton = { width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: "#0f172a", color: "white", fontWeight: "700", fontSize: "1rem", cursor: "pointer", transition: "transform 0.1s" };
const footerNote = { textAlign: "center", marginTop: "24px", fontSize: "0.75rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" };

const appLayout = { display: "flex", height: "100vh", background: "linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%)", overflow: "hidden", fontFamily: "Inter, sans-serif" };
const sidebar = { width: "280px", background: "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(20px)", borderRight: "1px solid rgba(0,0,0,0.05)", padding: "40px 24px", display: "flex", flexDirection: "column" };
const brandSection = { display: "flex", alignItems: "center", gap: "12px", marginBottom: "48px" };
const brandText = { fontSize: "1.5rem", fontWeight: "900", color: "#1e293b", letterSpacing: "-1px" };
const navSection = { flex: 1 };
const navLinkActive = { display: "flex", alignItems: "center", gap: "12px", padding: "14px 18px", background: "#3b82f6", color: "white", borderRadius: "14px", fontWeight: "600", marginBottom: "8px", boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.2)" };
const navLink = { display: "flex", alignItems: "center", gap: "12px", padding: "14px 18px", color: "#64748b", fontWeight: "500", cursor: "pointer" };

const mainContent = { flex: 1, padding: "48px", overflowY: "auto" };
const contentHeader = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "48px" };
const greeting = { fontSize: "2.25rem", color: "#0f172a", margin: 0, fontWeight: "800", letterSpacing: "-1px" };
const subGreeting = { color: "#64748b", margin: "4px 0 0 0" };
const liveBadge = { background: "#0f172a", color: "white", padding: "8px 16px", borderRadius: "99px", fontSize: "0.75rem", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" };
const pulseDot = { width: "8px", height: "8px", background: "#10b981", borderRadius: "50%" };

const statsGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px" };
const glassCard = { background: "rgba(255, 255, 255, 0.7)", backdropFilter: "blur(10px)", padding: "40px", borderRadius: "32px", border: "1px solid rgba(255, 255, 255, 0.5)", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05)" };
const cardTop = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" };
const cardTitle = { fontSize: "0.875rem", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" };
const cardValue = { fontSize: "4.5rem", fontWeight: "900", color: "#0f172a", letterSpacing: "-2px" };
const cardUnit = { fontSize: "1.25rem", color: "#94a3b8", fontWeight: "500" };
const statusPill = (norm) => ({ marginTop: "16px", display: "inline-block", padding: "6px 16px", borderRadius: "99px", fontSize: "0.85rem", fontWeight: "700", background: norm ? "#dcfce7" : "#fee2e2", color: norm ? "#166534" : "#991b1b" });

const userProfile = { display: "flex", alignItems: "center", gap: "12px", paddingTop: "24px", borderTop: "1px solid #e2e8f0" };
const userAvatar = { width: "40px", height: "40px", background: "#3b82f6", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold" };
const userInfo = { display: "flex", flexDirection: "column" };
const userName = { fontSize: "0.9rem", fontWeight: "700", color: "#1e293b" };
const logoutAction = { background: "none", border: "none", color: "#ef4444", fontSize: "0.75rem", fontWeight: "bold", padding: 0, cursor: "pointer", textAlign: "left" };
const loadingOverlay = { height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", color: "#64748b", fontWeight: "600" };