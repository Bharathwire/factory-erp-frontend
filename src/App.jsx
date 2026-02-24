import React, { useEffect, useState } from "react";
import { 
  LayoutDashboard, ClipboardList, Users, Trash2, Search, Filter, 
  Download, Plus, Package, X, Loader2, Database, MessageSquare, LogOut, Lock, ShieldCheck, UserPlus
} from "lucide-react";

const API_URL = "http://localhost:10000";
const MANAGER_PHONE = "918825737191";

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("factory_user")));
  const [view, setView] = useState("dashboard");
  const [orders, setOrders] = useState([]);
  const [stock, setStock] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isInitialized, setIsInitialized] = useState(true);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");

  const fetchData = async () => {
    try {
      const [ordRes, stkRes] = await Promise.all([
        fetch(`${API_URL}/orders`), fetch(`${API_URL}/stock`)
      ]);
      setOrders(await ordRes.json());
      setStock(await stkRes.json());
      if (user?.role === "Admin") {
        const usrRes = await fetch(`${API_URL}/users`);
        setAllUsers(await usrRes.json());
      }
    } catch (err) { console.error(err); }
  };

  const checkSetup = async () => {
    const res = await fetch(`${API_URL}/setup-check`);
    const data = await res.json();
    setIsInitialized(data.initialized);
  };

  useEffect(() => { 
    checkSetup();
    if (user) fetchData(); 
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });
    if (res.ok) {
      const userData = await res.json();
      setUser(userData);
      localStorage.setItem("factory_user", JSON.stringify(userData));
    } else {
      setLoginError("Invalid Login Details");
    }
  };

  const handleSetupAdmin = async () => {
    const confirm = window.confirm("Create default Admin account?");
    if (confirm) {
      await fetch(`${API_URL}/users/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "Admin", password: "Bharathwire@2026", role: "Admin" }),
      });
      alert("Admin Created! You can now login with Admin / Bharathwire@2026");
      checkSetup();
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const data = {
      username: e.target.username.value,
      password: e.target.password.value,
      role: e.target.role.value
    };
    await fetch(`${API_URL}/users/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    fetchData();
    e.target.reset();
  };

  if (!user) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-900 px-4">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black italic">BHARATH WIRE</h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">ERP Security Portal</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input className="w-full border p-4 rounded-2xl outline-none" placeholder="Username" onChange={e => setLoginData({...loginData, username: e.target.value})} />
            <input className="w-full border p-4 rounded-2xl outline-none" type="password" placeholder="Password" onChange={e => setLoginData({...loginData, password: e.target.value})} />
            {loginError && <p className="text-red-500 text-xs text-center font-bold">{loginError}</p>}
            <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg">Sign In</button>
          </form>
          
          {!isInitialized && (
            <button onClick={handleSetupAdmin} className="w-full mt-6 border-2 border-dashed border-blue-200 text-blue-600 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition">
              <UserPlus size={18}/> First Time Setup: Create Admin
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col">
        <h1 className="font-black text-xl mb-10 text-center">BHARATH WIRE</h1>
        <nav className="space-y-2 flex-1">
          <SidebarBtn active={view === 'dashboard'} label="Dashboard" icon={<LayoutDashboard size={18}/>} onClick={() => setView('dashboard')} />
          <SidebarBtn active={view === 'orders'} label="Production" icon={<ClipboardList size={18}/>} onClick={() => setView('orders')} />
          <SidebarBtn active={view === 'stock'} label="Inventory" icon={<Database size={18}/>} onClick={() => setView('stock')} />
          {user.role === "Admin" && (
            <SidebarBtn active={view === 'users'} label="Manage Access" icon={<ShieldCheck size={18}/>} onClick={() => setView('users')} />
          )}
        </nav>
        <button onClick={() => { localStorage.removeItem("factory_user"); setUser(null); }} className="flex items-center gap-3 p-4 text-red-400 font-bold hover:bg-white/5 rounded-xl"><LogOut size={18}/> Logout</button>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-black capitalize">{view}</h2>
          <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition">+ New Order</button>
        </header>

        {view === "users" && user.role === "Admin" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in duration-300">
            <div className="bg-white p-8 rounded-[2rem] border shadow-sm">
              <h3 className="font-bold mb-6">Staff Control Panel</h3>
              <form onSubmit={handleUpdateUser} className="space-y-4">
                <input name="username" className="w-full border p-3 rounded-xl" placeholder="Staff Name / Username" required />
                <input name="password" title="password" className="w-full border p-3 rounded-xl" placeholder="Staff Password" required />
                <select name="role" className="w-full border p-3 rounded-xl font-bold">
                  <option value="Local">Local User (Limited Access)</option>
                  <option value="Admin">Admin (Full Access)</option>
                </select>
                <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold shadow-lg">Authorize Staff Access</button>
              </form>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border shadow-sm overflow-hidden">
              <h3 className="font-bold mb-6">Active Staff Members</h3>
              <div className="space-y-3">
                {allUsers.map((u, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div><p className="font-black text-slate-700">{u.username}</p><p className="text-[10px] text-blue-500 font-bold uppercase">{u.role}</p></div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black ${u.role === 'Admin' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>ACTIVE</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === "dashboard" && (
           <div className="grid grid-cols-3 gap-6">
              <StatCard label="Total Revenue" value={user.role === "Admin" ? `₹${orders.reduce((s,o)=>s+Number(o.amount),0).toLocaleString()}` : "ADMIN ONLY"} />
              <StatCard label="Inventory Items" value={stock.length} />
              <StatCard label="Live Orders" value={orders.filter(o=>o.status!=="Completed").length} />
           </div>
        )}
        
        {view === "orders" && (
           <div className="bg-white rounded-[2rem] border overflow-hidden shadow-sm">
             <OrderTable orders={orders} role={user.role} onUpdate={(id, s) => fetch(`${API_URL}/orders/${id}`, {method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status:s})}).then(fetchData)} />
           </div>
        )}
        
        {view === "stock" && (
           <div className="grid grid-cols-3 gap-6">
             {stock.map(s => (
               <div key={s._id} className="bg-white p-8 rounded-[2rem] border shadow-sm hover:border-blue-500 transition">
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">{s.itemName}</p>
                  <h4 className="text-3xl font-black">{s.quantity} <span className="text-sm font-medium">{s.unit}</span></h4>
               </div>
             ))}
           </div>
        )}
      </main>

      {/* MODAL FOR ORDERS */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white p-10 rounded-[2.5rem] w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-black mb-6">Register New Order</h3>
            <form onSubmit={async (e) => {
               e.preventDefault();
               const res = await fetch(`${API_URL}/orders`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(formData)});
               const saved = await res.json();
               setShowModal(false); fetchData();
               const msg = `New Order:\nCustomer: ${saved.customerName}\nProduct: ${saved.productType}\nAmt: ₹${saved.amount}`;
               window.open(`https://wa.me/${MANAGER_PHONE}?text=${encodeURIComponent(msg)}`);
            }} className="space-y-4">
              <input className="w-full border p-4 rounded-2xl outline-none focus:ring-2 ring-blue-500" placeholder="Customer Name" onChange={e => setFormData({...formData, customerName: e.target.value})} required />
              <input className="w-full border p-4 rounded-2xl outline-none focus:ring-2 ring-blue-500" placeholder="Product Type" onChange={e => setFormData({...formData, productType: e.target.value})} required />
              <input className="w-full border p-4 rounded-2xl outline-none focus:ring-2 ring-blue-500" type="number" placeholder="Amount (₹)" onChange={e => setFormData({...formData, amount: e.target.value})} required />
              <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg">Save & Notify Manager</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const SidebarBtn = ({ active, label, icon, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
    {icon} <span className="font-bold text-xs uppercase tracking-widest">{label}</span>
  </button>
);

const StatCard = ({ label, value }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm">
    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
    <p className="text-3xl font-black italic">{value}</p>
  </div>
);

const OrderTable = ({ orders, onUpdate }) => (
  <table className="w-full text-left">
    <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b">
      <tr><th className="p-6">Client Name</th><th className="p-6">Product</th><th className="p-6 text-right">Value</th><th className="p-6">Workflow Status</th></tr>
    </thead>
    <tbody className="divide-y divide-slate-100">
      {orders.map(o => (
        <tr key={o._id} className="hover:bg-slate-50 transition">
          <td className="p-6 font-bold text-slate-800">{o.customerName}</td>
          <td className="p-6 text-sm font-medium text-slate-600">{o.productType}</td>
          <td className="p-6 text-right font-black italic">₹{Number(o.amount).toLocaleString()}</td>
          <td className="p-6">
            <select value={o.status} onChange={e => onUpdate(o._id, e.target.value)} className="p-1 text-[10px] font-black uppercase border-2 rounded-lg bg-white">
              <option value="Pending">Pending</option>
              <option value="In Progress">Production</option>
              <option value="Completed">Completed</option>
            </select>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default App;