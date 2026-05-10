import { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext } from "react";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONSTANTS & DATA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const TEXTS = {
  easy: [
    "The sun rose slowly over the mountains casting a warm golden light across the valley below. Birds began their morning songs filling the air with music.",
    "She walked to the store to buy some milk and bread. The weather was nice so she decided to take the long way home through the park.",
    "Learning to type fast takes daily practice and patience. Start slow and focus on accuracy before building up your speed over time.",
  ],
  medium: [
    "Artificial intelligence is reshaping the way we interact with technology. From voice assistants to recommendation systems, machine learning algorithms power countless applications we use every day.",
    "The blockchain technology underlying cryptocurrencies offers a decentralized approach to record-keeping. Each block contains a cryptographic hash of the previous block, creating an immutable chain of transactions.",
    "Software engineering is both a science and an art. Writing clean, maintainable code requires not just technical knowledge but also empathy for the developers who will read your work in the future.",
  ],
  hard: [
    "Asymptotic analysis provides a mathematical framework for comparing algorithm efficiency independent of hardware specifications. Big-O notation characterizes the upper bound of computational complexity as input size approaches infinity.",
    "Neuroplasticity—the brain's remarkable capacity to reorganize synaptic connections—underpins all forms of skill acquisition. Deliberate practice exploits this mechanism by repeatedly activating specific neural pathways until myelination increases signal transmission velocity.",
    "The Byzantine fault tolerance problem fundamentally challenges distributed systems design: achieving consensus among geographically dispersed nodes when an arbitrary subset may exhibit malicious or erratic behavior requires sophisticated cryptographic protocols.",
  ],
};

const QUOTES = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
];

const LEADERBOARD = [
  { rank: 1, name: "QuantumKeys", wpm: 212, acc: 99.1, tests: 1847, country: "🇺🇸", badge: "LEGEND" },
  { rank: 2, name: "NeonFlash", wpm: 198, acc: 98.7, tests: 2341, country: "🇯🇵", badge: "LEGEND" },
  { rank: 3, name: "CipherStorm", wpm: 187, acc: 99.4, tests: 976, country: "🇩🇪", badge: "ELITE" },
  { rank: 4, name: "VoidTyper", wpm: 176, acc: 97.8, tests: 3102, country: "🇰🇷", badge: "ELITE" },
  { rank: 5, name: "GlitchWave", wpm: 169, acc: 98.2, tests: 1523, country: "🇧🇷", badge: "PRO" },
  { rank: 6, name: "DataPulse", wpm: 161, acc: 96.9, tests: 892, country: "🇬🇧", badge: "PRO" },
  { rank: 7, name: "SyntaxGhost", wpm: 154, acc: 97.5, tests: 2187, country: "🇨🇦", badge: "PRO" },
  { rank: 8, name: "ByteRunner", wpm: 147, acc: 98.0, tests: 741, country: "🇫🇷", badge: "ADV" },
  { rank: 9, name: "HexBlade", wpm: 139, acc: 95.4, tests: 1654, country: "🇮🇳", badge: "ADV" },
  { rank: 10, name: "ZeroLatency", wpm: 132, acc: 97.1, tests: 428, country: "🇦🇺", badge: "ADV" },
];

const ACHIEVEMENTS = [
  { id: "first_test", icon: "🎯", label: "First Blood", desc: "Complete your first test", xp: 10 },
  { id: "wpm_50", icon: "⚡", label: "Speed Initiate", desc: "Reach 50 WPM", xp: 25 },
  { id: "wpm_80", icon: "🚀", label: "Velocity", desc: "Reach 80 WPM", xp: 50 },
  { id: "wpm_100", icon: "💎", label: "Century Club", desc: "Reach 100 WPM", xp: 100 },
  { id: "wpm_150", icon: "☄️", label: "Supersonic", desc: "Reach 150 WPM", xp: 250 },
  { id: "acc_100", icon: "🎖️", label: "Perfectionist", desc: "100% accuracy test", xp: 75 },
  { id: "streak_3", icon: "🔥", label: "On Fire", desc: "3-day streak", xp: 30 },
  { id: "streak_7", icon: "🌟", label: "Weekly Warrior", desc: "7-day streak", xp: 100 },
  { id: "tests_10", icon: "📈", label: "Dedicated", desc: "Complete 10 tests", xp: 40 },
  { id: "tests_50", icon: "🏅", label: "Veteran", desc: "Complete 50 tests", xp: 150 },
  { id: "daily_done", icon: "📅", label: "Daily Grinder", desc: "Complete daily challenge", xp: 50 },
  { id: "hard_mode", icon: "💀", label: "Masochist", desc: "Complete a hard difficulty test", xp: 60 },
];

const KEY_ROWS = [
  ["q","w","e","r","t","y","u","i","o","p"],
  ["a","s","d","f","g","h","j","k","l"],
  ["z","x","c","v","b","n","m"],
];

const AI_FEEDBACK = [
  { test: (w,a) => w >= 150 && a >= 98, tag: "NEURAL ELITE", color: "#a78bfa", msg: "Your fingers operate at machine precision. You've transcended the average typist — consider targeting 170+ WPM with specialized number-row drills." },
  { test: (w,a) => w >= 100 && a >= 97, tag: "APEX PERFORMER", color: "#34d399", msg: "Exceptional velocity with surgical accuracy. Focus on maintaining this rhythm under fatigue — try longer 2-minute tests to build endurance." },
  { test: (w,a) => w >= 80 && a >= 95, tag: "HIGH VELOCITY", color: "#60a5fa", msg: "Strong speed with reliable accuracy. Your weak point is likely common digraphs. Practice 'th', 'ing', 'ion' combinations in isolation." },
  { test: (w,a) => w >= 60 && a >= 90, tag: "INTERMEDIATE", color: "#fbbf24", msg: "Solid foundation established. Eliminate hesitation between words — your inter-word pauses are dragging your average. Think in chunks, not letters." },
  { test: (_,a) => a < 85, tag: "ACCURACY FOCUS", color: "#f87171", msg: "Speed is irrelevant without accuracy. Drop to 60% of your max speed and type each word perfectly. Accuracy first — speed will compound naturally." },
  { test: (w) => w < 40, tag: "FOUNDATION MODE", color: "#94a3b8", msg: "Build the right habits now. 15 minutes of daily home-row practice beats marathon sessions. Use all fingers — avoid single-finger typing at all costs." },
  { test: () => true, tag: "STEADY PROGRESS", color: "#818cf8", msg: "Consistency is your superpower. Daily 10-minute sessions will compound into 20+ WPM gains over 30 days. Track your trends in the Analytics dashboard." },
];

function getAIFeedback(wpm, acc) {
  return AI_FEEDBACK.find(f => f.test(wpm, acc));
}

function randomText(mode, difficulty) {
  if (mode === "quote") {
    const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    return { text: q.text, meta: `— ${q.author}` };
  }
  const arr = TEXTS[difficulty] || TEXTS.medium;
  return { text: arr[Math.floor(Math.random() * arr.length)], meta: null };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GLOBAL CSS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=IBM+Plex+Mono:wght@300;400;500;600;700&family=Exo+2:wght@300;400;600;800;900&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root {
  --bg0: #03040a;
  --bg1: #07091a;
  --bg2: #0d1030;
  --bg3: #121540;
  --glass: rgba(255,255,255,0.025);
  --glass2: rgba(255,255,255,0.05);
  --border: rgba(99,102,241,0.18);
  --border2: rgba(99,102,241,0.38);
  --border3: rgba(99,102,241,0.6);
  --p: #818cf8;
  --p2: #6366f1;
  --p3: #4f46e5;
  --cyan: #22d3ee;
  --violet: #a78bfa;
  --green: #34d399;
  --red: #f87171;
  --amber: #fbbf24;
  --text: #e2e8f0;
  --text2: #94a3b8;
  --text3: #475569;
  --text4: #1e293b;
  --glow-sm: 0 0 12px rgba(99,102,241,0.35);
  --glow-md: 0 0 28px rgba(99,102,241,0.28);
  --glow-lg: 0 0 60px rgba(99,102,241,0.2);
  --glow-cyan: 0 0 20px rgba(34,211,238,0.3);
  --font-display: 'Exo 2', sans-serif;
  --font-body: 'Rajdhani', sans-serif;
  --font-mono: 'IBM Plex Mono', monospace;
  --r: 14px;
  --r-sm: 8px;
  --r-lg: 20px;
}

.theme-light {
  --bg0: #f1f5ff;
  --bg1: #e8eeff;
  --bg2: #dde4ff;
  --bg3: #d0d9ff;
  --glass: rgba(99,102,241,0.04);
  --glass2: rgba(99,102,241,0.08);
  --border: rgba(99,102,241,0.2);
  --border2: rgba(99,102,241,0.4);
  --border3: rgba(99,102,241,0.7);
  --text: #1e1b4b;
  --text2: #3730a3;
  --text3: #6366f1;
  --text4: #e0e7ff;
}

html,body{background:var(--bg0);color:var(--text);font-family:var(--font-body);min-height:100vh;overflow-x:hidden}
body{background-image:radial-gradient(ellipse 80% 60% at 20% -10%, rgba(99,102,241,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 110%, rgba(139,92,246,0.08) 0%, transparent 60%);}

::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-track{background:var(--bg1)}
::-webkit-scrollbar-thumb{background:var(--p2);border-radius:2px}

/* ─── LAYOUT ─── */
.app{min-height:100vh;display:flex;flex-direction:column}
.page-content{flex:1;max-width:1240px;margin:0 auto;width:100%;padding:2rem 1.5rem}

/* ─── NAVBAR ─── */
.navbar{
  position:sticky;top:0;z-index:100;
  display:flex;align-items:center;gap:1rem;
  padding:0 2rem;height:58px;
  background:rgba(3,4,10,0.82);
  backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);
  border-bottom:1px solid var(--border);
}
.theme-light .navbar{background:rgba(241,245,255,0.88)}
.nav-logo{
  font-family:var(--font-display);font-weight:900;font-size:1.25rem;
  letter-spacing:1px;cursor:pointer;flex-shrink:0;
  background:linear-gradient(120deg,#fff 0%,var(--p) 45%,var(--cyan) 100%);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
}
.nav-logo span{color:var(--cyan);-webkit-text-fill-color:var(--cyan)}
.nav-center{display:flex;gap:2px;flex:1;justify-content:center}
.nav-link{
  background:none;border:none;cursor:pointer;
  font-family:var(--font-body);font-size:.78rem;font-weight:600;
  letter-spacing:1.5px;text-transform:uppercase;
  padding:.45rem .9rem;border-radius:var(--r-sm);
  color:var(--text2);transition:all .2s;
}
.nav-link:hover{color:var(--p);background:var(--glass2)}
.nav-link.active{color:var(--cyan);background:rgba(34,211,238,0.08);border:1px solid rgba(34,211,238,0.2)}
.nav-right{display:flex;align-items:center;gap:.6rem;flex-shrink:0}
.icon-btn{
  background:var(--glass);border:1px solid var(--border);
  border-radius:var(--r-sm);padding:.4rem .55rem;
  cursor:pointer;font-size:.95rem;transition:all .2s;color:var(--text2);
  font-family:var(--font-mono);
}
.icon-btn:hover{border-color:var(--border2);color:var(--p);box-shadow:var(--glow-sm)}
.avatar-btn{
  width:34px;height:34px;border-radius:50%;
  background:linear-gradient(135deg,var(--p2),var(--violet),var(--cyan));
  border:2px solid var(--border2);cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  font-family:var(--font-display);font-size:.75rem;font-weight:800;color:#fff;
  box-shadow:var(--glow-sm);transition:all .2s;
}
.avatar-btn:hover{box-shadow:var(--glow-md);transform:scale(1.05)}

/* ─── GLASS CARD ─── */
.card{
  background:var(--glass);
  border:1px solid var(--border);
  border-radius:var(--r);
  backdrop-filter:blur(12px);
  transition:border-color .25s,box-shadow .25s;
}
.card:hover{border-color:var(--border2)}
.card-glow:hover{box-shadow:var(--glow-md)}
.card-p{padding:1.5rem}
.card-p-lg{padding:2rem}

/* ─── SECTION HEADER ─── */
.section-hd{display:flex;align-items:center;gap:1rem;margin-bottom:1.75rem}
.section-hd-title{
  font-family:var(--font-display);font-weight:800;
  font-size:1.05rem;letter-spacing:1px;white-space:nowrap;
  color:var(--text);
}
.section-hd-line{flex:1;height:1px;background:linear-gradient(90deg,var(--border2),transparent)}
.section-hd-tag{
  font-size:.6rem;letter-spacing:2px;text-transform:uppercase;
  padding:.15rem .6rem;border-radius:4px;font-family:var(--font-mono);
  background:var(--glass2);border:1px solid var(--border);color:var(--p);
}

/* ─── BUTTONS ─── */
.btn-primary{
  background:linear-gradient(135deg,var(--p2),var(--p3));
  border:none;border-radius:var(--r-sm);
  color:#fff;font-family:var(--font-display);
  font-weight:700;font-size:.82rem;letter-spacing:2px;text-transform:uppercase;
  padding:.75rem 2rem;cursor:pointer;
  box-shadow:0 0 24px rgba(99,102,241,0.4);
  transition:all .25s;
}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 0 40px rgba(99,102,241,0.55)}
.btn-primary:active{transform:translateY(0)}
.btn-primary-lg{padding:1rem 3rem;font-size:.9rem;border-radius:var(--r)}
.btn-ghost{
  background:var(--glass);border:1px solid var(--border);
  border-radius:var(--r-sm);color:var(--text2);
  font-family:var(--font-body);font-weight:600;font-size:.78rem;letter-spacing:1px;text-transform:uppercase;
  padding:.6rem 1.2rem;cursor:pointer;transition:all .2s;
}
.btn-ghost:hover{border-color:var(--border2);color:var(--p);box-shadow:var(--glow-sm)}
.btn-danger{border-color:rgba(248,113,113,0.4);color:var(--red)}
.btn-danger:hover{border-color:var(--red);background:rgba(248,113,113,0.08);box-shadow:0 0 12px rgba(248,113,113,0.25)}
.btn-success{border-color:rgba(52,211,153,0.4);color:var(--green)}
.btn-success:hover{border-color:var(--green);background:rgba(52,211,153,0.08)}

/* ─── PILLS / TABS ─── */
.pill-group{display:flex;gap:.35rem;flex-wrap:wrap}
.pill{
  background:var(--glass);border:1px solid var(--border);
  border-radius:20px;padding:.28rem .85rem;
  font-family:var(--font-mono);font-size:.65rem;letter-spacing:1px;text-transform:uppercase;
  cursor:pointer;color:var(--text2);transition:all .2s;
}
.pill:hover{border-color:var(--border2);color:var(--p)}
.pill.active-p{background:rgba(99,102,241,0.15);border-color:var(--p2);color:var(--p);box-shadow:var(--glow-sm)}
.pill.active-c{background:rgba(34,211,238,0.1);border-color:var(--cyan);color:var(--cyan)}
.pill.active-g{background:rgba(52,211,153,0.1);border-color:var(--green);color:var(--green)}
.pill.active-r{background:rgba(248,113,113,0.1);border-color:var(--red);color:var(--red)}
.pill.active-a{background:rgba(251,191,36,0.1);border-color:var(--amber);color:var(--amber)}

/* ─── STAT CARDS ─── */
.stat-row{display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:1.5rem}
.stat-card{
  flex:1;min-width:85px;
  background:var(--glass);border:1px solid var(--border);
  border-radius:var(--r);padding:1.1rem 1rem;text-align:center;
  transition:all .2s;
}
.stat-card:hover{border-color:var(--border2);box-shadow:var(--glow-sm)}
.stat-val{
  font-family:var(--font-display);font-weight:900;
  font-size:2rem;line-height:1;color:var(--p);
}
.stat-lbl{font-family:var(--font-mono);font-size:.58rem;letter-spacing:2px;text-transform:uppercase;color:var(--text3);margin-top:.35rem}

/* ─── TYPING AREA ─── */
.typing-wrap{
  background:var(--bg1);border:1px solid var(--border);
  border-radius:var(--r-lg);padding:2.25rem 2rem;
  position:relative;cursor:text;
  transition:border-color .3s,box-shadow .3s;
  min-height:130px;
}
.typing-wrap.focused{border-color:var(--border3);box-shadow:var(--glow-md)}
.typing-wrap.idle::after{
  content:'▸  Click here or start typing to begin the test';
  position:absolute;inset:0;
  display:flex;align-items:center;justify-content:center;
  font-family:var(--font-mono);font-size:.8rem;letter-spacing:2px;
  color:var(--text3);pointer-events:none;
}
.type-text{
  font-family:var(--font-mono);font-size:1.2rem;
  line-height:2.4;letter-spacing:.6px;word-break:break-word;
  position:relative;z-index:1;
}
.ch-pending{color:var(--text3)}
.ch-ok{color:var(--text)}
.ch-err{color:var(--red);background:rgba(248,113,113,0.12);border-radius:2px}
.ch-cur{color:var(--text3);position:relative}
.ch-cur::before{
  content:'';position:absolute;left:0;top:8%;bottom:8%;
  width:2px;border-radius:2px;
  background:var(--cyan);box-shadow:0 0 10px var(--cyan),0 0 4px var(--cyan);
  animation:blink 1.1s step-end infinite;
}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
.hidden-input{position:absolute;opacity:0;pointer-events:none;width:1px;height:1px;top:0;left:0}

/* ─── PROGRESS BAR ─── */
.prog-wrap{height:3px;background:var(--bg2);border-radius:3px;overflow:visible;margin-bottom:1.5rem;position:relative}
.prog-fill{
  height:100%;border-radius:3px;
  background:linear-gradient(90deg,var(--p3),var(--p),var(--cyan));
  transition:width .12s linear;position:relative;
}
.prog-dot{
  position:absolute;right:-5px;top:-4px;
  width:11px;height:11px;border-radius:50%;
  background:var(--cyan);box-shadow:0 0 12px var(--cyan),0 0 5px var(--cyan);
}

/* ─── HOME PAGE ─── */
.hero{text-align:center;padding:5rem 1rem 4rem;position:relative}
.hero-bg{
  position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(ellipse 70% 60% at 50% 50%,rgba(99,102,241,0.07) 0%,transparent 70%);
}
.hero-eyebrow{
  display:inline-flex;align-items:center;gap:.5rem;
  background:var(--glass2);border:1px solid var(--border2);
  border-radius:20px;padding:.3rem 1rem;margin-bottom:1.5rem;
  font-family:var(--font-mono);font-size:.65rem;letter-spacing:2px;color:var(--cyan);
}
.hero-title{
  font-family:var(--font-display);font-weight:900;
  font-size:clamp(3rem,8vw,6rem);line-height:.95;
  letter-spacing:-2px;margin-bottom:1.5rem;
}
.hero-title .line1{
  display:block;
  background:linear-gradient(120deg,#fff 0%,#c7d2fe 40%,var(--p) 70%,var(--cyan) 100%);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
}
.hero-title .line2{
  display:block;color:transparent;
  -webkit-text-stroke:1.5px rgba(99,102,241,0.4);
  animation:outline-pulse 3s ease-in-out infinite;
}
@keyframes outline-pulse{0%,100%{-webkit-text-stroke:1.5px rgba(99,102,241,0.35)}50%{-webkit-text-stroke:1.5px rgba(34,211,238,0.5)}}
.hero-sub{color:var(--text2);font-size:1.1rem;max-width:520px;margin:0 auto 2.5rem;line-height:1.7;font-weight:400}
.hero-cta-group{display:flex;gap:.85rem;justify-content:center;flex-wrap:wrap;margin-bottom:4rem}
.hero-stats{display:flex;gap:3rem;justify-content:center;flex-wrap:wrap;padding:2rem;border-top:1px solid var(--border);margin-top:2rem}
.hero-stat-val{
  font-family:var(--font-display);font-weight:900;font-size:2.4rem;
  background:linear-gradient(135deg,var(--p),var(--cyan));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
}
.hero-stat-lbl{font-family:var(--font-mono);font-size:.62rem;letter-spacing:2px;color:var(--text3);text-transform:uppercase;margin-top:.2rem}
.features{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:1rem;margin-top:3rem}
.feat-card{
  background:var(--glass);border:1px solid var(--border);border-radius:var(--r);
  padding:1.5rem;transition:all .3s;cursor:default;
}
.feat-card:hover{border-color:var(--p2);transform:translateY(-4px);box-shadow:var(--glow-md)}
.feat-icon{font-size:2rem;margin-bottom:.85rem}
.feat-title{font-family:var(--font-display);font-weight:700;font-size:.88rem;color:var(--p);margin-bottom:.4rem;letter-spacing:.5px}
.feat-desc{font-size:.8rem;color:var(--text3);line-height:1.6}

/* ─── TEST CONTROLS ─── */
.test-controls{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;margin-bottom:1.75rem}
.control-group{display:flex;gap:.35rem;flex-wrap:wrap;align-items:center}
.ctrl-label{font-family:var(--font-mono);font-size:.6rem;letter-spacing:2px;color:var(--text3);text-transform:uppercase;margin-right:.25rem}
.daily-banner{
  background:linear-gradient(135deg,rgba(99,102,241,0.12),rgba(34,211,238,0.08));
  border:1px solid var(--border2);border-radius:var(--r);
  padding:1.25rem 1.5rem;margin-bottom:1.75rem;
  display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;
}
.daily-tag{font-family:var(--font-mono);font-size:.6rem;letter-spacing:3px;color:var(--cyan);text-transform:uppercase;margin-bottom:.3rem}
.daily-title{font-family:var(--font-display);font-weight:700;font-size:1rem;margin-bottom:.5rem}
.daily-targets{display:flex;gap:1.25rem}
.daily-target{font-family:var(--font-mono);font-size:.7rem;color:var(--text3)}
.daily-target strong{color:var(--p)}

/* ─── RESULT OVERLAY ─── */
.result-overlay{
  position:fixed;inset:0;z-index:500;
  background:rgba(3,4,10,0.92);
  display:flex;align-items:center;justify-content:center;
  animation:fadeIn .35s cubic-bezier(.4,0,.2,1);
  padding:1rem;
}
@keyframes fadeIn{from{opacity:0;backdrop-filter:blur(0)}to{opacity:1;backdrop-filter:blur(10px)}}
.result-modal{
  background:linear-gradient(145deg,var(--bg1),var(--bg2));
  border:1px solid var(--border2);border-radius:24px;
  padding:2.5rem;max-width:620px;width:100%;
  box-shadow:0 0 80px rgba(99,102,241,0.25),0 40px 80px rgba(0,0,0,0.5);
  animation:modalIn .4s cubic-bezier(.34,1.56,.64,1);
}
@keyframes modalIn{from{opacity:0;transform:scale(.9) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}
.result-title{
  font-family:var(--font-display);font-weight:900;font-size:1.6rem;
  background:linear-gradient(135deg,#fff,var(--p),var(--cyan));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  margin-bottom:.3rem;
}
.result-sub{font-family:var(--font-mono);font-size:.65rem;letter-spacing:3px;color:var(--text3);text-transform:uppercase;margin-bottom:1.75rem}
.result-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:.85rem;margin-bottom:1.75rem}
.result-stat{
  background:var(--glass);border:1px solid var(--border);
  border-radius:var(--r);padding:1.25rem;text-align:center;
}
.result-stat-val{font-family:var(--font-display);font-weight:900;font-size:2.1rem;line-height:1;margin-bottom:.35rem}
.result-stat-lbl{font-family:var(--font-mono);font-size:.58rem;letter-spacing:2px;color:var(--text3);text-transform:uppercase}
.ai-panel{
  background:linear-gradient(135deg,rgba(99,102,241,0.08),rgba(167,139,250,0.06));
  border:1px solid rgba(167,139,250,0.25);
  border-radius:var(--r);padding:1.25rem 1.5rem;margin-bottom:1.5rem;
}
.ai-header{display:flex;align-items:center;gap:.6rem;margin-bottom:.6rem}
.ai-dot{width:8px;height:8px;border-radius:50%;animation:pulse 2s ease-in-out infinite}
@keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.4);opacity:.7}}
.ai-tag-lbl{font-family:var(--font-mono);font-size:.62rem;letter-spacing:2px;text-transform:uppercase}
.ai-msg{font-size:.82rem;color:var(--text2);line-height:1.65}
.result-actions{display:flex;gap:.75rem;justify-content:center;flex-wrap:wrap}

/* ─── LEADERBOARD ─── */
.lb-wrap{overflow-x:auto}
.lb-table{width:100%;border-collapse:collapse}
.lb-table th{
  font-family:var(--font-mono);font-size:.6rem;letter-spacing:2px;
  text-transform:uppercase;color:var(--text3);
  padding:.75rem 1.1rem;text-align:left;
  border-bottom:1px solid var(--border);
}
.lb-table td{padding:.9rem 1.1rem;border-bottom:1px solid rgba(99,102,241,0.07);transition:background .15s}
.lb-table tr:hover td{background:var(--glass2)}
.lb-rank{font-family:var(--font-display);font-weight:800;font-size:.9rem}
.lb-name-cell{display:flex;align-items:center;gap:.6rem}
.lb-flag{font-size:1rem}
.lb-name{font-weight:600;font-size:.88rem}
.lb-wpm{font-family:var(--font-display);font-weight:800;font-size:1.05rem;color:var(--p)}
.lb-acc{color:var(--green);font-size:.85rem}
.lb-tests{color:var(--text3);font-family:var(--font-mono);font-size:.75rem}
.lb-badge{
  font-family:var(--font-mono);font-size:.58rem;letter-spacing:1.5px;text-transform:uppercase;
  padding:.15rem .55rem;border-radius:4px;font-weight:600;
}
.badge-LEGEND{background:rgba(251,191,36,0.15);border:1px solid rgba(251,191,36,0.4);color:var(--amber)}
.badge-ELITE{background:rgba(167,139,250,0.15);border:1px solid rgba(167,139,250,0.4);color:var(--violet)}
.badge-PRO{background:rgba(99,102,241,0.15);border:1px solid var(--border2);color:var(--p)}
.badge-ADV{background:var(--glass);border:1px solid var(--border);color:var(--text3)}
.my-rank-bar{
  margin-top:1.25rem;background:rgba(99,102,241,0.06);
  border:1px dashed var(--border2);border-radius:var(--r);
  padding:1.1rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;
}

/* ─── ANALYTICS ─── */
.analytics-kpi{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:1rem;margin-bottom:1.75rem}
.kpi-card{
  background:var(--glass);border:1px solid var(--border);
  border-radius:var(--r);padding:1.25rem;
  display:flex;flex-direction:column;gap:.4rem;
}
.kpi-val{font-family:var(--font-display);font-weight:900;font-size:2rem;line-height:1}
.kpi-lbl{font-family:var(--font-mono);font-size:.58rem;letter-spacing:2px;color:var(--text3);text-transform:uppercase}
.kpi-trend{font-family:var(--font-mono);font-size:.65rem}
.trend-up{color:var(--green)}
.trend-dn{color:var(--red)}
.analytics-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1.25rem}
.chart-title{font-family:var(--font-mono);font-size:.68rem;letter-spacing:2px;text-transform:uppercase;color:var(--p);margin-bottom:1rem}

/* Sparkline */
.spark{display:flex;align-items:flex-end;gap:3px;height:56px;padding:0 2px}
.spark-bar{
  flex:1;border-radius:3px 3px 0 0;
  background:linear-gradient(to top,var(--p3),var(--p));
  min-height:4px;transition:height .3s;opacity:.8;
  position:relative;
}
.spark-bar:hover{opacity:1;background:linear-gradient(to top,var(--p),var(--cyan))}
.spark-bar::after{
  content:attr(data-val);
  position:absolute;bottom:105%;left:50%;transform:translateX(-50%);
  font-family:var(--font-mono);font-size:.55rem;color:var(--p);
  opacity:0;pointer-events:none;white-space:nowrap;
}
.spark-bar:hover::after{opacity:1}

/* Bar chart */
.bar-chart{}
.bar-row{display:flex;align-items:center;gap:.75rem;margin-bottom:.55rem}
.bar-label{font-family:var(--font-mono);font-size:.65rem;color:var(--text2);width:38px;text-align:right;flex-shrink:0}
.bar-track{flex:1;height:8px;background:var(--bg2);border-radius:4px;overflow:hidden}
.bar-fill{height:100%;border-radius:4px;background:linear-gradient(90deg,var(--p2),var(--cyan));transition:width .5s ease}
.bar-val{font-family:var(--font-mono);font-size:.65rem;color:var(--text3);width:30px;flex-shrink:0}

/* Keyboard heatmap */
.kb-wrap{display:flex;flex-direction:column;align-items:center;gap:5px;padding:.5rem 0}
.kb-row{display:flex;gap:5px}
.kb-key{
  width:36px;height:36px;border-radius:6px;
  display:flex;align-items:center;justify-content:center;
  font-family:var(--font-mono);font-size:.62rem;font-weight:500;text-transform:uppercase;
  border:1px solid var(--border);transition:all .3s;cursor:default;
}
.kb-legend{display:flex;gap:1.25rem;justify-content:center;margin-top:.75rem;flex-wrap:wrap}
.kb-legend-item{display:flex;align-items:center;gap:.4rem;font-family:var(--font-mono);font-size:.6rem;color:var(--text3)}
.kb-legend-swatch{width:10px;height:10px;border-radius:2px}

/* ─── MULTIPLAYER ─── */
.room-code-box{
  font-family:var(--font-display);font-weight:900;
  font-size:2rem;letter-spacing:.5rem;text-align:center;padding:1.5rem;
  background:linear-gradient(135deg,var(--p),var(--cyan));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  border:1px dashed var(--border2);border-radius:var(--r);margin:1rem 0;
}
.racer-lane{display:flex;align-items:center;gap:1rem;margin-bottom:.85rem;flex-wrap:nowrap}
.racer-name-col{width:110px;flex-shrink:0}
.racer-name-txt{font-weight:600;font-size:.82rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.racer-wpm-txt{font-family:var(--font-mono);font-size:.65rem;color:var(--text3)}
.racer-track-wrap{flex:1;height:12px;background:var(--bg2);border-radius:6px;overflow:visible;position:relative}
.racer-track-fill{height:100%;border-radius:6px;transition:width .4s ease;position:relative;min-width:2px}
.racer-emoji{position:absolute;right:-14px;top:-6px;font-size:1.4rem;transition:right .4s ease;filter:drop-shadow(0 0 6px currentColor)}
.racer-pct{font-family:var(--font-mono);font-size:.68rem;color:var(--text3);width:36px;text-align:right;flex-shrink:0}
.mp-mode-cards{display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;max-width:680px;margin:0 auto}
.mp-mode-card{
  background:var(--glass);border:1px solid var(--border);
  border-radius:var(--r-lg);padding:2rem;text-align:center;
  cursor:pointer;transition:all .3s;
}
.mp-mode-card:hover{border-color:var(--border2);transform:translateY(-4px);box-shadow:var(--glow-md)}
.mp-mode-icon{font-size:2.8rem;margin-bottom:1rem}
.mp-mode-title{font-family:var(--font-display);font-weight:800;font-size:1rem;color:var(--p);margin-bottom:.4rem}
.mp-mode-desc{font-size:.78rem;color:var(--text3);line-height:1.5}

/* ─── PROFILE ─── */
.profile-hero{
  background:linear-gradient(135deg,rgba(99,102,241,0.1),rgba(34,211,238,0.05));
  border:1px solid var(--border);border-radius:var(--r-lg);
  padding:2rem;margin-bottom:1.5rem;
  display:flex;align-items:center;gap:2rem;flex-wrap:wrap;
}
.profile-avatar-lg{
  width:90px;height:90px;border-radius:50%;flex-shrink:0;
  background:linear-gradient(135deg,var(--p2),var(--violet),var(--cyan));
  display:flex;align-items:center;justify-content:center;
  font-size:2.5rem;border:3px solid var(--border2);
  box-shadow:0 0 40px rgba(99,102,241,0.35);
}
.profile-username{font-family:var(--font-display);font-weight:900;font-size:1.6rem;margin-bottom:.25rem}
.profile-sub{font-family:var(--font-mono);font-size:.68rem;letter-spacing:2px;color:var(--text3);text-transform:uppercase;margin-bottom:.75rem}
.tag{
  display:inline-flex;align-items:center;gap:.3rem;
  padding:.18rem .65rem;border-radius:20px;
  font-family:var(--font-mono);font-size:.62rem;letter-spacing:1px;text-transform:uppercase;font-weight:600;
  background:var(--glass2);border:1px solid var(--border);color:var(--p);margin-right:.4rem;margin-bottom:.3rem;
}
.achievements-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(155px,1fr));gap:.85rem}
.ach-card{
  background:var(--glass);border:1px solid var(--border);
  border-radius:var(--r);padding:1.1rem;text-align:center;
  transition:all .3s;
}
.ach-card.earned{border-color:var(--p2);background:rgba(99,102,241,0.07);box-shadow:var(--glow-sm)}
.ach-card:not(.earned){opacity:.35;filter:saturate(0)}
.ach-icon{font-size:1.9rem;margin-bottom:.5rem}
.ach-label{font-weight:700;font-size:.78rem;margin-bottom:.2rem}
.ach-desc{font-family:var(--font-mono);font-size:.6rem;color:var(--text3)}
.ach-xp{font-family:var(--font-mono);font-size:.6rem;color:var(--cyan);margin-top:.3rem}

/* ─── SETTINGS ─── */
.settings-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem}
.settings-section-title{font-family:var(--font-mono);font-size:.65rem;letter-spacing:2px;color:var(--p);text-transform:uppercase;margin-bottom:1rem}
.setting-row{display:flex;align-items:center;justify-content:space-between;padding:.9rem 0;border-bottom:1px solid rgba(99,102,241,0.07)}
.setting-row:last-child{border-bottom:none}
.setting-label{font-weight:600;font-size:.85rem;margin-bottom:.1rem}
.setting-desc{font-size:.7rem;color:var(--text3);font-family:var(--font-mono)}
.toggle-sw{
  width:46px;height:26px;border-radius:13px;
  background:var(--bg2);border:1px solid var(--border);
  cursor:pointer;position:relative;transition:all .3s;flex-shrink:0;
}
.toggle-sw.on{background:var(--p2);border-color:var(--p2);box-shadow:var(--glow-sm)}
.toggle-sw::after{
  content:'';position:absolute;
  width:20px;height:20px;border-radius:50%;
  background:#fff;top:2px;left:2px;
  transition:transform .3s cubic-bezier(.34,1.56,.64,1);
  box-shadow:0 1px 4px rgba(0,0,0,0.3);
}
.toggle-sw.on::after{transform:translateX(20px)}

/* ─── AUTH MODAL ─── */
.auth-overlay{
  position:fixed;inset:0;z-index:600;
  background:rgba(3,4,10,0.9);backdrop-filter:blur(10px);
  display:flex;align-items:center;justify-content:center;padding:1rem;
  animation:fadeIn .2s ease;
}
.auth-modal{
  background:var(--bg1);border:1px solid var(--border2);border-radius:24px;
  padding:2.5rem;max-width:420px;width:100%;
  box-shadow:0 0 80px rgba(99,102,241,0.2);
  animation:modalIn .3s cubic-bezier(.34,1.56,.64,1);
}
.auth-title{font-family:var(--font-display);font-weight:900;font-size:1.5rem;margin-bottom:.4rem}
.auth-sub{font-size:.8rem;color:var(--text3);margin-bottom:1.75rem;font-family:var(--font-mono)}
.form-group{margin-bottom:1rem}
.form-label{font-family:var(--font-mono);font-size:.65rem;letter-spacing:1.5px;color:var(--text2);text-transform:uppercase;margin-bottom:.4rem;display:block}
.form-input{
  width:100%;background:var(--bg2);border:1px solid var(--border);
  border-radius:var(--r-sm);padding:.7rem 1rem;
  color:var(--text);font-family:var(--font-mono);font-size:.85rem;
  outline:none;transition:border-color .2s,box-shadow .2s;
}
.form-input:focus{border-color:var(--border3);box-shadow:var(--glow-sm)}
.form-input::placeholder{color:var(--text3)}
.auth-toggle{font-size:.78rem;color:var(--text3);text-align:center;margin-top:1rem;cursor:pointer}
.auth-toggle span{color:var(--p);text-decoration:underline}

/* ─── TOAST ─── */
.toast-wrap{position:fixed;bottom:1.75rem;right:1.75rem;z-index:700;display:flex;flex-direction:column;gap:.5rem}
.toast{
  background:var(--bg1);border:1px solid var(--border2);
  border-radius:var(--r);padding:.85rem 1.4rem;
  font-size:.82rem;color:var(--text);min-width:220px;
  box-shadow:var(--glow-md);
  animation:toastIn .3s ease,toastOut .3s ease 2.7s forwards;
}
@keyframes toastIn{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
@keyframes toastOut{to{opacity:0;transform:translateX(30px)}}
.toast-success{border-color:rgba(52,211,153,0.5);box-shadow:0 0 20px rgba(52,211,153,0.15)}
.toast-error{border-color:rgba(248,113,113,0.5)}

/* ─── RESPONSIVE ─── */
@media(max-width:900px){
  .nav-center{display:none}
  .analytics-grid{grid-template-columns:1fr}
  .settings-grid{grid-template-columns:1fr}
  .result-grid{grid-template-columns:repeat(2,1fr)}
  .mp-mode-cards{grid-template-columns:1fr}
}
@media(max-width:600px){
  .page-content{padding:1.25rem 1rem}
  .hero{padding:3rem .5rem 2.5rem}
  .hero-stats{gap:1.5rem}
  .type-text{font-size:1rem}
  .result-modal{padding:1.75rem}
  .profile-hero{flex-direction:column;text-align:center}
  .stat-val{font-size:1.6rem}
}
`;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONTEXT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const AppCtx = createContext({});
const useApp = () => useContext(AppCtx);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// REUSABLE COMPONENTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function SectionHeader({ title, tag, action }) {
  return (
    <div className="section-hd">
      <div className="section-hd-title">{title}</div>
      {tag && <div className="section-hd-tag">{tag}</div>}
      <div className="section-hd-line" />
      {action}
    </div>
  );
}

function StatCard({ val, label, color, size = "2rem" }) {
  return (
    <div className="stat-card">
      <div className="stat-val" style={{ color, fontSize: size }}>{val}</div>
      <div className="stat-lbl">{label}</div>
    </div>
  );
}

function Sparkline({ data, color = "var(--p)" }) {
  const max = Math.max(...data, 1);
  return (
    <div className="spark">
      {data.map((v, i) => (
        <div key={i} className="spark-bar" data-val={v}
          style={{ height: `${(v / max) * 100}%`, background: `linear-gradient(to top, var(--p3), ${color})` }} />
      ))}
    </div>
  );
}

function BarChart({ data, title, color = "var(--p2)" }) {
  const max = Math.max(...data.map(d => d.val), 1);
  return (
    <div>
      {title && <div className="chart-title">{title}</div>}
      <div className="bar-chart">
        {data.map((d, i) => (
          <div key={i} className="bar-row">
            <div className="bar-label">{d.label}</div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${(d.val / max) * 100}%`, background: `linear-gradient(90deg,${color},var(--cyan))` }} />
            </div>
            <div className="bar-val">{d.val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KeyboardHeatmap({ freq = {} }) {
  const max = Math.max(...Object.values(freq), 1);
  const getStyle = (key) => {
    const f = freq[key] || 0;
    const p = f / max;
    if (p > 0.75) return { background: `rgba(248,113,113,${0.4 + p * 0.4})`, borderColor: "transparent", color: "#fff" };
    if (p > 0.5)  return { background: `rgba(251,191,36,${0.35 + p * 0.35})`, borderColor: "transparent", color: "#1e293b" };
    if (p > 0.2)  return { background: `rgba(99,102,241,${0.2 + p * 0.5})`, borderColor: "transparent", color: "var(--text)" };
    return {};
  };
  return (
    <div>
      <div className="kb-wrap">
        {KEY_ROWS.map((row, ri) => (
          <div key={ri} className="kb-row">
            {row.map(k => (
              <div key={k} className="kb-key" style={getStyle(k)} title={`${k}: ${freq[k] || 0} presses`}>{k}</div>
            ))}
          </div>
        ))}
      </div>
      <div className="kb-legend">
        {[["var(--text3)","Unused"],["rgba(99,102,241,0.5)","Low"],["rgba(251,191,36,0.6)","Medium"],["rgba(248,113,113,0.7)","High"]].map(([c, l]) => (
          <div key={l} className="kb-legend-item">
            <div className="kb-legend-swatch" style={{ background: c }} />
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}

function Toggle({ on, onToggle }) {
  return <div className={`toggle-sw ${on ? "on" : ""}`} onClick={onToggle} role="switch" aria-checked={on} />;
}

function Pill({ label, active, variant = "p", onClick }) {
  return (
    <button className={`pill ${active ? `active-${variant}` : ""}`} onClick={onClick}>{label}</button>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AUTH MODAL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function AuthModal({ onClose, onLogin, reason }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handle = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = () => {
    if (!form.username.trim() || !form.password.trim()) {
      setError("Please fill in both fields.");
      return;
    }
    onLogin({ username: form.username.trim() });
    onClose();
  };

  const handleKey = (e) => { if (e.key === "Enter") submit(); };

  return (
    <div className="auth-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="auth-modal">
        {/* Guest note at top */}
        <div style={{
          background: "rgba(34,211,238,0.07)", border: "1px solid rgba(34,211,238,0.2)",
          borderRadius: "var(--r-sm)", padding: ".6rem 1rem", marginBottom: "1.5rem",
          fontFamily: "var(--font-mono)", fontSize: ".68rem", color: "var(--cyan)",
          display: "flex", alignItems: "center", gap: ".5rem",
        }}>
          <span>👤</span>
          {reason === "save"
            ? "Sign in to save your results & track progress"
            : "Sign in to unlock leaderboard & achievements"}
        </div>

        <div className="auth-title">Welcome Back</div>
        <div className="auth-sub">// sign in to your neural interface</div>

        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            className="form-input" placeholder="CyberTypist"
            value={form.username} onChange={handle("username")} onKeyDown={handleKey}
            autoFocus
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input" type="password" placeholder="••••••••"
            value={form.password} onChange={handle("password")} onKeyDown={handleKey}
          />
        </div>

        {error && (
          <div style={{ color: "var(--red)", fontFamily: "var(--font-mono)", fontSize: ".7rem", marginBottom: ".75rem" }}>
            ⚠ {error}
          </div>
        )}

        <button className="btn-primary" style={{ width: "100%", textAlign: "center", marginBottom: ".85rem" }} onClick={submit}>
          SIGN IN
        </button>

        {/* Continue as guest option */}
        <button onClick={onClose} style={{
          width: "100%", background: "none", border: "1px solid var(--border)",
          borderRadius: "var(--r-sm)", padding: ".6rem", cursor: "pointer",
          fontFamily: "var(--font-mono)", fontSize: ".72rem", color: "var(--text3)",
          letterSpacing: "1px", textTransform: "uppercase", transition: "all .2s",
        }}
          onMouseOver={e => e.currentTarget.style.borderColor = "var(--border2)"}
          onMouseOut={e => e.currentTarget.style.borderColor = "var(--border)"}
        >
          Continue as Guest
        </button>

        <div style={{ fontFamily: "var(--font-mono)", fontSize: ".62rem", color: "var(--text3)", textAlign: "center", marginTop: ".85rem", lineHeight: 1.6 }}>
          No account? Contact your administrator.
        </div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RESULT MODAL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function ResultModal({ result, difficulty, timerMode, isDaily, isLoggedIn, onRetry, onClose, onSignIn }) {
  const fb = getAIFeedback(result.wpm, result.accuracy);
  const passed = isDaily && result.wpm >= 60 && result.accuracy >= 95;

  return (
    <div className="result-overlay">
      <div className="result-modal">
        <div className="result-title">TEST COMPLETE</div>
        <div className="result-sub">{isDaily ? "Daily Challenge" : `${difficulty} · ${timerMode}s`} · {new Date().toLocaleDateString()}</div>

        <div className="result-grid">
          <div className="result-stat">
            <div className="result-stat-val" style={{ color: "var(--p)" }}>{result.wpm}</div>
            <div className="result-stat-lbl">WPM</div>
          </div>
          <div className="result-stat">
            <div className="result-stat-val" style={{ color: "var(--cyan)" }}>{result.cpm}</div>
            <div className="result-stat-lbl">CPM</div>
          </div>
          <div className="result-stat">
            <div className="result-stat-val" style={{ color: "var(--green)" }}>{result.accuracy}%</div>
            <div className="result-stat-lbl">Accuracy</div>
          </div>
          <div className="result-stat">
            <div className="result-stat-val" style={{ color: "var(--red)" }}>{result.errors}</div>
            <div className="result-stat-lbl">Errors</div>
          </div>
          <div className="result-stat">
            <div className="result-stat-val" style={{ color: "var(--amber)" }}>{Math.round(result.elapsed)}s</div>
            <div className="result-stat-lbl">Time</div>
          </div>
          <div className="result-stat">
            <div className="result-stat-val" style={{ fontSize: "1.1rem", color: "var(--text2)", paddingTop: ".4rem" }}>
              #{Math.floor(Math.random() * 800) + 200}
            </div>
            <div className="result-stat-lbl">Global Rank</div>
          </div>
        </div>

        {fb && (
          <div className="ai-panel">
            <div className="ai-header">
              <div className="ai-dot" style={{ background: fb.color, boxShadow: `0 0 8px ${fb.color}` }} />
              <div className="ai-tag-lbl" style={{ color: fb.color }}>AI Coach · {fb.tag}</div>
            </div>
            <div className="ai-msg">{fb.msg}</div>
          </div>
        )}

        {passed && (
          <div style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.35)", borderRadius: "var(--r)", padding: ".9rem 1.25rem", marginBottom: "1.25rem", fontSize: ".82rem", color: "var(--green)" }}>
            🏅 Daily Challenge Complete! +50 XP · Badge unlocked: Daily Grinder
          </div>
        )}

        {/* Guest save nudge */}
        {!isLoggedIn && (
          <div style={{
            background:"rgba(99,102,241,0.07)",border:"1px dashed var(--border2)",
            borderRadius:"var(--r)",padding:".85rem 1.1rem",marginBottom:"1.25rem",
            display:"flex",alignItems:"center",justifyContent:"space-between",gap:"1rem",flexWrap:"wrap",
          }}>
            <div>
              <div style={{fontFamily:"var(--font-mono)",fontSize:".62rem",color:"var(--p)",letterSpacing:"2px",marginBottom:".2rem"}}>GUEST SESSION</div>
              <div style={{fontSize:".78rem",color:"var(--text2)"}}>Sign in to save results & track your progress over time</div>
            </div>
            <button className="btn-ghost" style={{borderColor:"var(--p2)",color:"var(--p)",flexShrink:0}} onClick={onSignIn}>
              Sign In
            </button>
          </div>
        )}

        <div className="result-actions">
          <button className="btn-primary" onClick={onRetry}>TRY AGAIN</button>
          <button className="btn-ghost" onClick={onClose}>CLOSE</button>
        </div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PAGE: HOME
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function HomePage({ setPage }) {
  return (
    <div>
      <div className="hero">
        <div className="hero-bg" />
        <div className="hero-eyebrow">
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--cyan)", boxShadow: "0 0 8px var(--cyan)", display: "inline-block" }} />
          Next-Generation Typing Platform
        </div>
        <h1 className="hero-title">
          <span className="line1">NEURAL</span>
          <span className="line2">TYPE</span>
        </h1>
        <p className="hero-sub">
          Where speed meets precision. Train your fingers, track your progress, compete globally — all in one cyberpunk-grade interface.
        </p>
        <div className="hero-cta-group">
          <button className="btn-primary btn-primary-lg" onClick={() => setPage("test")}>START TYPING</button>
          <button className="btn-ghost" style={{ padding: "1rem 2rem" }} onClick={() => setPage("leaderboard")}>VIEW LEADERBOARD</button>
        </div>
        <div className="hero-stats">
          {[["3.2M+","Tests Completed"],["212","Top WPM Record"],["99.4%","Peak Accuracy"],["85K+","Active Users"]].map(([v, l]) => (
            <div key={l}>
              <div className="hero-stat-val">{v}</div>
              <div className="hero-stat-lbl">{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="features">
        {[
          ["⚡","Real-Time Analytics","WPM, CPM, accuracy and errors tracked live as you type with zero latency."],
          ["🧠","AI Typing Coach","Neural pattern analysis gives personalized feedback after every test."],
          ["🌐","Multiplayer Racing","Battle up to 8 players worldwide in real-time typing races."],
          ["🏆","Global Leaderboard","Compete for top rankings across daily, weekly, and all-time charts."],
          ["📊","Analytics Dashboard","Deep-dive charts and trends showing your evolution over time."],
          ["⌨️","Keyboard Heatmap","Visual heat overlay showing your most and least-used keys."],
          ["📅","Daily Challenges","Fresh text each day with XP rewards and exclusive badges."],
          ["🔥","Achievement System","Unlock 12+ achievements and badges as you level up your skills."],
        ].map(([icon, title, desc]) => (
          <div key={title} className="feat-card">
            <div className="feat-icon">{icon}</div>
            <div className="feat-title">{title}</div>
            <div className="feat-desc">{desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PAGE: TYPING TEST
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function TestPage({ onResult, user, onSignIn }) {
  const [timerMode, setTimerMode] = useState(60);
  const [difficulty, setDifficulty] = useState("medium");
  const [mode, setMode] = useState("words");  // words | quote | zen
  const [textObj, setTextObj] = useState(() => randomText("words", "medium"));
  const [typed, setTyped] = useState("");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTs, setStartTs] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [wpm, setWpm] = useState(0);
  const [cpm, setCpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [keyFreq, setKeyFreq] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [isDaily, setIsDaily] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const resultRef = useRef(null);

  const text = textObj.text;

  const computeStats = useCallback((val, secs) => {
    const mins = Math.max(secs / 60, 0.001);
    const wordCount = val.trim().split(/\s+/).filter(Boolean).length;
    let errs = 0;
    for (let i = 0; i < val.length; i++) if (val[i] !== text[i]) errs++;
    const acc = val.length > 0 ? Math.round(((val.length - errs) / val.length) * 100) : 100;
    setWpm(Math.round(wordCount / mins));
    setCpm(Math.round(val.length / mins));
    setErrors(errs);
    setAccuracy(acc);
    return { wpm: Math.round(wordCount / mins), cpm: Math.round(val.length / mins), accuracy: acc, errors: errs };
  }, [text]);

  const doReset = useCallback((t = timerMode, d = difficulty, m = mode, daily = false) => {
    clearInterval(timerRef.current);
    const obj = daily
      ? { text: "The neon city breathes electric. Rain traces rivulets down glass towers as synths pulse beneath the surface. In 2089, every keystroke is a declaration.", meta: "Daily Challenge" }
      : randomText(m, d);
    setTextObj(obj);
    setTyped(""); setStarted(false); setFinished(false); setStartTs(null);
    setElapsed(0); setTimeLeft(t); setWpm(0); setCpm(0); setAccuracy(100); setErrors(0);
    setKeyFreq({}); setShowResult(false); setIsDaily(daily);
    setTimeout(() => inputRef.current?.focus(), 60);
  }, [timerMode, difficulty, mode]);

  useEffect(() => { doReset(); }, []);

  useEffect(() => {
    if (!started || finished) return;
    timerRef.current = setInterval(() => {
      const s = (Date.now() - startTs) / 1000;
      setElapsed(s);
      computeStats(typed, s);
      if (mode !== "zen") {
        const left = Math.max(0, timerMode - s);
        setTimeLeft(Math.ceil(left));
        if (left <= 0) {
          clearInterval(timerRef.current);
          setFinished(true);
          const stats = computeStats(typed, s);
          resultRef.current = { ...stats, elapsed: s, keyFreq };
          setShowResult(true);
        }
      }
    }, 150);
    return () => clearInterval(timerRef.current);
  }, [started, finished, startTs, typed, computeStats, timerMode, mode, keyFreq]);

  const handleType = useCallback((e) => {
    const val = e.target.value;
    if (val.length > text.length) return;
    if (!started && val.length === 1) { setStarted(true); setStartTs(Date.now()); }
    setTyped(val);
    const lastCh = val[val.length - 1];
    if (lastCh) setKeyFreq(prev => ({ ...prev, [lastCh.toLowerCase()]: (prev[lastCh.toLowerCase()] || 0) + 1 }));
    if (val === text) {
      clearInterval(timerRef.current);
      setFinished(true);
      const s = (Date.now() - startTs) / 1000;
      setElapsed(s);
      const stats = computeStats(val, s);
      resultRef.current = { ...stats, elapsed: s, keyFreq };
      setShowResult(true);
    }
  }, [text, started, startTs, computeStats, keyFreq]);

  const handleKey = useCallback((e) => {
    if (e.key === "Escape") doReset();
    if (e.key === "Tab") { e.preventDefault(); doReset(); }
  }, [doReset]);

  const progress = (typed.length / text.length) * 100;

  const renderText = useMemo(() => text.split("").map((ch, i) => {
    let cls = "ch-pending";
    if (i < typed.length) cls = typed[i] === ch ? "ch-ok" : "ch-err";
    else if (i === typed.length) cls = "ch-cur";
    return <span key={i} className={cls}>{ch}</span>;
  }), [text, typed]);

  const DIFF_COLORS = { easy: "g", medium: "a", hard: "r" };

  return (
    <div>
      {/* Daily Banner */}
      <div className="daily-banner">
        <div>
          <div className="daily-tag">📅 Daily Challenge · Day {new Date().getDate()}</div>
          <div className="daily-title">Cyberpunk Prose · Special XP Bonus</div>
          <div className="daily-targets">
            <div className="daily-target">Target: <strong>60 WPM</strong></div>
            <div className="daily-target">Accuracy: <strong>95%</strong></div>
            <div className="daily-target">Reward: <strong>+50 XP + Badge</strong></div>
          </div>
        </div>
        <button className="btn-ghost btn-success" onClick={() => doReset(timerMode, difficulty, mode, true)}>
          Accept Challenge
        </button>
      </div>

      {/* Controls */}
      <div className="test-controls">
        <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap", alignItems: "center" }}>
          <div className="control-group">
            <span className="ctrl-label">Mode</span>
            {["words", "quote", "zen"].map(m => (
              <Pill key={m} label={m} active={mode === m} variant="c" onClick={() => { setMode(m); doReset(timerMode, difficulty, m); }} />
            ))}
          </div>
          <div className="control-group">
            <span className="ctrl-label">Time</span>
            {[15, 30, 60].map(t => (
              <Pill key={t} label={`${t}s`} active={timerMode === t} variant="p" onClick={() => { setTimerMode(t); doReset(t, difficulty, mode); }} />
            ))}
          </div>
          {mode === "words" && (
            <div className="control-group">
              <span className="ctrl-label">Diff</span>
              {["easy", "medium", "hard"].map(d => (
                <Pill key={d} label={d} active={difficulty === d} variant={DIFF_COLORS[d]} onClick={() => { setDifficulty(d); doReset(timerMode, d, mode); }} />
              ))}
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: ".5rem" }}>
          <button className="btn-ghost" onClick={() => doReset()}>↺ Restart</button>
          <button className="btn-ghost" onClick={() => doReset(timerMode, difficulty, mode)}>New Text</button>
        </div>
      </div>

      {/* Live Stats */}
      <div className="stat-row">
        <StatCard val={started && !finished ? timeLeft : (mode === "zen" ? "∞" : timerMode)} label={mode === "zen" ? "Zen Mode" : "Seconds Left"} color="var(--cyan)" />
        <StatCard val={wpm} label="WPM" color="var(--p)" />
        <StatCard val={cpm} label="CPM" color="var(--amber)" />
        <StatCard val={`${accuracy}%`} label="Accuracy" color="var(--green)" />
        <StatCard val={errors} label="Errors" color={errors > 0 ? "var(--red)" : "var(--text3)"} />
        <StatCard val={`${Math.round(progress)}%`} label="Progress" color="var(--violet)" />
      </div>

      {/* Progress */}
      <div className="prog-wrap">
        <div className="prog-fill" style={{ width: `${progress}%` }}>
          {progress > 2 && <div className="prog-dot" />}
        </div>
      </div>

      {/* Text Box */}
      <div
        className={`typing-wrap ${focused ? "focused" : ""} ${!started ? "idle" : ""}`}
        onClick={() => inputRef.current?.focus()}
      >
        <div className="type-text">{renderText}</div>
        {textObj.meta && (
          <div style={{ fontFamily: "var(--font-mono)", fontSize: ".7rem", color: "var(--text3)", marginTop: ".75rem", textAlign: "right" }}>
            {textObj.meta}
          </div>
        )}
        <input
          ref={inputRef}
          className="hidden-input"
          value={typed}
          onChange={handleType}
          onKeyDown={handleKey}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={finished}
          autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
          aria-label="Typing input area"
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: ".75rem" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: ".65rem", color: "var(--text3)" }}>
          {typed.length} / {text.length} chars &nbsp;·&nbsp; Tab or Esc to restart
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: ".65rem", color: "var(--text3)" }}>
          {isDaily && <span style={{ color: "var(--cyan)" }}>📅 Daily Challenge Active</span>}
        </div>
      </div>

      {/* Result Modal */}
      {showResult && resultRef.current && (
        <ResultModal
          result={resultRef.current}
          difficulty={difficulty}
          timerMode={timerMode}
          isDaily={isDaily}
          isLoggedIn={!!user}
          onRetry={() => { setShowResult(false); doReset(); onResult(resultRef.current); }}
          onClose={() => { setShowResult(false); onResult(resultRef.current); }}
          onSignIn={() => { setShowResult(false); onSignIn("save"); }}
        />
      )}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PAGE: MULTIPLAYER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const RACER_EMOJIS = ["🏎", "🚀", "⚡", "🛸"];
const RACER_COLORS = ["var(--p)", "var(--cyan)", "var(--green)", "var(--amber)"];
const RACE_TEXT = "Neural signals fire across synaptic gaps at lightning speed. In this digital arena your keystrokes are your weapons and precision is your shield.";

function MultiplayerPage() {
  const [screen, setScreen] = useState("lobby");
  const [phase, setPhase] = useState("waiting");
  const [countdown, setCountdown] = useState(3);
  const [roomCode] = useState("NEON-" + Math.random().toString(36).slice(2, 6).toUpperCase());
  const [typed, setTyped] = useState("");
  const [racers, setRacers] = useState([
    { id: 0, name: "You", progress: 0, wpm: 0, color: RACER_COLORS[0], emoji: RACER_EMOJIS[0], isYou: true, finished: false },
    { id: 1, name: "QuantumKeys", progress: 0, wpm: 0, color: RACER_COLORS[1], emoji: RACER_EMOJIS[1], speed: 0.022 },
    { id: 2, name: "NeonFlash", progress: 0, wpm: 0, color: RACER_COLORS[2], emoji: RACER_EMOJIS[2], speed: 0.018 },
    { id: 3, name: "CipherStorm", progress: 0, wpm: 0, color: RACER_COLORS[3], emoji: RACER_EMOJIS[3], speed: 0.015 },
  ]);
  const inputRef = useRef(null);
  const botRef = useRef(null);
  const startTsRef = useRef(null);

  const startRace = () => {
    setTyped("");
    setRacers(r => r.map(x => ({ ...x, progress: 0, wpm: 0, finished: false })));
    setCountdown(3); setPhase("countdown");
    let c = 3;
    const cd = setInterval(() => {
      c--;
      setCountdown(c);
      if (c <= 0) {
        clearInterval(cd);
        setPhase("racing");
        startTsRef.current = Date.now();
        setTimeout(() => inputRef.current?.focus(), 50);
        botRef.current = setInterval(() => {
          setRacers(prev => prev.map(r => {
            if (r.isYou || r.finished) return r;
            const rand = 0.8 + Math.random() * 0.4;
            const np = Math.min(100, r.progress + r.speed * 100 * rand);
            return { ...r, progress: np, wpm: Math.round(np * 1.6), finished: np >= 100 };
          }));
        }, 200);
      }
    }, 1000);
  };

  useEffect(() => () => clearInterval(botRef.current), []);

  const handleInput = (e) => {
    const val = e.target.value;
    if (val.length > RACE_TEXT.length) return;
    setTyped(val);
    const prog = (val.length / RACE_TEXT.length) * 100;
    const secs = Math.max((Date.now() - startTsRef.current) / 1000, 0.1);
    const w = Math.round((val.trim().split(/\s+/).filter(Boolean).length / secs) * 60);
    setRacers(prev => prev.map(r => r.isYou ? { ...r, progress: prog, wpm: w, finished: prog >= 100 } : r));
    if (val === RACE_TEXT) { clearInterval(botRef.current); setPhase("finished"); }
  };

  const winner = racers.find(r => r.finished);
  const youWin = racers.find(r => r.isYou)?.finished;

  if (screen === "lobby") return (
    <div>
      <SectionHeader title="MULTIPLAYER RACE" tag="Real-Time · Up to 8 Players" />
      <div className="mp-mode-cards">
        <div className="mp-mode-card" onClick={() => setScreen("room")}>
          <div className="mp-mode-icon">⚡</div>
          <div className="mp-mode-title">QUICK MATCH</div>
          <div className="mp-mode-desc">Auto-matched with players of similar skill level. Race starts in under 30 seconds.</div>
          <button className="btn-primary" style={{ marginTop: "1.5rem", width: "100%" }}>FIND MATCH</button>
        </div>
        <div className="mp-mode-card" onClick={() => setScreen("room")}>
          <div className="mp-mode-icon">🔗</div>
          <div className="mp-mode-title">PRIVATE ROOM</div>
          <div className="mp-mode-desc">Create a room and invite friends with a shareable code. Race on your schedule.</div>
          <button className="btn-ghost" style={{ marginTop: "1.5rem", width: "100%", padding: ".75rem" }}>CREATE ROOM</button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <SectionHeader title="RACE ROOM" tag={roomCode} action={<button className="btn-ghost" onClick={() => setScreen("lobby")}>← Back</button>} />

      <div className="room-code-box">{roomCode}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: ".68rem", color: "var(--text3)", textAlign: "center", marginBottom: "1.5rem" }}>
        Share this code · 4/8 players joined
      </div>

      {phase === "countdown" && (
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "5rem", color: "var(--cyan)", textShadow: "0 0 40px var(--cyan)", lineHeight: 1 }}>
            {countdown === 0 ? "GO!" : countdown}
          </div>
          <div style={{ fontFamily: "var(--font-mono)", color: "var(--text3)", fontSize: ".75rem", marginTop: ".75rem", letterSpacing: "2px" }}>GET READY</div>
        </div>
      )}

      <div className="card card-p" style={{ marginBottom: "1.5rem" }}>
        {racers.map((r, i) => (
          <div key={r.id} className="racer-lane">
            <div className="racer-name-col">
              <div className="racer-name-txt" style={{ color: r.isYou ? r.color : "var(--text)" }}>{r.isYou ? "▶ " : ""}{r.name}</div>
              <div className="racer-wpm-txt">{Math.round(r.wpm)} wpm</div>
            </div>
            <div className="racer-track-wrap">
              <div className="racer-track-fill" style={{ width: `${r.progress}%`, background: r.color, boxShadow: r.isYou ? `0 0 12px ${r.color}` : "none" }}>
                <div className="racer-emoji" style={{ color: r.color }}>{r.emoji}</div>
              </div>
            </div>
            <div className="racer-pct">{Math.round(r.progress)}%</div>
          </div>
        ))}
      </div>

      {phase === "racing" && (
        <div className="typing-wrap" style={{ cursor: "text" }} onClick={() => inputRef.current?.focus()}>
          <div className="type-text">
            {RACE_TEXT.split("").map((ch, i) => {
              let cls = "ch-pending";
              if (i < typed.length) cls = typed[i] === ch ? "ch-ok" : "ch-err";
              else if (i === typed.length) cls = "ch-cur";
              return <span key={i} className={cls}>{ch}</span>;
            })}
          </div>
          <input ref={inputRef} className="hidden-input" value={typed} onChange={handleInput}
            autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" />
        </div>
      )}

      {phase === "finished" && (
        <div className="card card-p" style={{ textAlign: "center", padding: "2.5rem" }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>{youWin ? "🏆" : "🥈"}</div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.8rem", color: youWin ? "var(--amber)" : "var(--p)" }}>
            {youWin ? "VICTORY!" : `${winner?.name} wins!`}
          </div>
          <div style={{ color: "var(--text3)", fontSize: ".78rem", fontFamily: "var(--font-mono)", margin: ".75rem 0 2rem" }}>
            {youWin ? "Your neural interface is superior." : "Better luck next race."}
          </div>
          <div style={{ display: "flex", gap: ".75rem", justifyContent: "center" }}>
            <button className="btn-primary" onClick={startRace}>RACE AGAIN</button>
            <button className="btn-ghost" onClick={() => setScreen("lobby")}>Leave Room</button>
          </div>
        </div>
      )}

      {phase === "waiting" && (
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <button className="btn-primary btn-primary-lg" onClick={startRace}>START RACE</button>
        </div>
      )}
    </div>
  );
}

// ━━━━━━━━━━━━━━