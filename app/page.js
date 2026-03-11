"use client";
import React, { useEffect, useState, useMemo } from "react";
import { db, auth } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { 
  Heart, Activity, LayoutDashboard, ShieldCheck, Zap, 
  Bell, Radio, Settings, AlertTriangle, LogOut, 
  Thermometer, Droplets, Clock, User, Sun, Moon, Cpu
} from "lucide-react";

export default function CuraidePro() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState({ bpm: 0, spo2: 0, sbp: 0, dbp: 0, temp: 0 });
  const [history, setHistory] = useState([]); // Array to store telemetry stream
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [lastSync, setLastSync] = useState(new Date().toLocaleTimeString());
  const [theme, setTheme] = useState("light");

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
        if (val) {
          const newData = { 
            bpm: val.bpm || 0, 
            spo2: val.spo2 || 0,
            sbp: val.sbp || 0,
            dbp: val.dbp || 0,
            temp: val.temp || 0
          };
          setData(newData);
          setLastSync(new Date().toLocaleTimeString());
          // Update history for telemetry (keeps last 15 points)
          setHistory(prev => [...prev.slice(-14), newData.bpm]);
        }
      });
      return () => unsubscribeData();
    }
  }, [user]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert("Unauthorized Access: Check Medical Credentials.");
    }
  };

  const isCritical = (data.spo2 > 0 && data.spo2 < 90) || (data.temp > 38.5);

  const colors = {
    bg: theme === "light" ? "#f8fafc" : "#020617",
    card: theme === "light" ? "#ffffff" : "#0f172a",
    text: theme === "light" ? "#0f172a" : "#f8fafc",
    subtext: theme === "light" ? "#475569" : "#94a3b8",
    border: theme === "light" ? "#e2e8f0" : "#1e293b",
    sidebarText: "#ffffff",
    accent: "#3b82f6"
  };

  // Helper for generating the telemetry SVG path
  const generatePath = (vals, height = 40, width = 200) => {
    if (vals.length < 2) return "";
    const max = Math.max(...vals, 100);
    const min = Math.min(...vals, 40);
    const range = max - min || 1;
    return vals.map((v, i) => {
      const x = (i / (vals.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(" ");
  };

  if (!isClient || loading) return <div style={{...loadingOverlay, background: colors.bg, color: "#3b82f6"}}>Initializing Secure Terminal...</div>;

  if (!user) {
    return (
      <div style={{...animatedBg, background: colors.bg}}>
        <style>{`
          @keyframes gradMove { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
          .medical-grid { position: absolute; inset: 0; background-image: radial-gradient(${theme === "light" ? "#cbd5e1" : "#1e293b"} 1px, transparent 1px); background-size: 30px 30px; opacity: 0.5; }
        `}</style>
        <div className="medical-grid"></div>
        <div style={{...loginGlassCard, background: theme === "light" ? "rgba(255, 255, 255, 0.9)" : "rgba(15, 23, 42, 0.95)", border: `1px solid ${colors.border}`}}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={logoContainer}><ShieldCheck size={38} color="#3b82f6" /></div>
            <h1 style={{...loginTitle, color: colors.text}}>Curaide <span style={{color: '#3b82f6'}}>Pro</span></h1>
            <p style={{...loginSubtitle, color: colors.subtext}}>Vitals Monitoring & Analytics</p>
          </div>
          <form onSubmit={handleLogin} style={formGap}>
            <div style={inputGroup}>
              <label style={{...labelStyle, color: colors.subtext}}>Medical ID</label>
              <input type="email" placeholder="staff@curaide.com" style={{...inputStyle, background: colors.card, color: colors.text, borderColor: colors.border}} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div style={inputGroup}>
              <label style={{...labelStyle, color: colors.subtext}}>Access Key</label>
              <input type="password" placeholder="••••••••" style={{...inputStyle, background: colors.card, color: colors.text, borderColor: colors.border}} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" style={primaryButton}>Authorize Terminal</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{...(isCritical ? criticalWrapper : dashboardWrapper), background: colors.bg}}>
      <style>{`
        @keyframes pulse-red { 0% { background: ${colors.bg}; } 50% { background: ${theme === 'light' ? '#fee2e2' : '#450a0a'}; } 100% { background: ${colors.bg}; } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        .grid-bg { background-image: radial-gradient(${theme === 'light' ? '#cbd5e1' : '#1e293b'} 1px, transparent 1px); background-size: 40px 40px; }
      `}</style>

      {isCritical && (
        <div style={alertBanner}>
          <AlertTriangle size={24} style={{ animation: "bounce 0.5s infinite" }} />
          CRITICAL ALERT: ESP32-C3 DETECTED ANOMALY
        </div>
      )}

      <aside style={modernSidebar}>
        <div style={sidebarOverlay}></div>
        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={sidebarBrand}><div style={miniLogo}><Zap size={18} fill="white" color="white" /></div><span style={{...brandName, color: colors.sidebarText}}>CURAIDE</span></div>
            <nav style={menuList}>
            <div style={{...activeMenuItem, background: "rgba(59, 130, 246, 0.2)", color: "#fff"}}><LayoutDashboard size={20} /> Dashboard</div>
            <div style={{...menuItem, color: "rgba(255,255,255,0.7)"}}><Radio size={20} /> Patient 101</div>
            <div style={{...menuItem, color: "rgba(255,255,255,0.7)"}}><Bell size={20} /> History Logs</div>
            <div style={{...menuItem, color: "rgba(255,255,255,0.7)"}}><Settings size={20} /> Sensor Settings</div>
            </nav>
            <div style={{...sidebarFooter, borderTopColor: "rgba(255,255,255,0.1)"}}>
            <button onClick={() => signOut(auth)} style={logoutBtn}><LogOut size={18} /> Logout</button>
            </div>
        </div>
      </aside>

      <main style={mainStage} className="grid-bg">
        <header style={topHeader}>
          <div>
            <div style={{display:'flex', alignItems:'center', gap: '8px', marginBottom: '8px'}}>
                <Cpu size={16} color={colors.accent} />
                <span style={{color: colors.subtext, fontSize: '0.8rem', fontWeight: 'bold'}}>ESP32-C3 LIVE TELEMETRY</span>
            </div>
            <h2 style={{...pageTitle, color: colors.text}}>Real-time Stream</h2>
            <div style={{display: 'flex', gap: '15px', marginTop: '5px'}}>
                <p style={{...pageSub, color: colors.subtext}}>Subject: <strong>Patient-Alpha</strong></p>
                <p style={{...pageSub, color: colors.subtext, display:'flex', alignItems:'center', gap: '4px'}}><Clock size={14}/> {lastSync}</p>
            </div>
          </div>
          
          <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
            <button onClick={toggleTheme} style={{...themeToggleBtn, background: colors.card, borderColor: colors.border, color: colors.text}}>
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <div style={{...statusBadge, background: colors.card, borderColor: colors.border}}>
              <span style={isCritical ? criticalPulse : pulse}></span> 
              <span style={{fontSize: '0.75rem', fontWeight: 'bold', color: colors.text}}>{isCritical ? "ALERT" : "LINK STABLE"}</span>
            </div>
          </div>
        </header>

        <div style={dashboardGrid}>
          {/* Pulse Card with Telemetry Waveform */}
          <div style={{...vitalCard, background: colors.card, borderColor: colors.border}}>
            <div style={cardHeader}><span style={{...cardLabel, color: colors.subtext}}>Pulse</span><Heart size={22} color="#ef4444" fill="#ef4444" className={data.bpm > 0 ? "animate-pulse" : ""} /></div>
            <div style={cardMain}><span style={{...mainVal, color: colors.text}}>{data.bpm}</span><span style={unit}>BPM</span></div>
            <svg width="100%" height="40" style={{marginTop: '10px', overflow: 'visible'}}>
              <path d={generatePath(history)} fill="none" stroke="#ef4444" strokeWidth="2" strokeLinejoin="round" />
            </svg>
            <div style={{...indicator, color: data.bpm > 100 ? '#ef4444' : '#10b981'}}>{data.bpm > 100 ? "⚠️ Tachycardia" : "• Steady Rhythm"}</div>
          </div>

          <div style={{...vitalCard, background: colors.card, borderColor: colors.border}}>
            <div style={cardHeader}><span style={{...cardLabel, color: colors.subtext}}>Oxygen</span><Droplets size={22} color={data.spo2 < 95 ? "#ef4444" : "#0ea5e9"} /></div>
            <div style={cardMain}><span style={{...mainVal, color: data.spo2 < 95 ? "#ef4444" : colors.text}}>{data.spo2}</span><span style={unit}>%</span></div>
            <div style={{height:'40px', display:'flex', alignItems:'center', opacity: 0.3}}><Activity size={40} strokeWidth={1} /></div>
            <div style={{...indicator, color: data.spo2 < 95 ? '#ef4444' : '#10b981'}}>{data.spo2 < 95 ? "⚠️ Hypoxia Risk" : "• Normal O2"}</div>
          </div>

          <div style={{...vitalCard, background: colors.card, borderColor: colors.border}}>
            <div style={cardHeader}><span style={{...cardLabel, color: colors.subtext}}>Body Temp</span><Thermometer size={22} color={data.temp > 37.5 ? "#f97316" : "#10b981"} /></div>
            <div style={cardMain}><span style={{...mainVal, color: data.temp > 37.5 ? "#f97316" : colors.text}}>{data.temp.toFixed(1)}</span><span style={unit}>°C</span></div>
            <div style={{height:'40px', display:'flex', alignItems:'center', opacity: 0.3}}><Zap size={30} strokeWidth={1} /></div>
            <div style={{...indicator, color: data.temp > 37.5 ? '#f97316' : '#10b981'}}>{data.temp > 37.5 ? "⚠️ Fever Warning" : "• Apyretic"}</div>
          </div>

          <div style={{...vitalCard, background: colors.card, borderColor: colors.border}}>
            <div style={cardHeader}><span style={{...cardLabel, color: colors.subtext}}>Estimated BP</span><Activity size={22} color="#8b5cf6" /></div>
            <div style={cardMain}><span style={{...mainVal, color: colors.text}}>{data.sbp}/{data.dbp}</span><span style={unit}>mmHg</span></div>
            <div style={{height:'40px', display:'flex', alignItems:'center', opacity: 0.3}}><ShieldCheck size={30} strokeWidth={1} /></div>
            <div style={{...indicator, color: data.sbp > 130 ? '#ef4444' : '#10b981'}}>{data.sbp > 130 ? "⚠️ Hypertension" : "• Optimal"}</div>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- CSS CONSTANTS ---
const themeToggleBtn = { padding: "10px", borderRadius: "14px", border: "1px solid", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" };
const animatedBg = { height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", position: "relative" };
const loginGlassCard = { backdropFilter: "blur(20px)", padding: "48px", borderRadius: "32px", width: "100%", maxWidth: "400px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1)", zIndex: 10 };
const logoContainer = { width: "70px", height: "70px", background: "white", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", boxShadow: "0 10px 15px rgba(59,130,246,0.2)" };
const loginTitle = { fontSize: "2.2rem", fontWeight: "900", textAlign: "center", margin: "16px 0 0", letterSpacing: "-1px" };
const loginSubtitle = { textAlign: "center", marginBottom: "32px", fontSize: "0.9rem", fontWeight: "500" };
const formGap = { display: "flex", flexDirection: "column", gap: "20px" };
const inputGroup = { display: "flex", flexDirection: "column", gap: "6px" };
const labelStyle = { fontSize: "0.75rem", fontWeight: "700", marginLeft: "4px", textTransform: "uppercase" };
const inputStyle = { padding: "14px", borderRadius: "14px", border: "1px solid", outline: "none", fontSize: "1rem" };
const primaryButton = { padding: "16px", borderRadius: "14px", border: "none", background: "#3b82f6", color: "white", fontWeight: "800", cursor: "pointer", fontSize: "1rem" };
const dashboardWrapper = { display: "flex", height: "100vh", fontFamily: "sans-serif", transition: "background 0.3s ease" };
const criticalWrapper = { ...dashboardWrapper, animation: "pulse-red 1s infinite" };
const alertBanner = { position: "fixed", top: 0, left: 0, right: 0, background: "#ef4444", color: "white", padding: "14px", textAlign: "center", fontWeight: "900", zIndex: 100, display: "flex", justifyContent: "center", gap: "10px" };
const modernSidebar = { width: "260px", position: "relative", padding: "32px 20px", display: "flex", flexDirection: "column", zIndex: 50, background: "url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=500')", backgroundSize: "cover", backgroundPosition: "center" };
const sidebarOverlay = { position: "absolute", inset: 0, background: "rgba(15, 23, 42, 0.85)", backdropFilter: "blur(4px)", zIndex: 1 };
const sidebarBrand = { display: "flex", alignItems: "center", gap: "12px", marginBottom: "40px" };
const miniLogo = { width: "32px", height: "32px", background: "#3b82f6", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" };
const brandName = { fontWeight: "900", fontSize: "1.25rem", letterSpacing: "1px" };
const menuList = { flex: 1, display: "flex", flexDirection: "column", gap: "8px" };
const menuItem = { display: "flex", alignItems: "center", gap: "12px", padding: "14px", cursor: "pointer", borderRadius: "12px", fontSize: "0.9rem", fontWeight: "600", transition: "all 0.2s" };
const activeMenuItem = { ...menuItem };
const sidebarFooter = { paddingTop: "20px", borderTop: "1px solid" };
const logoutBtn = { background: "none", border: "none", color: "#fb7185", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" };
const mainStage = { flex: 1, padding: "40px 60px", overflowY: "auto", position: "relative" };
const topHeader = { display: "flex", justifyContent: "space-between", marginBottom: "40px", alignItems: "flex-end" };
const pageTitle = { fontSize: "2.5rem", fontWeight: "900", margin: 0, letterSpacing: "-1px" };
const pageSub = { margin: 0, fontSize: "0.85rem", fontWeight: "600" };
const statusBadge = { padding: "10px 20px", borderRadius: "99px", display: "flex", alignItems: "center", gap: "10px", border: "1px solid", height: "fit-content" };
const pulse = { width: "10px", height: "10px", background: "#10b981", borderRadius: "50%" };
const criticalPulse = { ...pulse, background: "#ef4444", animation: "bounce 0.5s infinite" };
const dashboardGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "30px" };
const vitalCard = { padding: "32px", borderRadius: "30px", border: "1px solid", transition: "all 0.3s ease", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)" };
const cardHeader = { display: "flex", justifyContent: "space-between", marginBottom: "20px" };
const cardLabel = { fontWeight: "800", textTransform: "uppercase", fontSize: "0.7rem", letterSpacing: "1px" };
const cardMain = { display: "flex", alignItems: "baseline", gap: "10px" };
const mainVal = { fontSize: "4rem", fontVariantNumeric: "tabular-nums", fontWeight: "900", letterSpacing: "-2px" };
const unit = { color: "#94a3b8", fontWeight: "800", fontSize: "1.4rem" };
const indicator = { marginTop: "20px", fontWeight: "800", fontSize: "0.8rem", textTransform: "uppercase" };
const loadingOverlay = { height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" };