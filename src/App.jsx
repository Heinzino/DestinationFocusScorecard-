import { useState, useEffect, useRef, useCallback } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    id: "q1", category: "Content Inventory & Strategy", catIdx: 0,
    question: "How is your destination's content — including content from agencies, freelancers, creators, and co-op partners — organized and tracked?",
    options: [
      { label: "A", text: "Content is produced across multiple sources and platforms. There's no centralized inventory, tagging system, or way to see what exists in one place.", score: 2 },
      { label: "B", text: "We have a general sense of what's out there, but content isn't systematically tagged, categorized, or connected to performance data.", score: 5 },
      { label: "C", text: "We have a content inventory with some categorization and tagging. It covers most of our owned content, though it may not include everything from agencies or creators.", score: 7 },
      { label: "D", text: "All content — regardless of who produced it — is centrally inventoried, tagged by theme and audience, structured for search and AI discovery, and tracked for performance.", score: 10 },
    ],
  },
  {
    id: "q2", category: "Content Inventory & Strategy", catIdx: 0,
    question: "How does your team decide what content to create, refresh, or retire?",
    options: [
      { label: "A", text: "Mostly driven by the campaign calendar or stakeholder requests. There's no formal process for evaluating what already exists.", score: 2 },
      { label: "B", text: "We look at metrics like traffic and engagement to inform some decisions, but there's no systematic evaluation of the full library.", score: 5 },
      { label: "C", text: "We have a process for reviewing content performance. It's not always consistent and doesn't always connect back to strategic priorities.", score: 7 },
      { label: "D", text: "Every content decision — create, refresh, retire — is informed by performance data, strategic priorities, and resource capacity. We know what we have and what it's doing.", score: 10 },
    ],
  },
  {
    id: "q3", category: "Channel Spend & Performance", catIdx: 1,
    question: "How clearly can you connect your marketing spend to visitor outcomes?",
    options: [
      { label: "A", text: "We know where the budget goes by channel, but reporting is mostly activity metrics — impressions, clicks, reach.", score: 2 },
      { label: "B", text: "We have some performance data by channel, but find it challenging to draw a straight line from spend to visitor behavior or economic impact.", score: 5 },
      { label: "C", text: "We can connect spend to visitor outcomes in some channels. It's not yet consistent across the full portfolio.", score: 7 },
      { label: "D", text: "We have a measurement framework that connects channel investment to visitor behavior and economic impact, and we use it to make budget decisions.", score: 10 },
    ],
  },
  {
    id: "q4", category: "Channel Spend & Performance", catIdx: 1,
    question: "How does your board or leadership evaluate marketing performance?",
    options: [
      { label: "A", text: "We report activity metrics — impressions, reach, social engagement — because that's what we can reliably pull together.", score: 2 },
      { label: "B", text: "We report a mix of activity and outcome metrics. The board focuses on top-line numbers without connecting them to specific efforts.", score: 5 },
      { label: "C", text: "We have a reporting framework with defined KPIs. It doesn't always tell a clear story about what's driving results and what isn't.", score: 7 },
      { label: "D", text: "Our board reporting connects marketing investment to visitor behavior and economic impact. Leadership can see which efforts are driving results.", score: 10 },
    ],
  },
  {
    id: "q5", category: "Campaign Portfolio", catIdx: 2,
    question: "How many distinct campaigns or marketing initiatives is your team currently managing?",
    options: [
      { label: "A", text: "6 or more. The team is busy across a lot of efforts, and it's difficult to give any single one the attention it needs.", score: 2 },
      { label: "B", text: "4–5. Manageable, though some campaigns exist because we've always done them or a stakeholder wants them.", score: 5 },
      { label: "C", text: "3. We've consolidated, and we're working on making sure the right things survived.", score: 7 },
      { label: "D", text: "1–3 focused efforts, each with clear KPIs. We can explain why every one of them exists.", score: 10 },
    ],
  },
  {
    id: "q6", category: "Campaign Portfolio", catIdx: 2,
    question: "How connected are your campaigns to measurable outcomes?",
    options: [
      { label: "A", text: "Most campaigns have general goals like awareness or engagement, but not specific KPIs tied to visitor behavior.", score: 2 },
      { label: "B", text: "Some campaigns have KPIs. They're mostly activity-based — impressions, clicks — rather than visitor outcomes.", score: 5 },
      { label: "C", text: "Most campaigns have defined KPIs. Measurement is inconsistent and it's difficult to tell what's moving the numbers.", score: 7 },
      { label: "D", text: "Every campaign has specific KPIs tied to visitor behavior or economic impact, and we can clearly report whether each one is delivering.", score: 10 },
    ],
  },
  {
    id: "q7", category: "Influencer & Creator Partnerships", catIdx: 3,
    question: "How would you describe your influencer or creator program?",
    options: [
      { label: "A", text: "We do some creator work. It's mostly one-off partnerships without a structured program or measurement beyond impressions.", score: 2 },
      { label: "B", text: "We have recurring creator relationships. Selection is mostly based on reach and we measure through engagement metrics.", score: 5 },
      { label: "C", text: "We have a structured program with selection criteria and some measurement. It's not consistently tied to trip-planning behavior or business outcomes.", score: 7 },
      { label: "D", text: "We run a structured program with strategic selection, content ownership, and measurement tied to trip-planning or booking behavior.", score: 10 },
    ],
  },
  {
    id: "q8", category: "Audience Data & Research", catIdx: 4,
    question: "How does your organization define and understand its target audiences?",
    options: [
      { label: "A", text: "Primarily broad demographics — families, couples, millennials, adventure travelers. We haven't done behavioral or psychographic research.", score: 2 },
      { label: "B", text: "We have some audience data beyond demographics from surveys or past research. It doesn't consistently inform campaign decisions.", score: 5 },
      { label: "C", text: "We have defined audience segments based on research that inform some campaign and content decisions. The research could be fresher.", score: 7 },
      { label: "D", text: "We use behavioral segmentation that tells us why people choose our destination, what drives their planning decisions, and which visitors generate the most economic impact. It drives targeting, messaging, and measurement.", score: 10 },
    ],
  },
  {
    id: "q9", category: "Agency & Partner Relationships", catIdx: 5,
    question: "How would you describe the structure of your agency relationships?",
    options: [
      { label: "A", text: "We work with multiple agencies and there's some overlap in what they deliver. We spend meaningful internal time coordinating between them.", score: 2 },
      { label: "B", text: "Agency roles are generally defined. We don't have shared KPIs or a unified view of what each partner is producing and whether it's driving results.", score: 5 },
      { label: "C", text: "Agency scopes are clear with limited overlap, and we have some shared reporting. Evaluating performance at the deliverable level is still difficult.", score: 7 },
      { label: "D", text: "Each agency has a clearly defined scope, shared KPIs, and accountability at the deliverable level. We evaluate based on outcomes.", score: 10 },
    ],
  },
  {
    id: "q10", category: "Brand & Messaging", catIdx: 6,
    question: "Does your destination have a messaging framework that guides communication across audiences, seasons, and channels?",
    options: [
      { label: "A", text: "We have visual brand guidelines — logo, colors, photography style. Messaging varies by campaign and channel.", score: 2 },
      { label: "B", text: "We have some messaging direction. Different campaigns and agencies tend to interpret the brand differently.", score: 5 },
      { label: "C", text: "We have a documented messaging framework. It's not always used consistently and hasn't been refreshed in a while.", score: 7 },
      { label: "D", text: "We have a current messaging architecture that all campaigns, agencies, and channels work from. Everything compounds instead of fragmenting.", score: 10 },
    ],
  },
  {
    id: "q11", category: "Brand & Messaging", catIdx: 6,
    question: "How aligned are your internal stakeholders on marketing priorities?",
    options: [
      { label: "A", text: "Different stakeholders push different priorities. The marketing plan reflects competing agendas more than strategic focus.", score: 2 },
      { label: "B", text: "There's general alignment on direction. Individual stakeholders still drive campaigns or initiatives that don't always connect to the core strategy.", score: 5 },
      { label: "C", text: "Leadership is mostly aligned. It takes effort to maintain that alignment, and new requests still pull the team off-plan regularly.", score: 7 },
      { label: "D", text: "Stakeholders are aligned on priorities. When new requests come in, there's a clear framework for evaluating whether they earn a place on the plan.", score: 10 },
    ],
  },
  {
    id: "q12", category: "AI & Digital Readiness", catIdx: 7,
    question: "How prepared is your destination for AI-driven trip planning?",
    options: [
      { label: "A", text: "We're aware AI is changing how travelers plan trips. We haven't taken specific action to adapt our content or infrastructure.", score: 2 },
      { label: "B", text: "We've discussed it internally and done some initial research. We don't have a plan or clear next steps.", score: 5 },
      { label: "C", text: "We've started some work — schema markup, content restructuring, or monitoring how AI platforms represent us. It's early and not yet systematic.", score: 7 },
      { label: "D", text: "We've implemented structured data, restructured content for AI discovery, and actively monitor how AI platforms represent our destination.", score: 10 },
    ],
  },
  {
    id: "q13", category: "AI & Digital Readiness", catIdx: 7,
    question: "Is your existing content structured for how AI platforms discover and recommend destinations?",
    options: [
      { label: "A", text: "We haven't approached content through the lens of AI discovery. Our content is built for traditional search and social.", score: 2 },
      { label: "B", text: "We know this matters. Our content is still mostly in formats that AI systems don't easily parse — listicles, broad landing pages, PDF guides.", score: 5 },
      { label: "C", text: "We've started restructuring some content for specificity and authority. Most of the library still reflects traditional formats.", score: 7 },
      { label: "D", text: "Our content is structured around specific experiences, destinations, and traveler needs in formats that AI platforms can easily surface and recommend.", score: 10 },
    ],
  },
  {
    id: "q14", category: "Team Capacity", catIdx: -1, standalone: true,
    question: "Which best describes your team's capacity relative to your current marketing workload?",
    options: [
      { label: "A", text: "The team is fully committed. We're managing everything on the list but don't have bandwidth to go deeper on anything.", score: 0, signal: "Capacity Constrained" },
      { label: "B", text: "We have enough capacity to keep things running. Strategic work — the stuff that would improve the operation — keeps getting pushed.", score: 0, signal: "Execution Trap" },
      { label: "C", text: "We have some room to take on strategic initiatives. Adding anything new means something else has to stop.", score: 0, signal: "Trade-Off Ready" },
      { label: "D", text: "We have capacity for both day-to-day execution and strategic improvements. The team isn't stretched beyond what's sustainable.", score: 0, signal: "Healthy Capacity" },
    ],
  },
  {
    id: "q15", category: "Focus Readiness", catIdx: -2, standalone: true,
    question: "If your board asked you to cut your marketing initiatives in half tomorrow and defend what's left — could you?",
    options: [
      { label: "A", text: "We'd struggle to decide what to cut and how to justify it.", score: 0, signal: "Focus Gap" },
      { label: "B", text: "We could make a case, but it would be based more on instinct than data.", score: 0, signal: "Gut-Driven" },
      { label: "C", text: "We could make a data-informed case for some cuts. Internal dynamics would make it difficult to execute.", score: 0, signal: "Politically Constrained" },
      { label: "D", text: "Yes. We know what's working, what isn't, and we could defend the decision.", score: 0, signal: "Focused" },
    ],
  },
];

const CATEGORIES = [
  "Content Inventory & Strategy",
  "Channel Spend & Performance",
  "Campaign Portfolio",
  "Influencer & Creator Partnerships",
  "Audience Data & Research",
  "Agency & Partner Relationships",
  "Brand & Messaging",
  "AI & Digital Readiness",
];

const CAT_QUESTIONS = {
  0: ["q1","q2"], 1: ["q3","q4"], 2: ["q5","q6"], 3: ["q7"],
  4: ["q8"], 5: ["q9"], 6: ["q10","q11"], 7: ["q12","q13"],
};

const INSIGHTS = {
  0: { 2:"You're producing content. You don't know what you have or what it's doing.", 5:"You have a sense of your content. Decisions aren't yet driven by data.", 7:"Your content is organized. The question is whether it's organized around what matters.", 10:"Your content operation is structured and strategic. That's rare." },
  1: { 2:"You know where the money goes. You don't know what it's doing when it gets there.", 5:"You're reporting activity. Your board wants outcomes.", 7:"Your measurement is getting there. Consistency across channels is the next step.", 10:"You can connect dollars to visitor behavior. That puts you ahead of most." },
  2: { 2:"Your team is running more campaigns than they can execute well.", 5:"You've got some focus. Some campaigns are surviving on inertia, not results.", 7:"Solid consolidation. The question is whether the right things survived.", 10:"Fewer campaigns. Clear KPIs. That's what focus looks like." },
  3: { 2:"You're doing creator work. It's not a program yet.", 5:"You have relationships. You don't have a system.", 7:"Your program has structure. Tying it to trip-planning behavior is the next level.", 10:"Strategic selection, real measurement, content ownership. That's a program." },
  4: { 2:"'Families and couples' isn't a segment. Behavioral insight tells you who to target and why.", 5:"You have data. It's not informing decisions consistently.", 7:"Your segments have depth. Making sure they're current and connected to strategy is key.", 10:"You know why people choose your destination and which visitors matter most." },
  5: { 2:"Your agencies are working. The question is whether anyone can see what's driving results.", 5:"Roles are defined. Accountability to outcomes isn't.", 7:"Clear scopes, limited overlap. Deliverable-level visibility would take it further.", 10:"Clear scopes, shared KPIs, outcome-based accountability. That's how it should work." },
  6: { 2:"Your visual brand is strong. Your messaging isn't. Every campaign starts from scratch.", 5:"You have messaging direction. If two agencies can interpret it two different ways, it's not a framework.", 7:"You have a framework. Keeping it current and consistently applied is the challenge.", 10:"One narrative. Every campaign. Every channel. That's messaging architecture." },
  7: { 2:"AI is already changing how travelers find destinations. That window is closing.", 5:"You're aware. The gap between knowing and doing is where competitive advantage lives.", 7:"You've started. Building a system rather than running a project is the next step.", 10:"Structured data, AI-optimized content, active monitoring. You're ahead of the industry." },
};

const CAPACITY_INSIGHTS = {
  "Capacity Constrained": "Your team doesn't have bandwidth for the work that would improve the operation. Something has to come off the plate.",
  "Execution Trap": "You're keeping things running but not moving forward. Strategic work keeps getting pushed.",
  "Trade-Off Ready": "You have some room. Knowing what to stop is as important as knowing what to start.",
  "Healthy Capacity": "Your team has room to breathe and build. That's a position most DMOs would envy.",
};

const FOCUS_INSIGHTS = {
  "Focus Gap": "You can't cut because you can't decide. That's the focus problem.",
  "Gut-Driven": "You have instincts. You don't have the data or framework to defend them.",
  "Politically Constrained": "You know what to cut. You need external validation and a defensible plan to make it happen.",
  "Focused": "You can make the hard calls and back them up. Strong position.",
};

const BUDGET_OPTIONS = ["Under $500K", "$500K – $1M", "$1M – $3M", "$3M – $5M", "$5M+", "Prefer not to say"];

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1920&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=80",
];

const BG_IMAGES = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80",
  "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1920&q=80",
  "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&q=80",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80",
  "https://images.unsplash.com/photo-1540202404-a2f29016b523?w=1920&q=80",
  "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=1920&q=80",
  "https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=1920&q=80",
  "https://images.unsplash.com/photo-1494783367193-149034c05e8f?w=1920&q=80",
  "https://images.unsplash.com/photo-1528164344705-47542687000d?w=1920&q=80",
  "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=1920&q=80",
  "https://images.unsplash.com/photo-1468413253725-0d5181091126?w=1920&q=80",
  "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=1920&q=80",
  "https://images.unsplash.com/photo-1484291150605-0860ed671f04?w=1920&q=80",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80",
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function getStatusLabel(score) {
  if (score <= 2) return { label: "Foundation Needed", color: "#DC2626", bg: "rgba(220,38,38,0.1)" };
  if (score <= 4) return { label: "Evolving", color: "#EA580C", bg: "rgba(234,88,12,0.1)" };
  if (score <= 6) return { label: "Functional", color: "#CA8A04", bg: "rgba(202,138,4,0.1)" };
  if (score <= 8) return { label: "Strong", color: "#16A34A", bg: "rgba(22,163,74,0.1)" };
  return { label: "Optimized", color: "#059669", bg: "rgba(5,150,105,0.1)" };
}

function getInsightForScore(catIdx, score) {
  const map = INSIGHTS[catIdx];
  if (score <= 3) return map[2];
  if (score <= 5.5) return map[5];
  if (score <= 8) return map[7];
  return map[10];
}

function calcResults(answers) {
  const catScores = {};
  for (let i = 0; i < 8; i++) {
    const qs = CAT_QUESTIONS[i];
    const scores = qs.map(qid => answers[qid]?.score ?? 0);
    catScores[i] = scores.reduce((a,b)=>a+b,0) / scores.length;
  }
  const total = Object.values(catScores).reduce((a,b)=>a+b,0);
  const capacity = answers["q14"]?.signal || "";
  const focus = answers["q15"]?.signal || "";
  return { catScores, total, capacity, focus };
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --ink: #0F172A;
  --ink-soft: #334155;
  --ink-muted: #64748B;
  --surface: #FAFAF9;
  --surface-warm: #F5F3EF;
  --white: #FFFFFF;
  --accent: #1B4D3E;
  --accent-light: #2D7A5F;
  --accent-glow: rgba(27,77,62,0.08);
  --gold: #B8860B;
  --gold-light: #D4A843;
  --border: rgba(15,23,42,0.08);
  --border-strong: rgba(15,23,42,0.15);
  --radius: 12px;
  --radius-lg: 20px;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 20px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04);
  --shadow-lg: 0 10px 40px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04);
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
  --ease: cubic-bezier(0.22, 1, 0.36, 1);
}

body { font-family: var(--font-body); background: var(--surface); color: var(--ink); -webkit-font-smoothing: antialiased; overflow-x: hidden; }

.scorecard-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* ─── SCREEN TRANSITIONS ─── */
.screen-enter { animation: screenIn 0.7s var(--ease) both; }
@keyframes screenIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ─── LANDING ─── */
.landing {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 40px 24px;
}
.landing-bg {
  position: absolute; inset: 0;
  background-size: cover;
  background-position: center;
  filter: brightness(0.35);
  z-index: 0;
}
.landing-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(15,23,42,0.3) 0%, rgba(15,23,42,0.7) 100%);
  z-index: 1;
}
.landing-content {
  position: relative; z-index: 2;
  max-width: 680px;
  text-align: center;
}
.landing-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 100px;
  color: rgba(255,255,255,0.85);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 32px;
  animation: fadeUp 0.6s var(--ease) 0.2s both;
}
.landing h1 {
  font-family: var(--font-display);
  font-size: clamp(36px, 6vw, 60px);
  font-weight: 600;
  color: white;
  line-height: 1.1;
  margin-bottom: 20px;
  letter-spacing: -0.5px;
  animation: fadeUp 0.6s var(--ease) 0.35s both;
}
.landing h1 em {
  color: var(--gold-light);
  font-style: italic;
}
.landing-sub {
  font-size: clamp(16px, 2.2vw, 19px);
  color: rgba(255,255,255,0.7);
  line-height: 1.6;
  margin-bottom: 44px;
  font-weight: 400;
  animation: fadeUp 0.6s var(--ease) 0.5s both;
}
.landing-cta {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 18px 40px;
  background: var(--white);
  color: var(--ink);
  border: none;
  border-radius: 100px;
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s var(--ease);
  box-shadow: 0 4px 30px rgba(0,0,0,0.2);
  animation: fadeUp 0.6s var(--ease) 0.65s both;
}
.landing-cta:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 40px rgba(0,0,0,0.3);
}
.landing-cta svg { transition: transform 0.3s var(--ease); }
.landing-cta:hover svg { transform: translateX(4px); }
.landing-meta {
  margin-top: 24px;
  font-size: 13px;
  color: rgba(255,255,255,0.45);
  animation: fadeUp 0.6s var(--ease) 0.8s both;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ─── EMAIL CAPTURE ─── */
.capture {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  background: var(--surface-warm);
}
.capture-card {
  width: 100%;
  max-width: 520px;
  background: var(--white);
  border-radius: var(--radius-lg);
  padding: 48px 40px;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border);
}
.capture-card h2 {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 6px;
  color: var(--ink);
}
.capture-card .capture-sub {
  color: var(--ink-muted);
  font-size: 15px;
  margin-bottom: 36px;
  line-height: 1.5;
}
.form-group {
  margin-bottom: 20px;
}
.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--ink-soft);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 8px;
}
.form-group input, .form-group select {
  width: 100%;
  padding: 14px 16px;
  border: 1.5px solid var(--border-strong);
  border-radius: var(--radius);
  font-family: var(--font-body);
  font-size: 15px;
  color: var(--ink);
  background: var(--surface);
  transition: all 0.25s var(--ease);
  outline: none;
}
.form-group input:focus, .form-group select:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
  background: var(--white);
}
.form-group input::placeholder { color: var(--ink-muted); }
.form-group .optional-tag {
  font-weight: 400;
  text-transform: none;
  letter-spacing: 0;
  color: var(--ink-muted);
  font-size: 12px;
}
.capture-btn {
  width: 100%;
  padding: 16px;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: var(--radius);
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s var(--ease);
  margin-top: 8px;
}
.capture-btn:hover:not(:disabled) {
  background: var(--accent-light);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
.capture-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ─── QUESTION SCREEN ─── */
.question-screen {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}
.question-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  transition: opacity 1.2s ease;
  z-index: 0;
}
.question-bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(15,23,42,0.88) 0%, rgba(15,23,42,0.75) 100%);
  z-index: 1;
}

/* Progress bar */
.progress-bar-container {
  position: relative;
  z-index: 10;
  padding: 0;
  width: 100%;
}
.progress-bar-track {
  height: 3px;
  background: rgba(255,255,255,0.1);
  width: 100%;
}
.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--gold), var(--gold-light));
  transition: width 0.6s var(--ease);
  border-radius: 0 2px 2px 0;
}

/* Question content */
.question-content-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  padding: 40px 24px;
  max-width: 760px;
  margin: 0 auto;
  width: 100%;
}
.question-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  width: 100%;
}
.question-number {
  font-size: 13px;
  font-weight: 600;
  color: var(--gold-light);
  letter-spacing: 1px;
  text-transform: uppercase;
}
.question-category {
  font-size: 13px;
  color: rgba(255,255,255,0.4);
  padding-left: 12px;
  border-left: 1px solid rgba(255,255,255,0.15);
}
.question-text {
  font-family: var(--font-display);
  font-size: clamp(22px, 3.5vw, 30px);
  font-weight: 500;
  color: white;
  line-height: 1.35;
  margin-bottom: 40px;
  width: 100%;
}

/* Options */
.options-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
.option-btn {
  width: 100%;
  text-align: left;
  padding: 20px 24px;
  background: rgba(255,255,255,0.06);
  backdrop-filter: blur(12px);
  border: 1.5px solid rgba(255,255,255,0.1);
  border-radius: var(--radius);
  color: rgba(255,255,255,0.85);
  font-family: var(--font-body);
  font-size: 15px;
  line-height: 1.55;
  cursor: pointer;
  transition: all 0.35s var(--ease);
  display: flex;
  gap: 16px;
  align-items: flex-start;
}
.option-btn:hover {
  background: rgba(255,255,255,0.12);
  border-color: rgba(255,255,255,0.25);
  transform: translateX(4px);
}
.option-btn.selected {
  background: rgba(27,77,62,0.35);
  border-color: var(--accent-light);
  color: white;
}
.option-letter {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: rgba(255,255,255,0.08);
  font-weight: 600;
  font-size: 13px;
  color: rgba(255,255,255,0.6);
  transition: all 0.35s var(--ease);
}
.option-btn.selected .option-letter {
  background: var(--accent-light);
  color: white;
}
.option-btn:hover .option-letter {
  background: rgba(255,255,255,0.15);
}

/* Nav buttons */
.question-nav {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 32px;
  border-top: 1px solid rgba(255,255,255,0.06);
}
.nav-back {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 100px;
  color: rgba(255,255,255,0.6);
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s var(--ease);
}
.nav-back:hover { background: rgba(255,255,255,0.1); color: white; }
.nav-next {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  background: var(--gold);
  border: none;
  border-radius: 100px;
  color: white;
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s var(--ease);
  box-shadow: 0 4px 20px rgba(184,134,11,0.3);
}
.nav-next:hover:not(:disabled) {
  background: var(--gold-light);
  transform: translateY(-1px);
}
.nav-next:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  box-shadow: none;
}
.nav-next svg { transition: transform 0.3s var(--ease); }
.nav-next:hover:not(:disabled) svg { transform: translateX(3px); }
.nav-counter {
  font-size: 13px;
  color: rgba(255,255,255,0.35);
  font-weight: 500;
}

/* ─── RESULTS ─── */
.results-screen {
  min-height: 100vh;
  width: 100%;
  background: var(--surface-warm);
  padding: 0;
}
.results-hero {
  position: relative;
  padding: 80px 24px 60px;
  text-align: center;
  overflow: hidden;
}
.results-hero-bg {
  position: absolute; inset: 0;
  background-size: cover;
  background-position: center;
  filter: brightness(0.3);
}
.results-hero-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(15,23,42,0.5) 0%, rgba(15,23,42,0.85) 100%);
}
.results-hero-content {
  position: relative; z-index: 2;
}
.results-hero h2 {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 500;
  color: var(--gold-light);
  margin-bottom: 16px;
  letter-spacing: 1px;
  text-transform: uppercase;
}
.score-ring-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 16px 0 20px;
}
.score-ring {
  position: relative;
  width: 180px;
  height: 180px;
}
.score-ring svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}
.score-ring-bg { stroke: rgba(255,255,255,0.08); }
.score-ring-fill {
  stroke: var(--gold-light);
  transition: stroke-dashoffset 2s var(--ease);
  filter: drop-shadow(0 0 8px rgba(212,168,67,0.3));
}
.score-ring-label {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.score-number {
  font-family: var(--font-display);
  font-size: 48px;
  font-weight: 700;
  color: white;
  line-height: 1;
}
.score-total {
  font-size: 16px;
  color: rgba(255,255,255,0.4);
  font-weight: 500;
  margin-top: 4px;
}
.results-peer-context {
  font-size: 14px;
  color: rgba(255,255,255,0.5);
  max-width: 480px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Category cards */
.results-body {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 24px 60px;
}
.results-section-title {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 24px;
}
.cat-card {
  background: var(--white);
  border-radius: var(--radius);
  padding: 24px;
  margin-bottom: 12px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s var(--ease);
  animation: cardIn 0.4s var(--ease) both;
}
.cat-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}
.cat-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  gap: 16px;
}
.cat-card-name {
  font-weight: 600;
  font-size: 15px;
  color: var(--ink);
}
.cat-card-score-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}
.cat-card-score-num {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
}
.cat-card-status {
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.3px;
}
.cat-card-bar {
  height: 4px;
  background: var(--surface);
  border-radius: 100px;
  overflow: hidden;
  margin-bottom: 14px;
}
.cat-card-bar-fill {
  height: 100%;
  border-radius: 100px;
  transition: width 1.2s var(--ease);
}
.cat-card-insight {
  font-size: 14px;
  color: var(--ink-muted);
  line-height: 1.55;
  font-style: italic;
}

@keyframes cardIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Diagnostic cards */
.diagnostic-section {
  margin-top: 48px;
}
.diagnostic-card {
  background: var(--white);
  border-radius: var(--radius);
  padding: 24px;
  margin-bottom: 12px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
}
.diagnostic-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--ink-muted);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 6px;
}
.diagnostic-signal {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 8px;
}
.diagnostic-insight {
  font-size: 14px;
  color: var(--ink-muted);
  line-height: 1.55;
}

/* CTA */
.results-cta-section {
  margin-top: 48px;
  text-align: center;
  padding: 40px;
  background: var(--white);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-md);
}
.results-cta-section p {
  font-size: 16px;
  color: var(--ink-muted);
  margin-bottom: 24px;
  line-height: 1.5;
}
.results-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 36px;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 100px;
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s var(--ease);
  box-shadow: 0 4px 20px rgba(27,77,62,0.25);
}
.results-cta-btn:hover {
  background: var(--accent-light);
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(27,77,62,0.3);
}

/* Keyboard hint */
.keyboard-hint {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(12px);
  border-radius: 100px;
  z-index: 100;
  font-size: 12px;
  color: rgba(255,255,255,0.5);
}
.key-badge {
  padding: 2px 8px;
  background: rgba(255,255,255,0.1);
  border-radius: 4px;
  font-weight: 600;
  color: rgba(255,255,255,0.7);
  font-size: 11px;
}

@media (max-width: 640px) {
  .capture-card { padding: 32px 24px; }
  .question-nav { padding: 16px 20px; }
  .results-body { padding: 32px 16px 48px; }
  .keyboard-hint { display: none; }
  .option-btn { padding: 16px 18px; font-size: 14px; }
}
`;

// ─── ICONS ───────────────────────────────────────────────────────────────────
const ArrowRight = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;
const ArrowLeft = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>;
const Compass = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>;

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
export default function DestinationFocusScorecard() {
  const [screen, setScreen] = useState("landing"); // landing | capture | questions | results
  const [formData, setFormData] = useState({ name: "", email: "", org: "", budget: "" });
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [animKey, setAnimKey] = useState(0);
  const questionRef = useRef(null);

  // Keyboard nav
  useEffect(() => {
    const handler = (e) => {
      if (screen !== "questions") return;
      const q = QUESTIONS[currentQ];
      if (["a","b","c","d","1","2","3","4"].includes(e.key.toLowerCase())) {
        const idx = { a:0, b:1, c:2, d:3, "1":0, "2":1, "3":2, "4":3 }[e.key.toLowerCase()];
        if (q.options[idx]) selectOption(q.options[idx]);
      }
      if (e.key === "Enter" && answers[q.id]) goNext();
      if (e.key === "Backspace" && currentQ > 0) goBack();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [screen, currentQ, answers]);

  const selectOption = useCallback((opt) => {
    const q = QUESTIONS[currentQ];
    setAnswers(prev => ({ ...prev, [q.id]: opt }));
    // Auto-advance after short delay
    setTimeout(() => {
      if (currentQ < QUESTIONS.length - 1) {
        setCurrentQ(c => c + 1);
        setAnimKey(k => k + 1);
      } else {
        // Last question
        const finalAnswers = { ...answers, [q.id]: opt };
        const r = calcResults(finalAnswers);
        setResults(r);
        setScreen("results");
      }
    }, 400);
  }, [currentQ, answers]);

  const goNext = useCallback(() => {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(c => c + 1);
      setAnimKey(k => k + 1);
    } else if (answers[QUESTIONS[currentQ].id]) {
      const r = calcResults(answers);
      setResults(r);
      setScreen("results");
    }
  }, [currentQ, answers]);

  const goBack = useCallback(() => {
    if (currentQ > 0) {
      setCurrentQ(c => c - 1);
      setAnimKey(k => k + 1);
    }
  }, [currentQ]);

  const canSubmitCapture = formData.name.trim() && formData.email.trim() && formData.org.trim();

  // ─── RENDER ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{css}</style>
      <div className="scorecard-root">

        {/* ═══ LANDING ═══ */}
        {screen === "landing" && (
          <div className="landing screen-enter">
            <div className="landing-bg" style={{ backgroundImage: `url(${HERO_IMAGES[0]})` }} />
            <div className="landing-overlay" />
            <div className="landing-content">
              <div className="landing-badge">
                <Compass /> iExplore for Business
              </div>
              <h1>Destination Focus<br /><em>Scorecard</em></h1>
              <p className="landing-sub">
                Eight categories. Five minutes. See where your marketing operation stands — and where the gaps are costing you.
              </p>
              <button className="landing-cta" onClick={() => { setScreen("capture"); setAnimKey(k => k + 1); }}>
                Take the Assessment <ArrowRight />
              </button>
              <p className="landing-meta">Free · No credit card · Results delivered instantly</p>
            </div>
          </div>
        )}

        {/* ═══ EMAIL CAPTURE ═══ */}
        {screen === "capture" && (
          <div className="capture screen-enter" key={animKey}>
            <div className="capture-card">
              <h2>Before we start</h2>
              <p className="capture-sub">We'll email your full scorecard results with category breakdowns and peer benchmarking.</p>
              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  placeholder="Jane Smith"
                  value={formData.name}
                  onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Work Email</label>
                <input
                  type="email"
                  placeholder="jane@visitdestination.com"
                  value={formData.email}
                  onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Organization Name</label>
                <input
                  type="text"
                  placeholder="Visit Somewhere"
                  value={formData.org}
                  onChange={e => setFormData(p => ({ ...p, org: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Annual Marketing Budget <span className="optional-tag">(optional)</span></label>
                <select
                  value={formData.budget}
                  onChange={e => setFormData(p => ({ ...p, budget: e.target.value }))}
                >
                  <option value="">Select a range</option>
                  {BUDGET_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <button
                className="capture-btn"
                disabled={!canSubmitCapture}
                onClick={() => { setScreen("questions"); setAnimKey(k => k + 1); }}
              >
                Start the Scorecard
              </button>
            </div>
          </div>
        )}

        {/* ═══ QUESTIONS ═══ */}
        {screen === "questions" && (() => {
          const q = QUESTIONS[currentQ];
          const progress = ((currentQ + 1) / QUESTIONS.length) * 100;
          const bgIdx = currentQ % BG_IMAGES.length;
          const isSelected = (opt) => answers[q.id]?.label === opt.label;

          return (
            <div className="question-screen" key={`qs-${animKey}`}>
              <div className="question-bg" style={{ backgroundImage: `url(${BG_IMAGES[bgIdx]})` }} />
              <div className="question-bg-overlay" />

              <div className="progress-bar-container">
                <div className="progress-bar-track">
                  <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="question-content-wrap screen-enter" ref={questionRef}>
                <div className="question-meta">
                  <span className="question-number">Question {currentQ + 1}</span>
                  <span className="question-category">{q.standalone ? q.category : q.category}</span>
                </div>
                <h2 className="question-text">{q.question}</h2>
                <div className="options-list">
                  {q.options.map((opt, i) => (
                    <button
                      key={opt.label}
                      className={`option-btn ${isSelected(opt) ? "selected" : ""}`}
                      onClick={() => selectOption(opt)}
                    >
                      <span className="option-letter">{opt.label}</span>
                      <span>{opt.text}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="question-nav">
                {currentQ > 0 ? (
                  <button className="nav-back" onClick={goBack}><ArrowLeft /> Back</button>
                ) : <div />}
                <span className="nav-counter">{currentQ + 1} of {QUESTIONS.length}</span>
                <button
                  className="nav-next"
                  disabled={!answers[q.id]}
                  onClick={goNext}
                >
                  {currentQ === QUESTIONS.length - 1 ? "See Results" : "Next"} <ArrowRight />
                </button>
              </div>

              <div className="keyboard-hint">
                <span className="key-badge">A–D</span> select
                <span className="key-badge">Enter</span> next
                <span className="key-badge">⌫</span> back
              </div>
            </div>
          );
        })()}

        {/* ═══ RESULTS ═══ */}
        {screen === "results" && results && (
          <div className="results-screen screen-enter">
            <div className="results-hero">
              <div className="results-hero-bg" style={{ backgroundImage: `url(${HERO_IMAGES[3]})` }} />
              <div className="results-hero-overlay" />
              <div className="results-hero-content">
                <h2>Your Destination Focus Score</h2>
                <div className="score-ring-wrap">
                  <ScoreRing score={results.total} max={80} />
                </div>
                <p className="results-peer-context">
                  The average mid-size DMO scores between 28 and 38. Organizations entering a Focus Blueprint engagement typically start between 22 and 35.
                </p>
              </div>
            </div>

            <div className="results-body">
              <h3 className="results-section-title">Category Breakdown</h3>
              {CATEGORIES.map((cat, i) => {
                const score = results.catScores[i];
                const status = getStatusLabel(score);
                const insight = getInsightForScore(i, score);
                return (
                  <div className="cat-card" key={cat} style={{ animationDelay: `${i * 0.08}s` }}>
                    <div className="cat-card-header">
                      <span className="cat-card-name">{cat}</span>
                      <div className="cat-card-score-wrap">
                        <span className="cat-card-score-num" style={{ color: status.color }}>{score % 1 === 0 ? score : score.toFixed(1)}</span>
                        <span className="cat-card-status" style={{ color: status.color, background: status.bg }}>{status.label}</span>
                      </div>
                    </div>
                    <div className="cat-card-bar">
                      <div className="cat-card-bar-fill" style={{ width: `${(score / 10) * 100}%`, background: status.color }} />
                    </div>
                    <p className="cat-card-insight">"{insight}"</p>
                  </div>
                );
              })}

              <div className="diagnostic-section">
                <h3 className="results-section-title">Diagnostic Signals</h3>
                <div className="diagnostic-card">
                  <div className="diagnostic-label">Team Capacity</div>
                  <div className="diagnostic-signal">{results.capacity}</div>
                  <p className="diagnostic-insight">{CAPACITY_INSIGHTS[results.capacity]}</p>
                </div>
                <div className="diagnostic-card" style={{ marginTop: 12 }}>
                  <div className="diagnostic-label">Focus Readiness</div>
                  <div className="diagnostic-signal">{results.focus}</div>
                  <p className="diagnostic-insight">{FOCUS_INSIGHTS[results.focus]}</p>
                </div>
              </div>

              <div className="results-cta-section">
                <p>Your full scorecard breakdown is on its way to <strong>{formData.email}</strong>.<br />Want to talk about what to do with it?</p>
                <a href="https://cal.com/readymation/30min" target="_blank" rel="noopener noreferrer" className="results-cta-btn" style={{ textDecoration: "none" }}>
                  Book a 30-Minute Focus Call <ArrowRight />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ─── SCORE RING ──────────────────────────────────────────────────────────────
function ScoreRing({ score, max }) {
  const [offset, setOffset] = useState(440);
  const r = 70;
  const circ = 2 * Math.PI * r;
  const pct = score / max;

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(circ - circ * pct);
    }, 300);
    return () => clearTimeout(timer);
  }, [score, max]);

  return (
    <div className="score-ring">
      <svg viewBox="0 0 160 160">
        <circle className="score-ring-bg" cx="80" cy="80" r={r} fill="none" strokeWidth="6" />
        <circle
          className="score-ring-fill"
          cx="80" cy="80" r={r}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="score-ring-label">
        <span className="score-number">{Math.round(score)}</span>
        <span className="score-total">out of {max}</span>
      </div>
    </div>
  );
}
