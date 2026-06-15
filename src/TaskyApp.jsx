import React, { useState, useEffect, useMemo, useRef } from "react";

/* ============================================================
   TASKY — MVP solo, zen, compagnon évolutif
   - TaskyAvatar = placeholder modulaire, remplaçable (voir bas de fichier)
   - State en mémoire (pas de persistance dans ce MVP)
   ============================================================ */

/* ---------- Constantes produit ---------- */

const STYLES = [
  { id: "zen", name: "Zen naturel", desc: "Mousse, pierre, lumière douce", accent: "#6B8F71", accent2: "#A7C4A0", tint: "#EFF3EC" },
  { id: "retro", name: "Rétro urbain", desc: "Brique, néon fatigué, vinyle", accent: "#C4673B", accent2: "#E2A87C", tint: "#F5EDE4" },
  { id: "futur", name: "Futur doux", desc: "Pastels, halos, courbes calmes", accent: "#7B7FD4", accent2: "#B9BCEF", tint: "#EFEFF8" },
  { id: "japon", name: "Japon campagne", desc: "Indigo, kaki, papier washi", accent: "#3F5577", accent2: "#C97B4A", tint: "#EEF0F2" },
  { id: "studio", name: "Créatif studio", desc: "Encre, papier, jaune soleil", accent: "#C9A227", accent2: "#3A3A38", tint: "#F6F2E6" },
  { id: "mono", name: "Minimal monochrome", desc: "Gris, encre, silence", accent: "#5A5A5E", accent2: "#9A9AA0", tint: "#F1F1F2" },
];

const SILHOUETTES = [
  { id: "galet", name: "Galet" },
  { id: "flamme", name: "Flamme" },
  { id: "feuille", name: "Feuille" },
  { id: "carre", name: "Carré doux" },
];
const EYES = [
  { id: "doux", name: "Doux" },
  { id: "rond", name: "Ronds" },
  { id: "etoile", name: "Étoilés" },
  { id: "calme", name: "Mi-clos" },
];
const ACCESSORIES = [
  { id: "aucun", name: "Aucun" },
  { id: "pousse", name: "Petite pousse" },
  { id: "beret", name: "Béret" },
  { id: "antenne", name: "Antenne lumineuse" },
];
const OUTFITS = [
  { id: "aucune", name: "Aucune" },
  { id: "echarpe", name: "Écharpe" },
  { id: "cape", name: "Petite cape" },
];

const PRIORITIES = [
  { id: "douce", name: "Douce", tone: "var(--accent2)" },
  { id: "normale", name: "Normale", tone: "var(--muted)" },
  { id: "importante", name: "Importante", tone: "#C97B4A" },
  { id: "focus", name: "Focus", tone: "var(--accent)" },
];
const EFFORTS = [
  { id: "5", name: "5 min", xp: 8 },
  { id: "15", name: "15 min", xp: 14 },
  { id: "30", name: "30 min", xp: 22 },
  { id: "deep", name: "Deep focus", xp: 35 },
];
const REPEATS = ["Aucune", "Quotidienne", "Hebdomadaire"];
const CATEGORIES = ["Travail", "Maison", "Soin de soi", "Études", "Créatif", "Autre"];

const STAGES = [
  { id: 0, name: "Éveil", min: 0, unlock: "Tasky ouvre les yeux" },
  { id: 1, name: "Élan", min: 50, unlock: "Accessoire « Petite pousse » + objet « Lanterne »" },
  { id: 2, name: "Ancrage", min: 150, unlock: "Biome « Campagne japonaise » + « Bonsaï »" },
  { id: 3, name: "Rayonnement", min: 300, unlock: "Tenue « Petite cape » + biome « Ville rétro »" },
  { id: 4, name: "Harmonie", min: 500, unlock: "Biome « Jardin apaisant » + halo d'harmonie" },
];

const BIOMES = [
  { id: "chambre", name: "Chambre cosy", stage: 0, sky: ["#F3E9DC", "#E8D5C0"] },
  { id: "campagne", name: "Campagne", stage: 0, sky: ["#DCE8D4", "#C5D8B8"], image: "campagne.png" },
  { id: "japon", name: "Campagne japonaise", stage: 2, sky: ["#DDE4EC", "#C8D4E0"], image: "japon.png" },
  { id: "retro", name: "Ville rétro", stage: 3, sky: ["#EAD9C8", "#D9BBA4"], image: "retro.png" },
  { id: "futur", name: "Ville futuriste", stage: 3, sky: ["#E3E2F4", "#CBCBEA"], image: "futur.png" },
  { id: "jardin", name: "Jardin apaisant", stage: 4, sky: ["#E2EFE4", "#C9E2CE"], image: "jardin.png" },
];
/* Fond d'une scène : image du biome si présente (sinon dégradé) */
const biomeBg = (b) =>
  b.image
    ? `url(${import.meta.env.BASE_URL}biomes/${b.image}) center/cover no-repeat, linear-gradient(${b.sky[0]}, ${b.sky[1]})`
    : `linear-gradient(${b.sky[0]}, ${b.sky[1]})`;
const AMBIENCES = [
  { id: "aube", name: "Aube", overlay: "rgba(255,200,160,0.25)" },
  { id: "jour", name: "Jour", overlay: "rgba(255,255,255,0)" },
  { id: "crepuscule", name: "Crépuscule", overlay: "rgba(120,90,160,0.22)" },
  { id: "nuit", name: "Nuit", overlay: "rgba(30,40,80,0.38)" },
];
const WORLD_OBJECTS = [
  { id: "lanterne", name: "Lanterne", stage: 1 },
  { id: "bonsai", name: "Bonsaï", stage: 2 },
  { id: "the", name: "Service à thé", stage: 0 },
  { id: "coussin", name: "Coussin", stage: 0 },
  { id: "carillon", name: "Carillon", stage: 2 },
];

const INVENTORY_SEED = [
  { id: "riz", name: "Bol de riz doux", type: "Nourriture", desc: "Redonne un peu d'énergie à Tasky.", unlocked: true },
  { id: "the-vert", name: "Thé vert", type: "Nourriture", desc: "Un moment calme partagé.", unlocked: true },
  { id: "echarpe", name: "Écharpe", type: "Vêtements", desc: "Tenue de départ.", unlocked: true },
  { id: "cape", name: "Petite cape", type: "Vêtements", desc: "Débloquée au palier Rayonnement.", unlocked: false },
  { id: "pousse", name: "Petite pousse", type: "Décorations", desc: "Accessoire — palier Élan.", unlocked: false },
  { id: "lanterne", name: "Lanterne", type: "Décorations", desc: "Objet de monde — palier Élan.", unlocked: false },
  { id: "bonsai", name: "Bonsaï", type: "Décorations", desc: "Objet de monde — palier Ancrage.", unlocked: false },
  { id: "galet-souvenir", name: "Galet souvenir", type: "Objets émotionnels", desc: "Le premier jour avec Tasky.", unlocked: true },
];

const MOODS = ["Paisible", "Serein", "Curieux", "Joyeux", "Rayonnant"];

/* ---------- Utilitaires ---------- */

const todayISO = () => new Date().toISOString().slice(0, 10);
const uid = () => Math.random().toString(36).slice(2, 9);

/* Persistance locale (survit aux rafraîchissements) */
const STORE_KEY = "tasky:v1";
function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY)) || {};
  } catch {
    return {};
  }
}
function saveState(data) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
  } catch {
    /* quota plein ou stockage indisponible : on ignore */
  }
}

function seedTasks() {
  const t = todayISO();
  return [
    { id: uid(), name: "Préparer la journée", desc: "Trois priorités, pas plus.", priority: "douce", due: t, time: "08:30", repeat: "Quotidienne", category: "Soin de soi", effort: "5", done: false, subtasks: [] },
    { id: uid(), name: "Répondre aux messages importants", desc: "", priority: "importante", due: t, time: "", repeat: "Aucune", category: "Travail", effort: "15", done: false, subtasks: [{ id: uid(), name: "Trier la boîte", done: false }, { id: uid(), name: "Répondre aux 3 urgents", done: false }] },
    { id: uid(), name: "Session deep work — projet principal", desc: "Une seule chose à la fois.", priority: "focus", due: t, time: "14:00", repeat: "Aucune", category: "Travail", effort: "deep", done: false, subtasks: [] },
    { id: uid(), name: "Marche de 20 minutes", desc: "", priority: "normale", due: t, time: "", repeat: "Quotidienne", category: "Soin de soi", effort: "15", done: true, subtasks: [] },
  ];
}

function stageFor(xp) {
  let s = STAGES[0];
  for (const st of STAGES) if (xp >= st.min) s = st;
  return s;
}
function moodFor(affinity, energy) {
  const score = affinity * 0.6 + energy * 0.4;
  return MOODS[Math.min(MOODS.length - 1, Math.floor(score / 22))];
}

/* ---------- Retour sensoriel (son doux + haptique) ---------- */
let SOUND_ON = true;
let MOTION_ON = true;
let _audioCtx = null;
function playChime() {
  try {
    _audioCtx = _audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const ctx = _audioCtx;
    if (ctx.state === "suspended") ctx.resume();
    const now = ctx.currentTime;
    [587.33, 880].forEach((freq, i) => {
      const t = now + i * 0.085;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = freq;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.11, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0008, t + 0.5);
      o.connect(g);
      g.connect(ctx.destination);
      o.start(t);
      o.stop(t + 0.55);
    });
  } catch {
    /* audio indisponible : on ignore */
  }
}
/* Récompense tactile : appelée quand on offre une tâche à Tasky */
function offerFeedback() {
  if (SOUND_ON) playChime();
  if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(14);
}

/* ---------- Styles ---------- */

const css = `
@import url('https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@500;700&family=Albert+Sans:wght@400;500;600;700&display=swap');

:root { --r: 18px; }
[data-theme="light"] {
  --bg: #F4F3EF; --surface: #FFFFFF; --surface2: #FBFAF7;
  --ink: #2B2B28; --muted: #8A887F; --line: #E5E2DA;
  --shadow: 0 8px 30px rgba(40,40,30,0.07);
}
[data-theme="dark"] {
  --bg: #1C1C1A; --surface: #262624; --surface2: #2D2D2A;
  --ink: #ECEAE3; --muted: #95938A; --line: #3A3A36;
  --shadow: 0 8px 30px rgba(0,0,0,0.35);
}
.tasky-app { background: var(--bg); color: var(--ink); min-height: 100vh; font-family: 'Albert Sans', sans-serif; }
.tasky-app * { box-sizing: border-box; }
.tasky-app h1, .tasky-app h2, .tasky-app h3, .display { font-family: 'Shippori Mincho', serif; font-weight: 600; letter-spacing: 0.01em; margin: 0; }
.layout { display: flex; min-height: 100vh; }
.side { width: 218px; padding: 28px 16px; border-right: 1px solid var(--line); position: sticky; top: 0; height: 100vh; display: flex; flex-direction: column; gap: 4px; }
.brand { font-family: 'Shippori Mincho', serif; font-size: 22px; letter-spacing: 0.18em; padding: 0 12px 22px; }
.brand span { color: var(--accent); }
.navbtn { display: flex; align-items: center; gap: 10px; width: 100%; border: none; background: transparent; color: var(--muted); font: inherit; font-weight: 500; padding: 10px 12px; border-radius: 12px; cursor: pointer; text-align: left; }
.navbtn.on { background: var(--tint); color: var(--ink); }
.navbtn:hover { color: var(--ink); }
.navbtn svg { flex: none; }
.main { flex: 1; padding: 36px clamp(18px, 4vw, 52px) 110px; max-width: 1060px; }
.pagehead { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; margin-bottom: 26px; flex-wrap: wrap; }
.pagehead h1 { font-size: 30px; }
.sub { color: var(--muted); font-size: 14.5px; margin-top: 6px; }
.card { background: var(--surface); border: 1px solid var(--line); border-radius: var(--r); padding: 20px; box-shadow: var(--shadow); }
.btn { border: none; font: inherit; font-weight: 600; padding: 10px 18px; border-radius: 999px; cursor: pointer; background: var(--accent); color: #fff; }
.btn.ghost { background: transparent; color: var(--ink); border: 1px solid var(--line); }
.btn.soft { background: var(--tint); color: var(--ink); }
.btn:disabled { opacity: 0.4; cursor: default; }
.chip { display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px; font-weight: 500; color: var(--muted); background: var(--surface2); border: 1px solid var(--line); border-radius: 999px; padding: 3px 10px; }
.dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); display: inline-block; }
.bar { height: 8px; border-radius: 99px; background: var(--tint); overflow: hidden; }
.bar > div { height: 100%; border-radius: 99px; background: var(--accent); transition: width 0.6s ease; }
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.grid3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.seg { display: inline-flex; background: var(--surface2); border: 1px solid var(--line); border-radius: 999px; padding: 3px; gap: 2px; flex-wrap: wrap; }
.seg button { border: none; background: transparent; font: inherit; font-size: 13.5px; font-weight: 500; color: var(--muted); padding: 7px 14px; border-radius: 999px; cursor: pointer; }
.seg button.on { background: var(--surface); color: var(--ink); box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
.taskrow { display: flex; gap: 12px; padding: 14px 4px; border-bottom: 1px solid var(--line); align-items: flex-start; }
.taskrow:last-child { border-bottom: none; }
.check { width: 24px; height: 24px; border-radius: 50%; border: 2px solid var(--line); background: transparent; cursor: pointer; flex: none; margin-top: 2px; display: grid; place-items: center; transition: all 0.2s; }
.check.on { background: var(--accent); border-color: var(--accent); }
.tname { font-weight: 600; font-size: 15px; }
.tname.done { color: var(--muted); text-decoration: line-through; }
.field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
.field label { font-size: 13px; font-weight: 600; color: var(--muted); }
.field input, .field textarea, .field select { font: inherit; padding: 10px 12px; border-radius: 12px; border: 1px solid var(--line); background: var(--surface2); color: var(--ink); }
.field input:focus, .field textarea:focus, .field select:focus { outline: 2px solid var(--accent); outline-offset: 1px; }
.overlay { position: fixed; inset: 0; background: rgba(20,20,15,0.45); display: grid; place-items: center; z-index: 50; padding: 18px; }
.modal { background: var(--surface); border-radius: 22px; padding: 26px; width: min(560px, 100%); max-height: 88vh; overflow: auto; box-shadow: var(--shadow); }
.scene { border-radius: var(--r); position: relative; overflow: hidden; min-height: 240px; display: grid; place-items: end center; padding-bottom: 18px; }
.scene .ground { position: absolute; bottom: 0; left: 0; right: 0; height: 38%; background: rgba(255,255,255,0.28); border-radius: 100% 100% 0 0 / 60px 60px 0 0; }
.toast { position: fixed; bottom: 26px; left: 50%; transform: translateX(-50%); background: var(--ink); color: var(--bg); padding: 12px 22px; border-radius: 999px; font-weight: 600; font-size: 14px; z-index: 99; animation: pop 0.3s ease; box-shadow: var(--shadow); }
@keyframes pop { from { opacity: 0; transform: translate(-50%, 8px); } }
@keyframes floaty { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
.float { animation: floaty 4s ease-in-out infinite; }
[data-motion="off"] .float, [data-motion="off"] .breath-circle, [data-motion="off"] .focus-breath, [data-motion="off"] .tk-breathe, [data-motion="off"] .tk-blink { animation: none !important; }
@keyframes tkbreathe { 0%,100% { transform: scale(1); } 50% { transform: scale(1.035); } }
@keyframes tkblink { 0%,93%,100% { transform: scaleY(1); } 96.5% { transform: scaleY(0.12); } }
.tk-breathe { transform-box: fill-box; transform-origin: 50% 96%; animation: tkbreathe 4.6s ease-in-out infinite; }
.tk-blink { transform-box: fill-box; transform-origin: 50% 50%; animation: tkblink 5.4s ease-in-out infinite; }
.pick { border: 1.5px solid var(--line); background: var(--surface); border-radius: 16px; padding: 14px; cursor: pointer; text-align: left; font: inherit; color: var(--ink); transition: border-color 0.15s; }
.pick.on { border-color: var(--accent); background: var(--tint); }
.pick .pname { font-weight: 700; font-size: 14.5px; }
.pick .pdesc { font-size: 12.5px; color: var(--muted); margin-top: 3px; }
.statline { display: flex; justify-content: space-between; font-size: 13px; font-weight: 600; margin-bottom: 6px; }
.statline span:last-child { color: var(--muted); font-weight: 500; }
.mobilenav { display: none; }
.mobiletop { display: none; }
.mobilesubnav { display: none; }
.fab { position: fixed; right: 26px; bottom: 26px; width: 56px; height: 56px; border-radius: 50%; border: none; background: var(--accent); color: #fff; font-size: 26px; cursor: pointer; box-shadow: var(--shadow); z-index: 40; }
.breath-circle { width: 120px; height: 120px; border-radius: 50%; background: var(--tint); border: 2px solid var(--accent); animation: breath 8s ease-in-out infinite; }
@keyframes breath { 0%,100% { transform: scale(0.7); } 50% { transform: scale(1.15); } }
.focusmode { position: fixed; inset: 0; z-index: 60; display: flex; flex-direction: column; background: linear-gradient(var(--tint), var(--bg)); padding: max(20px, env(safe-area-inset-top)) 22px max(26px, env(safe-area-inset-bottom)); }
.focusmode .fm-top { display: flex; align-items: flex-start; justify-content: space-between; }
.focusmode .fm-x { width: 38px; height: 38px; border-radius: 50%; border: none; background: var(--surface); color: var(--ink); display: grid; place-items: center; cursor: pointer; }
.focusmode .fm-center { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 22px; text-align: center; }
.focus-rings { position: relative; width: 230px; height: 230px; display: grid; place-items: center; }
.focus-rings .ring { position: absolute; border-radius: 50%; }
.focus-breath { animation: breath 9s ease-in-out infinite; }
.fm-time { font-family: 'Shippori Mincho', serif; font-size: 42px; letter-spacing: 0.02em; color: var(--ink); }
.cal { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; }
.cal-dow { text-align: center; font-size: 12px; font-weight: 600; color: var(--muted); padding: 2px 0 6px; }
.cal-cell { aspect-ratio: 1 / 1; border: 1px solid var(--line); border-radius: 12px; background: var(--surface2); padding: 6px; cursor: pointer; display: flex; flex-direction: column; font: inherit; color: var(--ink); transition: border-color 0.15s, background 0.15s; }
.cal-cell.muted { opacity: 0.35; }
.cal-cell.today { border-color: var(--accent); }
.cal-cell.today .dnum { color: var(--accent); }
.cal-cell.sel { background: var(--tint); border-color: var(--accent); }
.cal-cell .dnum { font-size: 13px; font-weight: 600; }
.cal-dots { display: flex; gap: 3px; flex-wrap: wrap; margin-top: auto; }
.cal-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); }
@media (max-width: 820px) {
  .side { display: none; }
  .grid2, .grid3 { grid-template-columns: 1fr; }
  .main { padding: 0 16px 130px; }
  .mobiletop { display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 30; background: var(--bg); margin: 0 -16px; padding: 14px 16px 10px; }
  .mobiletop .brand { font-family: 'Shippori Mincho', serif; font-size: 18px; letter-spacing: 0.16em; padding: 0; }
  .mobiletop .brand span { color: var(--accent); }
  .mobiletop .topbtns { display: flex; gap: 6px; }
  .mobiletop button { width: 38px; height: 38px; border-radius: 50%; border: none; background: var(--surface); color: var(--ink); display: grid; place-items: center; cursor: pointer; }
  .mobilesubnav { display: block; margin-bottom: 14px; margin-top: 6px; }
  .pagehead { margin-top: 8px; }
  .mobilenav { display: flex; position: fixed; bottom: 0; left: 0; right: 0; background: var(--surface); border-top: 1px solid var(--line); z-index: 45; overflow-x: auto; }
  .mobilenav button { flex: 1; border: none; background: none; font: inherit; font-size: 10.5px; font-weight: 600; color: var(--muted); padding: 10px 6px 14px; display: flex; flex-direction: column; align-items: center; gap: 3px; cursor: pointer; min-width: 64px; }
  .mobilenav button.on { color: var(--accent); }
  .fab { bottom: 84px; }
}
`;

/* ---------- Icônes (traits simples) ---------- */
const Ic = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);
const ICONS = {
  today: "M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4M12 8a4 4 0 100 8 4 4 0 000-8z",
  tasks: "M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2",
  calendar: "M4 5h16a1 1 0 011 1v13a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1zM3 9h18M8 3v4M16 3v4",
  tasky: "M12 4c4 0 7 3 7 7 0 4.5-3 9-7 9s-7-4.5-7-9c0-4 3-7 7-7zM9.5 11h.01M14.5 11h.01M10 15c.6.6 1.2 1 2 1s1.4-.4 2-1",
  world: "M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9z",
  rituals: "M12 21c-4-2-7-5.5-7-9.5C5 7 8 4 12 4s7 3 7 7.5c0 4-3 7.5-7 9.5zM12 8v5M9.5 10.5h5",
  journal: "M5 4h11a2 2 0 012 2v14H7a2 2 0 01-2-2V4zM5 4a2 2 0 012-2h9M9 9h6M9 13h4",
  inventory: "M4 8l8-5 8 5v8l-8 5-8-5V8zM4 8l8 5 8-5M12 13v8",
  settings: "M12 9a3 3 0 100 6 3 3 0 000-6zM19 12a7 7 0 00-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 00-2-1.2L14 3h-4l-.5 2.6a7 7 0 00-2 1.2l-2.4-1-2 3.4 2 1.6A7 7 0 005 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.4 2.4-1c.6.5 1.3.9 2 1.2L10 21h4l.5-2.6c.7-.3 1.4-.7 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z",
};
const NAV = [
  { id: "today", name: "Aujourd'hui" }, { id: "tasks", name: "Tâches" }, { id: "calendar", name: "Calendrier" }, { id: "tasky", name: "Tasky" },
  { id: "world", name: "Monde" }, { id: "rituals", name: "Rituels" }, { id: "journal", name: "Journal" },
  { id: "inventory", name: "Inventaire" }, { id: "settings", name: "Réglages" },
];

/* Navigation mobile : 4 zones au pouce (le reste est accessible par sous-onglets ou en touchant Tasky) */
const ZONES = [
  { id: "today", name: "Aujourd'hui", icon: "today", pages: [["today", "Aujourd'hui"]] },
  { id: "temps", name: "Temps", icon: "calendar", pages: [["tasks", "Tâches"], ["calendar", "Calendrier"]] },
  { id: "compagnon", name: "Compagnon", icon: "tasky", pages: [["tasky", "Tasky"], ["world", "Monde"], ["inventory", "Inventaire"]] },
  { id: "toi", name: "Toi", icon: "rituals", pages: [["rituals", "Rituels"], ["journal", "Journal"]] },
];
const zoneForPage = (page) => ZONES.find((z) => z.pages.some(([id]) => id === page));

/* ============================================================
   TaskyAvatar — MOTEUR D'AVATAR PLUGGABLE
   L'app appelle toujours <TaskyAvatar .../> ; en interne il choisit
   un moteur de rendu (engine). Pour brancher de vrais assets un jour :
   ajouter un moteur (images, Lottie…) dans AVATAR_ENGINES — mêmes props,
   rien d'autre à changer dans l'app.
   Props : silhouette, eyes, accessory, outfit, mood, stage, size, accent, floating, engine
   ============================================================ */
const AVATAR_BODIES = {
  galet: "M75 20 C115 20 135 55 135 90 C135 122 110 138 75 138 C40 138 15 122 15 90 C15 55 35 20 75 20 Z",
  flamme: "M75 14 C100 38 132 62 132 96 C132 124 106 140 75 140 C44 140 18 124 18 96 C18 62 50 38 75 14 Z",
  feuille: "M75 16 C120 28 136 68 128 102 C122 128 100 140 75 140 C50 140 28 128 22 102 C14 68 30 28 75 16 Z",
  carre: "M40 24 H110 C126 24 134 36 134 56 V104 C134 126 122 138 100 138 H50 C28 138 16 126 16 104 V56 C16 36 24 24 40 24 Z",
};

/* Moteur SVG — vectoriel, thémable, animé (respiration + clignement) */
function TaskyAvatarSVG({ silhouette = "galet", eyes = "doux", accessory = "aucun", outfit = "aucune", mood = "Serein", stage = 0, size = 150, accent = "#6B8F71", floating = true }) {
  const body = AVATAR_BODIES[silhouette] || AVATAR_BODIES.galet;
  const happy = ["Joyeux", "Rayonnant"].includes(mood);
  const eyeY = 78;
  const renderEyes = () => {
    if (eyes === "rond") return (<g fill="#2B2B28"><circle cx="55" cy={eyeY} r="6" /><circle cx="95" cy={eyeY} r="6" /></g>);
    if (eyes === "etoile") return (<g fill="#2B2B28"><path d={`M55 ${eyeY-7} l2.2 4.6 5 .7-3.6 3.5.8 5-4.4-2.4-4.4 2.4.8-5-3.6-3.5 5-.7z`} /><path d={`M95 ${eyeY-7} l2.2 4.6 5 .7-3.6 3.5.8 5-4.4-2.4-4.4 2.4.8-5-3.6-3.5 5-.7z`} /></g>);
    if (eyes === "calme") return (<g stroke="#2B2B28" strokeWidth="3.4" strokeLinecap="round"><path d={`M48 ${eyeY} h14`} /><path d={`M88 ${eyeY} h14`} /></g>);
    return (<g stroke="#2B2B28" strokeWidth="3.4" strokeLinecap="round" fill="none"><path d={`M48 ${eyeY+2} q7 ${happy ? -9 : -6} 14 0`} /><path d={`M88 ${eyeY+2} q7 ${happy ? -9 : -6} 14 0`} /></g>);
  };
  const gid = useRef("tk" + Math.random().toString(36).slice(2, 7)).current;
  return (
    <div className={floating ? "float" : ""} style={{ width: size, height: size }} aria-label={`Tasky, humeur ${mood}`}>
      <svg viewBox="0 0 150 150" width={size} height={size}>
        <defs>
          <linearGradient id={`shine-${gid}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity="0.4" /><stop offset="0.45" stopColor="#fff" stopOpacity="0" /></linearGradient>
          <linearGradient id={`shade-${gid}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0.55" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.16" /></linearGradient>
          <clipPath id={`clip-${gid}`}><path d={body} /></clipPath>
        </defs>
        {stage >= 4 && <circle cx="75" cy="80" r="68" fill={accent} opacity="0.12" />}
        <ellipse cx="75" cy="142" rx="42" ry="6" fill="#000" opacity="0.08" />
        <g className="tk-breathe">
          <path d={body} fill={accent} />
          <g clipPath={`url(#clip-${gid})`}>
            <path d={body} fill={`url(#shade-${gid})`} />
            <ellipse cx="56" cy="52" rx="30" ry="20" fill="#fff" opacity="0.22" />
          </g>
          <path d={body} fill={`url(#shine-${gid})`} />
          {/* Slot tenue (bas) */}
          {outfit === "echarpe" && <path d="M40 108 q35 14 70 0 l-3 12 q-32 12 -64 0 z" fill={accent} opacity="0.6" />}
          {outfit === "cape" && <path d="M30 70 q-14 40 4 62 q40 10 82 0 q18 -22 4 -62 q-45 -16 -90 0z" fill={accent} opacity="0.32" />}
          <g className="tk-blink">{renderEyes()}</g>
          <path d={`M66 ${happy ? 94 : 96} q9 ${happy ? 10 : 6} 18 0`} stroke="#2B2B28" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          {happy && <g fill="#E08A6D" opacity="0.5"><circle cx="44" cy="92" r="5.5" /><circle cx="106" cy="92" r="5.5" /></g>}
          {/* Slot accessoire (tête) */}
          {accessory === "pousse" && <g><path d="M75 22 q-2 -12 -10 -15 q12 -1 12 13" fill="#6B8F71" /><path d="M77 22 q2 -12 10 -15 q-12 -1 -12 13" fill="#8FB08A" /></g>}
          {accessory === "beret" && <path d="M42 34 q33 -26 66 0 q-8 -8 -33 -8 t-33 8z" fill="#2B2B28" opacity="0.8" />}
          {accessory === "antenne" && <g><line x1="75" y1="22" x2="75" y2="6" stroke="#2B2B28" strokeWidth="2.6" /><circle cx="75" cy="5" r="4.5" fill={accent} /></g>}
        </g>
      </svg>
    </div>
  );
}

/* Registre des moteurs d'avatar — ajouter ici "images" / "lottie" plus tard */
const AVATAR_ENGINES = { svg: TaskyAvatarSVG };
function TaskyAvatar(props) {
  const Engine = AVATAR_ENGINES[props.engine] || AVATAR_ENGINES.svg;
  return <Engine {...props} />;
}

/* ---------- Petits composants ---------- */
const Stat = ({ label, value, max = 100 }) => (
  <div style={{ marginBottom: 14 }}>
    <div className="statline"><span>{label}</span><span>{Math.round(value)} / {max}</span></div>
    <div className="bar"><div style={{ width: `${Math.min(100, (value / max) * 100)}%` }} /></div>
  </div>
);

/* ============================================================
   APP
   ============================================================ */
export default function TaskyApp() {
  const [saved] = useState(loadState);
  const [theme, setTheme] = useState(saved.theme ?? "light");
  const [motion, setMotion] = useState(saved.motion ?? "on");
  const [sounds, setSounds] = useState(saved.sounds ?? true);
  const [notifs, setNotifs] = useState(saved.notifs ?? true);
  const [page, setPage] = useState("today");
  const [onboarded, setOnboarded] = useState(saved.onboarded ?? false);
  const [profile, setProfile] = useState(saved.profile ?? { styleId: "zen", silhouette: "galet", eyes: "doux", accessory: "aucun", outfit: "aucune" });
  const [tasks, setTasks] = useState(() => saved.tasks ?? seedTasks());
  const [xp, setXp] = useState(saved.xp ?? 0);
  const [energy, setEnergy] = useState(saved.energy ?? 42);
  const [affinity, setAffinity] = useState(saved.affinity ?? 18);
  const [world, setWorld] = useState(saved.world ?? { biome: "chambre", ambience: "jour", objects: ["coussin"] });
  const [rituals, setRituals] = useState(() => saved.rituals ?? [
    { id: uid(), name: "Check-in du matin", done: false },
    { id: uid(), name: "Pause respiration", done: false },
    { id: uid(), name: "Une gratitude", done: false },
  ]);
  const [journal, setJournal] = useState(saved.journal ?? []);
  const [inventory, setInventory] = useState(saved.inventory ?? INVENTORY_SEED);
  const [history, setHistory] = useState(saved.history ?? [{ date: todayISO(), text: "Tasky s'éveille pour la première fois." }]);
  const [showNew, setShowNew] = useState(false);
  const [newTaskDate, setNewTaskDate] = useState(null);
  const [toast, setToast] = useState(null);
  const [breathing, setBreathing] = useState(false);
  const [focusTask, setFocusTask] = useState(null);
  const prevStage = useRef(stageFor(saved.xp ?? 0).id);

  const style = STYLES.find((s) => s.id === profile.styleId) || STYLES[0];
  const stage = stageFor(xp);
  const mood = moodFor(affinity, energy);
  const nextStage = STAGES.find((s) => s.min > xp);

  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2600); };
  const openNew = (date = null) => { setNewTaskDate(date); setShowNew(true); };
  const closeNew = () => { setShowNew(false); setNewTaskDate(null); };

  /* Paliers : déblocages */
  useEffect(() => {
    if (stage.id > prevStage.current) {
      notify(`✦ Palier atteint : ${stage.name} — ${stage.unlock}`);
      setHistory((h) => [{ date: todayISO(), text: `Tasky atteint le palier « ${stage.name} ». ${stage.unlock}.` }, ...h]);
      const unlockIds = { 1: ["pousse", "lanterne"], 2: ["bonsai"], 3: ["cape"], 4: [] }[stage.id] || [];
      setInventory((inv) => inv.map((i) => (unlockIds.includes(i.id) ? { ...i, unlocked: true } : i)));
      prevStage.current = stage.id;
    }
  }, [stage.id]);

  /* Sauvegarde automatique dans le navigateur */
  useEffect(() => {
    saveState({ theme, motion, sounds, notifs, onboarded, profile, tasks, xp, energy, affinity, world, rituals, journal, inventory, history });
  }, [theme, motion, sounds, notifs, onboarded, profile, tasks, xp, energy, affinity, world, rituals, journal, inventory, history]);

  /* Préférences accessibles au retour sensoriel (son/haptique des TaskRow) */
  useEffect(() => { SOUND_ON = sounds; }, [sounds]);
  useEffect(() => { MOTION_ON = motion === "on"; }, [motion]);

  const completeTask = (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const nowDone = !task.done;
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, done: nowDone } : t)));
    if (nowDone) {
      const eff = EFFORTS.find((e) => e.id === task.effort) || EFFORTS[1];
      const bonus = task.priority === "focus" ? 6 : task.priority === "importante" ? 3 : 0;
      setXp((x) => x + eff.xp + bonus);
      setEnergy((e) => Math.min(100, e + 10));
      setAffinity((a) => Math.min(100, a + 2));
      notify("Tasky s'illumine doucement ✦");
    }
  };
  const toggleSub = (taskId, subId) => setTasks((ts) => ts.map((t) => t.id === taskId ? { ...t, subtasks: t.subtasks.map((s) => (s.id === subId ? { ...s, done: !s.done } : s)) } : t));
  const addTask = (t) => { setTasks((ts) => [{ ...t, id: uid(), done: false }, ...ts]); closeNew(); notify("Tâche ajoutée"); };
  const checkRitual = (id) => {
    const r = rituals.find((x) => x.id === id);
    if (!r) return;
    if (!r.done) {
      setAffinity((a) => Math.min(100, a + 4));
      setEnergy((e) => Math.min(100, e + 4));
      notify("Tasky apprécie ce moment calme");
    }
    setRituals((rs) => rs.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
  };
  const addJournal = (entry) => { setJournal((j) => [{ ...entry, id: uid(), date: todayISO() }, ...j]); setAffinity((a) => Math.min(100, a + 3)); notify("Souvenir ajouté au journal"); };

  /* Un objet de l'inventaire est-il actuellement actif (placé / équipé) ? */
  const itemActive = (item) =>
    ((item.id === "lanterne" || item.id === "bonsai") && world.objects.includes(item.id)) ||
    (item.id === "pousse" && profile.accessory === "pousse") ||
    ((item.id === "echarpe" || item.id === "cape") && profile.outfit === item.id);

  /* Cliquer un objet de l'inventaire : le place dans le monde, l'équipe, ou le partage */
  const useItem = (item) => {
    if (!item.unlocked) return;
    if (item.id === "lanterne" || item.id === "bonsai") {
      const has = world.objects.includes(item.id);
      setWorld((w) => ({ ...w, objects: has ? w.objects.filter((x) => x !== item.id) : [...w.objects, item.id] }));
      notify(has ? `${item.name} retiré du monde` : `${item.name} placé dans le monde ✦`);
    } else if (item.id === "pousse") {
      const on = profile.accessory === "pousse";
      setProfile((p) => ({ ...p, accessory: on ? "aucun" : "pousse" }));
      notify(on ? "Petite pousse retirée" : "Petite pousse ajoutée à Tasky ✦");
    } else if (item.id === "echarpe" || item.id === "cape") {
      const on = profile.outfit === item.id;
      setProfile((p) => ({ ...p, outfit: on ? "aucune" : item.id }));
      notify(on ? `${item.name} retirée` : `${item.name} portée par Tasky ✦`);
    } else if (item.type === "Nourriture") {
      setEnergy((e) => Math.min(100, e + 12));
      setAffinity((a) => Math.min(100, a + 2));
      notify(`${item.name} partagé avec Tasky ✦`);
    } else {
      notify(item.desc);
    }
  };

  const t = todayISO();
  const todayTasks = tasks.filter((x) => x.due === t && !x.done);
  const doneToday = tasks.filter((x) => x.due === t && x.done).length;
  const totalToday = tasks.filter((x) => x.due === t).length;
  const biome = BIOMES.find((b) => b.id === world.biome) || BIOMES[0];
  const ambience = AMBIENCES.find((a) => a.id === world.ambience) || AMBIENCES[1];

  const avatarProps = { ...profile, mood, stage: stage.id, accent: style.accent };

  const vars = { "--accent": style.accent, "--accent2": style.accent2, "--tint": theme === "dark" ? "rgba(255,255,255,0.07)" : style.tint };
  const curZone = zoneForPage(page);

  if (!onboarded) {
    return (
      <div className="tasky-app" data-theme={theme} data-motion={motion} style={vars}>
        <style>{css}</style>
        <Onboarding profile={profile} setProfile={setProfile} onDone={() => { setOnboarded(true); notify("Tasky vous rejoint ✦"); }} />
        {toast && <div className="toast">{toast}</div>}
      </div>
    );
  }

  return (
    <div className="tasky-app" data-theme={theme} data-motion={motion} style={vars}>
      <style>{css}</style>
      <div className="layout">
        <aside className="side">
          <div className="brand">TASK<span>Y</span></div>
          {NAV.map((n) => (
            <button key={n.id} className={`navbtn ${page === n.id ? "on" : ""}`} onClick={() => setPage(n.id)}>
              <Ic d={ICONS[n.id]} /> {n.name}
            </button>
          ))}
        </aside>

        <main className="main">
          <div className="mobiletop">
            <div className="brand">TASK<span>Y</span></div>
            <div className="topbtns">
              <button aria-label="Monde" onClick={() => setPage("world")}><Ic d={ICONS.world} size={19} /></button>
              <button aria-label="Réglages" onClick={() => setPage("settings")}><Ic d={ICONS.settings} size={19} /></button>
            </div>
          </div>
          {curZone && curZone.pages.length > 1 && (
            <div className="mobilesubnav">
              <div className="seg">
                {curZone.pages.map(([id, label]) => (
                  <button key={id} className={page === id ? "on" : ""} onClick={() => setPage(id)}>{label}</button>
                ))}
              </div>
            </div>
          )}
          {page === "today" && (
            <>
              <div className="pagehead">
                <div><h1>Aujourd'hui</h1><div className="sub">{new Date().toLocaleDateString("fr-CH", { weekday: "long", day: "numeric", month: "long" })} · Tasky est {mood.toLowerCase()}</div></div>
                <button className="btn" onClick={() => openNew()}>+ Ajouter une tâche</button>
              </div>
              <div className="grid2">
                <div className="card scene" style={{ background: biomeBg(biome) }}>
                  <div style={{ position: "absolute", inset: 0, background: ambience.overlay }} />
                  <div className="ground" />
                  <button onClick={() => setPage("tasky")} aria-label="Voir Tasky de près" style={{ position: "relative", zIndex: 1, textAlign: "center", border: "none", background: "transparent", cursor: "pointer", padding: 0 }}>
                    <TaskyAvatar {...avatarProps} size={150} floating={motion === "on"} />
                    <div className="display" style={{ fontSize: 15, marginTop: 4, color: "#2B2B28" }}>{stage.name}</div>
                  </button>
                </div>
                <div className="card">
                  <h3 style={{ fontSize: 18, marginBottom: 16 }}>Résumé du jour</h3>
                  <Stat label="Progression du jour" value={totalToday ? (doneToday / totalToday) * 100 : 0} />
                  <Stat label="Énergie" value={energy} />
                  <Stat label="Humeur" value={(MOODS.indexOf(mood) + 1) * 20} />
                  <div className="sub">{doneToday} tâche{doneToday > 1 ? "s" : ""} accomplie{doneToday > 1 ? "s" : ""} · {todayTasks.length} restante{todayTasks.length > 1 ? "s" : ""}</div>
                </div>
              </div>

              <div className="card" style={{ marginTop: 18 }}>
                <h3 style={{ fontSize: 18, marginBottom: 6 }}>Tâches du jour</h3>
                {todayTasks.length === 0 && <div className="sub" style={{ padding: "14px 0" }}>Tout est calme. Ajoutez une tâche, ou profitez du moment avec Tasky.</div>}
                {[...todayTasks].sort((a, b) => (a.priority === "focus" ? -1 : 1)).map((task) => (
                  <TaskRow key={task.id} task={task} onToggle={completeTask} onSub={toggleSub} onFocus={setFocusTask} />
                ))}
              </div>
            </>
          )}

          {page === "tasks" && <TasksPage tasks={tasks} onToggle={completeTask} onSub={toggleSub} onNew={() => openNew()} onFocus={setFocusTask} />}
          {page === "calendar" && <CalendarPage tasks={tasks} onToggle={completeTask} onSub={toggleSub} onNew={openNew} onFocus={setFocusTask} />}
          {page === "tasky" && <TaskyPage profile={profile} setProfile={setProfile} stage={stage} nextStage={nextStage} xp={xp} energy={energy} affinity={affinity} mood={mood} history={history} inventory={inventory} avatarProps={avatarProps} motion={motion} />}
          {page === "world" && <WorldPage world={world} setWorld={setWorld} stage={stage} avatarProps={avatarProps} motion={motion} />}
          {page === "rituals" && <RitualsPage rituals={rituals} onCheck={checkRitual} onBreath={() => setBreathing(true)} onGratitude={(txt) => addJournal({ mood: "Serein", note: `Gratitude — ${txt}` })} />}
          {page === "journal" && <JournalPage journal={journal} onAdd={addJournal} />}
          {page === "inventory" && <InventoryPage inventory={inventory} onUse={useItem} isActive={itemActive} />}
          {page === "settings" && <SettingsPage theme={theme} setTheme={setTheme} motion={motion} setMotion={setMotion} sounds={sounds} setSounds={setSounds} notifs={notifs} setNotifs={setNotifs} onReset={() => { try { localStorage.removeItem(STORE_KEY); } catch {} window.location.reload(); }} />}
        </main>
      </div>

      <nav className="mobilenav">
        {ZONES.map((z) => (
          <button key={z.id} className={curZone?.id === z.id ? "on" : ""} onClick={() => setPage(z.pages[0][0])}><Ic d={ICONS[z.icon]} size={20} />{z.name}</button>
        ))}
      </nav>
      <button className="fab" onClick={() => openNew()} aria-label="Ajouter une tâche">+</button>

      {focusTask && <FocusMode task={focusTask} avatarProps={avatarProps} accent={style.accent} motion={motion} onClose={() => setFocusTask(null)} onComplete={() => { completeTask(focusTask.id); setFocusTask(null); }} />}
      {showNew && <NewTaskModal onClose={closeNew} onSave={addTask} initialDue={newTaskDate} />}
      {breathing && (
        <div className="overlay" onClick={() => setBreathing(false)}>
          <div style={{ textAlign: "center", color: "#fff" }}>
            <div className="breath-circle" style={{ margin: "0 auto 24px" }} />
            <div className="display" style={{ fontSize: 20 }}>Inspirez… expirez…</div>
            <div style={{ opacity: 0.8, marginTop: 8, fontSize: 14 }}>Touchez l'écran pour terminer</div>
          </div>
        </div>
      )}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

/* ---------- Onboarding ---------- */
function Onboarding({ profile, setProfile, onDone }) {
  const [step, setStep] = useState(0);
  const steps = ["Style", "Silhouette", "Regard", "Accessoire", "Tenue"];
  const style = STYLES.find((s) => s.id === profile.styleId) || STYLES[0];
  const set = (k, v) => setProfile((p) => ({ ...p, [k]: v }));
  const opts = [
    { key: "styleId", items: STYLES, title: "Quel univers vous ressemble ?", sub: "Ce choix teinte le monde de Tasky — et toute l'application." },
    { key: "silhouette", items: SILHOUETTES, title: "Sa silhouette", sub: "La forme de base de votre compagnon." },
    { key: "eyes", items: EYES, title: "Son regard", sub: "L'expression de départ de Tasky." },
    { key: "accessory", items: ACCESSORIES, title: "Un premier accessoire", sub: "D'autres se débloqueront avec le temps." },
    { key: "outfit", items: OUTFITS, title: "Sa tenue de départ", sub: "Tasky est prêt à vous rencontrer." },
  ];
  const cur = opts[step];
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 20 }}>
      <div style={{ width: "min(620px, 100%)", textAlign: "center" }}>
        <div className="display" style={{ fontSize: 14, letterSpacing: "0.3em", color: "var(--muted)", marginBottom: 6 }}>TASKY</div>
        <h1 style={{ fontSize: 26, marginBottom: 4 }}>{cur.title}</h1>
        <div className="sub" style={{ marginBottom: 22 }}>{cur.sub}</div>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 26 }}>
          <TaskyAvatar {...profile} accent={style.accent} mood="Curieux" size={140} />
        </div>
        <div className="grid3" style={{ marginBottom: 26, textAlign: "left" }}>
          {cur.items.map((it) => (
            <button key={it.id} className={`pick ${profile[cur.key] === it.id ? "on" : ""}`} onClick={() => set(cur.key, it.id)}>
              <div className="pname">{it.name}</div>
              {it.desc && <div className="pdesc">{it.desc}</div>}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
          {step > 0 && <button className="btn ghost" onClick={() => setStep(step - 1)}>Retour</button>}
          {step < steps.length - 1
            ? <button className="btn" onClick={() => setStep(step + 1)}>Continuer</button>
            : <button className="btn" onClick={onDone}>Rencontrer Tasky</button>}
        </div>
        <div className="sub" style={{ marginTop: 16 }}>{step + 1} / {steps.length} · {steps[step]}</div>
      </div>
    </div>
  );
}

/* ---------- Ligne de tâche ---------- */
/* Geste signature (mobile) : glisser vers la droite pour « offrir » la tâche à Tasky */
function TaskRow({ task, onToggle, onSub, onFocus }) {
  const p = PRIORITIES.find((x) => x.id === task.priority);
  const e = EFFORTS.find((x) => x.id === task.effort);
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [offering, setOffering] = useState(false);
  const start = useRef(null);
  const canSwipe = !task.done && !offering;

  const begin = (x, y) => { if (!canSwipe) return; start.current = { x, y, decided: false, horiz: false, dx: 0 }; setDragging(true); };
  const move = (x, y) => {
    const s = start.current; if (!s) return;
    const ddx = x - s.x, ddy = y - s.y;
    if (!s.decided && (Math.abs(ddx) > 8 || Math.abs(ddy) > 8)) { s.decided = true; s.horiz = Math.abs(ddx) > Math.abs(ddy); }
    if (s.horiz) { s.dx = Math.max(0, ddx); setDx(s.dx); }
  };
  const end = () => {
    const s = start.current; start.current = null; setDragging(false);
    if (s && s.horiz && s.dx > 78) {
      offerFeedback();
      setOffering(true);
      setTimeout(() => onToggle(task.id), MOTION_ON ? 400 : 0);
    } else {
      setDx(0);
    }
  };

  const transform = offering ? "translate(46px, -130px) scale(0.82)" : `translateX(${dx}px)`;
  const opacity = offering ? 0 : Math.max(0.15, 1 - dx / 320);
  const transition = dragging ? "none" : "transform 0.4s cubic-bezier(.2,.8,.2,1), opacity 0.4s ease";

  return (
    <div
      className="taskrow"
      style={{ transform, opacity, transition, background: "var(--surface)", touchAction: canSwipe ? "pan-y" : undefined, willChange: "transform", position: "relative", zIndex: offering ? 3 : 1 }}
      onTouchStart={(ev) => begin(ev.touches[0].clientX, ev.touches[0].clientY)}
      onTouchMove={(ev) => move(ev.touches[0].clientX, ev.touches[0].clientY)}
      onTouchEnd={end}
    >
      {canSwipe && dx > 4 && (
        <div style={{ position: "absolute", left: -2, top: 0, bottom: 0, display: "flex", alignItems: "center", gap: 6, color: "var(--accent)", fontSize: 13, fontWeight: 600, opacity: Math.min(1, dx / 78), transform: "translateX(-100%)", paddingRight: 12, pointerEvents: "none", whiteSpace: "nowrap" }}>
          Offrir à Tasky ✦
        </div>
      )}
      <button className={`check ${task.done ? "on" : ""}`} onClick={() => onToggle(task.id)} aria-label="Terminer la tâche">
        {task.done && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round"><path d="M5 13l4 4 10-11" /></svg>}
      </button>
      <div style={{ flex: 1 }}>
        <div className={`tname ${task.done ? "done" : ""}`}>{task.name}</div>
        {task.desc && <div className="sub" style={{ marginTop: 2 }}>{task.desc}</div>}
        <div style={{ display: "flex", gap: 6, marginTop: 7, flexWrap: "wrap" }}>
          <span className="chip"><span className="dot" style={{ background: p?.tone }} />{p?.name}</span>
          <span className="chip">{task.category}</span>
          <span className="chip">{e?.name}</span>
          {task.time && <span className="chip">{task.time}</span>}
          {task.repeat !== "Aucune" && <span className="chip">↻ {task.repeat}</span>}
        </div>
        {task.subtasks.length > 0 && (
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            {task.subtasks.map((s) => (
              <label key={s.id} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13.5, color: s.done ? "var(--muted)" : "var(--ink)", cursor: "pointer" }}>
                <input type="checkbox" checked={s.done} onChange={() => onSub(task.id, s.id)} /> {s.name}
              </label>
            ))}
          </div>
        )}
      </div>
      {onFocus && !task.done && (
        <button onClick={() => onFocus(task)} aria-label="Démarrer le focus" title="Focus — une seule chose" style={{ flex: "none", alignSelf: "center", width: 34, height: 34, borderRadius: "50%", border: "1px solid var(--line)", background: "var(--surface2)", color: "var(--accent)", display: "grid", placeItems: "center", cursor: "pointer" }}>
          <Ic d="M7 5l12 7-12 7z" size={15} />
        </button>
      )}
    </div>
  );
}

/* ---------- Mode Focus — « une seule chose » ---------- */
function FocusMode({ task, avatarProps, accent, motion, onClose, onComplete }) {
  const mins = { "5": 5, "15": 15, "30": 30, deep: 25 }[task.effort] || 15;
  const [left, setLeft] = useState(mins * 60);
  const [running, setRunning] = useState(true);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [running]);
  const done = left === 0;
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  const offer = () => { offerFeedback(); onComplete(); };
  return (
    <div className="focusmode">
      <div className="fm-top">
        <div>
          <div className="display" style={{ fontSize: 16 }}>Focus</div>
          <div className="sub" style={{ marginTop: 0 }}>une seule chose</div>
        </div>
        <button className="fm-x" onClick={onClose} aria-label="Quitter le focus"><Ic d="M6 6l12 12M18 6L6 18" size={18} /></button>
      </div>

      <div className="fm-center">
        <div className="focus-rings">
          <span className="ring" style={{ inset: 0, background: accent, opacity: 0.08 }} />
          <span className={`ring ${motion === "on" ? "focus-breath" : ""}`} style={{ width: 150, height: 150, border: `2px solid ${accent}`, opacity: 0.45 }} />
          <TaskyAvatar {...avatarProps} size={108} floating={false} />
        </div>

        <div className="sub" style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 0 }}>
          <Ic d="M3 12h4l2-7 4 14 2-7h4" size={16} /> {done ? "Beau travail — offre-la à Tasky" : "inspire… expire… avec Tasky"}
        </div>

        <div>
          <div className="sub" style={{ marginTop: 0 }}>en cours</div>
          <div className="display" style={{ fontSize: 21, marginTop: 2 }}>{task.name}</div>
          {task.desc && <div className="sub" style={{ marginTop: 2 }}>{task.desc}</div>}
        </div>

        <div className="fm-time" style={done ? { color: accent } : {}}>{mm}:{ss}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <button className="btn" onClick={offer} style={{ width: "100%", padding: 15, fontSize: 15 }}>✦ Offrir à Tasky</button>
        <button onClick={() => setRunning((r) => !r)} style={{ border: "none", background: "transparent", color: "var(--muted)", font: "inherit", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          {running ? <><Ic d="M8 5v14M16 5v14" size={15} /> mettre en pause</> : <><Ic d="M7 5l12 7-12 7z" size={15} /> reprendre</>}
        </button>
      </div>
    </div>
  );
}

/* ---------- Tâches ---------- */
function TasksPage({ tasks, onToggle, onSub, onNew, onFocus }) {
  const [view, setView] = useState("today");
  const [prio, setPrio] = useState("toutes");
  const [cat, setCat] = useState("toutes");
  const t = todayISO();
  const filtered = tasks.filter((x) => {
    if (view === "today" && (x.due !== t || x.done)) return false;
    if (view === "upcoming" && (x.due <= t || x.done)) return false;
    if (view === "done" && !x.done) return false;
    if (view === "repeat" && x.repeat === "Aucune") return false;
    if (prio !== "toutes" && x.priority !== prio) return false;
    if (cat !== "toutes" && x.category !== cat) return false;
    return true;
  });
  return (
    <>
      <div className="pagehead">
        <div><h1>Tâches</h1><div className="sub">Votre liste complète, sans pression.</div></div>
        <button className="btn" onClick={onNew}>+ Nouvelle tâche</button>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18, alignItems: "center" }}>
        <div className="seg">
          {[["today", "Aujourd'hui"], ["upcoming", "À venir"], ["done", "Terminées"], ["repeat", "Récurrentes"]].map(([id, name]) => (
            <button key={id} className={view === id ? "on" : ""} onClick={() => setView(id)}>{name}</button>
          ))}
        </div>
        <select value={prio} onChange={(e) => setPrio(e.target.value)} style={{ font: "inherit", padding: "8px 12px", borderRadius: 999, border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink)" }}>
          <option value="toutes">Toutes priorités</option>
          {PRIORITIES.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select value={cat} onChange={(e) => setCat(e.target.value)} style={{ font: "inherit", padding: "8px 12px", borderRadius: 999, border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink)" }}>
          <option value="toutes">Toutes catégories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="card">
        {filtered.length === 0 && <div className="sub" style={{ padding: "16px 0" }}>Rien ici pour le moment — et c'est très bien.</div>}
        {filtered.map((task) => <TaskRow key={task.id} task={task} onToggle={onToggle} onSub={onSub} onFocus={onFocus} />)}
      </div>
    </>
  );
}

/* ---------- Calendrier ---------- */
const CAL_WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const CAL_MONTHS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const ymdLocal = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function CalendarPage({ tasks, onToggle, onSub, onNew, onFocus }) {
  const today = new Date();
  const [cursor, setCursor] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [selected, setSelected] = useState(ymdLocal(today));

  const first = new Date(cursor.y, cursor.m, 1);
  const startDow = (first.getDay() + 6) % 7; // semaine commençant lundi
  const daysInMonth = new Date(cursor.y, cursor.m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push({ date: new Date(cursor.y, cursor.m, 1 - (startDow - i)), inMonth: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ date: new Date(cursor.y, cursor.m, d), inMonth: true });
  while (cells.length % 7 !== 0) { const last = cells[cells.length - 1].date; cells.push({ date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1), inMonth: false }); }

  const byDay = {};
  tasks.forEach((t) => { if (t.due) (byDay[t.due] = byDay[t.due] || []).push(t); });
  const todayISOv = ymdLocal(today);
  const selTasks = tasks.filter((t) => t.due === selected);
  const selLabel = new Date(selected + "T00:00:00").toLocaleDateString("fr-CH", { weekday: "long", day: "numeric", month: "long" });

  const prevMonth = () => setCursor((c) => (c.m === 0 ? { y: c.y - 1, m: 11 } : { y: c.y, m: c.m - 1 }));
  const nextMonth = () => setCursor((c) => (c.m === 11 ? { y: c.y + 1, m: 0 } : { y: c.y, m: c.m + 1 }));

  return (
    <>
      <div className="pagehead">
        <div><h1>Calendrier</h1><div className="sub">Vos tâches, jour après jour.</div></div>
        <button className="btn" onClick={() => onNew(selected)}>+ Ajouter ce jour</button>
      </div>
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <button className="btn ghost" onClick={prevMonth} aria-label="Mois précédent">‹</button>
          <div className="display" style={{ fontSize: 18 }}>{CAL_MONTHS[cursor.m]} {cursor.y}</div>
          <button className="btn ghost" onClick={nextMonth} aria-label="Mois suivant">›</button>
        </div>
        <div className="cal">
          {CAL_WEEKDAYS.map((d) => <div key={d} className="cal-dow">{d}</div>)}
          {cells.map((c, i) => {
            const iso = ymdLocal(c.date);
            const dayTasks = byDay[iso] || [];
            return (
              <button key={i} className={`cal-cell ${c.inMonth ? "" : "muted"} ${iso === todayISOv ? "today" : ""} ${iso === selected ? "sel" : ""}`} onClick={() => setSelected(iso)}>
                <span className="dnum">{c.date.getDate()}</span>
                <span className="cal-dots">
                  {dayTasks.slice(0, 4).map((t, j) => <span key={j} className="cal-dot" style={{ opacity: t.done ? 0.3 : 1 }} />)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <h3 style={{ fontSize: 17, marginBottom: 6, textTransform: "capitalize" }}>{selLabel}</h3>
        {selTasks.length === 0 && (
          <div className="sub" style={{ padding: "12px 0", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            Aucune tâche ce jour-là.
            <button className="btn soft" onClick={() => onNew(selected)}>+ En ajouter une</button>
          </div>
        )}
        {selTasks.map((task) => <TaskRow key={task.id} task={task} onToggle={onToggle} onSub={onSub} onFocus={onFocus} />)}
      </div>
    </>
  );
}

/* ---------- Nouvelle tâche ---------- */
function NewTaskModal({ onClose, onSave, initialDue }) {
  const [f, setF] = useState({ name: "", desc: "", priority: "normale", due: initialDue || todayISO(), time: "", repeat: "Aucune", category: "Travail", effort: "15", subtasks: [] });
  const [sub, setSub] = useState("");
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ fontSize: 21, marginBottom: 18 }}>Nouvelle tâche</h2>
        <div className="field"><label>Nom</label><input value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="Qu'aimeriez-vous accomplir ?" /></div>
        <div className="field"><label>Description</label><textarea rows={2} value={f.desc} onChange={(e) => set("desc", e.target.value)} placeholder="Optionnel" /></div>
        <div className="grid2">
          <div className="field"><label>Priorité</label><select value={f.priority} onChange={(e) => set("priority", e.target.value)}>{PRIORITIES.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
          <div className="field"><label>Effort estimé</label><select value={f.effort} onChange={(e) => set("effort", e.target.value)}>{EFFORTS.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></div>
          <div className="field"><label>Date limite</label><input type="date" value={f.due} onChange={(e) => set("due", e.target.value)} /></div>
          <div className="field"><label>Heure (optionnelle)</label><input type="time" value={f.time} onChange={(e) => set("time", e.target.value)} /></div>
          <div className="field"><label>Répétition</label><select value={f.repeat} onChange={(e) => set("repeat", e.target.value)}>{REPEATS.map((r) => <option key={r}>{r}</option>)}</select></div>
          <div className="field"><label>Catégorie</label><select value={f.category} onChange={(e) => set("category", e.target.value)}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></div>
        </div>
        <div className="field">
          <label>Sous-tâches</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input style={{ flex: 1 }} value={sub} onChange={(e) => setSub(e.target.value)} placeholder="Ajouter une étape" onKeyDown={(e) => { if (e.key === "Enter" && sub.trim()) { set("subtasks", [...f.subtasks, { id: uid(), name: sub.trim(), done: false }]); setSub(""); } }} />
            <button className="btn soft" onClick={() => { if (sub.trim()) { set("subtasks", [...f.subtasks, { id: uid(), name: sub.trim(), done: false }]); setSub(""); } }}>Ajouter</button>
          </div>
          {f.subtasks.map((s) => <div key={s.id} className="sub" style={{ marginTop: 4 }}>· {s.name}</div>)}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
          <button className="btn ghost" onClick={onClose}>Annuler</button>
          <button className="btn" disabled={!f.name.trim()} onClick={() => onSave(f)}>Créer la tâche</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Page Tasky ---------- */
function TaskyPage({ profile, setProfile, stage, nextStage, xp, energy, affinity, mood, history, inventory, avatarProps, motion }) {
  const set = (k, v) => setProfile((p) => ({ ...p, [k]: v }));
  const capeUnlocked = inventory.find((i) => i.id === "cape")?.unlocked;
  const pousseUnlocked = inventory.find((i) => i.id === "pousse")?.unlocked;
  return (
    <>
      <div className="pagehead"><div><h1>Tasky</h1><div className="sub">Votre compagnon — palier {stage.name}, humeur {mood.toLowerCase()}.</div></div></div>
      <div className="grid2">
        <div className="card" style={{ display: "grid", placeItems: "center", padding: 32 }}>
          <TaskyAvatar {...avatarProps} size={190} floating={motion === "on"} />
          <div className="display" style={{ fontSize: 19, marginTop: 10 }}>{stage.name}</div>
          {nextStage && <div className="sub">Prochain palier : {nextStage.name} à {nextStage.min} XP</div>}
        </div>
        <div className="card">
          <h3 style={{ fontSize: 17, marginBottom: 16 }}>État de Tasky</h3>
          <Stat label={`XP — ${stage.name}`} value={xp} max={nextStage ? nextStage.min : Math.max(xp, STAGES[4].min)} />
          <Stat label="Énergie" value={energy} />
          <Stat label="Affinité" value={affinity} />
          <div className="chip" style={{ marginTop: 4 }}><span className="dot" />Humeur : {mood}</div>
        </div>
      </div>

      <div className="grid2" style={{ marginTop: 18 }}>
        <div className="card">
          <h3 style={{ fontSize: 17, marginBottom: 12 }}>Accessoire</h3>
          <div className="seg">
            {ACCESSORIES.map((a) => {
              const locked = a.id === "pousse" && !pousseUnlocked;
              return <button key={a.id} className={profile.accessory === a.id ? "on" : ""} disabled={locked} style={locked ? { opacity: 0.35 } : {}} onClick={() => set("accessory", a.id)}>{a.name}{locked ? " 🔒" : ""}</button>;
            })}
          </div>
          <h3 style={{ fontSize: 17, margin: "20px 0 12px" }}>Tenue</h3>
          <div className="seg">
            {OUTFITS.map((o) => {
              const locked = o.id === "cape" && !capeUnlocked;
              return <button key={o.id} className={profile.outfit === o.id ? "on" : ""} disabled={locked} style={locked ? { opacity: 0.35 } : {}} onClick={() => set("outfit", o.id)}>{o.name}{locked ? " 🔒" : ""}</button>;
            })}
          </div>
        </div>
        <div className="card">
          <h3 style={{ fontSize: 17, marginBottom: 12 }}>Historique d'évolution</h3>
          {history.map((h, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: i < history.length - 1 ? "1px solid var(--line)" : "none" }}>
              <span className="dot" style={{ marginTop: 6 }} />
              <div><div style={{ fontSize: 14, fontWeight: 500 }}>{h.text}</div><div className="sub" style={{ fontSize: 12 }}>{h.date}</div></div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ---------- Monde ---------- */
function WorldPage({ world, setWorld, stage, avatarProps, motion }) {
  const biome = BIOMES.find((b) => b.id === world.biome) || BIOMES[0];
  const ambience = AMBIENCES.find((a) => a.id === world.ambience) || AMBIENCES[1];
  const toggleObj = (id) => setWorld((w) => ({ ...w, objects: w.objects.includes(id) ? w.objects.filter((x) => x !== id) : [...w.objects, id] }));
  const objGlyph = { lanterne: "◍", bonsai: "♣", the: "☕", coussin: "▢", carillon: "♪" };
  return (
    <>
      <div className="pagehead"><div><h1>Monde</h1><div className="sub">L'environnement de Tasky grandit avec vous.</div></div></div>
      <div className="card scene" style={{ background: biomeBg(biome), minHeight: 280 }}>
        <div style={{ position: "absolute", inset: 0, background: ambience.overlay, transition: "background 0.8s" }} />
        <div className="ground" />
        <div style={{ position: "absolute", bottom: 24, left: 30, display: "flex", gap: 18, fontSize: 26, color: "#2B2B28", opacity: 0.65, zIndex: 1 }}>
          {world.objects.map((o) => <span key={o} title={WORLD_OBJECTS.find((x) => x.id === o)?.name}>{objGlyph[o]}</span>)}
        </div>
        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <TaskyAvatar {...avatarProps} size={140} floating={motion === "on"} />
          <div className="chip" style={{ background: "rgba(255,255,255,0.7)", border: "none" }}>{biome.name} · {ambience.name}</div>
        </div>
      </div>

      <div className="grid2" style={{ marginTop: 18 }}>
        <div className="card">
          <h3 style={{ fontSize: 17, marginBottom: 12 }}>Biome</h3>
          <div className="grid3" style={{ gridTemplateColumns: "1fr 1fr" }}>
            {BIOMES.map((b) => (
              <button key={b.id} className={`pick ${world.biome === b.id ? "on" : ""}`} onClick={() => setWorld((w) => ({ ...w, biome: b.id }))}>
                <div className="pname">{b.name}</div>
                <div className="pdesc">{world.biome === b.id ? "Actuel" : "Choisir ce fond"}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="card">
          <h3 style={{ fontSize: 17, marginBottom: 12 }}>Ambiance</h3>
          <div className="seg" style={{ marginBottom: 20 }}>
            {AMBIENCES.map((a) => <button key={a.id} className={world.ambience === a.id ? "on" : ""} onClick={() => setWorld((w) => ({ ...w, ambience: a.id }))}>{a.name}</button>)}
          </div>
          <h3 style={{ fontSize: 17, marginBottom: 12 }}>Objets placés</h3>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {WORLD_OBJECTS.map((o) => {
              const locked = stage.id < o.stage;
              const on = world.objects.includes(o.id);
              return <button key={o.id} className="chip" disabled={locked} style={{ cursor: locked ? "default" : "pointer", opacity: locked ? 0.4 : 1, background: on ? "var(--tint)" : undefined, borderColor: on ? "var(--accent)" : undefined }} onClick={() => !locked && toggleObj(o.id)}>{objGlyph[o.id]} {o.name}{locked ? " 🔒" : ""}</button>;
            })}
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- Rituels ---------- */
function RitualsPage({ rituals, onCheck, onBreath, onGratitude }) {
  const [grat, setGrat] = useState("");
  return (
    <>
      <div className="pagehead"><div><h1>Rituels</h1><div className="sub">De petites routines calmes — rien d'obligatoire.</div></div></div>
      <div className="grid2">
        <div className="card">
          <h3 style={{ fontSize: 17, marginBottom: 8 }}>Aujourd'hui</h3>
          {rituals.map((r) => (
            <div key={r.id} className="taskrow">
              <button className={`check ${r.done ? "on" : ""}`} onClick={() => onCheck(r.id)} aria-label="Cocher le rituel">
                {r.done && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round"><path d="M5 13l4 4 10-11" /></svg>}
              </button>
              <div className={`tname ${r.done ? "done" : ""}`} style={{ paddingTop: 3 }}>{r.name}</div>
            </div>
          ))}
        </div>
        <div className="card">
          <h3 style={{ fontSize: 17, marginBottom: 10 }}>Pause respiration</h3>
          <div className="sub" style={{ marginBottom: 14 }}>Un cycle lent, guidé par Tasky. Une minute suffit.</div>
          <button className="btn soft" onClick={onBreath}>Commencer la respiration</button>
          <h3 style={{ fontSize: 17, margin: "24px 0 10px" }}>Gratitude du jour</h3>
          <div style={{ display: "flex", gap: 8 }}>
            <input style={{ flex: 1, font: "inherit", padding: "10px 12px", borderRadius: 12, border: "1px solid var(--line)", background: "var(--surface2)", color: "var(--ink)" }} value={grat} onChange={(e) => setGrat(e.target.value)} placeholder="Une chose qui vous a fait du bien…" />
            <button className="btn" disabled={!grat.trim()} onClick={() => { onGratitude(grat.trim()); setGrat(""); }}>Noter</button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- Journal ---------- */
function JournalPage({ journal, onAdd }) {
  const [m, setM] = useState("Serein");
  const [note, setNote] = useState("");
  return (
    <>
      <div className="pagehead"><div><h1>Journal</h1><div className="sub">Humeurs, petites notes, souvenirs partagés avec Tasky.</div></div></div>
      <div className="card" style={{ marginBottom: 18 }}>
        <h3 style={{ fontSize: 17, marginBottom: 12 }}>Comment vous sentez-vous ?</h3>
        <div className="seg" style={{ marginBottom: 14 }}>
          {MOODS.map((x) => <button key={x} className={m === x ? "on" : ""} onClick={() => setM(x)}>{x}</button>)}
        </div>
        <div className="field"><textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Une note courte sur ce moment… (optionnel)" /></div>
        <button className="btn" onClick={() => { onAdd({ mood: m, note: note.trim() || "—" }); setNote(""); }}>Garder ce moment</button>
      </div>
      <div className="card">
        <h3 style={{ fontSize: 17, marginBottom: 8 }}>Souvenirs</h3>
        {journal.length === 0 && <div className="sub" style={{ padding: "12px 0" }}>Votre premier souvenir vous attend.</div>}
        {journal.map((j) => (
          <div key={j.id} className="taskrow">
            <span className="dot" style={{ marginTop: 8 }} />
            <div><div style={{ fontWeight: 600, fontSize: 14.5 }}>{j.mood} <span className="sub" style={{ fontWeight: 400 }}>· {j.date}</span></div><div className="sub" style={{ marginTop: 2 }}>{j.note}</div></div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ---------- Inventaire ---------- */
/* Indice d'action selon le type d'objet */
function itemHint(i, active) {
  if (!i.unlocked) return "Verrouillé";
  if (i.id === "lanterne" || i.id === "bonsai") return active ? "✓ Placé dans le monde — toucher pour retirer" : "Toucher pour placer dans le monde";
  if (i.id === "pousse") return active ? "✓ Porté par Tasky — toucher pour retirer" : "Toucher pour ajouter à Tasky";
  if (i.id === "echarpe" || i.id === "cape") return active ? "✓ Porté par Tasky — toucher pour retirer" : "Toucher pour habiller Tasky";
  if (i.type === "Nourriture") return "Toucher pour partager avec Tasky";
  return "Toucher pour revoir ce souvenir";
}

function InventoryPage({ inventory, onUse, isActive }) {
  const types = ["Tous", "Nourriture", "Vêtements", "Décorations", "Objets émotionnels"];
  const [tab, setTab] = useState("Tous");
  const items = inventory.filter((i) => tab === "Tous" || i.type === tab);
  return (
    <>
      <div className="pagehead"><div><h1>Inventaire</h1><div className="sub">Touchez un objet débloqué pour le placer dans le monde ou l'offrir à Tasky.</div></div></div>
      <div className="seg" style={{ marginBottom: 18 }}>
        {types.map((x) => <button key={x} className={tab === x ? "on" : ""} onClick={() => setTab(x)}>{x}</button>)}
      </div>
      <div className="grid3">
        {items.map((i) => {
          const active = isActive(i);
          return (
            <button
              key={i.id}
              className="card"
              disabled={!i.unlocked}
              onClick={() => onUse(i)}
              style={{ textAlign: "left", font: "inherit", color: "var(--ink)", cursor: i.unlocked ? "pointer" : "default", opacity: i.unlocked ? 1 : 0.45, borderColor: active ? "var(--accent)" : undefined, boxShadow: active ? "0 0 0 2px var(--accent) inset, var(--shadow)" : "var(--shadow)" }}
            >
              <div style={{ fontWeight: 700, fontSize: 15 }}>{i.name} {!i.unlocked && "🔒"}</div>
              <div className="chip" style={{ margin: "8px 0" }}>{i.type}</div>
              <div className="sub">{i.desc}</div>
              <div className="sub" style={{ marginTop: 8, fontWeight: 600, color: active ? "var(--accent)" : "var(--muted)" }}>{itemHint(i, active)}</div>
            </button>
          );
        })}
      </div>
    </>
  );
}

/* ---------- Réglages ---------- */
function SettingsPage({ theme, setTheme, motion, setMotion, sounds, setSounds, notifs, setNotifs, onReset }) {
  const Row = ({ label, sub, children }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "1px solid var(--line)", gap: 16, flexWrap: "wrap" }}>
      <div><div style={{ fontWeight: 600, fontSize: 15 }}>{label}</div><div className="sub">{sub}</div></div>
      {children}
    </div>
  );
  return (
    <>
      <div className="pagehead"><div><h1>Réglages</h1><div className="sub">Ajustez TASKY à votre rythme.</div></div></div>
      <div className="card">
        <Row label="Thème" sub="Clair ou sombre.">
          <div className="seg"><button className={theme === "light" ? "on" : ""} onClick={() => setTheme("light")}>Clair</button><button className={theme === "dark" ? "on" : ""} onClick={() => setTheme("dark")}>Sombre</button></div>
        </Row>
        <Row label="Animations" sub="Réduisez les mouvements si vous préférez le calme total.">
          <div className="seg"><button className={motion === "on" ? "on" : ""} onClick={() => setMotion("on")}>Activées</button><button className={motion === "off" ? "on" : ""} onClick={() => setMotion("off")}>Réduites</button></div>
        </Row>
        <Row label="Sons" sub="Sons doux lors des interactions (à venir).">
          <div className="seg"><button className={sounds ? "on" : ""} onClick={() => setSounds(true)}>Activés</button><button className={!sounds ? "on" : ""} onClick={() => setSounds(false)}>Coupés</button></div>
        </Row>
        <Row label="Notifications douces" sub="Jamais de culpabilisation — seulement des invitations.">
          <div className="seg"><button className={notifs ? "on" : ""} onClick={() => setNotifs(true)}>Activées</button><button className={!notifs ? "on" : ""} onClick={() => setNotifs(false)}>Coupées</button></div>
        </Row>
        <Row label="Données" sub="Votre progression est enregistrée dans ce navigateur. La réinitialiser efface tout et relance l'accueil.">
          <button className="btn ghost" onClick={() => { if (window.confirm("Tout réinitialiser ? Cette action est définitive.")) onReset?.(); }}>Réinitialiser</button>
        </Row>
        <div style={{ paddingTop: 16 }}>
          <div style={{ fontWeight: 600, fontSize: 15 }}>Visuels de Tasky</div>
          <div className="sub">Les visuels actuels sont des placeholders. Remplacez le composant <code>TaskyAvatar</code> par vos propres assets — les props (silhouette, regard, accessoire, tenue, humeur, palier) resteront identiques.</div>
        </div>
      </div>
    </>
  );
}
