import { useState, useEffect } from "react";
import {
  Zap, Users, Briefcase, Star, Bell, MapPin, Phone,
  ChevronRight, Check, ArrowLeft, Home, FileText,
  Settings, TrendingUp, AlertCircle, CheckCircle,
  MessageCircle, LogOut, BarChart2, Wrench, Wallet,
  Award, Building, Activity, Wifi, Shield, Navigation
} from "lucide-react";

/* ═══════════════════════════════════════
   THEME
═══════════════════════════════════════ */
const C = {
  p:"#FF4500", p2:"#FF8C00",
  grad:"linear-gradient(135deg,#FF4500 0%,#FF8C00 100%)",
  bg:"#0B0B16", card:"#13132A", card2:"#1A1A35",
  border:"#25253F", text:"#EEEEF8", muted:"#6A6A9A",
  success:"#00E676", warn:"#FFD600", danger:"#FF3D00", info:"#2979FF",
  font:"'Rajdhani','Segoe UI',sans-serif",
  fontB:"'Nunito','Segoe UI',sans-serif",
};

/* ═══════════════════════════════════════
   DATA
═══════════════════════════════════════ */
const WORKERS=[
  {id:"w1",name:"Rajan Verma",  phone:"9876543210",skill:"Electrical", rating:4.8,distance:1.2,online:true, jobs:145},
  {id:"w2",name:"Suresh Kumar", phone:"9765432109",skill:"AC & Fridge",rating:4.6,distance:2.4,online:true, jobs:98 },
  {id:"w3",name:"Mohit Singh",  phone:"9654321098",skill:"Industrial", rating:4.9,distance:3.8,online:false,jobs:210},
  {id:"w4",name:"Deepak Sharma",phone:"9543210987",skill:"Electrical", rating:4.7,distance:0.9,online:true, jobs:67 },
];
const INIT_JOBS=[
  {id:"J001",customer:"Amit Gupta",  phone:"9812345678",address:"Sector 15, Noida",    problem:"Fan Repair",       type:"residential",status:"Working",     worker:"Rajan Verma",  workerId:"w1",emergency:false,amount:350, notes:"Ceiling fan not working"  },
  {id:"J002",customer:"Priya Sharma",phone:"9923456789",address:"MG Road, Gurgaon",    problem:"AC Gas Filling",   type:"residential",status:"Assigned",    worker:"Suresh Kumar", workerId:"w2",emergency:true, amount:2050,notes:"AC not cooling at all"    },
  {id:"J003",customer:"Tech Corp Ltd",phone:"9834567890",address:"Industrial Area Ph-2",problem:"Motor Repair",    type:"industrial", status:"Completed",   worker:"Mohit Singh",  workerId:"w3",emergency:false,amount:5000,notes:"Production motor bearing"  },
  {id:"J004",customer:"Sunita Devi", phone:"9745678901",address:"Rajouri Garden, Delhi",problem:"MCB Replacement", type:"residential",status:"New",         worker:null,           workerId:null,emergency:false,amount:0,   notes:"Main MCB keeps tripping"  },
  {id:"J005",customer:"Metro Mall",  phone:"9656789012",address:"CP, New Delhi",         problem:"Full Wiring Check",type:"commercial",status:"Estimate Sent",worker:"Deepak Sharma",workerId:"w4",emergency:false,amount:8500,notes:"Annual maintenance round" },
];
const PRICE_LIST={
  residential:[
    {item:"Switch/Socket Fitting",unit:"unit",price:50}, {item:"Fan Fitting",unit:"unit",price:150},
    {item:"Exhaust Fan Fitting",unit:"unit",price:250},  {item:"Light Fitting",unit:"unit",price:100},
    {item:"MCB Replacement",unit:"unit",price:300},       {item:"Cable Laying",unit:"foot",price:10},
    {item:"Geyser Installation",unit:"unit",price:600},   {item:"Inverter Setup",unit:"unit",price:1500},
    {item:"Doorbell Installation",unit:"unit",price:150},
  ],
  ac:[
    {item:"AC Gas Filling (1.5T)",unit:"unit",price:2050},{item:"AC Installation Split",unit:"unit",price:1500},
    {item:"AC Wet Service",unit:"unit",price:500},        {item:"AC Leak Testing",unit:"unit",price:500},
    {item:"Fridge Gas Refill",unit:"unit",price:1500},    {item:"Relay/Capacitor",unit:"unit",price:400},
    {item:"Compressor Repair",unit:"unit",price:2500},
  ],
  industrial:[
    {item:"Bearing Replacement",unit:"unit",price:1000},{item:"Pump Repair",unit:"unit",price:2500},
    {item:"Gearbox Repair",unit:"unit",price:5000},     {item:"Machine Alignment",unit:"unit",price:4500},
    {item:"Oil Seal Change",unit:"unit",price:800},     {item:"Arc Welding",unit:"unit",price:2000},
    {item:"Argon/SS Welding",unit:"unit",price:1200},
  ],
};
const TRAVEL_R={residential:10,commercial:15,industrial:20};
const VISIT_C= {residential:100,commercial:200,industrial:500};
const SVC_R=   {residential:0.08,commercial:0.10,industrial:0.12};
const S_STEPS= ["Assigned","On The Way","Reached","Inspection Done","Estimate Sent","Approved","Working","Completed"];

/* helpers */
const sColor=s=>({New:C.info,Assigned:"#AA44FF","On The Way":C.warn,Reached:"#FF9800","Inspection Done":"#FF9800","Estimate Sent":"#FF7043",Approved:"#26C6DA",Working:C.p,Completed:C.success}[s]||C.muted);
const tColor=t=>({residential:C.info,commercial:C.warn,industrial:"#FF4081"}[t]||C.muted);

/* ═══════════════════════════════════════
   SHARED COMPONENTS
═══════════════════════════════════════ */
function Btn({label,onClick,v="primary",Icon,size="md",disabled=false,style={}}){
  const sz={sm:{p:"7px 13px",fs:12,r:9},md:{p:"11px 20px",fs:14,r:13},lg:{p:"14px 22px",fs:15,r:14}}[size];
  const vs={
    primary:{background:C.grad,color:"#fff",boxShadow:"0 4px 18px rgba(255,69,0,0.35)",border:"none"},
    secondary:{background:C.card2,color:C.text,border:`1px solid ${C.border}`},
    ghost:{background:"transparent",color:C.p,border:`1px solid ${C.p}`},
    success:{background:"linear-gradient(135deg,#00C853,#00E676)",color:"#fff",border:"none",boxShadow:"0 4px 14px rgba(0,200,83,0.3)"},
    danger:{background:"linear-gradient(135deg,#FF3D00,#FF6D00)",color:"#fff",border:"none"},
  }[v]||{background:C.grad,color:"#fff",border:"none"};
  return(
    <button onClick={disabled?undefined:onClick} disabled={disabled}
      style={{padding:sz.p,fontSize:sz.fs,borderRadius:sz.r,cursor:disabled?"not-allowed":"pointer",
        fontFamily:C.font,fontWeight:700,letterSpacing:"0.3px",display:"flex",alignItems:"center",
        justifyContent:"center",gap:6,opacity:disabled?0.45:1,transition:"all 0.15s",...vs,...style}}>
      {Icon&&<Icon size={sz.fs+2}/>}{label}
    </button>
  );
}

function Badge({label,color}){
  return <span style={{background:`${color}22`,color,border:`1px solid ${color}44`,borderRadius:8,
    padding:"3px 9px",fontSize:11,fontWeight:700,fontFamily:C.font,whiteSpace:"nowrap"}}>{label}</span>;
}

function Card({children,style={},onClick}){
  return <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,padding:16,...style}} onClick={onClick}>{children}</div>;
}

function StatCard({label,value,Icon,color,sub}){
  return(
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"14px 14px",flex:1,minWidth:0}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
        <div style={{background:`${color}18`,borderRadius:10,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Icon size={18} color={color}/>
        </div>
        {sub&&<span style={{fontSize:11,color:C.success,fontWeight:700}}>{sub}</span>}
      </div>
      <div style={{fontSize:26,fontWeight:700,color:C.text,fontFamily:C.font,lineHeight:1.1}}>{value}</div>
      <div style={{fontSize:12,color:C.muted,marginTop:4}}>{label}</div>
    </div>
  );
}

function TopBar({title,subtitle,onBack,rightEl}){
  return(
    <div style={{background:C.bg,paddingTop:50,paddingBottom:13,paddingLeft:18,paddingRight:18,borderBottom:`1px solid ${C.border}`,flexShrink:0}}>
      <div style={{display:"flex",alignItems:"center",gap:11}}>
        {onBack&&(
          <button onClick={onBack} style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:12,width:38,height:38,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>
            <ArrowLeft size={17} color={C.text}/>
          </button>
        )}
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:18,fontWeight:700,color:C.text,fontFamily:C.font}}>{title}</div>
          {subtitle&&<div style={{fontSize:12,color:C.muted,marginTop:1}}>{subtitle}</div>}
        </div>
        {rightEl}
      </div>
    </div>
  );
}

function BottomNav({tab,setTab,role}){
  const tabs=role==="admin"
    ?[{id:"home",Icon:Home,label:"Home"},{id:"jobs",Icon:Briefcase,label:"Jobs"},{id:"workers",Icon:Users,label:"Workers"},{id:"reports",Icon:BarChart2,label:"Reports"}]
    :[{id:"home",Icon:Home,label:"Home"},{id:"jobs",Icon:Briefcase,label:"My Jobs"},{id:"earnings",Icon:Wallet,label:"Earnings"},{id:"profile",Icon:Award,label:"Profile"}];
  return(
    <div style={{background:C.card,borderTop:`1px solid ${C.border}`,display:"flex",paddingBottom:16,paddingTop:10,flexShrink:0}}>
      {tabs.map(t=>(
        <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,paddingTop:2}}>
          <t.Icon size={21} color={tab===t.id?C.p:C.muted}/>
          <span style={{fontSize:10,fontWeight:tab===t.id?700:500,color:tab===t.id?C.p:C.muted,fontFamily:C.font}}>{t.label}</span>
          {tab===t.id&&<div style={{width:16,height:3,background:C.p,borderRadius:2}}/>}
        </button>
      ))}
    </div>
  );
}

function JobCard({job,onPress}){
  return(
    <Card style={{marginBottom:10,cursor:"pointer"}} onClick={onPress}>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:10}}>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:15,fontWeight:700,color:C.text,fontFamily:C.font}}>{job.customer}</div>
          <div style={{fontSize:12,color:C.muted,display:"flex",alignItems:"center",gap:4,marginTop:3}}>
            <MapPin size={11} color={C.muted}/> {job.address}
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5,marginLeft:8,flexShrink:0}}>
          {job.emergency&&<Badge label="⚡ URGENT" color={C.danger}/>}
          <Badge label={job.status} color={sColor(job.status)}/>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          <Badge label={job.problem} color={C.p}/>
          <Badge label={job.type} color={tColor(job.type)}/>
        </div>
        {job.amount>0&&<div style={{fontSize:16,fontWeight:700,color:C.p,fontFamily:C.font}}>₹{job.amount.toLocaleString()}</div>}
      </div>
      {job.worker&&(
        <div style={{marginTop:10,paddingTop:10,borderTop:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:7}}>
          <Wrench size={12} color={C.muted}/>
          <span style={{fontSize:12,color:C.muted}}>Assigned: <span style={{color:C.text,fontWeight:600}}>{job.worker}</span></span>
        </div>
      )}
    </Card>
  );
}

/* ═══════════════════════════════════════
   SPLASH
═══════════════════════════════════════ */
function Splash(){
  const[prog,setProg]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setProg(p=>Math.min(p+3,100)),80);return()=>clearInterval(t);},[]);
  return(
    <div style={{height:"100%",background:`radial-gradient(circle at 50% 38%,rgba(255,69,0,0.2) 0%,${C.bg} 65%)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
      {[300,220,140].map((s,i)=>(
        <div key={i} style={{position:"absolute",top:`${-10-i*8}%`,right:`${-15-i*5}%`,width:s,height:s,border:`1px solid rgba(255,69,0,${0.06+i*0.03})`,borderRadius:"50%",pointerEvents:"none"}}/>
      ))}
      <div style={{position:"absolute",bottom:"-15%",left:"-8%",width:280,height:280,border:"1px solid rgba(255,140,0,0.06)",borderRadius:"50%"}}/>
      <div style={{width:112,height:112,background:C.grad,borderRadius:30,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 20px 60px rgba(255,69,0,0.55),0 0 0 12px rgba(255,69,0,0.08)",marginBottom:26}}>
        <span style={{fontSize:44,fontWeight:700,color:"#fff",fontFamily:C.font,lineHeight:1}}>PR</span>
      </div>
      <div style={{fontSize:30,fontWeight:700,color:C.text,fontFamily:C.font,letterSpacing:"3px",marginBottom:6}}>PR PARTNER</div>
      <div style={{fontSize:12,color:C.muted,letterSpacing:"3px",textTransform:"uppercase",marginBottom:64}}>Field Service Manager</div>
      <div style={{width:180,height:3,background:C.border,borderRadius:3,overflow:"hidden"}}>
        <div style={{width:`${prog}%`,height:"100%",background:C.grad,borderRadius:3,transition:"width 0.08s"}}/>
      </div>
      <div style={{fontSize:11,color:C.muted,marginTop:10}}>{prog<100?"Loading…":"Ready"}</div>
    </div>
  );
}

/* ═══════════════════════════════════════
   LOGIN
═══════════════════════════════════════ */
function Login({go,setRole}){
  const[roleChoice,setRoleChoice]=useState(null);
  const[step,setStep]=useState(1);
  const[phone,setPhone]=useState("");
  const[pass,setPass]=useState("");
  return(
    <div style={{height:"100%",display:"flex",flexDirection:"column",overflowY:"auto"}}>
      <div style={{background:C.grad,padding:"58px 26px 34px",position:"relative",overflow:"hidden",flexShrink:0}}>
        {[{s:180,op:0.08,top:"-45px",right:"-45px"},{s:110,op:0.05,bottom:"-24px",left:"-16px"}].map((d,i)=>(
          <div key={i} style={{position:"absolute",width:d.s,height:d.s,background:`rgba(255,255,255,${d.op})`,borderRadius:"50%",...(d.top?{top:d.top}:{}),right:d.right,bottom:d.bottom,left:d.left}}/>
        ))}
        <div style={{width:50,height:50,background:"rgba(255,255,255,0.2)",borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14}}>
          <span style={{fontSize:20,fontWeight:800,color:"#fff",fontFamily:C.font}}>PR</span>
        </div>
        <div style={{fontSize:25,fontWeight:700,color:"#fff",fontFamily:C.font}}>Welcome Back!</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.75)",marginTop:3}}>PR Partner — Field Service Management</div>
      </div>
      <div style={{flex:1,padding:"22px 18px 30px",overflowY:"auto"}}>
        {step===1&&<>
          <div style={{fontSize:12,color:C.muted,fontWeight:700,marginBottom:16,fontFamily:C.font,letterSpacing:"0.8px"}}>SELECT YOUR ROLE</div>
          {[{r:"admin",Icon:Shield,t:"Admin",s:"Manage jobs, workers & reports"},{r:"worker",Icon:Wrench,t:"Worker / Technician",s:"Accept jobs & manage work"}].map(({r,Icon,t,s})=>(
            <div key={r} onClick={()=>setRoleChoice(r)} style={{background:roleChoice===r?"rgba(255,69,0,0.1)":C.card,border:`1.5px solid ${roleChoice===r?C.p:C.border}`,borderRadius:18,padding:"15px 17px",marginBottom:13,cursor:"pointer",display:"flex",alignItems:"center",gap:13,transition:"all 0.2s"}}>
              <div style={{width:50,height:50,background:roleChoice===r?C.grad:C.card2,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <Icon size={24} color={roleChoice===r?"#fff":C.muted}/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:16,fontWeight:700,color:C.text,fontFamily:C.font}}>{t}</div>
                <div style={{fontSize:12,color:C.muted,marginTop:2}}>{s}</div>
              </div>
              {roleChoice===r&&<Check size={18} color={C.p}/>}
            </div>
          ))}
          <Btn label="Continue →" onClick={()=>roleChoice&&setStep(2)} style={{width:"100%"}} size="lg" disabled={!roleChoice}/>
        </>}
        {step===2&&<>
          <button onClick={()=>setStep(1)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:6,marginBottom:18,color:C.muted,padding:0}}>
            <ArrowLeft size={14} color={C.muted}/><span style={{fontSize:13,fontFamily:C.fontB}}>Back to role select</span>
          </button>
          <div style={{fontSize:22,fontWeight:700,color:C.text,fontFamily:C.font,marginBottom:4}}>{roleChoice==="admin"?"Admin":"Worker"} Login</div>
          <div style={{fontSize:13,color:C.muted,marginBottom:24}}>Enter any credentials to continue (demo)</div>
          {[{l:"Mobile Number",T:"tel",v:phone,s:setPhone,Icon:Phone},{l:"Password",T:"password",v:pass,s:setPass,Icon:Settings}].map(({l,T,v,s,Icon})=>(
            <div key={l} style={{marginBottom:13}}>
              <div style={{fontSize:12,color:C.muted,fontWeight:600,marginBottom:5}}>{l}</div>
              <div style={{background:C.card,border:`1.5px solid ${v?C.p:C.border}`,borderRadius:13,display:"flex",alignItems:"center",padding:"11px 14px",gap:10,transition:"border-color 0.2s"}}>
                <Icon size={16} color={C.muted}/>
                <input value={v} onChange={e=>s(e.target.value)} placeholder={l} type={T} style={{background:"none",border:"none",outline:"none",color:C.text,fontSize:14,flex:1,fontFamily:C.fontB}}/>
              </div>
            </div>
          ))}
          <Btn label={`Login as ${roleChoice==="admin"?"Admin":"Worker"}`} onClick={()=>{setRole(roleChoice);go(roleChoice==="admin"?"admin-home":"worker-home");}} style={{width:"100%",marginTop:10}} size="lg" disabled={!phone||!pass}/>
          <div style={{textAlign:"center",marginTop:14,fontSize:12,color:C.muted}}>Demo mode — any credentials work</div>
        </>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   ADMIN APP
═══════════════════════════════════════ */
function AdminApp({jobs,setJobs,go,setSelJob,tab,setTab}){
  const stats={
    newJobs:jobs.filter(j=>j.status==="New").length,
    active:jobs.filter(j=>!["New","Completed"].includes(j.status)).length,
    done:jobs.filter(j=>j.status==="Completed").length,
    online:WORKERS.filter(w=>w.online).length,
  };

  function HomeTab(){
    return(
      <div style={{flex:1,overflowY:"auto",padding:"14px 14px 100px"}}>
        <div style={{background:C.grad,borderRadius:20,padding:"18px 20px",marginBottom:16,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",right:-20,top:-20,width:100,height:100,background:"rgba(255,255,255,0.08)",borderRadius:"50%"}}/>
          <div style={{fontSize:20,fontWeight:700,color:"#fff",fontFamily:C.font}}>Good Morning! 👋</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.75)",marginTop:3}}>{stats.newJobs} new request{stats.newJobs!==1?"s":""} pending today</div>
          <Btn label="+ New Job" onClick={()=>go("admin-create")} style={{marginTop:12,background:"rgba(255,255,255,0.2)",color:"#fff",border:"1px solid rgba(255,255,255,0.3)"}} size="sm"/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:18}}>
          <StatCard label="New Requests"   value={stats.newJobs}       Icon={Bell}        color={C.info}    sub="+2"/>
          <StatCard label="Active Jobs"    value={stats.active}         Icon={Activity}    color={C.p}/>
          <StatCard label="Completed"      value={stats.done}           Icon={CheckCircle} color={C.success} sub="this week"/>
          <StatCard label="Online Workers" value={`${stats.online}/4`}  Icon={Users}       color={C.warn}/>
        </div>
        <div style={{fontSize:16,fontWeight:700,color:C.text,fontFamily:C.font,marginBottom:10}}>Recent Jobs</div>
        {jobs.slice(0,3).map(j=><JobCard key={j.id} job={j} onPress={()=>{setSelJob(j);go("job-detail");}}/>)}
        <Btn label="View All Jobs →" v="secondary" onClick={()=>setTab("jobs")} style={{width:"100%",marginTop:6}}/>
      </div>
    );
  }

  function JobsTab(){
    return(
      <div style={{flex:1,overflowY:"auto",padding:"14px 14px 100px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{fontSize:17,fontWeight:700,color:C.text,fontFamily:C.font}}>All Jobs ({jobs.length})</div>
          <Btn label="+ New" onClick={()=>go("admin-create")} size="sm"/>
        </div>
        {jobs.map(j=><JobCard key={j.id} job={j} onPress={()=>{setSelJob(j);go("job-detail");}}/>)}
      </div>
    );
  }

  function WorkersTab(){
    return(
      <div style={{flex:1,overflowY:"auto",padding:"14px 14px 100px"}}>
        <div style={{fontSize:17,fontWeight:700,color:C.text,fontFamily:C.font,marginBottom:14}}>Workers ({WORKERS.length})</div>
        {WORKERS.map(w=>(
          <Card key={w.id} style={{marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:13}}>
              <div style={{width:48,height:48,background:w.online?C.grad:C.card2,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <Wrench size={22} color={w.online?"#fff":C.muted}/>
              </div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:15,fontWeight:700,color:C.text,fontFamily:C.font}}>{w.name}</span>
                  <div style={{width:7,height:7,borderRadius:"50%",background:w.online?C.success:C.muted}}/>
                </div>
                <div style={{fontSize:12,color:C.muted}}>{w.skill} · ⭐{w.rating} · {w.jobs} jobs</div>
                <div style={{fontSize:11,color:C.muted,marginTop:2}}>{w.phone} · {w.distance}km away</div>
              </div>
              <Badge label={w.online?"Online":"Offline"} color={w.online?C.success:C.muted}/>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  function ReportsTab(){
    const rev=jobs.filter(j=>j.status==="Completed").reduce((s,j)=>s+j.amount,0);
    const comm=Math.round(rev*0.09);
    return(
      <div style={{flex:1,overflowY:"auto",padding:"14px 14px 100px"}}>
        <div style={{background:C.grad,borderRadius:20,padding:20,textAlign:"center",marginBottom:16}}>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.75)",letterSpacing:"1px"}}>TOTAL REVENUE</div>
          <div style={{fontSize:40,fontWeight:700,color:"#fff",fontFamily:C.font}}>₹{rev.toLocaleString()}</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.7)"}}>Platform Commission: ₹{comm.toLocaleString()}</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
          <StatCard label="Total Jobs"  value={jobs.length}                                  Icon={Briefcase}  color={C.p}/>
          <StatCard label="Completed"   value={jobs.filter(j=>j.status==="Completed").length} Icon={CheckCircle}color={C.success}/>
          <StatCard label="Workers"     value={WORKERS.length}                                Icon={Users}      color={C.info}/>
          <StatCard label="Commission"  value={`₹${comm}`}                                   Icon={TrendingUp} color={C.warn}/>
        </div>
        <div style={{fontSize:15,fontWeight:700,color:C.text,fontFamily:C.font,marginBottom:10}}>Completed Jobs</div>
        {jobs.filter(j=>j.status==="Completed").map(j=>(
          <Card key={j.id} style={{marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:C.text,fontFamily:C.font}}>{j.customer}</div>
                <div style={{fontSize:12,color:C.muted}}>{j.problem} · {j.worker}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:18,fontWeight:700,color:C.success,fontFamily:C.font}}>₹{j.amount.toLocaleString()}</div>
                <div style={{fontSize:11,color:C.muted}}>Comm: ₹{Math.round(j.amount*0.09)}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return(
    <div style={{height:"100%",display:"flex",flexDirection:"column"}}>
      <div style={{background:C.bg,paddingTop:50,paddingBottom:13,paddingLeft:18,paddingRight:18,borderBottom:`1px solid ${C.border}`,flexShrink:0}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:22,fontWeight:700,color:C.text,fontFamily:C.font}}>PR Partner</div>
            <div style={{fontSize:12,color:C.p}}>Admin Panel</div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,width:38,height:38,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",cursor:"pointer"}}>
              <Bell size={17} color={C.text}/>
              {stats.newJobs>0&&<div style={{position:"absolute",top:7,right:7,width:7,height:7,background:C.danger,borderRadius:"50%"}}/>}
            </div>
            <div style={{background:C.grad,borderRadius:12,width:38,height:38,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontSize:14,fontWeight:700,color:"#fff",fontFamily:C.font}}>A</span>
            </div>
          </div>
        </div>
      </div>
      {tab==="home"&&<HomeTab/>}
      {tab==="jobs"&&<JobsTab/>}
      {tab==="workers"&&<WorkersTab/>}
      {tab==="reports"&&<ReportsTab/>}
      <BottomNav tab={tab} setTab={setTab} role="admin"/>
    </div>
  );
}

/* ═══════════════════════════════════════
   CREATE JOB
═══════════════════════════════════════ */
function CreateJob({go,jobs,setJobs}){
  const[f,setF]=useState({name:"",phone:"",addr:"",problem:"Fan Repair",type:"residential",emergency:false,notes:""});
  const[step,setStep]=useState(1);
  const[selW,setSelW]=useState(null);
  const problems=["Fan Repair","Switch Fitting","MCB Replacement","AC Gas Filling","AC Installation","Refrigerator Repair","Full Wiring","Geyser Fitting","Motor Repair","Arc Welding","Other"];

  return(
    <div style={{height:"100%",display:"flex",flexDirection:"column"}}>
      <TopBar title="New Job" subtitle={`Step ${step} of 2`} onBack={()=>go("admin-home")}/>
      <div style={{flex:1,overflowY:"auto",padding:"16px 16px 30px"}}>
        {step===1&&<>
          <div style={{fontSize:12,color:C.muted,fontWeight:700,marginBottom:14,fontFamily:C.font,letterSpacing:"0.8px"}}>CUSTOMER DETAILS</div>
          {[{l:"Customer Name",k:"name",T:"text",p:"Full name"},{l:"Phone Number",k:"phone",T:"tel",p:"Mobile number"},{l:"Address",k:"addr",T:"text",p:"Full address"},{l:"Notes",k:"notes",T:"text",p:"Problem description"}].map(({l,k,T,p})=>(
            <div key={k} style={{marginBottom:12}}>
              <div style={{fontSize:12,color:C.muted,fontWeight:600,marginBottom:5}}>{l}</div>
              <div style={{background:C.card,border:`1.5px solid ${f[k]?C.p:C.border}`,borderRadius:13,display:"flex",alignItems:"center",padding:"11px 14px",transition:"border-color 0.2s"}}>
                <input value={f[k]} onChange={e=>setF({...f,[k]:e.target.value})} placeholder={p} type={T} style={{background:"none",border:"none",outline:"none",color:C.text,fontSize:14,width:"100%",fontFamily:C.fontB}}/>
              </div>
            </div>
          ))}
          <div style={{marginBottom:14}}>
            <div style={{fontSize:12,color:C.muted,fontWeight:600,marginBottom:8}}>Service Type</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
              {problems.map(p=>(
                <button key={p} onClick={()=>setF({...f,problem:p})} style={{background:f.problem===p?C.grad:C.card,border:`1px solid ${f.problem===p?"transparent":C.border}`,color:f.problem===p?"#fff":C.muted,borderRadius:9,padding:"6px 12px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:C.font}}>{p}</button>
              ))}
            </div>
          </div>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:12,color:C.muted,fontWeight:600,marginBottom:7}}>Category</div>
            <div style={{display:"flex",gap:8}}>
              {["residential","commercial","industrial"].map(t=>(
                <button key={t} onClick={()=>setF({...f,type:t})} style={{flex:1,background:f.type===t?`${tColor(t)}18`:C.card,border:`1.5px solid ${f.type===t?tColor(t):C.border}`,color:f.type===t?tColor(t):C.muted,borderRadius:12,padding:"9px 0",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:C.font,textTransform:"capitalize"}}>{t}</button>
              ))}
            </div>
          </div>
          <div onClick={()=>setF({...f,emergency:!f.emergency})} style={{background:C.card,border:`1.5px solid ${f.emergency?C.danger:C.border}`,borderRadius:14,padding:"13px 15px",display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:22,cursor:"pointer"}}>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <Zap size={17} color={f.emergency?C.danger:C.muted}/>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:f.emergency?C.danger:C.text,fontFamily:C.font}}>Emergency Job</div>
                <div style={{fontSize:11,color:C.muted}}>Priority alert to all nearby workers</div>
              </div>
            </div>
            <div style={{width:44,height:24,background:f.emergency?C.danger:C.card2,borderRadius:12,border:`2px solid ${f.emergency?C.danger:C.border}`,position:"relative",transition:"all 0.2s"}}>
              <div style={{position:"absolute",top:2,left:f.emergency?20:2,width:16,height:16,background:"#fff",borderRadius:"50%",transition:"left 0.2s",boxShadow:"0 2px 6px rgba(0,0,0,0.3)"}}/>
            </div>
          </div>
          <Btn label="Next: Assign Worker →" onClick={()=>setStep(2)} style={{width:"100%"}} size="lg" disabled={!f.name||!f.phone||!f.addr}/>
        </>}
        {step===2&&<>
          <div style={{background:"rgba(255,69,0,0.08)",border:"1px solid rgba(255,69,0,0.2)",borderRadius:14,padding:"12px 14px",marginBottom:16}}>
            <div style={{fontSize:13,fontWeight:700,color:C.text,fontFamily:C.font}}>Job: {f.problem}</div>
            <div style={{fontSize:12,color:C.muted,marginTop:3}}>{f.name} · {f.addr}</div>
            {f.emergency&&<div style={{marginTop:6}}><Badge label="⚡ EMERGENCY" color={C.danger}/></div>}
          </div>
          <div style={{fontSize:14,fontWeight:600,color:C.text,marginBottom:12}}>Available Workers ({WORKERS.filter(w=>w.online).length} online)</div>
          {WORKERS.filter(w=>w.online).map(w=>(
            <div key={w.id} onClick={()=>setSelW(selW?.id===w.id?null:w)} style={{background:selW?.id===w.id?"rgba(255,69,0,0.1)":C.card,border:`1.5px solid ${selW?.id===w.id?C.p:C.border}`,borderRadius:16,padding:"13px 15px",marginBottom:10,cursor:"pointer",display:"flex",alignItems:"center",gap:12,transition:"all 0.2s"}}>
              <div style={{width:46,height:46,background:selW?.id===w.id?C.grad:C.card2,borderRadius:13,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <Wrench size={20} color={selW?.id===w.id?"#fff":C.muted}/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:15,fontWeight:700,color:C.text,fontFamily:C.font}}>{w.name}</div>
                <div style={{fontSize:12,color:C.muted}}>{w.skill} · ⭐{w.rating}</div>
                <div style={{fontSize:11,color:C.success,marginTop:2}}>📍 {w.distance}km away</div>
              </div>
              {selW?.id===w.id&&<Check size={20} color={C.p}/>}
            </div>
          ))}
          <div style={{display:"flex",gap:8,marginTop:8}}>
            <Btn label="← Back" v="secondary" onClick={()=>setStep(1)} style={{flex:1}}/>
            <Btn label={selW?"Assign & Create":"Create (Unassigned)"} onClick={()=>{
              const nj={id:"J"+String(jobs.length+100).padStart(3,"0"),customer:f.name,phone:f.phone,address:f.addr,problem:f.problem,type:f.type,status:selW?"Assigned":"New",worker:selW?.name||null,workerId:selW?.id||null,emergency:f.emergency,amount:0,notes:f.notes};
              setJobs([nj,...jobs]);go("admin-home");
            }} style={{flex:2}}/>
          </div>
        </>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   JOB DETAIL
═══════════════════════════════════════ */
function JobDetail({go,job,jobs,setJobs}){
  if(!job) return null;
  const cur=jobs.find(j=>j.id===job.id)||job;
  const idx=S_STEPS.indexOf(cur.status);
  const advance=()=>{const ni=Math.min(idx+1,S_STEPS.length-1);if(ni!==idx)setJobs(jobs.map(j=>j.id===cur.id?{...j,status:S_STEPS[ni]}:j));};
  return(
    <div style={{height:"100%",display:"flex",flexDirection:"column"}}>
      <TopBar title={`Job ${cur.id}`} subtitle={cur.customer} onBack={()=>go("admin-home")} rightEl={<Badge label={cur.status} color={sColor(cur.status)}/>}/>
      <div style={{flex:1,overflowY:"auto",padding:"14px 14px 30px"}}>
        <Card style={{marginBottom:14}}>
          <div style={{fontSize:14,fontWeight:700,color:C.text,fontFamily:C.font,marginBottom:12}}>Progress Timeline</div>
          {S_STEPS.map((s,i)=>{
            const done=i<=idx,active=i===idx;
            return(
              <div key={s} style={{display:"flex",alignItems:"flex-start",gap:10}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                  <div style={{width:22,height:22,borderRadius:"50%",background:done?(active?C.p:C.success):C.card2,border:`2px solid ${done?(active?C.p:C.success):C.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {done&&!active&&<Check size={10} color="#fff"/>}
                    {active&&<div style={{width:8,height:8,borderRadius:"50%",background:"#fff"}}/>}
                  </div>
                  {i<S_STEPS.length-1&&<div style={{width:2,height:24,background:i<idx?C.success:C.border,marginTop:1}}/>}
                </div>
                <div style={{paddingBottom:12,paddingTop:1}}>
                  <div style={{fontSize:13,fontWeight:active?700:400,color:done?C.text:C.muted}}>{s}</div>
                  {active&&<div style={{fontSize:10,color:C.p}}>● current</div>}
                </div>
              </div>
            );
          })}
        </Card>
        <Card style={{marginBottom:12}}>
          <div style={{fontSize:13,fontWeight:700,color:C.text,fontFamily:C.font,marginBottom:10}}>Customer Info</div>
          {[{Icon:Users,v:cur.customer},{Icon:Phone,v:cur.phone},{Icon:MapPin,v:cur.address},{Icon:Wrench,v:cur.problem},{Icon:FileText,v:cur.notes}].map(({Icon,v},i)=>(
            <div key={i} style={{display:"flex",gap:10,marginBottom:8,alignItems:"flex-start"}}>
              <Icon size={14} color={C.muted} style={{marginTop:1,flexShrink:0}}/><span style={{fontSize:13,color:C.text}}>{v}</span>
            </div>
          ))}
          <div style={{display:"flex",gap:8,marginTop:8}}>
            <Btn label="📞 Call" v="ghost" style={{flex:1}} size="sm"/>
            <Btn label="💬 WhatsApp" v="secondary" style={{flex:1}} size="sm"/>
          </div>
        </Card>
        {cur.worker&&(
          <Card style={{marginBottom:12}}>
            <div style={{fontSize:13,fontWeight:700,color:C.text,fontFamily:C.font,marginBottom:10}}>Assigned Worker</div>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:42,height:42,background:C.grad,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Wrench size={18} color="#fff"/>
              </div>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:C.text,fontFamily:C.font}}>{cur.worker}</div>
                <div style={{fontSize:12,color:C.success}}>● Online & Active</div>
              </div>
            </div>
          </Card>
        )}
        {cur.amount>0&&(
          <Card style={{marginBottom:14,background:"rgba(255,69,0,0.07)",border:"1px solid rgba(255,69,0,0.2)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:14,color:C.muted}}>Job Amount</div>
              <div style={{fontSize:30,fontWeight:700,color:C.p,fontFamily:C.font}}>₹{cur.amount.toLocaleString()}</div>
            </div>
          </Card>
        )}
        {cur.status!=="Completed"
          ?<Btn label={`→ Advance: ${S_STEPS[idx+1]||"Done"}`} onClick={advance} style={{width:"100%"}} size="lg"/>
          :<div style={{background:"rgba(0,230,118,0.1)",border:"1px solid rgba(0,230,118,0.3)",borderRadius:16,padding:16,textAlign:"center"}}>
            <CheckCircle size={28} color={C.success}/>
            <div style={{fontSize:16,fontWeight:700,color:C.success,fontFamily:C.font,marginTop:6}}>Job Completed ✓</div>
          </div>
        }
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   WORKER APP
═══════════════════════════════════════ */
function WorkerApp({jobs,setJobs,go,setSelJob,tab,setTab,online,setOnline}){
  const myJobs=jobs.filter(j=>j.workerId==="w1");
  const activeJob=myJobs.find(j=>j.status==="Working");
  const pending=jobs.find(j=>j.status==="New");

  function HomeTab(){
    return(
      <div style={{flex:1,overflowY:"auto",padding:"14px 14px 100px"}}>
        <div onClick={()=>setOnline(!online)} style={{background:online?C.grad:C.card2,borderRadius:20,padding:"18px 20px",marginBottom:16,cursor:"pointer",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",right:-20,top:-20,width:90,height:90,background:"rgba(255,255,255,0.08)",borderRadius:"50%"}}/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:12,color:online?"rgba(255,255,255,0.7)":C.muted,letterSpacing:"1px"}}>YOUR STATUS</div>
              <div style={{fontSize:24,fontWeight:700,color:online?"#fff":C.text,fontFamily:C.font}}>{online?"● ONLINE":"○ OFFLINE"}</div>
              <div style={{fontSize:12,color:online?"rgba(255,255,255,0.65)":C.muted,marginTop:2}}>Tap to toggle</div>
            </div>
            <Zap size={36} color={online?"rgba(255,255,255,0.9)":C.muted}/>
          </div>
        </div>
        {activeJob&&(
          <div onClick={()=>{setSelJob(activeJob);go("worker-active");}} style={{background:"rgba(255,69,0,0.1)",border:`1.5px solid ${C.p}`,borderRadius:16,padding:"13px 15px",marginBottom:14,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:11,color:C.p,fontWeight:700,letterSpacing:"0.5px"}}>ACTIVE JOB</div>
              <div style={{fontSize:15,fontWeight:700,color:C.text,fontFamily:C.font}}>{activeJob.customer}</div>
              <div style={{fontSize:12,color:C.muted}}>{activeJob.problem}</div>
            </div>
            <ChevronRight size={20} color={C.p}/>
          </div>
        )}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
          <StatCard label="Today's Jobs"  value="3"      Icon={Briefcase}  color={C.p}       sub="+1"/>
          <StatCard label="Rating"        value="4.8★"   Icon={Star}       color={C.warn}/>
          <StatCard label="Today Earning" value="₹1,250" Icon={Wallet}     color={C.success}/>
          <StatCard label="Total Jobs"    value="145"    Icon={CheckCircle}color={C.info}/>
        </div>
        {online&&pending&&(
          <div style={{background:"rgba(0,230,118,0.07)",border:`1.5px solid ${C.success}`,borderRadius:16,padding:"14px 15px",marginBottom:14}}>
            <div style={{fontSize:12,color:C.success,fontWeight:700,marginBottom:5,letterSpacing:"0.4px"}}>⚡ NEW JOB AVAILABLE</div>
            <div style={{fontSize:15,fontWeight:700,color:C.text,fontFamily:C.font}}>{pending.problem}</div>
            <div style={{fontSize:13,color:C.muted,margin:"4px 0 10px"}}>{pending.address}</div>
            <div style={{display:"flex",gap:8}}>
              <Btn label="✓ Accept" v="success" size="sm" style={{flex:1}} onClick={()=>{setSelJob(pending);setJobs(jobs.map(j=>j.id===pending.id?{...j,status:"Assigned",worker:"Rajan Verma",workerId:"w1"}:j));go("worker-active");}}/>
              <Btn label="✗ Reject" v="danger"  size="sm" style={{flex:1}} onClick={()=>setJobs(jobs.map(j=>j.id===pending.id?{...j,status:"New"}:j))}/>
            </div>
          </div>
        )}
        <div style={{fontSize:15,fontWeight:700,color:C.text,fontFamily:C.font,marginBottom:10}}>Recent Activity</div>
        {[{j:"Fan Repair",c:"Amit G.",a:350,ch:28,d:"Today"},{j:"MCB Work",c:"Mrs. Singh",a:600,ch:48,d:"Yesterday"},{j:"AC Service",c:"Tech Corp",a:2050,ch:164,d:"12 May"}].map((e,i)=>(
          <Card key={i} style={{marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:C.text,fontFamily:C.font}}>{e.j}</div>
                <div style={{fontSize:12,color:C.muted}}>{e.c} · {e.d}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:16,fontWeight:700,color:C.success,fontFamily:C.font}}>₹{e.a-e.ch}</div>
                <div style={{fontSize:11,color:C.muted}}>after 8%</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  function EarningsTab(){
    const monthly=[{m:"Jan",e:18000},{m:"Feb",e:22000},{m:"Mar",e:19500},{m:"Apr",e:28000},{m:"May",e:12500}];
    const mx=Math.max(...monthly.map(m=>m.e));
    return(
      <div style={{flex:1,overflowY:"auto",padding:"14px 14px 100px"}}>
        <div style={{background:C.grad,borderRadius:20,padding:20,textAlign:"center",marginBottom:16}}>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.75)",letterSpacing:"1px"}}>MAY PAYOUT</div>
          <div style={{fontSize:44,fontWeight:700,color:"#fff",fontFamily:C.font}}>₹11,500</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.7)"}}>Service charge deducted: ₹1,000 (8%)</div>
        </div>
        <Card style={{marginBottom:14}}>
          <div style={{fontSize:14,fontWeight:700,color:C.text,fontFamily:C.font,marginBottom:12}}>Monthly Overview</div>
          {monthly.map(m=>(
            <div key={m.m} style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
              <div style={{width:30,fontSize:12,fontWeight:700,color:C.muted,fontFamily:C.font}}>{m.m}</div>
              <div style={{flex:1,background:C.border,borderRadius:4,height:8,overflow:"hidden"}}>
                <div style={{width:`${(m.e/mx)*100}%`,height:"100%",background:C.grad,borderRadius:4}}/>
              </div>
              <div style={{textAlign:"right",minWidth:62}}>
                <div style={{fontSize:12,fontWeight:700,color:C.success,fontFamily:C.font}}>₹{Math.round(m.e*0.92/100)*100}</div>
              </div>
            </div>
          ))}
        </Card>
        <Card>
          <div style={{fontSize:14,fontWeight:700,color:C.text,fontFamily:C.font,marginBottom:12}}>May Breakdown</div>
          {[{l:"Labour Charges",a:"₹8,500",c:C.text},{l:"Travel Charges",a:"₹3,500",c:C.text},{l:"Material",a:"₹500",c:C.text},{l:"Gross Total",a:"₹12,500",c:C.p},{l:"Service Charge (8%)",a:"−₹1,000",c:C.danger},{l:"NET PAYOUT",a:"₹11,500",c:C.success}].map((r,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",padding:i===5?"10px 0 0":"0 0 8px",borderTop:i===4?`1px dashed ${C.border}`:"none",marginTop:i===4?4:0}}>
              <div style={{fontSize:13,color:C.muted}}>{r.l}</div>
              <div style={{fontSize:i>=5?16:13,fontWeight:i>=4?700:500,color:r.c,fontFamily:C.font}}>{r.a}</div>
            </div>
          ))}
        </Card>
      </div>
    );
  }

  function ProfileTab(){
    return(
      <div style={{flex:1,overflowY:"auto",padding:"14px 14px 100px"}}>
        <div style={{background:C.grad,borderRadius:20,padding:24,textAlign:"center",marginBottom:18,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-30,right:-30,width:120,height:120,background:"rgba(255,255,255,0.07)",borderRadius:"50%"}}/>
          <div style={{width:70,height:70,background:"rgba(255,255,255,0.2)",borderRadius:20,margin:"0 auto 10px",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Wrench size={30} color="#fff"/>
          </div>
          <div style={{fontSize:22,fontWeight:700,color:"#fff",fontFamily:C.font}}>Rajan Verma</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.75)"}}>Senior Electrician</div>
          <div style={{display:"flex",justifyContent:"center",gap:28,marginTop:14}}>
            {[{v:"4.8",l:"Rating"},{v:"145",l:"Jobs"},{v:"3yr",l:"Exp"}].map(({v,l})=>(
              <div key={l} style={{textAlign:"center"}}>
                <div style={{fontSize:20,fontWeight:700,color:"#fff",fontFamily:C.font}}>{v}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.7)"}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <Card style={{marginBottom:14}}>
          {[{Icon:Phone,l:"Mobile",v:"9876543210"},{Icon:MapPin,l:"Area",v:"Noida, Delhi NCR"},{Icon:Wrench,l:"Skill",v:"Residential & Commercial"},{Icon:Award,l:"Certified",v:"Level 2 Electrician"}].map(({Icon,l,v},i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 0",borderBottom:i<3?`1px solid ${C.border}`:"none"}}>
              <Icon size={16} color={C.p}/>
              <div>
                <div style={{fontSize:11,color:C.muted}}>{l}</div>
                <div style={{fontSize:14,fontWeight:600,color:C.text}}>{v}</div>
              </div>
            </div>
          ))}
        </Card>
        <Btn label="Logout" v="danger" Icon={LogOut} style={{width:"100%"}} onClick={()=>go("login")}/>
      </div>
    );
  }

  return(
    <div style={{height:"100%",display:"flex",flexDirection:"column"}}>
      <div style={{background:C.bg,paddingTop:50,paddingBottom:13,paddingLeft:18,paddingRight:18,borderBottom:`1px solid ${C.border}`,flexShrink:0}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:21,fontWeight:700,color:C.text,fontFamily:C.font}}>Hello, Rajan! 👋</div>
            <div style={{fontSize:12,color:online?C.success:C.muted}}>● {online?"Online — Ready for jobs":"Offline"}</div>
          </div>
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,width:38,height:38,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
            <Bell size={17} color={C.text}/>
          </div>
        </div>
      </div>
      {tab==="home"&&<HomeTab/>}
      {tab==="jobs"&&(
        <div style={{flex:1,overflowY:"auto",padding:"14px 14px 100px"}}>
          {myJobs.length===0?<div style={{textAlign:"center",padding:40,color:C.muted}}>No assigned jobs yet</div>:myJobs.map(j=><JobCard key={j.id} job={j} onPress={()=>{setSelJob(j);go("worker-active");}}/>)}
        </div>
      )}
      {tab==="earnings"&&<EarningsTab/>}
      {tab==="profile"&&<ProfileTab/>}
      <BottomNav tab={tab} setTab={setTab} role="worker"/>
    </div>
  );
}

/* ═══════════════════════════════════════
   ACTIVE JOB (Worker)
═══════════════════════════════════════ */
function ActiveJob({go,job,jobs,setJobs}){
  if(!job) return null;
  const cur=jobs.find(j=>j.id===job.id)||job;
  const idx=S_STEPS.indexOf(cur.status);
  const advance=()=>{const ni=Math.min(idx+1,S_STEPS.length-1);if(ni!==idx)setJobs(jobs.map(j=>j.id===cur.id?{...j,status:S_STEPS[ni]}:j));};
  const pct=Math.round((idx/(S_STEPS.length-1))*100);
  return(
    <div style={{height:"100%",display:"flex",flexDirection:"column"}}>
      <div style={{background:C.grad,paddingTop:52,paddingBottom:20,paddingLeft:18,paddingRight:18,position:"relative",overflow:"hidden",flexShrink:0}}>
        <div style={{position:"absolute",right:-30,top:-30,width:140,height:140,background:"rgba(255,255,255,0.07)",borderRadius:"50%"}}/>
        <button onClick={()=>go("worker-home")} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:10,padding:"7px 10px",cursor:"pointer",display:"flex",alignItems:"center",gap:5,marginBottom:14}}>
          <ArrowLeft size={14} color="#fff"/><span style={{fontSize:12,fontFamily:C.font,fontWeight:600,color:"#fff"}}>Back</span>
        </button>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.7)",letterSpacing:"0.8px"}}>ACTIVE JOB</div>
        <div style={{fontSize:22,fontWeight:700,color:"#fff",fontFamily:C.font}}>{cur.customer}</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.8)",marginTop:2}}>{cur.problem} · {cur.address}</div>
        <div style={{display:"flex",gap:8,marginTop:12}}>
          {["📞 Call","💬 Chat","🗺 Navigate"].map(l=><Btn key={l} label={l} style={{background:"rgba(255,255,255,0.2)",color:"#fff",border:"none"}} size="sm"/>)}
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"14px 14px 28px"}}>
        <div style={{background:"rgba(255,69,0,0.1)",border:`1.5px solid ${C.p}`,borderRadius:15,padding:"12px 15px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:11,color:C.muted,letterSpacing:"0.5px"}}>CURRENT STATUS</div>
            <div style={{fontSize:20,fontWeight:700,color:C.p,fontFamily:C.font}}>{cur.status}</div>
          </div>
          {S_STEPS[idx+1]&&<div style={{textAlign:"right"}}><div style={{fontSize:11,color:C.muted}}>Next</div><div style={{fontSize:13,color:C.text,fontWeight:600}}>{S_STEPS[idx+1]}</div></div>}
        </div>
        <Card style={{marginBottom:14}}>
          <div style={{fontSize:13,fontWeight:700,color:C.text,fontFamily:C.font,marginBottom:10}}>Job Progress</div>
          <div style={{background:C.border,height:7,borderRadius:4,overflow:"hidden",marginBottom:8}}>
            <div style={{width:`${pct}%`,height:"100%",background:C.grad,borderRadius:4,transition:"width 0.4s ease"}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <div style={{fontSize:11,color:C.muted}}>Started</div>
            <div style={{fontSize:12,fontWeight:700,color:C.p,fontFamily:C.font}}>{pct}% Complete</div>
            <div style={{fontSize:11,color:C.muted}}>Done</div>
          </div>
        </Card>
        <Card style={{marginBottom:14}}>
          <div style={{fontSize:13,fontWeight:700,color:C.text,fontFamily:C.font,marginBottom:10}}>Job Details</div>
          {[{Icon:MapPin,l:"Address",v:cur.address},{Icon:Wrench,l:"Problem",v:cur.problem},{Icon:Building,l:"Type",v:cur.type},{Icon:FileText,l:"Notes",v:cur.notes}].map(({Icon,l,v},i)=>(
            <div key={i} style={{display:"flex",gap:10,marginBottom:8,alignItems:"flex-start"}}>
              <Icon size={14} color={C.muted} style={{marginTop:1,flexShrink:0}}/>
              <div>
                <div style={{fontSize:10,color:C.muted,textTransform:"uppercase"}}>{l}</div>
                <div style={{fontSize:13,color:C.text,fontWeight:500,textTransform:"capitalize"}}>{v}</div>
              </div>
            </div>
          ))}
        </Card>
        <div style={{display:"flex",gap:8,marginBottom:12}}>
          <Btn label="📷 Photos" v="secondary" style={{flex:1}} size="sm"/>
          <Btn label="📋 Estimate" v="secondary" onClick={()=>go("worker-estimate")} style={{flex:1}} size="sm"/>
        </div>
        {cur.status!=="Completed"
          ?<Btn label={S_STEPS[idx+1]?`→ Mark: ${S_STEPS[idx+1]}`:"✓ Complete Job"} onClick={advance} style={{width:"100%"}} size="lg"/>
          :<>
            <div style={{background:"rgba(0,230,118,0.1)",border:"1px solid rgba(0,230,118,0.3)",borderRadius:15,padding:14,textAlign:"center",marginBottom:12}}>
              <CheckCircle size={26} color={C.success}/>
              <div style={{fontSize:16,fontWeight:700,color:C.success,fontFamily:C.font,marginTop:6}}>Job Completed ✓</div>
            </div>
            <Btn label="View / Share Bill" onClick={()=>go("worker-bill")} style={{width:"100%"}} size="lg"/>
          </>
        }
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   ESTIMATE GENERATOR
═══════════════════════════════════════ */
function Estimate({go,job}){
  const[cat,setCat]=useState("residential");
  const[items,setItems]=useState([]);
  const[dist,setDist]=useState(5);
  const[visitOnly,setVisitOnly]=useState(false);
  const[matCost,setMatCost]=useState("");
  const list=PRICE_LIST[cat==="ac"?"ac":cat==="industrial"?"industrial":"residential"];
  const catKey=cat==="ac"?"residential":cat;
  const labour=items.reduce((s,i)=>s+i.price*i.qty,0);
  const travel=visitOnly?0:dist*(TRAVEL_R[catKey]||10);
  const visit=visitOnly?VISIT_C[catKey]:0;
  const mat=parseInt(matCost)||0;
  const gross=labour+travel+visit+mat;
  const svcR=SVC_R[catKey]||0.08;
  const svcCharge=Math.round(gross*svcR);
  const payout=gross-svcCharge;
  const addItem=item=>{const ex=items.find(i=>i.item===item.item);ex?setItems(items.map(i=>i.item===item.item?{...i,qty:i.qty+1}:i)):setItems([...items,{...item,qty:1}]);};
  const decItem=item=>{const ex=items.find(i=>i.item===item.item);if(!ex)return;ex.qty>1?setItems(items.map(i=>i.item===item.item?{...i,qty:i.qty-1}:i)):setItems(items.filter(i=>i.item!==item.item));};
  return(
    <div style={{height:"100%",display:"flex",flexDirection:"column"}}>
      <TopBar title="Estimate Generator" subtitle="Build customer quote" onBack={()=>go("worker-active")}/>
      <div style={{flex:1,overflowY:"auto",padding:"14px 14px 30px"}}>
        <div style={{display:"flex",gap:7,marginBottom:16}}>
          {["residential","ac","industrial"].map(c=>(
            <button key={c} onClick={()=>setCat(c)} style={{flex:1,background:cat===c?C.grad:C.card,border:`1.5px solid ${cat===c?"transparent":C.border}`,color:cat===c?"#fff":C.muted,borderRadius:12,padding:"9px 0",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:C.font,textTransform:"capitalize",transition:"all 0.2s"}}>
              {c==="ac"?"AC/Fridge":c}
            </button>
          ))}
        </div>
        <div onClick={()=>setVisitOnly(!visitOnly)} style={{background:C.card,border:`1.5px solid ${visitOnly?C.warn:C.border}`,borderRadius:14,padding:"12px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,cursor:"pointer"}}>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:C.text,fontFamily:C.font}}>Visit Only (No Work)</div>
            <div style={{fontSize:11,color:C.muted}}>Customer declined — charge visit fee only</div>
          </div>
          <div style={{width:42,height:23,background:visitOnly?C.warn:C.card2,borderRadius:11,border:`2px solid ${visitOnly?C.warn:C.border}`,position:"relative",transition:"all 0.2s"}}>
            <div style={{position:"absolute",top:2,left:visitOnly?18:2,width:15,height:15,background:"#fff",borderRadius:"50%",transition:"left 0.2s"}}/>
          </div>
        </div>
        <div style={{marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <div style={{fontSize:12,color:C.muted,fontWeight:600}}>DISTANCE</div>
            <div style={{fontSize:13,fontWeight:700,color:C.p,fontFamily:C.font}}>{dist}km → ₹{visitOnly?visit:travel}</div>
          </div>
          <input type="range" min="1" max="50" value={dist} onChange={e=>setDist(+e.target.value)} style={{width:"100%",accentColor:C.p}}/>
        </div>
        {!visitOnly&&<>
          <div style={{fontSize:12,color:C.muted,fontWeight:600,marginBottom:8,fontFamily:C.font,letterSpacing:"0.5px"}}>ADD SERVICES</div>
          {list.map(item=>{
            const sel=items.find(i=>i.item===item.item);
            return(
              <div key={item.item} style={{background:C.card,border:`1.5px solid ${sel?C.p:C.border}`,borderRadius:13,padding:"11px 13px",marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div>
                  <div style={{fontSize:12,fontWeight:600,color:C.text}}>{item.item}</div>
                  <div style={{fontSize:11,color:C.muted}}>₹{item.price}/{item.unit}</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  {sel&&<><button onClick={()=>decItem(item)} style={{width:26,height:26,background:C.card2,border:`1px solid ${C.border}`,borderRadius:7,cursor:"pointer",color:C.text,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>−</button><span style={{fontSize:14,fontWeight:700,color:C.p,fontFamily:C.font,minWidth:14,textAlign:"center"}}>{sel.qty}</span></>}
                  <button onClick={()=>addItem(item)} style={{width:26,height:26,background:sel?C.grad:C.card2,border:`1px solid ${sel?"transparent":C.border}`,borderRadius:7,cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>+</button>
                </div>
              </div>
            );
          })}
          <div style={{marginBottom:16,marginTop:4}}>
            <div style={{fontSize:12,color:C.muted,fontWeight:600,marginBottom:6}}>MATERIAL COST (Optional)</div>
            <div style={{background:C.card,border:`1.5px solid ${matCost?C.p:C.border}`,borderRadius:13,display:"flex",alignItems:"center",padding:"11px 13px",gap:8}}>
              <span style={{color:C.muted,fontSize:15}}>₹</span>
              <input value={matCost} onChange={e=>setMatCost(e.target.value)} placeholder="0" type="number" style={{background:"none",border:"none",outline:"none",color:C.text,fontSize:14,flex:1,fontFamily:C.fontB}}/>
            </div>
          </div>
        </>}
        <Card style={{background:"rgba(255,69,0,0.06)",border:"1px solid rgba(255,69,0,0.2)",marginBottom:12}}>
          <div style={{fontSize:13,fontWeight:700,color:C.text,fontFamily:C.font,marginBottom:10}}>📋 Customer Bill</div>
          {items.map(i=><div key={i.item} style={{display:"flex",justifyContent:"space-between",marginBottom:7}}><div style={{fontSize:13,color:C.muted}}>{i.item} ×{i.qty}</div><div style={{fontSize:13,color:C.text,fontWeight:600,fontFamily:C.font}}>₹{i.price*i.qty}</div></div>)}
          {travel>0&&<div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}><div style={{fontSize:13,color:C.muted}}>Travel ({dist}km)</div><div style={{fontSize:13,color:C.text,fontWeight:600,fontFamily:C.font}}>₹{travel}</div></div>}
          {visit>0&&<div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}><div style={{fontSize:13,color:C.muted}}>Visit Charge</div><div style={{fontSize:13,color:C.text,fontWeight:600,fontFamily:C.font}}>₹{visit}</div></div>}
          {mat>0&&<div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}><div style={{fontSize:13,color:C.muted}}>Material</div><div style={{fontSize:13,color:C.text,fontWeight:600,fontFamily:C.font}}>₹{mat}</div></div>}
          <div style={{borderTop:`1px dashed ${C.border}`,paddingTop:10,marginTop:4,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontSize:15,fontWeight:700,color:C.text,fontFamily:C.font}}>TOTAL</div>
            <div style={{fontSize:24,fontWeight:700,color:C.p,fontFamily:C.font}}>₹{gross}</div>
          </div>
        </Card>
        <Card style={{background:"rgba(0,230,118,0.06)",border:"1px solid rgba(0,230,118,0.25)",marginBottom:14}}>
          <div style={{fontSize:12,color:C.success,fontWeight:700,letterSpacing:"0.3px",marginBottom:8}}>💰 YOUR EARNINGS (Hidden from customer)</div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><div style={{fontSize:13,color:C.muted}}>Gross Amount</div><div style={{fontSize:13,color:C.text,fontFamily:C.font,fontWeight:600}}>₹{gross}</div></div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><div style={{fontSize:13,color:C.muted}}>Service Charge ({Math.round(svcR*100)}%)</div><div style={{fontSize:13,color:C.danger,fontFamily:C.font,fontWeight:600}}>−₹{svcCharge}</div></div>
          <div style={{borderTop:"1px dashed rgba(0,230,118,0.3)",paddingTop:8,marginTop:4,display:"flex",justifyContent:"space-between"}}>
            <div style={{fontSize:14,fontWeight:700,color:C.success,fontFamily:C.font}}>NET PAYOUT</div>
            <div style={{fontSize:20,fontWeight:700,color:C.success,fontFamily:C.font}}>₹{payout}</div>
          </div>
        </Card>
        <div style={{display:"flex",gap:8}}>
          <Btn label="Save Estimate" onClick={()=>go("worker-active")} style={{flex:1}} size="lg"/>
          <Btn label="Share PDF" v="secondary" style={{flex:1}} size="lg"/>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   BILL VIEW
═══════════════════════════════════════ */
function Bill({go,job}){
  const[view,setView]=useState("customer");
  const amount=job?.amount||2050;
  const svcCharge=Math.round(amount*0.08);
  const travelSvc=Math.round(50*0.08);
  const payout=amount-svcCharge-travelSvc;
  return(
    <div style={{height:"100%",display:"flex",flexDirection:"column"}}>
      <TopBar title="Final Bill" subtitle={job?.customer||"Customer"} onBack={()=>go("worker-active")}/>
      <div style={{flex:1,overflowY:"auto",padding:"14px 14px 30px"}}>
        <div style={{display:"flex",gap:3,background:C.card,borderRadius:14,padding:4,marginBottom:16}}>
          {[{v:"customer",l:"Customer Bill"},{v:"worker",l:"My Earnings"}].map(t=>(
            <button key={t.v} onClick={()=>setView(t.v)} style={{flex:1,padding:"9px 0",borderRadius:10,background:view===t.v?C.grad:"transparent",border:"none",color:view===t.v?"#fff":C.muted,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:C.font,transition:"all 0.2s"}}>{t.l}</button>
          ))}
        </div>
        {view==="customer"&&<>
          <Card style={{textAlign:"center",marginBottom:14,background:"rgba(255,69,0,0.05)",border:"1px solid rgba(255,69,0,0.2)"}}>
            <div style={{width:44,height:44,background:C.grad,borderRadius:12,margin:"0 auto 8px",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontSize:16,fontWeight:800,color:"#fff",fontFamily:C.font}}>PR</span>
            </div>
            <div style={{fontSize:17,fontWeight:700,color:C.text,fontFamily:C.font}}>PR PARTNER</div>
            <div style={{fontSize:12,color:C.muted}}>Field Service Solutions</div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:14,paddingTop:12,borderTop:`1px solid ${C.border}`}}>
              <div style={{fontSize:12,color:C.muted}}>Bill: {job?.id||"J002"}</div>
              <div style={{fontSize:12,color:C.muted}}>13 May 2026</div>
            </div>
          </Card>
          <Card style={{marginBottom:12}}>
            <div style={{fontSize:13,fontWeight:700,color:C.text,fontFamily:C.font,marginBottom:10}}>Customer Info</div>
            {[{l:"Name",v:job?.customer||"Priya Sharma"},{l:"Address",v:job?.address||"MG Road, Gurgaon"},{l:"Service",v:job?.problem||"AC Gas Filling"},{l:"Technician",v:job?.worker||"Suresh Kumar"}].map((r,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <div style={{fontSize:13,color:C.muted}}>{r.l}</div>
                <div style={{fontSize:13,color:C.text,fontWeight:600,textAlign:"right",maxWidth:"55%"}}>{r.v}</div>
              </div>
            ))}
          </Card>
          <Card style={{marginBottom:14}}>
            <div style={{fontSize:13,fontWeight:700,color:C.text,fontFamily:C.font,marginBottom:10}}>Bill Details</div>
            {[{l:"AC Gas Filling (1.5T)",v:"₹2,000"},{l:"Leak Testing",v:"₹500"},{l:"Travel Charge (5km)",v:"₹50"}].map((r,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",marginBottom:9}}>
                <div style={{fontSize:13,color:C.muted}}>{r.l}</div>
                <div style={{fontSize:13,color:C.text,fontWeight:600,fontFamily:C.font}}>{r.v}</div>
              </div>
            ))}
            <div style={{borderTop:`1.5px solid ${C.border}`,marginTop:4,paddingTop:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:16,fontWeight:700,color:C.text,fontFamily:C.font}}>TOTAL</div>
              <div style={{fontSize:28,fontWeight:700,color:C.p,fontFamily:C.font}}>₹{amount}</div>
            </div>
          </Card>
          <div style={{display:"flex",gap:8}}>
            <Btn label="Share PDF" v="secondary" style={{flex:1}}/>
            <Btn label="WhatsApp Bill" style={{flex:1}}/>
          </div>
        </>}
        {view==="worker"&&<>
          <Card style={{background:"rgba(0,230,118,0.06)",border:"1px solid rgba(0,230,118,0.3)",textAlign:"center",marginBottom:14}}>
            <div style={{fontSize:12,color:C.success,letterSpacing:"1px"}}>YOUR PAYOUT</div>
            <div style={{fontSize:46,fontWeight:700,color:C.success,fontFamily:C.font}}>₹{payout}</div>
            <div style={{fontSize:12,color:C.muted}}>After service charges</div>
          </Card>
          <Card style={{marginBottom:12}}>
            <div style={{fontSize:13,fontWeight:700,color:C.text,fontFamily:C.font,marginBottom:10}}>Earnings Breakdown</div>
            {[{l:"Customer Paid",a:`₹${amount}`,c:C.text},{l:"Work Service Charge (8%)",a:`−₹${svcCharge}`,c:C.danger},{l:"Travel Service Charge (8%)",a:`−₹${travelSvc}`,c:C.danger},{l:"NET PAYOUT",a:`₹${payout}`,c:C.success}].map((r,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:i===3?"10px 0 0":"0 0 8px",borderTop:i===3?`1.5px dashed ${C.border}`:"none",marginTop:i===3?4:0}}>
                <div style={{fontSize:13,color:C.muted}}>{r.l}</div>
                <div style={{fontSize:i===3?17:13,fontWeight:i===3?700:500,color:r.c,fontFamily:C.font}}>{r.a}</div>
              </div>
            ))}
          </Card>
          <Card>
            <div style={{fontSize:11,color:C.warn,fontWeight:700,marginBottom:6}}>ℹ️ How charges work</div>
            <div style={{fontSize:12,color:C.muted,lineHeight:1.65}}>Service charges are auto-deducted by PR Partner (8% residential · 10% commercial · 12% industrial). The customer bill does NOT show these. Your net payout is updated automatically in your earnings dashboard.</div>
          </Card>
        </>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN APP
═══════════════════════════════════════ */
export default function PRPartnerApp(){
  const[screen,setScreen]=useState("splash");
  const[role,setRole]=useState(null);
  const[tab,setTab]=useState("home");
  const[jobs,setJobs]=useState(INIT_JOBS);
  const[selJob,setSelJob]=useState(null);
  const[online,setOnline]=useState(true);

  useEffect(()=>{
    const l=document.createElement("link");
    l.href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Nunito:wght@400;500;600;700&display=swap";
    l.rel="stylesheet";
    document.head.appendChild(l);
  },[]);

  useEffect(()=>{
    if(screen==="splash"){const t=setTimeout(()=>setScreen("login"),2800);return()=>clearTimeout(t);}
  },[screen]);

  const go=s=>{setScreen(s);if(s==="admin-home"||s==="worker-home")setTab("home");};
  const curJob=selJob?(jobs.find(j=>j.id===selJob.id)||selJob):null;

  const screens={
    "splash":          <Splash/>,
    "login":           <Login go={go} setRole={setRole}/>,
    "admin-home":      <AdminApp  jobs={jobs} setJobs={setJobs} go={go} setSelJob={setSelJob} tab={tab} setTab={setTab}/>,
    "admin-create":    <CreateJob jobs={jobs} setJobs={setJobs} go={go}/>,
    "job-detail":      <JobDetail go={go} job={curJob} jobs={jobs} setJobs={setJobs}/>,
    "worker-home":     <WorkerApp jobs={jobs} setJobs={setJobs} go={go} setSelJob={setSelJob} tab={tab} setTab={setTab} online={online} setOnline={setOnline}/>,
    "worker-active":   <ActiveJob go={go} job={curJob||jobs[0]} jobs={jobs} setJobs={setJobs}/>,
    "worker-estimate": <Estimate  go={go} job={curJob||jobs[0]}/>,
    "worker-bill":     <Bill      go={go} job={curJob||jobs[0]}/>,
  };

  return(
    <div style={{minHeight:"100vh",background:"radial-gradient(ellipse at 30% 20%,#0F0F25 0%,#050508 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:C.fontB,padding:"24px 16px 100px"}}>
      {/* Top info bar */}
      <div style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",background:"rgba(255,69,0,0.12)",border:"1px solid rgba(255,69,0,0.3)",borderRadius:12,padding:"7px 18px",fontSize:12,color:"rgba(255,130,0,0.95)",zIndex:200,pointerEvents:"none",whiteSpace:"nowrap"}}>
        PR Partner App {role?`· Logged in as ${role}`:"· Select a screen below"}
      </div>

      {/* Phone frame */}
      <div style={{width:390,height:844,background:C.bg,borderRadius:44,overflow:"hidden",position:"relative",boxShadow:"0 60px 200px rgba(0,0,0,0.95),0 0 0 1.5px #2a2a45,0 0 0 8px rgba(255,255,255,0.015),inset 0 0 0 1px rgba(255,255,255,0.04)",display:"flex",flexDirection:"column"}}>
        {/* Status bar */}
        <div style={{position:"absolute",top:13,left:0,right:0,display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 26px 0 22px",zIndex:100,pointerEvents:"none"}}>
          <span style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.55)",fontFamily:C.font}}>9:41</span>
          <div style={{width:100,height:28,background:"#050510",borderRadius:"0 0 16px 16px"}}/>
          <div style={{display:"flex",gap:4,alignItems:"center"}}>
            <Activity size={10} color="rgba(255,255,255,0.45)"/>
            <Wifi size={10} color="rgba(255,255,255,0.45)"/>
            <span style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.55)",fontFamily:C.font}}>84%</span>
          </div>
        </div>
        {/* Screen */}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          {screens[screen]||screens["splash"]}
        </div>
      </div>

      {/* Navigation buttons */}
      <div style={{marginTop:20,display:"flex",gap:7,flexWrap:"wrap",justifyContent:"center",maxWidth:480}}>
        {[
          {label:"Splash",     s:"splash"         },
          {label:"Login",      s:"login"          },
          {label:"Admin",      s:"admin-home"     },
          {label:"New Job",    s:"admin-create"   },
          {label:"Job Detail", s:"job-detail"     },
          {label:"Worker",     s:"worker-home"    },
          {label:"Active Job", s:"worker-active"  },
          {label:"Estimate",   s:"worker-estimate"},
          {label:"Bill",       s:"worker-bill"    },
        ].map(({label,s})=>(
          <button key={s} onClick={()=>go(s)} style={{background:screen===s?C.grad:"rgba(255,255,255,0.07)",border:`1px solid ${screen===s?"transparent":"rgba(255,255,255,0.12)"}`,color:screen===s?"#fff":"rgba(255,255,255,0.5)",borderRadius:20,padding:"5px 14px",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:C.font,transition:"all 0.15s"}}>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
