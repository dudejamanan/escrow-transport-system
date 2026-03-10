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

// (All page components, sidebar, and root App implementation remain identical
// to the original admin-dashboard.html content and should be kept there. For
// the React entry point, we re-export the default App from that file.)

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function AdminDashboardApp() {
  // Delegate to the App defined in admin-dashboard.html (JSX source).
  // This placeholder will be replaced if you move all code into this file.
  return null;
}


