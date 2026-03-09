import { useState, useCallback, createContext, useContext } from "react";
import {
  LayoutDashboard, Package, Users, Truck, ArrowLeftRight,
  AlertTriangle, BarChart2, Bell, Settings, Search, ChevronDown,
  TrendingUp, TrendingDown, CheckCircle, Shield, Wallet, Star,
  MoreVertical, Download, RefreshCw, Eye, Ban, Menu, X,
  ArrowDownRight, Zap, Globe, Lock, DollarSign, UserCheck,
  LogOut, Mail, KeyRound, AlertCircle, Activity, Sun, Moon,
  Filter, Plus, Copy, ExternalLink, CheckCheck, UserX, UserPlus,
  ChevronRight, Trash2, Edit2, Save, RotateCcw
} from "lucide-react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

// ─── CREDENTIALS ─────────────────────────────────────────────────────────────
const ADMIN_EMAIL = "admin@swiftescrow.io";
const ADMIN_PASSWORD = "Swift@2024";

// ─── THEME CONTEXT ────────────────────────────────────────────────────────────
const ThemeCtx = createContext({ dark: false, toggle: () => {} });
const useTheme = () => useContext(ThemeCtx);

// ─── DATA ─────────────────────────────────────────────────────────────────────
const ordersData = [
  { day: "Mon", orders: 42, revenue: 3820 }, { day: "Tue", orders: 58, revenue: 5200 },
  { day: "Wed", orders: 51, revenue: 4610 }, { day: "Thu", orders: 73, revenue: 6890 },
  { day: "Fri", orders: 89, revenue: 8340 }, { day: "Sat", orders: 96, revenue: 9120 },
  { day: "Sun", orders: 64, revenue: 5870 },
];
const successRateData = [
  { month: "Jan", rate: 94.2, drivers: 128 }, { month: "Feb", rate: 95.8, drivers: 134 },
  { month: "Mar", rate: 93.1, drivers: 141 }, { month: "Apr", rate: 96.4, drivers: 156 },
  { month: "May", rate: 97.2, drivers: 163 }, { month: "Jun", rate: 95.9, drivers: 178 },
];
const escrowDistribution = [
  { name: "Released", value: 62, color: "#10b981" }, { name: "Pending", value: 24, color: "#f59e0b" },
  { name: "Disputed", value: 8, color: "#ef4444" },  { name: "Refunded", value: 6, color: "#6366f1" },
];
const revenueAreaData = [
  { week: "W1", escrow: 28400, released: 24100 }, { week: "W2", escrow: 34200, released: 29800 },
  { week: "W3", escrow: 31600, released: 26400 }, { week: "W4", escrow: 41800, released: 37200 },
  { week: "W5", escrow: 38900, released: 33600 }, { week: "W6", escrow: 46200, released: 41000 },
];

const INIT_ORDERS = [
  { id: "ORD-8821", customer: "James Okonkwo",   driver: "Maria Diaz",    pickup: "Lagos Island", dropoff: "Victoria Island", amount: "$48.00", status: "delivered",  time: "2m ago" },
  { id: "ORD-8820", customer: "Sarah Chen",       driver: "Kwame Asante",  pickup: "Ikeja GRA",    dropoff: "Lekki Phase 1",  amount: "$72.50", status: "in_transit", time: "8m ago" },
  { id: "ORD-8819", customer: "Emeka Nwosu",      driver: "Unassigned",   pickup: "Yaba",          dropoff: "Surulere",       amount: "$31.00", status: "pending",    time: "15m ago" },
  { id: "ORD-8818", customer: "Aisha Bello",      driver: "David Kim",    pickup: "Ajah",          dropoff: "Ikoyi",          amount: "$95.00", status: "disputed",   time: "1h ago" },
  { id: "ORD-8817", customer: "Fatima Al-Hassan", driver: "Tunde Adeyemi",pickup: "Mushin",        dropoff: "Oshodi",         amount: "$22.50", status: "delivered",  time: "2h ago" },
  { id: "ORD-8816", customer: "Michael Torres",   driver: "Grace Nkem",   pickup: "Marina",        dropoff: "CMS",            amount: "$58.00", status: "cancelled",  time: "3h ago" },
  { id: "ORD-8815", customer: "Ngozi Eze",        driver: "Seun Falola",  pickup: "Gbagada",       dropoff: "Palmgrove",      amount: "$37.75", status: "delivered",  time: "4h ago" },
];
const INIT_CUSTOMERS = [
  { id:"CUS-001",name:"James Okonkwo",  email:"james@example.com",  phone:"+234 801 234 5678",orders:47,spent:"$2,340",status:"active",   joined:"Jan 2024",avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face"},
  { id:"CUS-002",name:"Sarah Chen",     email:"sarah@example.com",  phone:"+234 802 345 6789",orders:31,spent:"$1,890",status:"active",   joined:"Feb 2024",avatar:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face"},
  { id:"CUS-003",name:"Emeka Nwosu",    email:"emeka@example.com",  phone:"+234 803 456 7890",orders:12,spent:"$640", status:"active",   joined:"Mar 2024",avatar:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face"},
  { id:"CUS-004",name:"Aisha Bello",    email:"aisha@example.com",  phone:"+234 804 567 8901",orders:8, spent:"$480", status:"suspended",joined:"Mar 2024",avatar:"https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=64&h=64&fit=crop&crop=face"},
  { id:"CUS-005",name:"Fatima Al-Hassan",email:"fatima@example.com",phone:"+234 805 678 9012",orders:63,spent:"$3,710",status:"active",  joined:"Dec 2023",avatar:"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=64&h=64&fit=crop&crop=face"},
  { id:"CUS-006",name:"Michael Torres", email:"michael@example.com",phone:"+234 806 789 0123",orders:5, spent:"$210", status:"inactive", joined:"Apr 2024",avatar:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"},
];
const INIT_DRIVERS = [
  { id:"DRV-001",name:"Maria Diaz",    wallet:"0x1a2b...3c4d",deliveries:284,rating:4.9,status:"active",   earnings:"$8,420", avatar:"https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=64&h=64&fit=crop&crop=face"},
  { id:"DRV-002",name:"Kwame Asante", wallet:"0x2b3c...4d5e",deliveries:198,rating:4.7,status:"active",   earnings:"$6,140", avatar:"https://images.unsplash.com/photo-1463453091185-61582044d556?w=64&h=64&fit=crop&crop=face"},
  { id:"DRV-003",name:"David Kim",    wallet:"0x3c4d...5e6f",deliveries:156,rating:4.5,status:"offline",  earnings:"$4,890", avatar:"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop&crop=face"},
  { id:"DRV-004",name:"Tunde Adeyemi",wallet:"0x4d5e...6f7g",deliveries:321,rating:4.8,status:"active",   earnings:"$9,680", avatar:"https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=64&h=64&fit=crop&crop=face"},
  { id:"DRV-005",name:"Grace Nkem",   wallet:"0x5e6f...7g8h",deliveries:89, rating:4.3,status:"suspended",earnings:"$2,710", avatar:"https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=64&h=64&fit=crop&crop=face"},
  { id:"DRV-006",name:"Seun Falola",  wallet:"0x6f7g...8h9i",deliveries:412,rating:4.9,status:"active",   earnings:"$12,340",avatar:"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=64&h=64&fit=crop&crop=face"},
];
const INIT_DISPUTES = [
  { id:"DSP-041",orderId:"ORD-8818",customer:"Aisha Bello",  driver:"David Kim", amount:"$95.00",opened:"3h ago",status:"open",        customerClaim:"Package was not delivered. Driver marked as delivered but I never received it.",   driverClaim:"I delivered to the gate and took a photo. The security confirmed the drop-off."},
  { id:"DSP-040",orderId:"ORD-8801",customer:"Ngozi Eze",    driver:"Grace Nkem",amount:"$52.00",opened:"1d ago",status:"under_review", customerClaim:"Item arrived damaged. The packaging was completely crushed.",                       driverClaim:"Package was intact when I handed it over. Customer may have damaged it."},
];
const INIT_NOTIFS = [
  { id:1,type:"dispute",title:"New dispute opened",       desc:"ORD-8818 — Aisha Bello filed a dispute",            time:"3h ago", read:false},
  { id:2,type:"payment",title:"Failed payment detected",  desc:"Transaction 0xij90...mn12 failed on-chain",          time:"10h ago",read:false},
  { id:3,type:"driver", title:"Driver suspension alert",  desc:"Grace Nkem (DRV-005) has been suspended by system",  time:"1d ago", read:true},
  { id:4,type:"dispute",title:"Dispute resolved",         desc:"DSP-039 closed — payment released to driver",        time:"2d ago", read:true},
  { id:5,type:"system", title:"Platform fee updated",     desc:"Escrow fee changed from 2.5% to 2.8%",               time:"3d ago", read:true},
];
const INIT_ESCROW = [
  { orderId:"ORD-8821",amount:"$48.00",wallet:"0x1a2b...3c4d",escrowStatus:"held",    releaseStatus:"pending_delivery"},
  { orderId:"ORD-8820",amount:"$72.50",wallet:"0x2b3c...4d5e",escrowStatus:"held",    releaseStatus:"in_transit"},
  { orderId:"ORD-8818",amount:"$95.00",wallet:"0x3c4d...5e6f",escrowStatus:"locked",  releaseStatus:"disputed"},
  { orderId:"ORD-8817",amount:"$22.50",wallet:"0x4d5e...6f7g",escrowStatus:"released",releaseStatus:"completed"},
  { orderId:"ORD-8815",amount:"$37.75",wallet:"0x5e6f...7g8h",escrowStatus:"released",releaseStatus:"completed"},
  { orderId:"ORD-8814",amount:"$61.00",wallet:"0x6f7g...8h9i",escrowStatus:"refunded",releaseStatus:"refunded"},
];
const INIT_TXS = [
  { txId:"0xab12...ef34",orderId:"ORD-8817",amount:"$22.50",wallet:"0x4d5e...6f7g",status:"confirmed",time:"2h ago"},
  { txId:"0xcd34...gh56",orderId:"ORD-8815",amount:"$37.75",wallet:"0x5e6f...7g8h",status:"confirmed",time:"4h ago"},
  { txId:"0xef56...ij78",orderId:"ORD-8814",amount:"$61.00",wallet:"0x6f7g...8h9i",status:"confirmed",time:"6h ago"},
  { txId:"0xgh78...kl90",orderId:"ORD-8812",amount:"$88.25",wallet:"0x7g8h...9i0j",status:"pending",  time:"8h ago"},
  { txId:"0xij90...mn12",orderId:"ORD-8810",amount:"$44.00",wallet:"0x8h9i...0j1k",status:"failed",   time:"10h ago"},
];

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Syne:wght@600;700;800&display=swap');
    *{font-family:'DM Sans',sans-serif;box-sizing:border-box;margin:0;padding:0;}
    .syne{font-family:'Syne',sans-serif!important;}
    .page-fade{animation:pFade .22s ease forwards;}
    @keyframes pFade{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
    .login-in{animation:lIn .52s cubic-bezier(.16,1,.3,1) forwards;}
    @keyframes lIn{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
    .d1{animation-delay:.08s;opacity:0}.d2{animation-delay:.18s;opacity:0}.d3{animation-delay:.28s;opacity:0}.d4{animation-delay:.38s;opacity:0}
    .float{animation:fl 6s ease-in-out infinite;}.float2{animation:fl 8s ease-in-out infinite reverse;}
    @keyframes fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
    .grid-bg{background-image:linear-gradient(rgba(99,102,241,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.07) 1px,transparent 1px);background-size:44px 44px;}
    ::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:99px}
    .sl{border:1px solid transparent;transition:all .15s;}
    .sl.on{background:linear-gradient(135deg,rgba(99,102,241,.25),rgba(139,92,246,.15));border-color:rgba(99,102,241,.3);color:#e0e7ff!important;}
    .sl:not(.on):hover{background:rgba(255,255,255,.05);color:#cbd5e1!important;}
    .ch{transition:all .25s ease;}.ch:hover{transform:translateY(-3px);box-shadow:0 12px 36px rgba(0,0,0,.12);}
    .bp{background:linear-gradient(135deg,#4f46e5,#6366f1);box-shadow:0 4px 14px rgba(99,102,241,.35);transition:all .2s;}
    .bp:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(99,102,241,.45);}
    .bp:disabled{opacity:.6;cursor:not-allowed;transform:none;}
    .dm-bg{background:#0f172a!important;}.dm-card{background:#1e293b!important;border-color:#334155!important;}
    .dm-text{color:#f1f5f9!important;}.dm-sub{color:#94a3b8!important;}.dm-border{border-color:#334155!important;}
    .dm-input{background:#0f172a!important;border-color:#334155!important;color:#f1f5f9!important;}
    .dm-row:hover{background:rgba(255,255,255,.03)!important;}
    .dm-th{background:rgba(255,255,255,.04)!important;}.dm-header{background:rgba(15,23,42,.85)!important;border-color:#1e293b!important;}
    .toast{position:fixed;bottom:24px;right:24px;z-index:9999;animation:toastIn .3s ease forwards;}
    @keyframes toastIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    .modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:100;display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(4px);}
    .modal{background:#fff;border-radius:20px;padding:28px;width:100%;max-width:480px;box-shadow:0 24px 64px rgba(0,0,0,.18);animation:pFade .2s ease forwards;}
    .modal.dark{background:#1e293b;}
  `}</style>
);

// ─── TOAST ────────────────────────────────────────────────────────────────────
const Toast = ({ msg, type, onClose }) => {
  const { dark } = useTheme();
  const bg = type === "success" ? "bg-emerald-600" : type === "error" ? "bg-red-600" : type === "warn" ? "bg-amber-500" : "bg-indigo-600";
  return (
    <div className={`toast flex items-center gap-3 px-5 py-3.5 rounded-2xl text-white text-sm font-semibold shadow-2xl ${bg}`}>
      {type === "success" ? <CheckCheck size={16}/> : type === "error" ? <AlertCircle size={16}/> : <Bell size={16}/>}
      {msg}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X size={14}/></button>
    </div>
  );
};

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
const SB = ({ status }) => {
  const m = {
    delivered:        ["Delivered",       "bg-emerald-50 text-emerald-700 border-emerald-200"],
    in_transit:       ["In Transit",      "bg-blue-50 text-blue-700 border-blue-200"],
    pending:          ["Pending",         "bg-amber-50 text-amber-700 border-amber-200"],
    disputed:         ["Disputed",        "bg-red-50 text-red-700 border-red-200"],
    cancelled:        ["Cancelled",       "bg-slate-100 text-slate-500 border-slate-200"],
    active:           ["Active",          "bg-emerald-50 text-emerald-700 border-emerald-200"],
    offline:          ["Offline",         "bg-slate-100 text-slate-500 border-slate-200"],
    suspended:        ["Suspended",       "bg-red-50 text-red-700 border-red-200"],
    inactive:         ["Inactive",        "bg-slate-100 text-slate-500 border-slate-200"],
    held:             ["Held",            "bg-amber-50 text-amber-700 border-amber-200"],
    locked:           ["Locked",          "bg-red-50 text-red-700 border-red-200"],
    released:         ["Released",        "bg-emerald-50 text-emerald-700 border-emerald-200"],
    refunded:         ["Refunded",        "bg-violet-50 text-violet-700 border-violet-200"],
    confirmed:        ["Confirmed",       "bg-emerald-50 text-emerald-700 border-emerald-200"],
    failed:           ["Failed",          "bg-red-50 text-red-700 border-red-200"],
    open:             ["Open",            "bg-red-50 text-red-700 border-red-200"],
    under_review:     ["Under Review",    "bg-amber-50 text-amber-700 border-amber-200"],
    resolved:         ["Resolved",        "bg-emerald-50 text-emerald-700 border-emerald-200"],
    pending_delivery: ["Pending Delivery","bg-blue-50 text-blue-700 border-blue-200"],
    completed:        ["Completed",       "bg-emerald-50 text-emerald-700 border-emerald-200"],
  };
  const [label, cls] = m[status] || [status, "bg-slate-100 text-slate-500 border-slate-200"];
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold border ${cls}`}>{label}</span>;
};

// ─── AVATAR ───────────────────────────────────────────────────────────────────
const Av = ({ src, name, size = "w-9 h-9" }) => {
  const [err, setErr] = useState(false);
  const initials = (name || "").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const pals = ["from-indigo-400 to-violet-500","from-emerald-400 to-teal-500","from-rose-400 to-pink-500","from-amber-400 to-orange-500","from-sky-400 to-blue-500"];
  const ci = (name || " ").charCodeAt(0) % pals.length;
  if (src && !err) return <img src={src} alt={name} onError={() => setErr(true)} className={`${size} rounded-full object-cover border-2 border-white shadow-sm`}/>;
  return <div className={`${size} rounded-full bg-gradient-to-br ${pals[ci]} flex items-center justify-center text-white text-xs font-bold`}>{initials}</div>;
};

// ─── BANNER ───────────────────────────────────────────────────────────────────
const Banner = ({ title, sub, img, accent, action }) => (
  <div className="relative rounded-3xl overflow-hidden h-32 mb-6 shrink-0">
    <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover"/>
    <div className="absolute inset-0" style={{ background: accent }}/>
    <div className="relative z-10 px-8 h-full flex items-center justify-between">
      <div>
        <h2 className="syne text-2xl font-extrabold text-white tracking-tight">{title}</h2>
        <p className="text-slate-300 text-xs mt-1">{sub}</p>
      </div>
      {action}
    </div>
  </div>
);

// ─── TABLE HEADER ─────────────────────────────────────────────────────────────
const TH = ({ cols, dark }) => (
  <thead><tr className={`border-b ${dark ? "dm-th border-slate-700" : "bg-slate-50/80 border-slate-100"}`}>
    {cols.map(h => <th key={h} className={`text-left text-[11px] font-bold px-4 py-3.5 uppercase tracking-wider whitespace-nowrap ${dark ? "text-slate-400" : "text-slate-400"}`}>{h}</th>)}
  </tr></thead>
);

// ─── CONFIRM MODAL ────────────────────────────────────────────────────────────
const ConfirmModal = ({ title, msg, onConfirm, onCancel, confirmLabel = "Confirm", confirmColor = "bp", dark }) => (
  <div className="modal-bg" onClick={onCancel}>
    <div className={`modal ${dark ? "dark" : ""}`} onClick={e => e.stopPropagation()}>
      <h3 className={`syne text-lg font-bold mb-2 ${dark ? "text-white" : "text-slate-900"}`}>{title}</h3>
      <p className={`text-sm mb-6 leading-relaxed ${dark ? "text-slate-300" : "text-slate-600"}`}>{msg}</p>
      <div className="flex gap-3">
        <button onClick={onCancel} className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-colors ${dark ? "border-slate-600 text-slate-300 hover:bg-slate-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>Cancel</button>
        <button onClick={onConfirm} className={`flex-1 py-2.5 rounded-xl text-white text-sm font-bold ${confirmColor}`}>{confirmLabel}</button>
      </div>
    </div>
  </div>
);

// ─── VIEW MODAL ───────────────────────────────────────────────────────────────
const ViewModal = ({ title, rows, onClose, dark }) => (
  <div className="modal-bg" onClick={onClose}>
    <div className={`modal ${dark ? "dark" : ""}`} style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-5">
        <h3 className={`syne text-lg font-bold ${dark ? "text-white" : "text-slate-900"}`}>{title}</h3>
        <button onClick={onClose} className={`p-1.5 rounded-xl transition-colors ${dark ? "hover:bg-slate-700" : "hover:bg-slate-100"}`}><X size={15}/></button>
      </div>
      <div className="space-y-3">
        {rows.map(([label, value], i) => (
          <div key={i} className={`flex items-start justify-between gap-4 py-2.5 border-b last:border-0 ${dark ? "border-slate-700" : "border-slate-100"}`}>
            <span className={`text-xs font-bold uppercase tracking-wide ${dark ? "text-slate-400" : "text-slate-400"}`}>{label}</span>
            <span className={`text-sm font-semibold text-right ${dark ? "text-slate-200" : "text-slate-800"}`}>{value}</span>
          </div>
        ))}
      </div>
      <button onClick={onClose} className="mt-5 w-full py-2.5 rounded-xl text-white text-sm font-bold bp">Close</button>
    </div>
  </div>
);

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const submit = () => {
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setTimeout(() => {
      if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        onLogin({ email: email.trim().toLowerCase(), name: "Admin" });
      } else {
        setError("Invalid credentials. Please try again.");
        setLoading(false);
      }
    }, 1100);
  };

  return (
    <div className="min-h-screen flex">
      <GlobalStyles />
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[58%] relative overflow-hidden flex-col" style={{ background: "linear-gradient(160deg,#060d1f 0%,#0f172a 45%,#1e1040 100%)" }}>
        <div className="absolute inset-0 grid-bg"/>
        <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle,rgba(99,102,241,.2),transparent 70%)" }}/>
        <div className="absolute bottom-[-80px] right-[-80px] w-[420px] h-[420px] rounded-full" style={{ background: "radial-gradient(circle,rgba(139,92,246,.18),transparent 70%)" }}/>
        <div className="absolute top-[45%] right-[15%] w-[250px] h-[250px] rounded-full" style={{ background: "radial-gradient(circle,rgba(6,182,212,.12),transparent 70%)" }}/>
        <div className="relative z-10 flex flex-col h-full p-14">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}><Shield size={20} className="text-white"/></div>
            <span className="syne font-bold text-white text-xl tracking-tight">SwiftEscrow</span>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="mb-10">
              <span className="text-indigo-400 text-xs font-bold tracking-widest uppercase">Admin Control Center</span>
              <h1 className="syne mt-4 text-5xl font-extrabold text-white leading-none tracking-tight">
                Secure Delivery<br/>
                <span style={{ background: "linear-gradient(135deg,#818cf8,#c4b5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Escrow Platform.</span>
              </h1>
              <p className="text-slate-400 mt-5 leading-relaxed max-w-md text-sm">Monitor every order, manage your driver fleet, track escrow payments, and resolve disputes — all from one powerful dashboard.</p>
            </div>
            <div className="flex gap-4 mb-10">
              {[{label:"Total Escrow",val:"$142.8K",sub:"+18.3%",col:"text-emerald-400",cls:"float"},{label:"Active Drivers",val:"163",sub:"Online now",col:"text-indigo-400",cls:"float2"},{label:"Success Rate",val:"97.2%",sub:"Excellent",col:"text-emerald-400",cls:"float"}].map((s,i)=>(
                <div key={i} className={`${s.cls} rounded-2xl p-4 flex-1`} style={{ background: "rgba(255,255,255,.05)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,.07)" }}>
                  <p className="text-slate-400 text-xs mb-1">{s.label}</p>
                  <p className={`syne text-white font-bold text-xl`}>{s.val}</p>
                  <p className={`text-xs mt-1 ${s.col}`}>{s.sub}</p>
                </div>
              ))}
            </div>
            <div className="relative h-44 rounded-2xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&h=400&fit=crop" alt="" className="w-full h-full object-cover opacity-40"/>
              <div className="absolute inset-0" style={{ background: "linear-gradient(90deg,rgba(6,13,31,.8),rgba(6,13,31,.3))" }}/>
              <div className="absolute bottom-5 left-5">
                <p className="text-white text-sm font-semibold">Trusted logistics infrastructure</p>
                <p className="text-slate-400 text-xs mt-0.5">Built for speed, security, and scale</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-8">
            <div className="flex -space-x-2">
              {["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face","https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face","https://images.unsplash.com/photo-1463453091185-61582044d556?w=40&h=40&fit=crop&crop=face","https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=40&h=40&fit=crop&crop=face"].map((src,i)=>(
                <img key={i} src={src} alt="" className="w-8 h-8 rounded-full object-cover border-2" style={{ borderColor: "#0f172a" }}/>
              ))}
            </div>
            <p className="text-slate-400 text-xs">Trusted by <span className="text-white font-semibold">8,800+</span> platform users</p>
          </div>
        </div>
      </div>
      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-16" style={{ background: "#f8fafc" }}>
        <div className="w-full max-w-[400px]">
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}><Shield size={17} className="text-white"/></div>
            <span className="syne font-bold text-slate-900 text-lg">SwiftEscrow</span>
          </div>
          <div className="login-in d1">
            <h2 className="syne text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back</h2>
            <p className="text-slate-500 text-sm mt-2 mb-8">Sign in to your admin control center</p>
          </div>
          <div className="space-y-4">
            <div className="login-in d2">
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} placeholder="admin@swiftescrow.io"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"/>
              </div>
            </div>
            <div className="login-in d3">
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Password</label>
              <div className="relative">
                <KeyRound size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>
                <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} placeholder="Enter your password"
                  className="w-full pl-11 pr-14 py-3.5 rounded-2xl text-sm border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"/>
                <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors">{showPass ? "Hide" : "Show"}</button>
              </div>
            </div>
            {error && <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm"><AlertCircle size={14} className="shrink-0"/>{error}</div>}
            <div className="login-in d4">
              <button onClick={submit} disabled={loading} className="w-full py-4 rounded-2xl text-white text-sm font-bold mt-2 flex items-center justify-center gap-2 bp">
                {loading ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity=".3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>Authenticating…</> : <><Lock size={14}/> Sign in to Dashboard</>}
              </button>
            </div>
          </div>
          <div className="login-in d4 mt-8 p-4 rounded-2xl border border-indigo-100" style={{ background: "linear-gradient(135deg,#eef2ff,#f5f3ff)" }}>
            <p className="text-xs font-bold text-indigo-700 mb-1.5">Demo Credentials</p>
            <p className="text-xs text-indigo-600 font-mono">Email: admin@swiftescrow.io</p>
            <p className="text-xs text-indigo-600 font-mono">Password: Swift@2024</p>
          </div>
          <p className="text-center text-xs text-slate-400 mt-8">© 2024 SwiftEscrow · Secured &amp; encrypted</p>
        </div>
      </div>
    </div>
  );
};

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
const DashboardPage = ({ navigate, dark }) => {
  const c = dark ? "text-slate-200" : "text-slate-900";
  const cs = dark ? "text-slate-400" : "text-slate-500";
  const card = dark ? "dm-card border" : "bg-white border border-slate-100 shadow-sm";
  const gridStroke = dark ? "#1e293b" : "#f1f5f9";
  const tickFill = dark ? "#64748b" : "#94a3b8";

  return (
    <div className="space-y-7 page-fade">
      <div className="relative rounded-3xl overflow-hidden" style={{ height: 188 }}>
        <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1400&h=500&fit=crop" alt="" className="absolute inset-0 w-full h-full object-cover"/>
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,rgba(9,14,33,.92) 0%,rgba(79,70,229,.7) 100%)" }}/>
        <div className="relative z-10 p-8 flex items-center justify-between h-full">
          <div>
            <p className="text-indigo-300 text-xs font-bold tracking-widest uppercase mb-2">Platform Overview</p>
            <h1 className="syne text-3xl font-extrabold text-white tracking-tight">Admin Dashboard</h1>
            <p className="text-slate-300 text-sm mt-1.5">March 10, 2026 · All systems operational</p>
          </div>
          <div className="hidden md:flex gap-3">
            {[["$142.8K","Total Escrow"],["97.2%","Success Rate"],["8,821","Total Orders"]].map(([v,l],i)=>(
              <div key={i} className="text-center rounded-2xl px-5 py-3" style={{ background: "rgba(255,255,255,.1)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,.12)" }}>
                <p className="syne text-white text-xl font-bold">{v}</p><p className="text-slate-300 text-xs mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { icon:Package,  label:"Total Orders",     value:"8,821",  change:"+12%", up:true,  accent:"bg-indigo-600",  img:"https://images.unsplash.com/photo-1553413077-190dd305871c?w=300" },
          { icon:Truck,    label:"Active Deliveries",value:"47",     change:"+3",   up:true,  accent:"bg-blue-600",    img:"https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300" },
          { icon:Wallet,   label:"Pending Escrow",   value:"$14,280",change:"+8%",  up:true,  accent:"bg-amber-500",   img:"https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300" },
          { icon:CheckCircle,label:"Completed",      value:"8,241",  change:"+15%", up:true,  accent:"bg-emerald-600", img:"https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=300" },
          { icon:UserCheck,label:"Active Drivers",   value:"163",    change:"-2",   up:false, accent:"bg-slate-700",   img:"https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300" },
          { icon:Users,    label:"Customer Growth",  value:"+284",   change:"+22%", up:true,  accent:"bg-violet-600",  img:"https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300" },
        ].map((k,i)=>(
          <div key={i} className={`ch ${card} rounded-2xl p-5 relative overflow-hidden group cursor-pointer`} onClick={()=>navigate(["orders","orders","escrow","orders","drivers","customers"][i])}>
            {k.img && <img src={k.img} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.035] group-hover:opacity-[0.07] transition-opacity"/>}
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-sm ${k.accent}`}><k.icon size={18} className="text-white"/></div>
                <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${k.up?"bg-emerald-50 text-emerald-700":"bg-red-50 text-red-600"}`}>
                  {k.up?<TrendingUp size={10}/>:<TrendingDown size={10}/>}{k.change}
                </span>
              </div>
              <p className={`syne text-2xl font-bold ${c}`}>{k.value}</p>
              <p className={`text-xs mt-1 ${cs}`}>{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 ${card} rounded-2xl p-6`}>
          <div className="flex items-center justify-between mb-5">
            <div><p className={`text-sm font-bold ${c}`}>Orders &amp; Revenue</p><p className={`text-xs ${cs}`}>This week</p></div>
            <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold ${dark?"bg-slate-700 text-slate-300":"bg-slate-100 text-slate-600"}`}>Daily</span>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={ordersData}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.18}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.18}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke}/>
              <XAxis dataKey="day" tick={{fontSize:11,fill:tickFill}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:11,fill:tickFill}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{borderRadius:12,border:`1px solid ${dark?"#334155":"#e2e8f0"}`,fontSize:12,background:dark?"#1e293b":"#fff",color:dark?"#f1f5f9":"#0f172a"}}/>
              <Area type="monotone" dataKey="orders" stroke="#6366f1" strokeWidth={2.5} fill="url(#g1)" name="Orders"/>
              <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fill="url(#g2)" name="Revenue ($)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className={`${card} rounded-2xl p-6`}>
          <p className={`text-sm font-bold mb-1 ${c}`}>Escrow Distribution</p>
          <p className={`text-xs mb-4 ${cs}`}>Current period</p>
          <ResponsiveContainer width="100%" height={155}>
            <PieChart><Pie data={escrowDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={72} paddingAngle={3} dataKey="value">
              {escrowDistribution.map((e,i) => <Cell key={i} fill={e.color} strokeWidth={0}/>)}
            </Pie><Tooltip contentStyle={{borderRadius:10,border:`1px solid ${dark?"#334155":"#e2e8f0"}`,fontSize:12,background:dark?"#1e293b":"#fff",color:dark?"#f1f5f9":"#0f172a"}}/></PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">{escrowDistribution.map((d,i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <span className={`flex items-center gap-2 ${cs}`}><span className="w-2.5 h-2.5 rounded-full" style={{background:d.color}}/>{d.name}</span>
              <span className={`font-bold ${c}`}>{d.value}%</span>
            </div>
          ))}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[
          { title:"Escrow Value Flow", sub:"6-week trend", chart: <BarChart data={revenueAreaData} barGap={4}><CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false}/><XAxis dataKey="week" tick={{fontSize:11,fill:tickFill}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:11,fill:tickFill}} axisLine={false} tickLine={false}/><Tooltip contentStyle={{borderRadius:10,border:`1px solid ${dark?"#334155":"#e2e8f0"}`,fontSize:12,background:dark?"#1e293b":"#fff",color:dark?"#f1f5f9":"#0f172a"}}/><Bar dataKey="escrow" fill="#6366f1" radius={[5,5,0,0]} name="Escrow In"/><Bar dataKey="released" fill="#10b981" radius={[5,5,0,0]} name="Released"/></BarChart> },
          { title:"Delivery Success Rate", sub:"6-month view", chart: <LineChart data={successRateData}><CartesianGrid strokeDasharray="3 3" stroke={gridStroke}/><XAxis dataKey="month" tick={{fontSize:11,fill:tickFill}} axisLine={false} tickLine={false}/><YAxis domain={[90,100]} tick={{fontSize:11,fill:tickFill}} axisLine={false} tickLine={false}/><Tooltip contentStyle={{borderRadius:10,border:`1px solid ${dark?"#334155":"#e2e8f0"}`,fontSize:12,background:dark?"#1e293b":"#fff",color:dark?"#f1f5f9":"#0f172a"}}/><Line type="monotone" dataKey="rate" stroke="#6366f1" strokeWidth={2.5} dot={{r:4,fill:"#6366f1",strokeWidth:0}} name="Success %"/></LineChart> },
        ].map((ch,i)=>(
          <div key={i} className={`${card} rounded-2xl p-6`}>
            <p className={`text-sm font-bold mb-1 ${c}`}>{ch.title}</p><p className={`text-xs mb-4 ${cs}`}>{ch.sub}</p>
            <ResponsiveContainer width="100%" height={185}>{ch.chart}</ResponsiveContainer>
          </div>
        ))}
      </div>

      <div className={`${card} rounded-2xl overflow-hidden`}>
        <div className={`px-6 py-4 flex items-center justify-between border-b ${dark?"border-slate-700":"border-slate-50"}`}>
          <p className={`text-sm font-bold ${c}`}>Recent Orders</p>
          <button onClick={()=>navigate("orders")} className="text-xs text-indigo-500 font-bold hover:text-indigo-400 transition-colors">View all →</button>
        </div>
        {INIT_ORDERS.slice(0,5).map((o,i)=>(
          <div key={i} className={`px-6 py-3.5 flex items-center gap-4 transition-colors border-b last:border-0 cursor-pointer ${dark?"border-slate-800 hover:bg-slate-800/50 dm-row":"border-slate-50 hover:bg-slate-50/80"}`}
            onClick={()=>navigate("orders")}>
            <span className="text-xs font-mono font-bold text-indigo-500 w-20 shrink-0">{o.id}</span>
            <span className={`text-sm font-semibold w-36 truncate ${c}`}>{o.customer}</span>
            <span className={`text-sm w-32 truncate hidden md:block ${cs}`}>{o.driver}</span>
            <span className={`text-sm font-bold w-16 ${c}`}>{o.amount}</span>
            <SB status={o.status}/>
            <span className={`text-xs ml-auto ${cs}`}>{o.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── ORDERS PAGE ──────────────────────────────────────────────────────────────
const OrdersPage = ({ dark, showToast }) => {
  const [filter, setFilter] = useState("all");
  const [orderList, setOrderList] = useState(INIT_ORDERS);
  const [viewOrder, setViewOrder] = useState(null);
  const [confirmCancel, setConfirmCancel] = useState(null);

  const c = dark ? "text-slate-200" : "text-slate-900";
  const cs = dark ? "text-slate-400" : "text-slate-500";
  const card = dark ? "dm-card border" : "bg-white border border-slate-100 shadow-sm";
  const filtered = filter === "all" ? orderList : orderList.filter(o => o.status === filter);

  const handleCancel = (id) => {
    setOrderList(list => list.map(o => o.id === id ? { ...o, status: "cancelled" } : o));
    setConfirmCancel(null);
    showToast("Order cancelled successfully", "success");
  };

  const exportCSV = () => {
    const header = "Order ID,Customer,Driver,Pickup,Dropoff,Amount,Status";
    const rows = filtered.map(o => `${o.id},${o.customer},${o.driver},${o.pickup},${o.dropoff},${o.amount},${o.status}`);
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "orders.csv"; a.click();
    showToast("Orders exported as CSV", "success");
  };

  return (
    <div className="page-fade space-y-5">
      <Banner title="Orders" sub={`${orderList.length} total orders`} img="https://images.unsplash.com/photo-1553413077-190dd305871c?w=1400&h=300&fit=crop" accent="linear-gradient(90deg,rgba(9,14,33,.92),rgba(79,70,229,.6))"
        action={<button onClick={exportCSV} className="px-4 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-1.5" style={{background:"rgba(255,255,255,.15)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,.2)"}}><Download size={13}/> Export CSV</button>}
      />
      <div className="flex gap-2 flex-wrap">
        {["all","pending","in_transit","delivered","disputed","cancelled"].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${filter===s?"text-white":"border text-slate-600 hover:bg-slate-50"}`}
            style={filter===s?{background:"linear-gradient(135deg,#4f46e5,#6366f1)",boxShadow:"0 4px 12px rgba(99,102,241,.35)"}:{borderColor:dark?"#334155":"#e2e8f0",background:dark?"#1e293b":"#fff",color:dark?"#94a3b8":"#475569"}}>
            {s === "all" ? "All Orders" : s.replace("_"," ")}
          </button>
        ))}
        <span className={`ml-auto text-xs font-semibold self-center ${cs}`}>{filtered.length} results</span>
      </div>
      <div className={`${card} rounded-2xl overflow-x-auto`}>
        <table className="w-full">
          <TH dark={dark} cols={["Order ID","Customer","Driver","Pickup","Dropoff","Amount","Status","Time","Actions"]}/>
          <tbody className="divide-y" style={{borderColor:dark?"#1e293b":"#f8fafc"}}>
            {filtered.length === 0 && <tr><td colSpan={9} className={`text-center py-12 text-sm ${cs}`}>No orders match this filter.</td></tr>}
            {filtered.map((o,i) => (
              <tr key={i} className={`transition-colors group ${dark?"dm-row":"hover:bg-slate-50/70"}`}>
                <td className="px-4 py-3.5 text-xs font-mono font-bold text-indigo-500">{o.id}</td>
                <td className={`px-4 py-3.5 text-sm font-semibold ${c}`}>{o.customer}</td>
                <td className={`px-4 py-3.5 text-sm ${cs}`}>{o.driver}</td>
                <td className={`px-4 py-3.5 text-sm ${cs} max-w-[80px] truncate`}>{o.pickup}</td>
                <td className={`px-4 py-3.5 text-sm ${cs} max-w-[80px] truncate`}>{o.dropoff}</td>
                <td className={`px-4 py-3.5 text-sm font-bold ${c}`}>{o.amount}</td>
                <td className="px-4 py-3.5"><SB status={o.status}/></td>
                <td className={`px-4 py-3.5 text-xs ${cs}`}>{o.time}</td>
                <td className="px-4 py-3.5">
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setViewOrder(o)} className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${dark?"bg-slate-700 text-slate-300 hover:bg-slate-600":"bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>View</button>
                    {o.status !== "cancelled" && o.status !== "delivered" &&
                      <button onClick={() => setConfirmCancel(o.id)} className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-colors">Cancel</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {viewOrder && <ViewModal dark={dark} title={`Order ${viewOrder.id}`} onClose={() => setViewOrder(null)} rows={[["Order ID",viewOrder.id],["Customer",viewOrder.customer],["Driver",viewOrder.driver],["Pickup",viewOrder.pickup],["Dropoff",viewOrder.dropoff],["Amount",viewOrder.amount],["Status",viewOrder.status],["Time",viewOrder.time]]}/>}
      {confirmCancel && <ConfirmModal dark={dark} title="Cancel Order" msg={`Are you sure you want to cancel order ${confirmCancel}? This action cannot be undone.`} confirmLabel="Yes, Cancel" confirmColor="bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors" onConfirm={() => handleCancel(confirmCancel)} onCancel={() => setConfirmCancel(null)}/>}
    </div>
  );
};

// ─── CUSTOMERS PAGE ───────────────────────────────────────────────────────────
const CustomersPage = ({ dark, showToast }) => {
  const [customers, setCustomers] = useState(INIT_CUSTOMERS);
  const [viewCust, setViewCust] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const c = dark ? "text-slate-200" : "text-slate-900";
  const cs = dark ? "text-slate-400" : "text-slate-500";
  const card = dark ? "dm-card border" : "bg-white border border-slate-100 shadow-sm";

  const toggleSuspend = (id) => {
    const cust = customers.find(c => c.id === id);
    const newStatus = cust.status === "suspended" ? "active" : "suspended";
    setCustomers(list => list.map(c => c.id === id ? { ...c, status: newStatus } : c));
    setConfirmAction(null);
    showToast(`${cust.name} has been ${newStatus === "suspended" ? "suspended" : "reactivated"}`, newStatus === "suspended" ? "warn" : "success");
  };

  return (
    <div className="page-fade space-y-5">
      <Banner title="Customers" sub={`${customers.length} registered customers`} img="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&h=300&fit=crop" accent="linear-gradient(90deg,rgba(9,14,33,.92),rgba(16,185,129,.5))"/>
      <div className={`${card} rounded-2xl overflow-x-auto`}>
        <table className="w-full">
          <TH dark={dark} cols={["Customer","Contact","Orders","Total Spent","Status","Joined","Actions"]}/>
          <tbody className="divide-y" style={{borderColor:dark?"#1e293b":"#f8fafc"}}>
            {customers.map((cu,i) => (
              <tr key={i} className={`transition-colors ${dark?"dm-row":"hover:bg-slate-50/70"}`}>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <Av src={cu.avatar} name={cu.name} size="w-9 h-9"/>
                    <div><p className={`text-sm font-bold ${c}`}>{cu.name}</p><p className={`text-xs font-mono ${cs}`}>{cu.id}</p></div>
                  </div>
                </td>
                <td className="px-4 py-4"><p className={`text-sm ${c}`}>{cu.email}</p><p className={`text-xs ${cs}`}>{cu.phone}</p></td>
                <td className={`px-4 py-4 text-sm font-bold ${c}`}>{cu.orders}</td>
                <td className={`px-4 py-4 text-sm font-bold ${c}`}>{cu.spent}</td>
                <td className="px-4 py-4"><SB status={cu.status}/></td>
                <td className={`px-4 py-4 text-sm ${cs}`}>{cu.joined}</td>
                <td className="px-4 py-4">
                  <div className="flex gap-1.5">
                    <button onClick={() => setViewCust(cu)} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${dark?"bg-slate-700 text-slate-300 hover:bg-slate-600":"bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>View</button>
                    {cu.status !== "inactive" && (
                      <button onClick={() => setConfirmAction({ id: cu.id, name: cu.name, currentStatus: cu.status })}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${cu.status==="suspended"?"bg-emerald-50 text-emerald-700 hover:bg-emerald-100":"bg-red-50 text-red-600 hover:bg-red-100"}`}>
                        {cu.status === "suspended" ? "Reactivate" : "Suspend"}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {viewCust && <ViewModal dark={dark} title={viewCust.name} onClose={() => setViewCust(null)} rows={[["ID",viewCust.id],["Email",viewCust.email],["Phone",viewCust.phone],["Orders",viewCust.orders],["Total Spent",viewCust.spent],["Status",viewCust.status],["Joined",viewCust.joined]]}/>}
      {confirmAction && <ConfirmModal dark={dark} title={confirmAction.currentStatus==="suspended"?"Reactivate Customer":"Suspend Customer"} msg={`Are you sure you want to ${confirmAction.currentStatus==="suspended"?"reactivate":"suspend"} ${confirmAction.name}?`} confirmLabel={confirmAction.currentStatus==="suspended"?"Reactivate":"Suspend"} confirmColor={confirmAction.currentStatus==="suspended"?"bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl":"bg-red-600 hover:bg-red-700 text-white rounded-xl"} onConfirm={()=>toggleSuspend(confirmAction.id)} onCancel={()=>setConfirmAction(null)}/>}
    </div>
  );
};

// ─── DRIVERS PAGE ─────────────────────────────────────────────────────────────
const DriversPage = ({ dark, showToast }) => {
  const [drivers, setDrivers] = useState(INIT_DRIVERS);
  const [viewDriver, setViewDriver] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const c = dark ? "text-slate-200" : "text-slate-900";
  const cs = dark ? "text-slate-400" : "text-slate-500";
  const card = dark ? "dm-card border" : "bg-white border border-slate-100 shadow-sm";

  const toggleSuspend = (id) => {
    const drv = drivers.find(d => d.id === id);
    const ns = drv.status === "suspended" ? "active" : "suspended";
    setDrivers(list => list.map(d => d.id === id ? { ...d, status: ns } : d));
    setConfirmAction(null);
    showToast(`${drv.name} has been ${ns === "suspended" ? "suspended" : "reinstated"}`, ns === "suspended" ? "warn" : "success");
  };

  return (
    <div className="page-fade space-y-5">
      <Banner title="Drivers" sub={`${drivers.length} registered drivers`} img="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1400&h=300&fit=crop" accent="linear-gradient(90deg,rgba(9,14,33,.92),rgba(99,102,241,.55))"/>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {drivers.map((d,i) => (
          <div key={i} className={`ch ${card} rounded-2xl p-5`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3"><Av src={d.avatar} name={d.name} size="w-11 h-11"/><div><p className={`text-sm font-bold ${c}`}>{d.name}</p><p className={`text-xs font-mono ${cs}`}>{d.id}</p></div></div>
              <SB status={d.status}/>
            </div>
            <div className="space-y-2.5 mb-4">
              {[["Wallet",d.wallet],["Deliveries",d.deliveries],["Earnings",d.earnings]].map(([l,v],j) => (
                <div key={j} className={`flex items-center justify-between text-xs border-b pb-1 ${dark?"border-slate-700":"border-slate-50"}`}>
                  <span className={cs}>{l}</span>
                  <span className={`font-bold ${l==="Earnings"?"text-emerald-500":c}`}>{v}</span>
                </div>
              ))}
              <div className="flex items-center justify-between text-xs">
                <span className={cs}>Rating</span>
                <span className={`flex items-center gap-1 font-bold ${c}`}><Star size={11} className="fill-amber-400 text-amber-400"/>{d.rating}</span>
              </div>
            </div>
            <div className="flex gap-2 pt-3 border-t" style={{borderColor:dark?"#334155":"#f1f5f9"}}>
              <button onClick={() => setViewDriver(d)} className={`flex-1 py-2 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1 ${dark?"bg-slate-700 text-slate-300 hover:bg-slate-600":"bg-slate-100 text-slate-700 hover:bg-slate-200"}`}><Eye size={12}/> View</button>
              {d.status !== "offline" && (
                d.status !== "suspended"
                  ? <button onClick={() => setConfirmAction({id:d.id,name:d.name,action:"suspend"})} className="flex-1 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors flex items-center justify-center gap-1"><Ban size={12}/> Suspend</button>
                  : <button onClick={() => setConfirmAction({id:d.id,name:d.name,action:"reinstate"})} className="flex-1 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors flex items-center justify-center gap-1"><CheckCircle size={12}/> Reinstate</button>
              )}
            </div>
          </div>
        ))}
      </div>
      {viewDriver && <ViewModal dark={dark} title={viewDriver.name} onClose={() => setViewDriver(null)} rows={[["ID",viewDriver.id],["Wallet",viewDriver.wallet],["Deliveries",viewDriver.deliveries],["Rating",viewDriver.rating+"/5.0"],["Earnings",viewDriver.earnings],["Status",viewDriver.status]]}/>}
      {confirmAction && <ConfirmModal dark={dark} title={confirmAction.action==="suspend"?"Suspend Driver":"Reinstate Driver"} msg={`Are you sure you want to ${confirmAction.action} ${confirmAction.name}?`} confirmLabel={confirmAction.action==="suspend"?"Suspend":"Reinstate"} confirmColor={confirmAction.action==="suspend"?"bg-red-600 hover:bg-red-700 text-white rounded-xl":"bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"} onConfirm={()=>toggleSuspend(confirmAction.id)} onCancel={()=>setConfirmAction(null)}/>}
    </div>
  );
};

// ─── ESCROW PAGE ──────────────────────────────────────────────────────────────
const EscrowPage = ({ dark, showToast }) => {
  const [escrow, setEscrow] = useState(INIT_ESCROW);
  const [confirm, setConfirm] = useState(null);
  const c = dark ? "text-slate-200" : "text-slate-900";
  const cs = dark ? "text-slate-400" : "text-slate-500";
  const card = dark ? "dm-card border" : "bg-white border border-slate-100 shadow-sm";

  const release = (orderId) => {
    setEscrow(list => list.map(e => e.orderId === orderId ? {...e, escrowStatus:"released", releaseStatus:"completed"} : e));
    setConfirm(null);
    showToast(`Escrow released for ${orderId}`, "success");
  };

  return (
    <div className="page-fade space-y-5">
      <Banner title="Escrow / Payments" sub="Real-time escrow state tracking" img="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1400&h=300&fit=crop" accent="linear-gradient(90deg,rgba(9,14,33,.92),rgba(245,158,11,.5))"/>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[{l:"Total Held",v:"$14,280",I:Lock,bg:"bg-amber-500"},{l:"Released Today",v:"$6,420",I:CheckCircle,bg:"bg-emerald-600"},{l:"In Dispute",v:"$1,830",I:AlertTriangle,bg:"bg-red-500"},{l:"Refunded",v:"$940",I:ArrowDownRight,bg:"bg-violet-600"}].map((s,i)=>(
          <div key={i} className={`ch ${card} rounded-2xl p-5`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.bg} mb-3 shadow-sm`}><s.I size={16} className="text-white"/></div>
            <p className={`syne text-xl font-bold ${c}`}>{s.v}</p><p className={`text-xs mt-0.5 ${cs}`}>{s.l}</p>
          </div>
        ))}
      </div>
      <div className={`${card} rounded-2xl overflow-x-auto`}>
        <table className="w-full">
          <TH dark={dark} cols={["Order ID","Escrow Amount","Wallet Address","Escrow Status","Release Status","Action"]}/>
          <tbody className="divide-y" style={{borderColor:dark?"#1e293b":"#f8fafc"}}>
            {escrow.map((e,i) => (
              <tr key={i} className={`transition-colors ${dark?"dm-row":"hover:bg-slate-50/70"}`}>
                <td className="px-4 py-3.5 text-xs font-mono font-bold text-indigo-500">{e.orderId}</td>
                <td className={`px-4 py-3.5 text-sm font-bold ${c}`}>{e.amount}</td>
                <td className={`px-4 py-3.5 text-xs font-mono ${cs}`}>{e.wallet}</td>
                <td className="px-4 py-3.5"><SB status={e.escrowStatus}/></td>
                <td className="px-4 py-3.5"><SB status={e.releaseStatus}/></td>
                <td className="px-4 py-3.5">
                  {(e.escrowStatus === "held" || e.escrowStatus === "locked") && (
                    <button onClick={() => setConfirm(e.orderId)} className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors">Release</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {confirm && <ConfirmModal dark={dark} title="Release Escrow" msg={`Release escrow funds for ${confirm}? This will mark the payment as completed.`} confirmLabel="Release Funds" confirmColor="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl" onConfirm={() => release(confirm)} onCancel={() => setConfirm(null)}/>}
    </div>
  );
};

// ─── TRANSACTIONS PAGE ────────────────────────────────────────────────────────
const TransactionsPage = ({ dark, showToast }) => {
  const [txs, setTxs] = useState(INIT_TXS);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(null);
  const c = dark ? "text-slate-200" : "text-slate-900";
  const cs = dark ? "text-slate-400" : "text-slate-500";
  const card = dark ? "dm-card border" : "bg-white border border-slate-100 shadow-sm";

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => { setRefreshing(false); showToast("Transactions refreshed", "success"); }, 1000);
  };
  const copyTx = (txId) => {
    setCopied(txId);
    setTimeout(() => setCopied(null), 2000);
    showToast("Transaction ID copied", "info");
  };

  return (
    <div className="page-fade space-y-5">
      <div className="flex items-center justify-between">
        <div><h2 className={`syne text-xl font-extrabold ${c}`}>Transactions</h2><p className={`text-sm mt-0.5 ${cs}`}>On-chain blockchain transactions</p></div>
        <button onClick={refresh} className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-sm font-bold transition-colors ${dark?"border-slate-700 text-slate-300 hover:bg-slate-800":"border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
          <RefreshCw size={13} className={refreshing ? "animate-spin" : ""}/> {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>
      <div className={`${card} rounded-2xl overflow-x-auto`}>
        <table className="w-full">
          <TH dark={dark} cols={["Transaction ID","Order ID","Amount","Wallet","Status","Timestamp","Copy"]}/>
          <tbody className="divide-y" style={{borderColor:dark?"#1e293b":"#f8fafc"}}>
            {txs.map((t,i) => (
              <tr key={i} className={`transition-colors ${dark?"dm-row":"hover:bg-slate-50/70"}`}>
                <td className={`px-4 py-3.5 text-xs font-mono ${cs}`}>{t.txId}</td>
                <td className="px-4 py-3.5 text-xs font-mono font-bold text-indigo-500">{t.orderId}</td>
                <td className={`px-4 py-3.5 text-sm font-bold ${c}`}>{t.amount}</td>
                <td className={`px-4 py-3.5 text-xs font-mono ${cs}`}>{t.wallet}</td>
                <td className="px-4 py-3.5"><SB status={t.status}/></td>
                <td className={`px-4 py-3.5 text-xs ${cs}`}>{t.time}</td>
                <td className="px-4 py-3.5">
                  <button onClick={() => copyTx(t.txId)} className={`p-1.5 rounded-lg transition-colors ${dark?"hover:bg-slate-700":"hover:bg-slate-100"}`}>
                    {copied === t.txId ? <CheckCheck size={13} className="text-emerald-500"/> : <Copy size={13} className={cs}/>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── DISPUTES PAGE ────────────────────────────────────────────────────────────
const DisputesPage = ({ dark, showToast }) => {
  const [disputes, setDisputes] = useState(INIT_DISPUTES);
  const [sel, setSel] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const c = dark ? "text-slate-200" : "text-slate-900";
  const cs = dark ? "text-slate-400" : "text-slate-500";
  const card = dark ? "dm-card border" : "bg-white border border-slate-100 shadow-sm";

  const resolve = (id, action) => {
    setDisputes(list => list.map(d => d.id === id ? { ...d, status: "resolved" } : d));
    setSel(prev => prev?.id === id ? { ...prev, status: "resolved" } : prev);
    setConfirm(null);
    showToast(action === "release" ? "Payment released to driver" : "Refund issued to customer", "success");
  };

  return (
    <div className="page-fade space-y-5">
      <Banner title="Disputes" sub={`${disputes.filter(d=>d.status!=="resolved").length} open disputes`} img="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1400&h=300&fit=crop" accent="linear-gradient(90deg,rgba(9,14,33,.92),rgba(239,68,68,.5))"/>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="space-y-3">
          {disputes.map((d,i) => (
            <div key={i} onClick={() => setSel(d)} className={`ch ${card} rounded-2xl p-5 cursor-pointer transition-all ${sel?.id===d.id?"ring-2 ring-indigo-400":"hover:shadow-md"}`}>
              <div className="flex items-start justify-between mb-3">
                <div><span className="text-xs font-mono font-bold text-indigo-500">{d.id}</span><span className="mx-2 opacity-30">·</span><span className={`text-xs font-mono ${cs}`}>{d.orderId}</span></div>
                <SB status={d.status}/>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className={`flex items-center gap-2 ${c}`}><Users size={12} className={cs}/>{d.customer}</div>
                <div className={`flex items-center gap-2 ${c}`}><Truck size={12} className={cs}/>{d.driver}</div>
              </div>
              <div className={`flex items-center justify-between mt-3 pt-3 border-t ${dark?"border-slate-700":"border-slate-100"}`}>
                <span className={`syne text-xl font-bold ${c}`}>{d.amount}</span>
                <span className={`text-xs ${cs}`}>{d.opened}</span>
              </div>
            </div>
          ))}
        </div>
        {sel ? (
          <div className={`${card} rounded-2xl p-6 space-y-5`}>
            <div className="flex items-center justify-between">
              <h3 className={`syne font-bold ${c}`}>Resolution — {sel.id}</h3>
              <button onClick={() => setSel(null)} className={`p-1.5 rounded-xl transition-colors ${dark?"hover:bg-slate-700":"hover:bg-slate-100"}`}><X size={14}/></button>
            </div>
            <div className="space-y-3">
              <div className={`rounded-2xl p-4 border ${dark?"bg-blue-900/20 border-blue-800":"bg-blue-50 border-blue-100"}`}>
                <p className="text-xs font-bold text-blue-500 uppercase tracking-wide mb-2 flex items-center gap-1.5"><Users size={11}/> Customer — {sel.customer}</p>
                <p className={`text-sm leading-relaxed ${dark?"text-slate-300":"text-slate-700"}`}>{sel.customerClaim}</p>
              </div>
              <div className={`rounded-2xl p-4 border ${dark?"bg-slate-800 border-slate-700":"bg-slate-50 border-slate-200"}`}>
                <p className={`text-xs font-bold uppercase tracking-wide mb-2 flex items-center gap-1.5 ${dark?"text-slate-400":"text-slate-600"}`}><Truck size={11}/> Driver — {sel.driver}</p>
                <p className={`text-sm leading-relaxed ${dark?"text-slate-300":"text-slate-700"}`}>{sel.driverClaim}</p>
              </div>
            </div>
            <div className={`pt-3 border-t ${dark?"border-slate-700":"border-slate-100"}`}>
              <p className={`text-xs font-bold uppercase tracking-wide mb-3 ${cs}`}>Admin Decision</p>
              {sel.status === "resolved" ? (
                <div className={`py-4 rounded-2xl text-center text-sm font-bold ${dark?"bg-slate-800 text-slate-400":"bg-slate-100 text-slate-500"}`}>✓ This dispute has been resolved</div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setConfirm({id:sel.id,action:"release"})} className="py-3.5 rounded-2xl text-white text-sm font-bold flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5" style={{background:"linear-gradient(135deg,#059669,#10b981)",boxShadow:"0 4px 12px rgba(16,185,129,.3)"}}><CheckCircle size={14}/> Release</button>
                    <button onClick={() => setConfirm({id:sel.id,action:"refund"})} className="py-3.5 rounded-2xl text-white text-sm font-bold flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5" style={{background:"linear-gradient(135deg,#dc2626,#ef4444)",boxShadow:"0 4px 12px rgba(239,68,68,.3)"}}><ArrowDownRight size={14}/> Refund</button>
                  </div>
                  <button onClick={() => { setDisputes(list => list.map(d => d.id===sel.id?{...d,status:"under_review"}:d)); setSel(prev=>prev?.id===sel.id?{...prev,status:"under_review"}:prev); showToast("Dispute escalated for review","warn"); }}
                    className={`w-full mt-3 py-2.5 rounded-2xl border text-sm font-bold transition-colors ${dark?"border-slate-600 text-slate-400 hover:bg-slate-800":"border-slate-200 text-slate-600 hover:bg-slate-50"}`}>Escalate for Review</button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className={`${card} rounded-2xl p-16 flex flex-col items-center justify-center text-center`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${dark?"bg-slate-800":"bg-slate-100"}`}><AlertTriangle size={22} className={cs}/></div>
            <p className={`text-sm font-bold ${c}`}>Select a dispute to review</p>
            <p className={`text-xs mt-1 ${cs}`}>Click any card on the left</p>
          </div>
        )}
      </div>
      {confirm && <ConfirmModal dark={dark} title={confirm.action==="release"?"Release Payment":"Issue Refund"} msg={confirm.action==="release"?"Release escrow funds to the driver? This decision is final.":"Issue a full refund to the customer? This decision is final."} confirmLabel={confirm.action==="release"?"Release to Driver":"Refund Customer"} confirmColor={confirm.action==="release"?"bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl":"bg-red-600 hover:bg-red-700 text-white rounded-xl"} onConfirm={()=>resolve(confirm.id,confirm.action)} onCancel={()=>setConfirm(null)}/>}
    </div>
  );
};

// ─── ANALYTICS PAGE ───────────────────────────────────────────────────────────
const AnalyticsPage = ({ dark }) => {
  const c = dark ? "text-slate-200" : "text-slate-900";
  const cs = dark ? "text-slate-400" : "text-slate-500";
  const card = dark ? "dm-card border" : "bg-white border border-slate-100 shadow-sm";
  const grid = dark ? "#1e293b" : "#f1f5f9";
  const tick = dark ? "#64748b" : "#94a3b8";
  const tt = { borderRadius:10, border:`1px solid ${dark?"#334155":"#e2e8f0"}`, fontSize:12, background:dark?"#1e293b":"#fff", color:dark?"#f1f5f9":"#0f172a" };
  return (
    <div className="page-fade space-y-6">
      <Banner title="Analytics" sub="Platform performance insights" img="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&h=300&fit=crop" accent="linear-gradient(90deg,rgba(9,14,33,.92),rgba(99,102,241,.5))"/>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[
          {t:"Weekly Order Volume",s:"7-day comparison",h:200,ch:<BarChart data={ordersData}><CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false}/><XAxis dataKey="day" tick={{fontSize:11,fill:tick}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:11,fill:tick}} axisLine={false} tickLine={false}/><Tooltip contentStyle={tt}/><Bar dataKey="orders" fill="#6366f1" radius={[5,5,0,0]} name="Orders"/></BarChart>},
          {t:"Revenue Trend",s:"Daily revenue ($)",h:200,ch:<AreaChart data={ordersData}><defs><linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={.15}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke={grid}/><XAxis dataKey="day" tick={{fontSize:11,fill:tick}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:11,fill:tick}} axisLine={false} tickLine={false}/><Tooltip contentStyle={tt}/><Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fill="url(#rg)" name="Revenue ($)"/></AreaChart>},
          {t:"Driver Activity",s:"Active drivers over 6 months",h:200,ch:<LineChart data={successRateData}><CartesianGrid strokeDasharray="3 3" stroke={grid}/><XAxis dataKey="month" tick={{fontSize:11,fill:tick}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:11,fill:tick}} axisLine={false} tickLine={false}/><Tooltip contentStyle={tt}/><Line type="monotone" dataKey="drivers" stroke="#6366f1" strokeWidth={2.5} dot={{r:4,fill:"#6366f1",strokeWidth:0}} name="Drivers"/></LineChart>},
          {t:"Success Rate",s:"Monthly delivery success %",h:200,ch:<LineChart data={successRateData}><CartesianGrid strokeDasharray="3 3" stroke={grid}/><XAxis dataKey="month" tick={{fontSize:11,fill:tick}} axisLine={false} tickLine={false}/><YAxis domain={[90,100]} tick={{fontSize:11,fill:tick}} axisLine={false} tickLine={false}/><Tooltip contentStyle={tt}/><Line type="monotone" dataKey="rate" stroke="#f59e0b" strokeWidth={2.5} dot={{r:4,fill:"#f59e0b",strokeWidth:0}} name="Success %"/></LineChart>},
        ].map((ch,i)=>(
          <div key={i} className={`${card} rounded-2xl p-6`}>
            <p className={`text-sm font-bold mb-1 ${c}`}>{ch.t}</p><p className={`text-xs mb-4 ${cs}`}>{ch.s}</p>
            <ResponsiveContainer width="100%" height={ch.h}>{ch.ch}</ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── NOTIFICATIONS PAGE ───────────────────────────────────────────────────────
const NotificationsPage = ({ dark, showToast }) => {
  const [notifs, setNotifs] = useState(INIT_NOTIFS);
  const c = dark ? "text-slate-200" : "text-slate-900";
  const cs = dark ? "text-slate-400" : "text-slate-500";
  const card = dark ? "dm-card border" : "bg-white border border-slate-100 shadow-sm";
  const tI = { dispute:AlertTriangle, payment:Wallet, driver:Truck, system:Zap };
  const tC = { dispute:"text-red-500 bg-red-50 border-red-100", payment:"text-amber-500 bg-amber-50 border-amber-100", driver:"text-blue-500 bg-blue-50 border-blue-100", system:"text-violet-500 bg-violet-50 border-violet-100" };
  const tCDark = { dispute:"text-red-400 bg-red-900/20 border-red-800", payment:"text-amber-400 bg-amber-900/20 border-amber-800", driver:"text-blue-400 bg-blue-900/20 border-blue-800", system:"text-violet-400 bg-violet-900/20 border-violet-800" };
  const unread = notifs.filter(n => !n.read).length;

  const markAllRead = () => { setNotifs(list => list.map(n => ({...n, read: true}))); showToast("All notifications marked as read", "success"); };
  const markRead = (id) => setNotifs(list => list.map(n => n.id === id ? {...n, read: true} : n));
  const deleteNotif = (id) => { setNotifs(list => list.filter(n => n.id !== id)); showToast("Notification dismissed", "info"); };

  return (
    <div className="page-fade space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`syne text-xl font-extrabold ${c}`}>Notifications</h2>
          <p className={`text-sm mt-0.5 ${cs}`}>{unread} unread · {notifs.length} total</p>
        </div>
        {unread > 0 && <button onClick={markAllRead} className="text-xs text-indigo-500 font-bold hover:text-indigo-400 transition-colors px-3 py-1.5 rounded-xl border border-indigo-200 hover:bg-indigo-50">Mark all read</button>}
      </div>
      <div className="space-y-2.5">
        {notifs.length === 0 && <div className={`${card} rounded-2xl p-12 text-center`}><p className={`text-sm font-bold ${c}`}>No notifications</p><p className={`text-xs mt-1 ${cs}`}>You're all caught up!</p></div>}
        {notifs.map(n => {
          const Icon = tI[n.type] || Bell;
          return (
            <div key={n.id} className={`${card} rounded-2xl px-5 py-4 flex items-start gap-4 transition-all group ${!n.read?(dark?"ring-1 ring-indigo-700":"ring-1 ring-indigo-200 bg-indigo-50/20"):""}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${dark?tCDark[n.type]:tC[n.type]}`}><Icon size={15}/></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-bold ${!n.read?c:cs}`}>{n.title}</p>
                  <span className={`text-xs shrink-0 ${cs}`}>{n.time}</span>
                </div>
                <p className={`text-sm mt-0.5 ${cs}`}>{n.desc}</p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                {!n.read && <button onClick={() => markRead(n.id)} className={`p-1.5 rounded-lg transition-colors ${dark?"hover:bg-slate-700":"hover:bg-slate-100"}`} title="Mark read"><CheckCheck size={13} className="text-emerald-500"/></button>}
                <button onClick={() => deleteNotif(n.id)} className={`p-1.5 rounded-lg transition-colors ${dark?"hover:bg-slate-700":"hover:bg-slate-100"}`} title="Dismiss"><Trash2 size={13} className="text-red-400"/></button>
              </div>
              {!n.read && <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0 mt-1.5"/>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── SETTINGS PAGE ────────────────────────────────────────────────────────────
const SettingsPage = ({ dark, showToast, toggleDark }) => {
  const [settings, setSettings] = useState({ platformName:"SwiftEscrow", email:"admin@swiftescrow.io", timezone:"Africa/Lagos (WAT)", escrowFee:"2.8", commission:"5.0", disputeFee:"2.50", escalationHrs:"48", emailAlerts:true, smsAlerts:false });
  const [saved, setSaved] = useState(false);
  const [pwModal, setPwModal] = useState(false);
  const [pw, setPw] = useState({cur:"",nw:"",cnf:""});

  const c = dark ? "text-slate-200" : "text-slate-900";
  const cs = dark ? "text-slate-400" : "text-slate-500";
  const card = dark ? "dm-card border" : "bg-white border border-slate-100 shadow-sm";
  const inp = `text-sm rounded-xl px-3 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all border ${dark?"dm-input border-slate-600":"border-slate-200 bg-white text-slate-700"}`;

  const save = () => { setSaved(true); setTimeout(()=>setSaved(false),2000); showToast("Settings saved successfully","success"); };

  const changePw = () => {
    if (!pw.cur||!pw.nw||!pw.cnf) { showToast("Please fill all fields","error"); return; }
    if (pw.nw !== pw.cnf) { showToast("Passwords do not match","error"); return; }
    if (pw.nw.length < 6) { showToast("Password too short (min 6 chars)","error"); return; }
    setPwModal(false); setPw({cur:"",nw:"",cnf:""}); showToast("Password changed successfully","success");
  };

  return (
    <div className="page-fade space-y-6">
      <div><h2 className={`syne text-xl font-extrabold ${c}`}>Settings</h2><p className={`text-sm mt-0.5 ${cs}`}>Platform configuration and preferences</p></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Platform */}
          <div className={`${card} rounded-2xl p-6`}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100"><Globe size={15} className="text-indigo-600"/></div>
              <h3 className={`text-sm font-bold ${c}`}>Platform Settings</h3>
            </div>
            <div className="space-y-4">
              {[["Platform Name","platformName","text"],["Support Email","email","email"],["Timezone","timezone","text"]].map(([l,k,t])=>(
                <div key={k} className="flex items-center justify-between">
                  <label className={`text-sm font-medium ${c}`}>{l}</label>
                  <input type={t} value={settings[k]} onChange={e=>setSettings(s=>({...s,[k]:e.target.value}))} className={inp}/>
                </div>
              ))}
            </div>
          </div>
          {/* Fees */}
          <div className={`${card} rounded-2xl p-6`}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100"><DollarSign size={15} className="text-amber-600"/></div>
              <h3 className={`text-sm font-bold ${c}`}>Fee Configuration</h3>
            </div>
            <div className="space-y-4">
              {[["Escrow Fee (%)","escrowFee"],["Platform Commission (%)","commission"],["Dispute Fee ($)","disputeFee"]].map(([l,k])=>(
                <div key={k} className="flex items-center justify-between">
                  <label className={`text-sm font-medium ${c}`}>{l}</label>
                  <input type="number" value={settings[k]} onChange={e=>setSettings(s=>({...s,[k]:e.target.value}))} className={inp} step="0.1" min="0"/>
                </div>
              ))}
            </div>
          </div>
          {/* Notifications */}
          <div className={`${card} rounded-2xl p-6`}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center border border-violet-100"><Bell size={15} className="text-violet-600"/></div>
              <h3 className={`text-sm font-bold ${c}`}>Notification Preferences</h3>
            </div>
            <div className="space-y-4">
              {[["Email Alerts","emailAlerts"],["SMS Alerts","smsAlerts"]].map(([l,k])=>(
                <div key={k} className="flex items-center justify-between">
                  <label className={`text-sm font-medium ${c}`}>{l}</label>
                  <button onClick={()=>setSettings(s=>({...s,[k]:!s[k]}))} className={`w-12 h-6 rounded-full transition-colors relative ${settings[k]?"bg-indigo-600":"bg-slate-300"}`}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings[k]?"translate-x-6":"translate-x-0.5"}`}/>
                  </button>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <label className={`text-sm font-medium ${c}`}>Auto-escalation (hrs)</label>
                <input type="number" value={settings.escalationHrs} onChange={e=>setSettings(s=>({...s,escalationHrs:e.target.value}))} className={inp} min="1"/>
              </div>
            </div>
          </div>
          {/* Appearance */}
          <div className={`${card} rounded-2xl p-6`}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200">{dark?<Moon size={15} className="text-slate-600"/>:<Sun size={15} className="text-slate-600"/>}</div>
              <h3 className={`text-sm font-bold ${c}`}>Appearance</h3>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${c}`}>Dark Mode</p>
                <p className={`text-xs mt-0.5 ${cs}`}>Toggle between light and dark interface</p>
              </div>
              <button onClick={toggleDark} className={`w-12 h-6 rounded-full transition-colors relative ${dark?"bg-indigo-600":"bg-slate-300"}`}>
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${dark?"translate-x-6":"translate-x-0.5"}`}/>
              </button>
            </div>
          </div>

          <button onClick={save} className="px-6 py-3 text-white text-sm font-bold rounded-2xl bp flex items-center gap-2">
            {saved ? <><CheckCheck size={14}/> Saved!</> : <><Save size={14}/> Save Changes</>}
          </button>
        </div>

        <div className="space-y-4">
          {/* Profile */}
          <div className={`${card} rounded-2xl p-6`}>
            <h3 className={`text-sm font-bold mb-5 ${c}`}>Admin Profile</h3>
            <div className="flex flex-col items-center text-center mb-5">
              <div className="relative mb-3">
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&crop=face" alt="" className="w-16 h-16 rounded-2xl object-cover shadow-md border-2" style={{borderColor:dark?"#334155":"#e2e8f0"}}/>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white"/>
              </div>
              <p className={`font-bold ${c}`}>Admin</p>
              <p className={`text-xs mt-0.5 ${cs}`}>admin@swiftescrow.io</p>
            </div>
            <button onClick={()=>setPwModal(true)} className={`w-full py-2.5 text-xs font-bold rounded-xl transition-colors ${dark?"bg-slate-700 text-slate-300 hover:bg-slate-600":"bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>Change Password</button>
          </div>
          {/* Security */}
          <div className={`${card} rounded-2xl p-6`}>
            <h3 className={`text-sm font-bold mb-4 ${c}`}>Security Status</h3>
            <div className="space-y-3">
              {[["Two-Factor Auth","Enabled",true],["API Access","Active",true],["Audit Log","Enabled",true]].map(([l,v,ok],i)=>(
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className={cs}>{l}</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${ok?"bg-emerald-50 text-emerald-700":"bg-red-50 text-red-600"}`}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Password modal */}
      {pwModal && (
        <div className="modal-bg" onClick={()=>setPwModal(false)}>
          <div className={`modal ${dark?"dark":""}`} onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className={`syne text-lg font-bold ${dark?"text-white":"text-slate-900"}`}>Change Password</h3>
              <button onClick={()=>setPwModal(false)} className={`p-1.5 rounded-xl ${dark?"hover:bg-slate-700":"hover:bg-slate-100"}`}><X size={15}/></button>
            </div>
            {[["Current Password","cur"],["New Password","nw"],["Confirm New Password","cnf"]].map(([l,k])=>(
              <div key={k} className="mb-4">
                <label className={`block text-xs font-bold mb-1.5 uppercase tracking-wide ${dark?"text-slate-400":"text-slate-500"}`}>{l}</label>
                <input type="password" value={pw[k]} onChange={e=>setPw(p=>({...p,[k]:e.target.value}))} className={`w-full px-4 py-3 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all ${dark?"bg-slate-900 border-slate-600 text-slate-200":"bg-white border-slate-200 text-slate-800"}`} placeholder="••••••••"/>
              </div>
            ))}
            <div className="flex gap-3 mt-5">
              <button onClick={()=>setPwModal(false)} className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-colors ${dark?"border-slate-600 text-slate-300 hover:bg-slate-700":"border-slate-200 text-slate-600 hover:bg-slate-50"}`}>Cancel</button>
              <button onClick={changePw} className="flex-1 py-2.5 rounded-xl text-white text-sm font-bold bp">Update Password</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const navItems = [
  {id:"dashboard",label:"Dashboard",icon:LayoutDashboard},
  {id:"orders",label:"Orders",icon:Package},
  {id:"customers",label:"Customers",icon:Users},
  {id:"drivers",label:"Drivers",icon:Truck},
  {id:"escrow",label:"Escrow / Payments",icon:Shield},
  {id:"transactions",label:"Transactions",icon:ArrowLeftRight},
  {id:"disputes",label:"Disputes",icon:AlertTriangle,badge:2},
  {id:"analytics",label:"Analytics",icon:BarChart2},
  {id:"notifications",label:"Notifications",icon:Bell,badge:2},
  {id:"settings",label:"Settings",icon:Settings},
];

const Sidebar = ({ active, nav, collapsed, toggle, logout, dark, toggleDark }) => (
  <aside className={`fixed left-0 top-0 h-full flex flex-col z-50 transition-all duration-300 ${collapsed?"w-16":"w-60"}`}
    style={{ background:"linear-gradient(180deg,#080e22 0%,#0f172a 50%,#1a1040 100%)", borderRight:"1px solid rgba(255,255,255,.06)" }}>
    <div className="flex items-center gap-3 px-4 h-16 border-b shrink-0" style={{borderColor:"rgba(255,255,255,.06)"}}>
      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)"}}><Shield size={16} className="text-white"/></div>
      {!collapsed && <span className="syne font-bold text-white text-sm tracking-tight">SwiftEscrow</span>}
    </div>
    <nav className="flex-1 overflow-y-auto py-4 px-2">
      {navItems.map(item => (
        <button key={item.id} onClick={() => nav(item.id)} title={collapsed ? item.label : undefined}
          className={`sl w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 relative text-slate-500 text-xs font-semibold ${active===item.id?"on":""}`}>
          {active===item.id && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-400 rounded-r-full"/>}
          <item.icon size={17} className="shrink-0"/>
          {!collapsed && <span>{item.label}</span>}
          {item.badge && !collapsed && <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">{item.badge}</span>}
          {item.badge && collapsed && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"/>}
        </button>
      ))}
    </nav>
    <div className="px-2 pb-4 pt-2 border-t space-y-0.5" style={{borderColor:"rgba(255,255,255,.06)"}}>
      <button onClick={toggleDark} className="sl w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 text-xs font-semibold" title={collapsed?(dark?"Light Mode":"Dark Mode"):undefined}>
        {dark ? <Sun size={17}/> : <Moon size={17}/>}
        {!collapsed && <span>{dark?"Light Mode":"Dark Mode"}</span>}
      </button>
      <button onClick={toggle} className="sl w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 text-xs font-semibold">
        <Menu size={17}/>{!collapsed && "Collapse"}
      </button>
      <button onClick={logout} className="sl w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold" style={{color:"#f87171"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(239,68,68,.1)"} onMouseLeave={e=>e.currentTarget.style.background=""}>
        <LogOut size={17}/>{!collapsed && "Sign out"}
      </button>
    </div>
  </aside>
);

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [auth, setAuth] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [key, setKey] = useState(0);
  const [dark, setDark] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, type = "info") => {
    setToast({ msg, type, id: Date.now() });
    setTimeout(() => setToast(null), 3200);
  }, []);

  const navigate = useCallback((p) => { setPage(p); setKey(k => k + 1); }, []);
  const toggleDark = useCallback(() => setDark(d => !d), []);

  const pageProps = { dark, showToast, navigate };

  const pageMap = {
    dashboard:    <DashboardPage    {...pageProps}/>,
    orders:       <OrdersPage       {...pageProps}/>,
    customers:    <CustomersPage    {...pageProps}/>,
    drivers:      <DriversPage      {...pageProps}/>,
    escrow:       <EscrowPage       {...pageProps}/>,
    transactions: <TransactionsPage {...pageProps}/>,
    disputes:     <DisputesPage     {...pageProps}/>,
    analytics:    <AnalyticsPage    {...pageProps}/>,
    notifications:<NotificationsPage {...pageProps}/>,
    settings:     <SettingsPage     {...pageProps} toggleDark={toggleDark}/>,
  };

  const bgMain = dark ? "#0f172a" : "#f1f5f9";
  const headerBg = dark ? "rgba(15,23,42,.88)" : "rgba(248,250,252,.88)";
  const headerBorder = dark ? "#1e293b" : "rgba(226,232,240,.8)";
  const searchBg = dark ? "#1e293b" : "#f1f5f9";
  const searchText = dark ? "#e2e8f0" : "#374151";
  const c = dark ? "text-slate-200" : "text-slate-900";
  const cs = dark ? "text-slate-400" : "text-slate-500";

  if (!auth) return <><GlobalStyles/><LoginPage onLogin={setAuth}/></>;

  return (
    <div style={{ minHeight: "100vh", background: bgMain }}>
      <GlobalStyles/>
      <Sidebar active={page} nav={navigate} collapsed={collapsed} toggle={() => setCollapsed(c => !c)} logout={() => setAuth(null)} dark={dark} toggleDark={toggleDark}/>

      <div className="transition-all duration-300" style={{ marginLeft: collapsed ? 64 : 240 }}>
        {/* Header */}
        <header className="h-16 flex items-center px-6 gap-4 sticky top-0 z-40" style={{ background:headerBg, backdropFilter:"blur(16px)", borderBottom:`1px solid ${headerBorder}`, boxShadow:"0 1px 16px rgba(0,0,0,.05)" }}>
          <div className="flex-1 max-w-md relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
            <input value={search} onChange={e => setSearch(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && search.trim()) { const found = navItems.find(n => n.label.toLowerCase().includes(search.toLowerCase())); if (found) { navigate(found.id); setSearch(""); showToast(`Navigated to ${found.label}`, "info"); } else showToast("No matching page found","warn"); }}}
              placeholder="Search pages, orders, customers…"
              style={{ background:searchBg, color:searchText }}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all border border-transparent focus:border-indigo-400"/>
          </div>
          <div className="ml-auto flex items-center gap-2.5">
            {/* Dark mode toggle in header */}
            <button onClick={toggleDark} className={`p-2.5 rounded-xl transition-colors ${dark?"hover:bg-slate-700":"hover:bg-slate-100"}`} title={dark?"Switch to Light":"Switch to Dark"}>
              {dark ? <Sun size={17} className="text-amber-400"/> : <Moon size={17} className="text-slate-500"/>}
            </button>
            <button onClick={() => { navigate("orders"); showToast("Opened Orders — Quick Action","info"); }} className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-bold bp"><Zap size={12}/> Quick Action</button>
            <button onClick={() => navigate("notifications")} className={`relative p-2.5 rounded-xl transition-colors ${dark?"hover:bg-slate-700":"hover:bg-slate-100"}`}>
              <Bell size={17} className={dark?"text-slate-300":"text-slate-600"}/>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2" style={{borderColor:dark?"#0f172a":"#f8fafc"}}/>
            </button>
            <div className={`flex items-center gap-2.5 pl-2.5 border-l cursor-pointer ${dark?"border-slate-700":"border-slate-200"}`} onClick={() => navigate("settings")}>
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=40&h=40&fit=crop&crop=face" alt="" className="w-8 h-8 rounded-xl object-cover shadow-sm"/>
              <div className="hidden md:block">
                <p className={`text-xs font-bold leading-tight ${c}`}>Admin</p>
                <p className={`text-[10px] ${cs}`}>{auth.email}</p>
              </div>
              <ChevronDown size={12} className={`hidden md:block ${cs}`}/>
            </div>
          </div>
        </header>

        <main className="p-6 lg:p-8" style={{ minHeight: "calc(100vh - 64px)" }}>
          <div key={key} className="max-w-7xl mx-auto">{pageMap[page]}</div>
        </main>
      </div>

      {toast && <Toast key={toast.id} msg={toast.msg} type={toast.type} onClose={() => setToast(null)}/>}
    </div>
  );
}
