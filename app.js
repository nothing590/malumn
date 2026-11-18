/* 말문: 하루 20분 영어 말하기. 인터넷 없이 작동하고, AI 대화만 본인 API 키가 필요하다. */
"use strict";

/* ---------- 도구 ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const fmt = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
const today = () => fmt(new Date());
const plusDays = n => { const d = new Date(); d.setDate(d.getDate() + n); return fmt(d); };
const daysBetween = (a, b) => Math.round((new Date(b + "T00:00:00") - new Date(a + "T00:00:00")) / 864e5);
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
let toastT;
function toast(t) { const e = $("#toast"); e.textContent = t; e.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => e.classList.remove("show"), 2200); }
function download(name, blob) { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000); }

const I = {
  x: `<svg class="icon" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z"/></svg>`,
  play: `<svg class="icon" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M240,128a15.74,15.74,0,0,1-7.6,13.51L88.32,229.65a16,16,0,0,1-16.2.3A15.86,15.86,0,0,1,64,216.13V39.87a15.86,15.86,0,0,1,8.12-13.82,16,16,0,0,1,16.2.3L232.4,114.49A15.74,15.74,0,0,1,240,128Z"/></svg>`,
  stop: `<svg class="icon" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M216,56V200a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V56A16,16,0,0,1,56,40H200A16,16,0,0,1,216,56Z"/></svg>`,
  speaker: `<svg class="icon" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M160,32.25V223.69a8.29,8.29,0,0,1-3.91,7.18,8,8,0,0,1-9-.56l-65.57-51A4,4,0,0,1,80,176.16V79.84a4,4,0,0,1,1.55-3.15l65.57-51a8,8,0,0,1,10,.16A8.27,8.27,0,0,1,160,32.25ZM60,80H32A16,16,0,0,0,16,96v64a16,16,0,0,0,16,16H60a4,4,0,0,0,4-4V84A4,4,0,0,0,60,80Zm126.77,20.84a8,8,0,0,0-.72,11.3,24,24,0,0,1,0,31.72,8,8,0,1,0,12,10.58,40,40,0,0,0,0-52.88A8,8,0,0,0,186.74,100.84Zm40.89-26.17a8,8,0,1,0-11.92,10.66,64,64,0,0,1,0,85.34,8,8,0,1,0,11.92,10.66,80,80,0,0,0,0-106.66Z"/></svg>`,
  mic: `<svg class="icon" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M80,128V64a48,48,0,0,1,96,0v64a48,48,0,0,1-96,0Zm128,0a8,8,0,0,0-16,0,64,64,0,0,1-128,0,8,8,0,0,0-16,0,80.11,80.11,0,0,0,72,79.6V240a8,8,0,0,0,16,0V207.6A80.11,80.11,0,0,0,208,128Z"/></svg>`,
  check: `<svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z"/></svg>`,
  tick: `<svg class="mark" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z"/></svg>`,
  cross: `<svg class="mark" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z"/></svg>`,
  cards: `<svg class="icon" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M200,88V200a16,16,0,0,1-16,16H40a16,16,0,0,1-16-16V88A16,16,0,0,1,40,72H184A16,16,0,0,1,200,88Zm16-48H64a8,8,0,0,0,0,16H216V176a8,8,0,0,0,16,0V56A16,16,0,0,0,216,40Z"/></svg>`,
  swap: `<svg class="icon" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M216.49,184.49l-32,32a12,12,0,0,1-17-17L179,188H48a12,12,0,0,1,0-24H179l-11.52-11.51a12,12,0,0,1,17-17l32,32A12,12,0,0,1,216.49,184.49Zm-145-64a12,12,0,0,0,17-17L77,92H208a12,12,0,0,0,0-24H77L88.49,56.49a12,12,0,0,0-17-17l-32,32a12,12,0,0,0,0,17Z"/></svg>`,
  ear: `<svg class="icon" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm20,128a4.21,4.21,0,0,0,1.33-.22,8,8,0,0,1,5.34,15.08A20,20,0,0,1,128,148c0-8.85,4.77-15.23,9-20.87,3.77-5,7-9.38,7-15.13a16,16,0,0,0-32,0,8,8,0,0,1-16,0,32,32,0,0,1,64,0c0,11.07-5.66,18.63-10.2,24.71-3.6,4.81-5.8,7.93-5.8,11.29A4,4,0,0,0,148,152Zm36-32a8,8,0,0,1-8-8,48,48,0,0,0-96,0c0,11.9,6.71,20.5,13.82,29.6,7,8.92,14.18,18.15,14.18,30.4a20,20,0,0,0,34,14.29,8,8,0,1,1,11.19,11.42A36,36,0,0,1,92,172c0-6.74-5-13.14-10.79-20.55C73.54,141.63,64,129.41,64,112a64,64,0,0,1,128,0A8,8,0,0,1,184,120Z"/></svg>`,
  repeat: `<svg class="icon" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M20,128A76.08,76.08,0,0,1,96,52h99l-3.52-3.51a12,12,0,1,1,17-17l24,24a12,12,0,0,1,0,17l-24,24a12,12,0,0,1-17-17L195,76H96a52.06,52.06,0,0,0-52,52,12,12,0,0,1-24,0Zm204-12a12,12,0,0,0-12,12,52.06,52.06,0,0,1-52,52H61l3.52-3.51a12,12,0,1,0-17-17l-24,24a12,12,0,0,0,0,17l24,24a12,12,0,1,0,17-17L61,204h99a76.08,76.08,0,0,0,76-76A12,12,0,0,0,224,116Z"/></svg>`,
  people: `<svg class="icon" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M164.47,195.63a8,8,0,0,1-6.7,12.37H10.23a8,8,0,0,1-6.7-12.37,95.83,95.83,0,0,1,47.22-37.71,60,60,0,1,1,66.5,0A95.83,95.83,0,0,1,164.47,195.63Zm87.91-.15a95.87,95.87,0,0,0-47.13-37.56A60,60,0,0,0,144.7,54.59a4,4,0,0,0-1.33,6A75.83,75.83,0,0,1,147,150.53a4,4,0,0,0,1.07,5.53,112.32,112.32,0,0,1,29.85,30.83,23.92,23.92,0,0,1,3.65,16.47,4,4,0,0,0,3.95,4.64h60.3a8,8,0,0,0,7.73-5.93A8.22,8.22,0,0,0,252.38,195.48Z"/></svg>`,
  chat: `<svg class="icon" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm32,128H96a8,8,0,0,1,0-16h64a8,8,0,0,1,0,16Zm0-32H96a8,8,0,0,1,0-16h64a8,8,0,0,1,0,16Z"/></svg>`,
  clock: `<svg class="icon" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M128,40a96,96,0,1,0,96,96A96.11,96.11,0,0,0,128,40Zm45.66,61.66-40,40a8,8,0,0,1-11.32-11.32l40-40a8,8,0,0,1,11.32,11.32ZM96,16a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H104A8,8,0,0,1,96,16Z"/></svg>`,
  headphones: `<svg class="icon" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M232,128v56a24,24,0,0,1-24,24H192a24,24,0,0,1-24-24V144a24,24,0,0,1,24-24h23.65a87.71,87.71,0,0,0-87-80H128a88,88,0,0,0-87.64,80H64a24,24,0,0,1,24,24v40a24,24,0,0,1-24,24H48a24,24,0,0,1-24-24V128A104.11,104.11,0,0,1,201.89,54.66,103.41,103.41,0,0,1,232,128Z"/></svg>`,
  flame: `<svg class="icon" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M143.38,17.85a8,8,0,0,0-12.63,3.41l-22,60.41L84.59,58.26a8,8,0,0,0-11.93.89C51,87.53,40,116.08,40,144a88,88,0,0,0,176,0C216,84.55,165.21,36,143.38,17.85Zm40.51,135.49a57.6,57.6,0,0,1-46.56,46.55A7.65,7.65,0,0,1,136,200a8,8,0,0,1-1.32-15.89c16.57-2.79,30.63-16.85,33.44-33.45a8,8,0,0,1,15.78,2.68Z"/></svg>`,
  gear: `<svg class="icon" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M216,130.16q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.6,107.6,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.29,107.29,0,0,0-26.25-10.86,8,8,0,0,0-7.06,1.48L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.6,107.6,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06ZM128,168a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z"/></svg>`,
  star: `<svg class="icon" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z"/></svg>`,
  person: `<svg class="icon" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M230.93,220a8,8,0,0,1-6.93,4H32a8,8,0,0,1-6.92-12c15.23-26.33,38.7-45.21,66.09-54.16a72,72,0,1,1,73.66,0c27.39,8.95,50.86,27.83,66.09,54.16A8,8,0,0,1,230.93,220Z"/></svg>`,
  globe: `<svg class="icon" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M128,24h0A104,104,0,1,0,232,128,104.12,104.12,0,0,0,128,24Zm78.36,64H170.71a135.28,135.28,0,0,0-22.3-45.6A88.29,88.29,0,0,1,206.37,88ZM216,128a87.61,87.61,0,0,1-3.33,24H174.16a157.44,157.44,0,0,0,0-48h38.51A87.61,87.61,0,0,1,216,128ZM128,43a115.27,115.27,0,0,1,26,45H102A115.11,115.11,0,0,1,128,43ZM102,168H154a115.11,115.11,0,0,1-26,45A115.27,115.27,0,0,1,102,168Zm-3.9-16a140.84,140.84,0,0,1,0-48h59.88a140.84,140.84,0,0,1,0,48Zm50.35,61.6a135.28,135.28,0,0,0,22.3-45.6h35.66A88.29,88.29,0,0,1,148.41,213.6Z"/></svg>`,
  plane: `<svg class="icon" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M215.52,197.26a8,8,0,0,1-1.86,8.39l-24,24A8,8,0,0,1,184,232a7.09,7.09,0,0,1-.79,0,8,8,0,0,1-5.87-3.52l-44.07-66.12L112,183.59V208a8,8,0,0,1-2.34,5.65s-14,14.06-15.88,15.88A7.91,7.91,0,0,1,91,231.41a8,8,0,0,1-10.41-4.35l-.06-.15-14.7-36.76L29,175.42a8,8,0,0,1-2.69-13.08l16-16A8,8,0,0,1,48,144H72.4l21.27-21.27L27.56,78.65a8,8,0,0,1-1.22-12.32l24-24a8,8,0,0,1,8.39-1.86l85.94,31.25L176.2,40.19a28,28,0,0,1,39.6,39.6l-31.53,31.53Z"/></svg>`,
  bag: `<svg class="icon" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M152,112a8,8,0,0,1-8,8H112a8,8,0,0,1,0-16h32A8,8,0,0,1,152,112Zm80-40V200a16,16,0,0,1-16,16H40a16,16,0,0,1-16-16V72A16,16,0,0,1,40,56H80V48a24,24,0,0,1,24-24h48a24,24,0,0,1,24,24v8h40A16,16,0,0,1,232,72ZM96,56h64V48a8,8,0,0,0-8-8H104a8,8,0,0,0-8,8Zm120,57.61V72H40v41.61A184,184,0,0,0,128,136,184,184,0,0,0,216,113.61Z"/></svg>`,
  smile: `<svg class="icon" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM92,96a12,12,0,1,1-12,12A12,12,0,0,1,92,96Zm82.92,60c-10.29,17.79-27.39,28-46.92,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.08-20a8,8,0,1,1,13.84,8ZM164,120a12,12,0,1,1,12-12A12,12,0,0,1,164,120Z"/></svg>`,
  trophy: `<svg class="icon" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M232,64H208V48a8,8,0,0,0-8-8H56a8,8,0,0,0-8,8V64H24A16,16,0,0,0,8,80V96a40,40,0,0,0,40,40h3.65A80.13,80.13,0,0,0,120,191.61V216H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16H136V191.58c31.94-3.23,58.44-25.64,68.08-55.58H208a40,40,0,0,0,40-40V80A16,16,0,0,0,232,64ZM48,120A24,24,0,0,1,24,96V80H48v32q0,4,.39,8ZM232,96a24,24,0,0,1-24,24h-.5a81.81,81.81,0,0,0,.5-8.9V80h24Z"/></svg>`,
  target: `<svg class="icon" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M221.87,83.16A104.1,104.1,0,1,1,195.67,49l22.67-22.68a8,8,0,0,1,11.32,11.32L167.6,99.71h0l-37.71,37.71-23.95,23.95a40,40,0,0,0,62-35.67,8,8,0,1,1,16-.9,56,56,0,0,1-95.5,42.79h0a56,56,0,0,1,73.13-84.43L184.3,60.39a87.88,87.88,0,1,0,23.13,29.67,8,8,0,0,1,14.44-6.9Z"/></svg>`,
  chats: `<svg class="icon" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M232,96a16,16,0,0,0-16-16H184V48a16,16,0,0,0-16-16H40A16,16,0,0,0,24,48V176a8,8,0,0,0,13,6.22L72,154V184a16,16,0,0,0,16,16h93.59L219,230.22a8,8,0,0,0,5,1.78,8,8,0,0,0,8-8Zm-42.55,89.78a8,8,0,0,0-5-1.78H88V152h80a16,16,0,0,0,16-16V96h32V207.25Z"/></svg>`,
  chev: `<svg class="chev" viewBox="0 0 8 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 1l6 6-6 6"/></svg>`
};

/* ---------- 데이터 ---------- */
const CATS = Object.keys(window.PHRASES_RAW);
const PHRASES = [];
CATS.forEach((c, ci) => window.PHRASES_RAW[c].trim().split("\n").forEach((l, i) => {
  const [ko, en, note] = l.split("|");
  PHRASES.push({ id: `p${ci}_${i}`, cat: c, ko, en, note: note || "", ord: i, ci });
}));
const PURPOSES = [
  ["여행", "주문, 쇼핑, 길 묻기, 호텔과 공항", ["식당·카페", "쇼핑", "교통·길", "호텔·공항", "건강·병원"]],
  ["회사 업무", "회의, 메일, 전화", ["업무·회의", "이메일·전화", "의견·감정"]],
  ["일상 대화", "스몰톡, 약속, 맞장구", ["스몰톡", "리액션", "일상생활", "약속·계획"]],
  ["전부 골고루", "모든 분야를 섞어서", []]
];
const BASIC = ["대화 기술", "부탁·제안"];
const LEVELS = { "초급": "Use very short, simple sentences and common words (CEFR A2).", "중급": "Use natural everyday English (CEFR B1-B2).", "고급": "Use fully natural, native-speed English with idioms (CEFR C1)." };
const SCENARIOS = {
  "카페 주문": ["You are a friendly barista at a busy coffee shop. The learner is a customer.", "Hi there! What can I get started for you today?"],
  "스몰톡": ["You are a friendly coworker chatting with the learner at lunch about weekends, hobbies and life.", "Hey! How was your weekend? Do anything fun?"],
  "호텔": ["You are a hotel front desk clerk. The learner is checking in and may have requests or problems.", "Good evening, welcome! Are you checking in?"],
  "쇼핑": ["You are a clothing store clerk. The learner is shopping.", "Hi! Let me know if you need help finding anything."],
  "병원": ["You are a doctor at a clinic. Ask about symptoms one question at a time.", "Hello, have a seat. So, what brings you in today?"],
  "면접": ["You are a job interviewer for an office role. Ask one question at a time.", "Thanks for coming in today. Could you tell me a little about yourself?"],
  "회의": ["You are a project manager in a weekly team meeting.", "Okay, let's get started. Could you give us a quick update on your work?"],
  "길 묻기": ["You are a helpful local the learner stops on the street.", "Hi! You look a little lost. Can I help you find something?"]
};
const INTERVALS = [0, 1, 2, 4, 7, 15, 30, 60, 120];
const MONTHLY_Q = ["간단한 자기소개", "요즘 하는 일", "지난 주말에 한 일"];

/* ---------- 상태 ---------- */
const KEY = "malmun.v1";
const DEF = { onboarded: false, cards: {}, custom: [], days: {}, streak: 0, lastDay: null, newPerDay: 5, focus: [], level: null, testScore: null,
  patternIdx: 0, listenIdx: 0, shadowIdx: 0, roleIdx: 0, aiKey: "", aiModel: "claude-haiku-5-5", voice: "", rate: 0.9,
  chatTurns: 0, listenTotal: 0, remindTime: "21:00", aiDialogs: [], aiListen: [], flow: { date: null, step: 0 }, doneDays: [] };
let S = Object.assign({}, DEF);
/* 저장된 데이터·백업 파일을 그대로 믿지 않고, 알려진 항목만 정해진 형식으로 받아들인다 */
function clean(j, keepKey) {
  const o = Object.assign({}, DEF), D8 = /^\d{4}-\d{2}-\d{2}$/, isD = x => typeof x === "string" && D8.test(x);
  const int = (x, lo, hi, d = 0) => Number.isFinite(+x) ? Math.min(hi, Math.max(lo, Math.round(+x))) : d;
  const str = (x, n = 300) => typeof x === "string" ? x.slice(0, n) : "";
  if (!j || typeof j !== "object") return o;
  o.onboarded = j.onboarded === true; o.sound = j.sound !== false;
  o.newPerDay = [3, 5, 8, 10, 15].includes(+j.newPerDay) ? +j.newPerDay : DEF.newPerDay;
  o.rate = [.75, .9, 1].includes(+j.rate) ? +j.rate : DEF.rate;
  o.level = ["초급", "중급", "고급"].includes(j.level) ? j.level : null;
  o.testScore = j.testScore == null ? null : int(j.testScore, 0, 100);
  o.lastDay = isD(j.lastDay) ? j.lastDay : null;
  o.remindTime = /^\d{2}:\d{2}$/.test(j.remindTime) ? j.remindTime : DEF.remindTime;
  o.voice = str(j.voice, 120); o.aiModel = str(j.aiModel, 80) || DEF.aiModel; o.aiKey = keepKey ? str(j.aiKey, 300) : "";
  for (const k of ["streak", "patternIdx", "listenIdx", "shadowIdx", "roleIdx", "chatTurns", "listenTotal", "spokenTotal", "recCount"]) o[k] = int(j[k], 0, 1e7);
  o.focus = Array.isArray(j.focus) ? j.focus.filter(c => CATS.includes(c)) : [];
  o.cards = {}; if (j.cards && typeof j.cards === "object") for (const [k, v] of Object.entries(j.cards)) if (/^[pu][\w]{1,30}$/.test(k) && v && isD(v.due)) o.cards[k] = { box: int(v.box, 0, INTERVALS.length - 1), due: v.due };
  o.custom = Array.isArray(j.custom) ? j.custom.filter(c => c && /^u\d{1,20}$/.test(c.id)).slice(0, 2000).map(c => ({ id: c.id, ko: str(c.ko), en: str(c.en), note: str(c.note) })) : [];
  o.days = {}; if (j.days && typeof j.days === "object") for (const [k, v] of Object.entries(j.days)) if (isD(k) && v && typeof v === "object") o.days[k] = { rev: int(v.rev, 0, 1e5), newL: int(v.newL, 0, 1e5), listen: int(v.listen, 0, 1440), steps: int(v.steps, 0, 5), spoken: int(v.spoken, 0, 1e5), human: v.human === true };
  o.doneDays = Array.isArray(j.doneDays) ? [...new Set(j.doneDays.filter(isD))] : [];
  o.awards = {}; if (j.awards && typeof j.awards === "object") for (const [k, v] of Object.entries(j.awards)) if (/^[a-z0-9]{1,10}$/.test(k) && isD(v)) o.awards[k] = v;
  o.flow = j.flow && isD(j.flow.date) ? { date: j.flow.date, step: int(j.flow.step, 0, 5) } : { date: null, step: 0 };
  o.aiDialogs = Array.isArray(j.aiDialogs) ? j.aiDialogs.slice(-40).filter(d => d && typeof d.title === "string" && Array.isArray(d.lines)).map(d => ({ title: str(d.title, 40), lines: d.lines.slice(0, 12).filter(l => Array.isArray(l)).map(l => [l[0] === "A" ? "A" : "B", str(l[1]), str(l[2])]) })).filter(d => d.lines.length >= 2) : [];
  o.aiListen = [];
  return o;
}
try { const j = localStorage.getItem(KEY); if (j) { const raw = JSON.parse(j); S = clean(raw, true); if (Object.keys(S.cards).length && !("onboarded" in raw)) S.onboarded = true; } } catch (e) {}
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
function D() { const k = today(); if (!S.days[k]) S.days[k] = { rev: 0, newL: 0, listen: 0, human: false }; return S.days[k]; }
/* ---------- 성취: 링, 배지, 소리 ---------- */
const GOALS = { lesson: 5, speak: 15, listen: 30 };
const RING = { lesson: "#fa2d55", speak: "#30d158", listen: "#0fb5f5" };
function spoke(n = 1) { const d = D(); d.spoken = (d.spoken || 0) + n; S.spokenTotal = (S.spokenTotal || 0) + n; save(); }
function dayVals(ds) { const d = S.days[ds] || {}; return { lesson: (ds === today() ? flowStep() : d.steps || 0) / GOALS.lesson, speak: (d.spoken || 0) / GOALS.speak, listen: (d.listen || 0) / GOALS.listen }; }
const learned = () => Object.values(S.cards).filter(c => c.box >= 2).length;
const AWARDS = [
  { id: "first", icon: "trophy", name: "첫 레슨", label: "1", color: "#0a84ff", desc: "첫 레슨을 끝냈어요", test: () => (S.doneDays || []).length >= 1 },
  { id: "s3", icon: "flame", name: "3일 연속", label: "3", color: "#ff9f0a", desc: "3일 연속 레슨", test: () => runDays() >= 3 },
  { id: "s7", icon: "flame", name: "7일 연속", label: "7", color: "#ff6a00", desc: "일주일 연속 레슨", test: () => runDays() >= 7 },
  { id: "s14", icon: "flame", name: "14일 연속", label: "14", color: "#ff375f", desc: "2주 연속 레슨", test: () => runDays() >= 14 },
  { id: "s30", icon: "flame", name: "30일 연속", label: "30", color: "#bf5af2", desc: "한 달 연속 레슨", test: () => runDays() >= 30 },
  { id: "rings", icon: "target", name: "링 완성", label: "◎", color: "#fa2d55", desc: "하루에 링 세 개를 모두 채웠어요", test: () => { const v = dayVals(today()); return v.lesson >= 1 && v.speak >= 1 && v.listen >= 1; } },
  { id: "w50", icon: "cards", name: "표현 50", label: "50", color: "#5e5ce6", desc: "표현 50개를 익혔어요", test: () => learned() >= 50 },
  { id: "w150", icon: "cards", name: "표현 150", label: "150", color: "#5e5ce6", desc: "표현 150개를 익혔어요", test: () => learned() >= 150 },
  { id: "sp100", icon: "chats", name: "100문장", label: "100", color: "#30d158", desc: "영어로 100문장을 말했어요", test: () => (S.spokenTotal || 0) >= 100 },
  { id: "sp500", icon: "chats", name: "500문장", label: "500", color: "#30d158", desc: "영어로 500문장을 말했어요", test: () => (S.spokenTotal || 0) >= 500 },
  { id: "l300", icon: "headphones", name: "5시간 듣기", label: "5h", color: "#0fb5f5", desc: "모두 합쳐 5시간을 들었어요", test: () => (S.listenTotal || 0) >= 300 },
  { id: "rec", icon: "mic", name: "첫 녹음", label: "1분", color: "#ff453a", desc: "1분 말하기를 처음 녹음했어요", test: () => !!S.recCount },
  { id: "human", icon: "people", name: "실전 대화", label: "!", color: "#64d2ff", desc: "실제 사람과 영어로 대화했어요", test: () => Object.values(S.days).some(d => d.human) }
];
function checkAwards() { S.awards = S.awards || {}; const got = AWARDS.filter(a => !S.awards[a.id] && a.test()); got.forEach(a => S.awards[a.id] = today()); if (got.length) save(); return got; }
const medal = (a, on = true, big = false) => `<div class="medal ${on ? "" : "off"} ${big ? "big" : ""}" style="--m:${a.color}">${I[a.icon]}${/^s\d/.test(a.id) ? `<em>${a.label}</em>` : ""}</div>`;
let actx = null;
function chime(kind = "step") {
  if (S.sound !== false) try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const t0 = actx.currentTime, notes = kind === "done" ? [523.25, 659.25, 783.99, 1046.5] : kind === "ok" ? [1174.66] : [783.99, 1174.66];
    notes.forEach((f, i) => { const o = actx.createOscillator(), g = actx.createGain(), t = t0 + i * .09; o.type = "sine"; o.frequency.value = f;
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(kind === "ok" ? .08 : .16, t + .015); g.gain.exponentialRampToValueAtTime(.0001, t + .4);
      o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + .45); });
  } catch (e) {}
  try { navigator.vibrate && navigator.vibrate(kind === "done" ? [20, 50, 30] : 12); } catch (e) {}
}
function rings(v, size = 120, anim = false) {
  const W = 8.5, keys = ["lesson", "speak", "listen"];
  return `<svg class="rings ${anim ? "anim" : ""}" width="${size}" height="${size}" viewBox="0 0 100 100">${keys.map((k, i) => {
    const r = 44 - i * (W + 2.2), c = 2 * Math.PI * r, f = Math.min(1, v[k] || 0);
    return `<circle cx="50" cy="50" r="${r}" fill="none" stroke="${RING[k]}" stroke-opacity=".22" stroke-width="${W}"/>` +
      (f > 0 ? `<circle cx="50" cy="50" r="${r}" fill="none" stroke="${RING[k]}" stroke-width="${W}" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - f)}" style="--c0:${c}" transform="rotate(-90 50 50)"/>` : "");
  }).join("")}</svg>`;
}
/* 단계 완료 표시: 잠깐 떴다가 다음으로 */
function celebrate(title, sub, then) {
  chime("step");
  const o = document.createElement("div"); o.className = "celebrate";
  o.innerHTML = `<div class="cel-card"><svg class="cel-check" viewBox="0 0 52 52"><circle cx="26" cy="26" r="24"/><path d="M15 27l7 7 15-16"/></svg><div class="cel-t">${esc(title)}</div>${sub ? `<div class="cel-s">${esc(sub)}</div>` : ""}</div>`;
  document.body.appendChild(o);
  let gone = false; const end = () => { if (gone) return; gone = true; o.classList.add("out"); setTimeout(() => { o.remove(); then(); }, 180); };
  o.onclick = end; setTimeout(end, matchMedia("(prefers-reduced-motion: reduce)").matches ? 900 : 1300);
}
function confetti() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const c = document.createElement("canvas"), x = c.getContext("2d"), dpr = devicePixelRatio || 1;
  c.className = "confetti"; c.width = innerWidth * dpr; c.height = innerHeight * dpr; document.body.appendChild(c); x.scale(dpr, dpr);
  const cols = [RING.lesson, RING.speak, RING.listen, "#ff9f0a", "#5e5ce6"];
  const P = [...Array(120)].map(() => ({ x: innerWidth / 2, y: innerHeight * .32, vx: (Math.random() - .5) * 11, vy: -Math.random() * 11 - 3, r: Math.random() * 6 + 4, a: Math.random() * 6, va: (Math.random() - .5) * .3, c: cols[Math.floor(Math.random() * cols.length)] }));
  const t0 = performance.now();
  (function f(t) { const e = t - t0; x.clearRect(0, 0, innerWidth, innerHeight);
    P.forEach(p => { p.vy += .32; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.a += p.va; x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.globalAlpha = Math.max(0, 1 - e / 2200); x.fillStyle = p.c; x.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); x.restore(); });
    e < 2200 ? requestAnimationFrame(f) : c.remove(); })(t0);
}
function touch() { const k = today(); if (S.lastDay === k) return; S.streak = S.lastDay === plusDays(-1) ? S.streak + 1 : 1; S.lastDay = k; }
const runDays = () => (S.lastDay === today() || S.lastDay === plusDays(-1)) ? S.streak : 0;
const allPhrases = () => PHRASES.concat((S.custom || []).map(c => ({ id: c.id, cat: "내가 고친 문장", ko: c.ko, en: c.en, note: c.note || "", ord: -1, ci: -1 })));
const allDialogs = () => Object.assign({}, window.DIALOGS, Object.fromEntries((S.aiDialogs || []).map(d => [d.title, d.lines])));
const allListening = () => window.LISTENING.concat(S.aiListen || []);
function dayNum() { const d = S.doneDays || []; return d.length + (d.includes(today()) ? 0 : 1); }
function flowStep() { if (S.flow.date !== today()) S.flow = { date: today(), step: 0 }; return S.flow.step; }

/* ---------- 소리 ---------- */
const TTS = "speechSynthesis" in window;
let voices = [];
function loadVoices() { if (TTS) voices = speechSynthesis.getVoices().filter(v => /^en[-_]/i.test(v.lang)); }
if (TTS) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
function pickVoice() { if (!voices.length) loadVoices(); return voices.find(v => v.name === S.voice) || voices.find(v => /en[-_]US/i.test(v.lang) && v.localService) || voices.find(v => /en[-_]US/i.test(v.lang)) || voices[0]; }
function speak(text, rate) {
  return new Promise(res => {
    if (!TTS) return res();
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text), v = pickVoice();
      if (v) u.voice = v; u.lang = v ? v.lang : "en-US"; u.rate = rate || S.rate;
      u.onend = res; u.onerror = res; speechSynthesis.speak(u);
      setTimeout(res, 2500 + text.length * 150);
    } catch (e) { res(); }
  });
}
function hush() { if (TTS) try { speechSynthesis.cancel(); } catch (e) {} }

const SRClass = window.SpeechRecognition || window.webkitSpeechRecognition;
const canSR = () => !!SRClass && navigator.onLine !== false;
let srNow = null;
function recognize(onPartial) {
  return new Promise((res, rej) => {
    const r = new SRClass(); srNow = r;
    r.lang = "en-US"; r.interimResults = true; r.continuous = false;
    let fin = "";
    r.onresult = e => { let mid = ""; for (let i = e.resultIndex; i < e.results.length; i++) { const t = e.results[i][0].transcript; if (e.results[i].isFinal) fin += t + " "; else mid += t; } onPartial && onPartial((fin + mid).trim()); };
    r.onerror = e => { srNow = null; rej(e.error || "error"); };
    r.onend = () => { srNow = null; res(fin.trim()); };
    try { r.start(); } catch (e) { rej(e); }
  });
}
function stopSR() { if (srNow) try { srNow.stop(); } catch (e) {} }

const canRec = () => !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
async function startRec() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const type = ["audio/webm;codecs=opus", "audio/mp4", "audio/webm"].find(t => MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t));
  const mr = new MediaRecorder(stream, type ? { mimeType: type } : undefined), chunks = [];
  mr.ondataavailable = e => e.data.size && chunks.push(e.data); mr.start();
  return { stop: () => new Promise(r => { mr.onstop = () => { stream.getTracks().forEach(t => t.stop()); r(new Blob(chunks, { type: mr.mimeType || "audio/webm" })); }; mr.stop(); }) };
}

const idb = {
  db: null,
  open() { return this.db ? Promise.resolve(this.db) : new Promise((res, rej) => { const r = indexedDB.open("malmun", 1); r.onupgradeneeded = () => r.result.createObjectStore("recs", { keyPath: "id" }); r.onsuccess = () => res(this.db = r.result); r.onerror = () => rej(r.error); }); },
  async tx(mode, fn) { const db = await this.open(); return new Promise((res, rej) => { const t = db.transaction("recs", mode), q = fn(t.objectStore("recs")); t.oncomplete = () => res(q && q.result); t.onerror = () => rej(t.error); }); },
  put(v) { return this.tx("readwrite", s => s.put(v)); },
  all() { return this.tx("readonly", s => s.getAll()).then(a => a || []).catch(() => []); },
  del(id) { return this.tx("readwrite", s => s.delete(id)); }
};

/* ---------- 채점 ---------- */
const words = s => s.toLowerCase().replace(/[’'`]/g, "").replace(/\.\.\.|…/g, " ").replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(Boolean);
function score(target, said) {
  const t = words(target), s = words(said), n = t.length, m = s.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = t[i] === s[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const hit = new Array(n).fill(false); let i = 0, j = 0;
  while (i < n && j < m) { if (t[i] === s[j]) { hit[i] = true; i++; j++; } else if (dp[i + 1][j] >= dp[i][j + 1]) i++; else j++; }
  const pct = n ? Math.round(100 * dp[0][0] / n) : 0; let k = 0;
  const html = target.split(/\s+/).map(w => { const ws = words(w); if (!ws.length) return esc(w); const ok = ws.every(() => hit[k++]); return ok ? esc(w) : `<span class="miss">${esc(w)}</span>`; }).join(" ");
  return { pct, html };
}
function resultHTML(target, said) {
  const r = score(target, said);
  const msg = r.pct >= 90 ? "아주 좋아요" : r.pct >= 60 ? "빨간 단어만 다시 들어 보세요" : "다시 듣고 한 번 더 말해 보세요";
  return `<div class="result ${r.pct >= 90 ? "good" : ""}"><div class="row"><span class="pct">${r.pct}%</span><span class="sub" style="font-size:15px">${msg}</span></div><div class="words">${r.html}</div></div>`;
}

/* ---------- AI (선택) ---------- */
const aiReady = () => !!S.aiKey && navigator.onLine;
async function ai(prompt, max = 900) {
  if (!S.aiKey) throw { code: "nokey" };
  if (!navigator.onLine) throw { code: "offline" };
  const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST",
    headers: { "content-type": "application/json", "x-api-key": S.aiKey, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
    body: JSON.stringify({ model: S.aiModel || DEF.aiModel, max_tokens: max, messages: [{ role: "user", content: prompt }] }) });
  if (!r.ok) { let m = ""; try { m = (await r.json()).error.message; } catch (e) {} throw { code: "http", status: r.status, msg: m }; }
  return (await r.json()).content.map(c => c.text || "").join("");
}
const parseJSON = t => { const m = t.match(/\{[\s\S]*\}/); return JSON.parse(m ? m[0] : t); };
function aiError(e) {
  if (e && e.code === "nokey") return "설정에서 API 키를 넣으면 쓸 수 있어요";
  if (e && e.code === "offline") return "인터넷에 연결되면 쓸 수 있어요";
  if (e && e.status === 401) return "API 키가 맞지 않아요. 설정에서 확인해 주세요";
  if (e && e.status === 429) return "요청이 많아요. 잠시 후 다시 해 주세요";
  if (e && e.status === 404) return "모델 이름을 찾을 수 없어요. 설정에서 확인해 주세요";
  return "AI 응답을 받지 못했어요";
}

/* ---------- 화면 틀 ---------- */
const COLOR = { cards: "var(--indigo)", pattern: "var(--pink)", listen: "var(--teal)", shadow: "var(--orange)", role: "var(--green)", ai: "var(--purple)", month: "var(--red)", misc: "var(--blue)", streak: "var(--orange)", gray: "#8e8e93" };
const V = $("#view");
let tab = "home", leaveFn = null;
function fitBottom() { document.documentElement.style.setProperty("--bottom-h", ($("#bottom").offsetHeight + 12) + "px"); }
window.addEventListener("resize", fitBottom);
/* opts.nav = { title, p } → 레슨 화면(닫기 + 제목 + 진행 막대), opts.act = 활동 색 */
function screen(html, dock, opts = {}) {
  hush(); stopSR();
  document.documentElement.style.setProperty("--act", COLOR[opts.act] || COLOR.misc);
  const nav = opts.nav;
  document.body.classList.toggle("flow", !!nav);
  V.innerHTML = (nav ? `<div class="navbar"><button class="navbtn" data-x>${nav.back || "닫기"}</button><div class="navtitle">${esc(nav.title || "")}</div><span></span></div>${nav.p != null ? `<div class="progress"><i style="width:${Math.max(2, Math.round(nav.p * 100))}%"></i></div>` : ""}` : "") + html;
  $("#dock").innerHTML = dock ? `<div class="in">${dock}</div>` : "";
  const x = $("[data-x]", V); if (x) x.onclick = () => { leaveFn ? leaveFn() : go("home"); };
  fitBottom(); window.scrollTo(0, 0);
}
function go(t) {
  tab = t; leaveFn = null;
  $$("nav.tabs button").forEach(b => b.setAttribute("aria-current", b.dataset.tab === t ? "page" : "false"));
  ({ home: vHome, practice: vPractice, me: vMe })[t]();
}
$$("nav.tabs button").forEach(b => b.onclick = () => go(b.dataset.tab));
const cell = (o) => `<li><${o.href ? `a href="${o.href}"${/^https?:/.test(o.href) ? ' target="_blank" rel="noopener"' : ""}` : "button"} class="cell ${o.done ? "done" : ""}" ${o.attr || ""}>${o.icon ? `<span class="glyph" style="--c:${o.color || COLOR.misc}">${o.icon}</span>` : ""}${o.status != null ? `<span class="status ${o.status ? "on" : ""}" style="--c:${o.color || COLOR.misc}">${o.status ? I.tick : ""}</span>` : ""}<span class="t">${o.t}${o.d ? `<small>${o.d}</small>` : ""}</span>${o.v != null ? `<span class="v">${o.v}</span>` : ""}${o.done ? `<span class="ok">${I.tick}</span>` : o.noChev ? "" : I.chev}</${o.href ? "a" : "button"}></li>`;
const dateStr = () => { const d = new Date(); return `${d.getMonth() + 1}월 ${d.getDate()}일 ${"일월화수목금토"[d.getDay()]}요일`; };

/* 말하기 입력: 마이크가 되면 마이크, 아니면 직접 적기 */
function sayBox(box, onSaid, hint = "말해 보기") {
  if (canSR()) {
    box.innerHTML = `<div class="say"><button class="circle" data-mic aria-label="마이크로 말하기">${I.mic}</button><span class="sub" style="font-size:15px" data-live>${hint}</span></div>`;
    const b = $("[data-mic]", box), live = $("[data-live]", box);
    b.onclick = async () => {
      if (srNow) { stopSR(); return; }
      hush(); b.classList.add("on"); b.innerHTML = I.stop; live.textContent = "듣고 있어요…";
      try { const t = await recognize(p => live.textContent = p); b.classList.remove("on"); b.innerHTML = I.mic; if (t) { live.textContent = t; onSaid(t); } else live.textContent = "잘 안 들렸어요. 다시 눌러 주세요"; }
      catch (e) { b.classList.remove("on"); b.innerHTML = I.mic; live.textContent = e === "not-allowed" ? "설정에서 마이크를 허용해 주세요" : "잘 안 들렸어요. 다시 눌러 주세요"; }
    };
  } else {
    box.innerHTML = `<div class="inputcell" style="background:var(--bg)"><input class="field" data-in placeholder="키보드 마이크로 말해서 확인" autocomplete="off" autocapitalize="off" enterkeyhint="done"><button class="btn sm tint" data-ok>확인</button></div>`;
    const ok = () => { const v = $("[data-in]", box).value.trim(); if (v) onSaid(v); };
    $("[data-ok]", box).onclick = ok; $("[data-in]", box).onkeydown = e => { if (e.key === "Enter" && !e.isComposing) ok(); };
  }
}
function recButton(btn, onBlob) {
  if (!canRec()) { btn.outerHTML = `<label class="btn tint">${I.mic} 녹음<input type="file" accept="audio/*" capture hidden data-file></label>`; $("[data-file]").onchange = e => e.target.files[0] && onBlob(e.target.files[0]); return; }
  let rec = null;
  btn.onclick = async () => {
    if (rec) { const b = await rec.stop(); rec = null; btn.className = "btn tint"; btn.innerHTML = `${I.mic} 다시 녹음`; onBlob(b); return; }
    try { hush(); rec = await startRec(); btn.className = "btn red"; btn.innerHTML = `${I.stop} 멈추기`; } catch (e) { toast("설정에서 마이크를 허용해 주세요"); }
  };
}

/* ---------- 처음 안내 ---------- */
function onboard(step = 1) {
  if (step === 1) {
    screen(`<div class="welcome"><img class="appicon" src="icon-180.png" alt=""><div class="title2" style="font-size:34px;margin-bottom:6px">말문</div><p class="sub">매일 20분, 영어로 말하는 연습</p></div>`,
      `<button class="btn" data-n>시작하기</button>`);
    document.body.classList.add("flow"); fitBottom();
    $("[data-n]").onclick = () => onboard(2);
  } else if (step === 2) {
    screen(`<div class="title2" style="margin-top:8px">영어를 어디서 쓰고 싶으세요?</div>
      <div class="choices">${PURPOSES.map((p, i) => `<button class="choice" data-i="${i}"><span>${p[0]}<small>${p[1]}</small></span>${I.chev}</button>`).join("")}</div>`, "", { nav: { title: "", back: "뒤로" } });
    leaveFn = () => onboard(1);
    $$("[data-i]").forEach(b => b.onclick = () => { const c = PURPOSES[+b.dataset.i][2]; S.focus = c.length ? BASIC.concat(c) : []; save(); onboard(3); });
  } else {
    screen(`<div class="title2" style="margin-top:8px">지금 영어는 어느 정도예요?</div>
      <div class="choices">
        <button class="choice" data-l="초급"><span>거의 처음이에요<small>짧은 인사 정도</small></span>${I.chev}</button>
        <button class="choice" data-l="중급"><span>간단한 대화는 돼요<small>말이 바로 안 나와요</small></span>${I.chev}</button>
        <button class="choice" data-l="고급"><span>대화는 돼요<small>더 자연스럽고 빠르게</small></span>${I.chev}</button>
        <button class="choice" data-l="test"><span>잘 모르겠어요<small>3분 테스트로 알아보기</small></span>${I.chev}</button>
      </div>`, "", { nav: { title: "", back: "뒤로" } });
    leaveFn = () => onboard(2);
    $$("[data-l]").forEach(b => b.onclick = () => {
      if (b.dataset.l === "test") return levelTest(() => { S.onboarded = true; save(); go("home"); });
      setLevel(b.dataset.l, null); S.onboarded = true; save(); go("home");
    });
  }
}
function setLevel(lv, pct) { S.level = lv; S.testScore = pct; S.newPerDay = { "초급": 5, "중급": 8, "고급": 10 }[lv]; save(); }

/* ---------- 오늘 ---------- */
const FLOW = [
  { key: "cards", name: "표현 외우기", min: 7, icon: () => I.cards, run: runCards },
  { key: "pattern", name: "바꿔 말하기", min: 3, icon: () => I.swap, run: runPattern },
  { key: "listen", name: "듣기", min: 4, icon: () => I.ear, run: runListen },
  { key: "shadow", name: "따라 말하기", min: 4, icon: () => I.repeat, run: runShadow },
  { key: "role", name: "대화해 보기", min: 3, icon: () => I.people, run: runRole }
];
function ring(frac) {
  const r = 26, c = 2 * Math.PI * r;
  return `<svg class="ring" viewBox="0 0 64 64"><circle cx="32" cy="32" r="${r}" fill="none" stroke="var(--fill2)" stroke-width="8"/><circle cx="32" cy="32" r="${r}" fill="none" stroke="var(--blue)" stroke-width="8" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - frac)}" transform="rotate(-90 32 32)"/></svg>`;
}
function nextAward() {
  S.awards = S.awards || {}; const a = AWARDS.find(x => !S.awards[x.id]); if (!a) return "";
  return `<p class="gh">다음 배지</p><ul class="group plain"><li><button class="cell" data-awards>${medal(a, false)}<span class="t">${a.name}<small>${a.desc}</small></span>${I.chev}</button></li></ul>`;
}
function weekStrip() {
  const d = new Date(), dow = (d.getDay() + 6) % 7, done = S.doneDays || [];
  return `<div class="week">${[...Array(7)].map((_, k) => { const x = new Date(); x.setDate(d.getDate() - dow + k); const ds = fmt(x);
    return `<div class="wd ${ds === today() ? "today" : ""} ${done.includes(ds) ? "on" : ""}"><span>${"월화수목금토일"[k]}</span>${ds === today() || (S.days[ds] && (S.days[ds].steps || S.days[ds].spoken || S.days[ds].listen)) ? `<div class="mini">${rings(dayVals(ds), 36)}</div>` : `<i>${x.getDate()}</i>`}</div>`; }).join("")}</div>`;
}
async function vHome() {
  if (!S.onboarded) return onboard(1);
  const st = flowStep(), allDone = st >= FLOW.length, left = FLOW.slice(st).reduce((a, f) => a + f.min, 0);
  const recs = await idb.all(), last = recs.sort((a, b) => b.id - a.id)[0], monthDue = !last || daysBetween(last.date, today()) >= 28;
  const first = newList()[0] || dueList()[0];
  const v = dayVals(today()), d = D();
  screen(`<header class="large row" style="align-items:flex-end;flex-wrap:nowrap"><div class="grow"><p class="date">${dateStr()}</p><h1>오늘</h1></div>${runDays() ? `<div class="streak">${I.flame}<b>${runDays()}</b></div>` : ""}</header>
    ${weekStrip()}
    <section class="widget">
      <div class="w-head">${rings(v, 118)}<div class="legend">
        <div class="w-day">${dayNum()}일차</div>
        <div class="lg"><span>레슨</span><b style="color:${RING.lesson}">${st}/${GOALS.lesson}</b></div>
        <div class="lg"><span>말하기</span><b style="color:${RING.speak}">${d.spoken || 0}/${GOALS.speak}</b></div>
        <div class="lg"><span>듣기</span><b style="color:${RING.listen}">${d.listen || 0}/${GOALS.listen}분</b></div></div></div>
      ${first && !allDone ? `<div class="preview"><div class="pv-ko">${esc(first.ko)}</div><div class="pv-en">${esc(first.en)}</div></div>` : `<div class="preview"><div class="pv-ko">${dayNum() + 1}일차는 내일</div></div>`}
      ${allDone ? `<button class="btn gray" data-more>더 연습하기</button>` : `<button class="btn" data-go>${st ? "이어서 하기" : "시작하기"}</button>`}
    </section>
    <ul class="group plain" style="margin-top:20px">${FLOW.map((f, i) => cell({ status: i < st, color: COLOR[f.key], t: f.name, v: `${f.min}분`, attr: `data-step="${i}"`, noChev: true })).join("")}</ul>
    ${monthDue ? `<ul class="group plain" style="margin-top:20px">${cell({ t: "1분 말하기 녹음", v: last ? "한 달 지남" : "", attr: "data-month" })}</ul>` : ""}
    ${nextAward()}`, "");
  const g = $("[data-go]"); if (g) g.onclick = () => runFlow();
  const m = $("[data-more]"); if (m) m.onclick = () => go("practice");
  const mo = $("[data-month]"); if (mo) mo.onclick = () => runMonthly(() => go("home"));
  const aw = $("[data-awards]"); if (aw) aw.onclick = () => go("me");
  $$("[data-step]").forEach(b => b.onclick = () => { const i = +b.dataset.step; if (i === st) return runFlow(); FLOW[i].run(solo("home", FLOW[i].name)); });
}
function runFlow() {
  const st = flowStep();
  if (st >= FLOW.length) return finishFlow();
  leaveFn = () => { toast("저장했어요. 이어서 할 수 있어요"); go("home"); };
  FLOW[st].run({ nav: frac => ({ title: `${dayNum()}일차`, p: (st + Math.min(1, frac)) / FLOW.length }), done: sum => { S.flow.step = st + 1; D().steps = st + 1; touch(); save(); celebrate(`${FLOW[st].name} 완료`, sum, runFlow); } });
}
function finishFlow() {
  S.doneDays = S.doneDays || []; const n = dayNum(); if (!S.doneDays.includes(today())) S.doneDays.push(today()); D().steps = FLOW.length; touch(); save();
  const got = checkAwards(), d = D(), v = dayVals(today());
  screen(`<div class="finish"><div class="fin-rings">${rings(v, 168, true)}</div>
    <div class="title2" style="font-size:32px;margin-top:18px">${n}일차 완료!</div>
    <p class="sub">연속 ${runDays()}일</p></div>
    <ul class="group plain">
      <li class="cell"><span class="dot" style="--c:${RING.lesson}"></span><span class="t">레슨</span><span class="v">${FLOW.length}/${GOALS.lesson}</span></li>
      <li class="cell"><span class="dot" style="--c:${RING.speak}"></span><span class="t">말한 문장</span><span class="v">${d.spoken || 0}/${GOALS.speak}</span></li>
      <li class="cell"><span class="dot" style="--c:${RING.listen}"></span><span class="t">들은 시간</span><span class="v">${d.listen || 0}/${GOALS.listen}분</span></li>
      <li class="cell"><span class="dot" style="--c:var(--indigo)"></span><span class="t">새로 배운 표현</span><span class="v">${d.newL || 0}개</span></li></ul>
    ${got.length ? `<p class="gh">새 배지</p><div class="medals new">${got.map(a => `<div class="mcell">${medal(a, true, true)}<span>${a.name}</span></div>`).join("")}</div>` : ""}
    ${v.speak < 1 || v.listen < 1 ? `<p class="foot" style="text-align:center;padding-top:14px">${v.speak < 1 ? `${GOALS.speak - (d.spoken || 0)}문장 더 말하면` : `${GOALS.listen - (d.listen || 0)}분 더 들으면`} 링이 채워져요</p>` : ""}`,
    `<button class="btn" data-h>완료</button>`, { nav: { title: "", p: 1 } });
  $("[data-x]").remove(); $("[data-h]").onclick = () => go("home");
  chime("done"); confetti();
}
function solo(back = "practice", title = "") {
  leaveFn = () => go(back);
  return { nav: frac => ({ title, p: Math.min(1, frac) }), done: sum => { touch(); save(); celebrate(`${title || "연습"} 완료`, sum, () => go(back)); } };
}

/* ---------- 표현 외우기 ---------- */
function dueList() { const k = today(); return allPhrases().filter(p => S.cards[p.id] && S.cards[p.id].due <= k); }
function newList() {
  const room = Math.max(0, S.newPerDay - D().newL), f = S.focus.length ? S.focus : null;
  return allPhrases().filter(p => !S.cards[p.id]).sort((a, b) => {
    const fa = a.ord < 0 ? -1 : f && f.includes(a.cat) ? 0 : 1, fb = b.ord < 0 ? -1 : f && f.includes(b.cat) ? 0 : 1;
    return fa - fb || a.ord - b.ord || a.ci - b.ci;
  }).slice(0, room);
}
function runCards(ctx) {
  const q = [...dueList().map(p => ({ p, isNew: false })), ...newList().map(p => ({ p, isNew: true }))]; let total = q.length, n = 0, combo = 0;
  if (!total) return ctx.done("오늘 분량 끝");
  const front = () => {
    const c = q[0]; let said = "";
    screen(`<p class="cap">표현 외우기 ${n + 1}/${total}${combo >= 3 ? `<span class="combo">${combo}연속</span>` : ""}</p>
      <div class="card"><div class="ko-big">${esc(c.p.ko)}</div>${c.isNew ? `<span class="new">새 표현</span>` : ""}<div data-say></div></div>`,
      `<button class="btn" data-show>정답 보기</button>`, { nav: ctx.nav(n / total), act: "cards" });
    sayBox($("[data-say]"), t => { said = t; back(said); });
    $("[data-show]").onclick = () => back(said);
  };
  const back = said => {
    const c = q[0];
    screen(`<p class="cap">표현 외우기 ${n + 1}/${total}</p>
      <div class="card"><div class="sub" style="font-weight:600">${esc(c.p.ko)}</div><div class="sep"></div>
      <div class="row" style="align-items:flex-start;flex-wrap:nowrap"><div class="en-big grow">${esc(c.p.en)}</div><button class="circle" data-sp aria-label="다시 듣기">${I.speaker}</button></div>
      ${c.p.note ? `<p class="note">${esc(c.p.note)}</p>` : ""}${said ? resultHTML(c.p.en, said) : ""}</div>
      `,
      `<button class="btn red" data-g="0">몰랐어요</button><button class="btn gray" data-g="1">애매해요</button><button class="btn green" data-g="2">알았어요</button>`, { nav: ctx.nav((n + .5) / total), act: "cards" });
    speak(c.p.en); $("[data-sp]").onclick = () => speak(c.p.en);
    $$("[data-g]").forEach(b => b.onclick = () => {
      const g = +b.dataset.g, id = c.p.id, card = S.cards[id] || { box: 0, due: today() };
      if (c.isNew) D().newL++; else D().rev++;
      q.shift();
      if (g === 0) { card.box = 0; q.push({ p: c.p, isNew: false }); total++; }
      else if (g === 1) card.box = Math.max(1, card.box);
      else card.box = Math.min(INTERVALS.length - 1, card.box + 1);
      card.due = plusDays(g === 0 ? 0 : INTERVALS[card.box]); S.cards[id] = card; n++; save();
      spoke(); combo = g === 2 ? combo + 1 : 0; if (g === 2) chime("ok");
      q.length ? front() : ctx.done(`표현 ${n}개`);
    });
  };
  front();
}

/* ---------- 바꿔 말하기 ---------- */
function runPattern(ctx) {
  const P = window.PATTERNS[S.patternIdx % window.PATTERNS.length], items = P[2]; let i = 0;
  const front = () => {
    const [ko, en] = items[i]; let said = "";
    const head = `<p class="cap">바꿔 말하기 ${i + 1}/${items.length}</p><div class="title3">${esc(P[0])}</div><p class="sub" style="font-size:15px">${esc(P[1])}</p>`;
    screen(`${head}<div class="card"><div class="ko-big">${esc(ko)}</div><div data-say></div></div>`, `<button class="btn" data-show>정답 보기</button>`, { nav: ctx.nav(i / items.length), act: "pattern" });
    const show = () => {
      screen(`${head}<div class="card"><div class="sub" style="font-weight:600">${esc(ko)}</div><div class="sep"></div>
        <div class="row" style="align-items:flex-start;flex-wrap:nowrap"><div class="en-big grow">${esc(en)}</div><button class="circle" data-sp aria-label="다시 듣기">${I.speaker}</button></div>${said ? resultHTML(en, said) : ""}</div>`,
        `<button class="btn" data-n>다음</button>`, { nav: ctx.nav((i + .5) / items.length), act: "pattern" });
      speak(en); $("[data-sp]").onclick = () => speak(en);
      $("[data-n]").onclick = () => { spoke(); i++; if (i < items.length) front(); else { S.patternIdx++; save(); ctx.done(`문장 ${items.length}개`); } };
    };
    sayBox($("[data-say]"), t => { said = t; show(); });
    $("[data-show]").onclick = show;
  };
  front();
}

/* ---------- 듣기 ---------- */
function runListen(ctx) {
  const LV = ["초급", "중급", "고급"], me = LV.indexOf(S.level || "중급");
  const list = allListening().map((x, i) => [x, i]).sort((a, b) => Math.abs(LV.indexOf(a[0].level) - me) - Math.abs(LV.indexOf(b[0].level) - me) || a[1] - b[1]).map(x => x[0]);
  const L = list[S.listenIdx % list.length], sents = L.s.map(x => x[0]); let playing = false, qi = 0, right = 0;
  const playAll = async () => {
    const btn = $("[data-p]");
    if (playing) { playing = false; hush(); if (btn) btn.innerHTML = I.play; return; }
    playing = true; if (btn) btn.innerHTML = I.stop;
    for (const s of sents) { if (!playing) break; await speak(s); await sleep(350); }
    playing = false; const b2 = $("[data-p]"); if (b2) b2.innerHTML = I.play;
  };
  const stage1 = () => {
    screen(`<p class="cap">듣기</p><div class="title2">${esc(L.title)}</div><p class="sub">글자 없이 끝까지 들어 보세요</p>
      <div class="center"><button class="circle big" data-p aria-label="재생">${I.play}</button></div>`,
      `<button class="btn" data-n>다 들었어요</button>`, { nav: ctx.nav(.05), act: "listen" });
    $("[data-p]").onclick = playAll;
    $("[data-n]").onclick = () => { playing = false; hush(); quiz(); };
    playAll();
  };
  const quiz = () => {
    const q = L.q[qi];
    screen(`<p class="cap">듣기 문제 ${qi + 1}/${L.q.length}</p><div class="title3">${esc(q[0])}</div>
      <div class="choices">${q[1].map((o, oi) => `<button class="choice" data-o="${oi}"><span>${esc(o)}</span></button>`).join("")}</div>`, "", { nav: ctx.nav(.2 + .5 * qi / L.q.length), act: "listen" });
    $$("[data-o]").forEach(b => b.onclick = () => {
      $$("[data-o]").forEach(x => { x.disabled = true; if (+x.dataset.o === q[2]) { x.classList.add("right"); x.insertAdjacentHTML("beforeend", I.tick); } });
      if (+b.dataset.o !== q[2]) { b.classList.add("wrong"); b.insertAdjacentHTML("beforeend", I.cross); } else { right++; chime("ok"); }
      setTimeout(() => { qi++; qi < L.q.length ? quiz() : script(); }, 900);
    });
  };
  const script = () => {
    screen(`<p class="cap">듣기</p><div class="title3">${esc(L.title)}</div><p class="sub" style="font-size:15px">문장을 누르면 다시 들려요</p>
      <ul class="script">${L.s.map((x, i) => `<li><button data-i="${i}"><div class="e">${esc(x[0])}</div><div class="k">${esc(x[1])}</div></button></li>`).join("")}</ul>`,
      `<button class="btn" data-n>다음</button>`, { nav: ctx.nav(.85), act: "listen" });
    $$("[data-i]").forEach(b => b.onclick = () => speak(sents[+b.dataset.i]));
    $("[data-n]").onclick = () => { D().listen += 5; S.listenTotal += 5; S.listenIdx++; save(); ctx.done(`${L.q.length}문제 중 ${right}개 정답`); };
  };
  stage1();
}

/* ---------- 따라 말하기 ---------- */
function runShadow(ctx, name) {
  const all = allDialogs(), names = Object.keys(all), picked = !!name;
  name = name || names[S.shadowIdx % names.length];
  const L = all[name]; let i = 0; const recs = {};
  const line = () => {
    const [, en, ko] = L[i];
    screen(`<p class="cap">따라 말하기 ${i + 1}/${L.length}</p><div class="title3">${esc(name)}</div>
      <div class="card"><div class="en-mid">${esc(en)}</div><p class="sub" style="margin:8px 0 0">${esc(ko)}</p></div>
      <div class="ab"><button class="btn tint" data-o>${I.speaker} 다시 듣기</button><button class="btn tint" data-r>${I.mic} 녹음</button></div>
      <div data-mine>${recs[i] ? `<p class="foot">내 목소리</p><audio controls src="${recs[i]}"></audio>` : ""}</div>
      <button class="link" data-slow>천천히 듣기</button>`,
      `<button class="btn" data-n>${i + 1 < L.length ? "다음 문장" : "다음"}</button>`, { nav: ctx.nav(i / L.length), act: "shadow" });
    speak(en);
    $("[data-o]").onclick = () => speak(en);
    $("[data-slow]").onclick = () => speak(en, .7);
    recButton($("[data-r]"), blob => { if (recs[i]) URL.revokeObjectURL(recs[i]); recs[i] = URL.createObjectURL(blob); $("[data-mine]").innerHTML = `<p class="foot">내 목소리</p><audio controls src="${recs[i]}"></audio>`; });
    $("[data-n]").onclick = () => { spoke(); i++; if (i < L.length) line(); else { if (!picked) S.shadowIdx++; save(); ctx.done(`${L.length}문장 따라 말함`); } };
  };
  line();
}

/* ---------- 대화해 보기 ---------- */
function runRole(ctx, name) {
  const all = allDialogs(), names = Object.keys(all), picked = !!name, me = "B";
  name = name || names[(S.roleIdx + 15) % names.length];
  const L = all[name], log = [], scores = []; let i = 0;
  const draw = mine => {
    const bubbles = log.map(m => `<div class="bub ${m.me ? "me" : "them"}">${esc(m.t)}</div>${m.fix ? `<div class="fix">원래 문장<span class="e">${esc(m.fix)}</span></div>` : ""}`).join("");
    screen(`<p class="cap">대화해 보기</p><div class="title3">${esc(name)}</div><div class="chat">${bubbles}</div>${mine || ""}`,
      mine ? `<button class="btn gray" data-skip>모르겠어요</button>` : "", { nav: ctx.nav(i / L.length), act: "role" });
    const c = $(".chat"); if (c && c.lastElementChild) c.lastElementChild.scrollIntoView({ block: "nearest" });
  };
  const step = async () => {
    if (i >= L.length) {
      const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
      if (!picked) S.roleIdx++; save();
      ctx.done(`평균 ${avg}%`); return;
    }
    const [who, en, ko] = L[i];
    if (who !== me) { log.push({ me: false, t: en }); draw(); await speak(en); i++; return step(); }
    draw(`<div class="myturn"><p class="cap" style="margin:0 0 4px">내 차례</p><div class="ko-big" style="font-size:21px">${esc(ko)}</div><div data-say></div></div>`);
    sayBox($("[data-say]"), said => { spoke(); const r = score(en, said); scores.push(r.pct); log.push({ me: true, t: said, fix: r.pct >= 85 ? "" : en }); i++; step(); }, "영어로 대답하기");
    $("[data-skip]").onclick = () => { scores.push(0); log.push({ me: true, t: "…", fix: en }); speak(en); i++; step(); };
  };
  step();
}

/* ---------- AI와 대화 ---------- */
function runAI() {
  let scn = "카페 주문", hist = [], busy = false;
  const draw = () => {
    if (!aiReady()) {
      screen(`<div class="center" style="margin-top:10vh"><span class="sq" style="--c:${COLOR.ai};width:64px;height:64px;border-radius:15px">${I.chat}</span><div class="title3">${S.aiKey ? "인터넷에 연결되면 쓸 수 있어요" : "API 키가 필요해요"}</div>
        <p class="sub">${S.aiKey ? "그동안 '대화해 보기'로 연습해 보세요. 인터넷 없이 돼요." : "기록 탭 › 설정에서 Anthropic API 키를 넣으면 AI와 자유롭게 대화하고 틀린 문장을 고쳐 받을 수 있어요."}</p></div>`, "", { nav: { title: "AI와 대화" }, act: "ai" });
      return;
    }
    screen(`<div class="seg" style="margin:4px 0 8px;overflow-x:auto">${Object.keys(SCENARIOS).slice(0, 4).map(s => `<button data-s="${s}" aria-pressed="${s === scn}">${s}</button>`).join("")}</div>
      <div class="seg" style="margin:0 0 10px">${Object.keys(SCENARIOS).slice(4).map(s => `<button data-s="${s}" aria-pressed="${s === scn}">${s}</button>`).join("")}</div>
      <div class="chat" id="chat"></div><div data-say></div>
      <div class="inputcell"><textarea class="field" id="msg" rows="1" placeholder="영어로 입력 (한국어도 돼요)"></textarea><button class="btn sm" id="send">보내기</button></div>`, "", { nav: { title: "AI와 대화" }, act: "ai" });
    $$("[data-s]").forEach(b => b.onclick = () => { scn = b.dataset.s; hist = []; draw(); });
    if (!hist.length) hist.push({ role: "assistant", content: SCENARIOS[scn][1] });
    hist.forEach(addBub);
    if (canSR()) sayBox($("[data-say]"), t => { $("#msg").value = t; send(); });
    $("#send").onclick = send;
    $("#msg").onkeydown = e => { if (e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); send(); } };
    if (hist.length === 1) speak(hist[0].content);
  };
  const addBub = m => {
    const c = $("#chat"); if (!c) return;
    c.insertAdjacentHTML("beforeend", `<div class="bub ${m.role === "user" ? "me" : "them"}">${esc(m.content)}</div>`);
    if (m.fix) {
      const f = document.createElement("div"); f.className = "fix";
      f.innerHTML = `더 자연스러운 표현<span class="e">${esc(m.fix.better)}</span>${m.fix.tip ? esc(m.fix.tip) : ""}<div><button class="link" style="font-size:13px" data-l>듣기</button> <button class="link" style="font-size:13px" data-a>${m.fix.saved ? "카드에 추가됨" : "카드에 추가"}</button></div>`;
      $("[data-l]", f).onclick = () => speak(m.fix.better);
      $("[data-a]", f).onclick = e => { if (m.fix.saved) return; S.custom.push({ id: "u" + Date.now(), ko: m.content.slice(0, 60), en: m.fix.better, note: m.fix.tip || "" }); m.fix.saved = true; save(); e.target.textContent = "카드에 추가됨"; toast("다음 표현 외우기에 나와요"); };
      c.appendChild(f);
    }
    c.lastElementChild.scrollIntoView({ block: "nearest" });
  };
  const send = async () => {
    const m = $("#msg"), text = m.value.trim(); if (!text || busy) return;
    busy = true; m.value = ""; $("#send").disabled = true;
    const um = { role: "user", content: text }; hist.push(um); addBub(um); spoke();
    try {
      const t = await ai(`You are an English conversation partner in a role-play with a Korean adult learner.
Role: ${SCENARIOS[scn][0]}
Level: ${LEVELS[S.level || "중급"]}
Stay in character. Reply in 1-3 sentences and end with a question so the learner keeps talking.
Conversation so far:
${hist.map(x => (x.role === "user" ? "LEARNER: " : "YOU: ") + x.content).join("\n")}
Return only JSON: {"reply":"...","ok":true/false (false if the learner's last message had an error, sounded unnatural, or was in Korean),"better":"natural native version of the learner's last message, or empty","tip":"짧은 한국어 설명, or empty"}`, 600);
      let j; try { j = parseJSON(t); } catch (e) { j = { reply: t, ok: true }; }
      if (!j.ok && j.better) { um.fix = { better: j.better, tip: j.tip }; $("#chat").lastElementChild.remove(); addBub(um); }
      const a = { role: "assistant", content: j.reply || "Sorry, could you say that again?" }; hist.push(a); addBub(a);
      S.chatTurns++; touch(); save(); speak(a.content);
    } catch (e) { hist.pop(); $("#chat").lastElementChild.remove(); m.value = text; toast(aiError(e)); }
    busy = false; if ($("#send")) $("#send").disabled = false;
  };
  draw();
}

/* ---------- 1분 말하기 ---------- */
function runMonthly(back) {
  leaveFn = back;
  screen(`<div class="title2" style="margin-top:4px">1분 동안 영어로 말해 보세요</div><p class="sub">이 순서로 이어서 말하면 돼요. 틀려도 멈추지 마세요.</p>
    <ul class="group plain">${MONTHLY_Q.map((q, i) => cell({ t: `${i + 1}. ${q}`, noChev: true })).join("")}</ul>
    <div class="center" style="margin:28px 0 10px"><div class="timer" id="tm">1:00</div></div><div id="out"></div>`,
    `<button class="btn" id="go">${I.mic} 녹음 시작</button>`, { nav: { title: "1분 말하기" }, act: "month" });
  if (!canRec()) { $("#go").outerHTML = `<label class="btn">녹음하기<input type="file" accept="audio/*" capture hidden id="mf"></label>`; $("#mf").onchange = e => e.target.files[0] && finish(e.target.files[0], "", null); return; }
  let rec = null, timer = null, text = "", t0 = 0, sr = false;
  const stop = async () => { clearInterval(timer); if (!rec) return; const r = rec; rec = null; sr = false; stopSR(); const b = await r.stop(); const secs = Math.max(1, (Date.now() - t0) / 1000); finish(b, text, text ? Math.round(words(text).length * 60 / secs) : null); };
  $("#go").onclick = async () => {
    if (rec) return stop();
    try { hush(); rec = await startRec(); } catch (e) { return toast("설정에서 마이크를 허용해 주세요"); }
    t0 = Date.now(); $("#go").innerHTML = `${I.stop} 그만하기`; $("#go").style.background = "var(--red)"; $("#tm").classList.add("rec");
    timer = setInterval(() => { const l = Math.max(0, 60 - Math.floor((Date.now() - t0) / 1000)); $("#tm").textContent = `0:${String(l).padStart(2, "0")}`; if (!l) stop(); }, 250);
    if (canSR()) { sr = true; (async () => { while (sr && rec) { try { const t = await recognize(); if (t) text += " " + t; } catch (e) { if (e !== "no-speech" && e !== "aborted") break; } } })(); }
  };
  function finish(blob, text, wpm) {
    const url = URL.createObjectURL(blob); let stuck = null;
    $("#tm").classList.remove("rec");
    $("#out").innerHTML = `<audio controls src="${url}"></audio>${wpm != null ? `<p style="margin-top:12px;text-align:center">1분에 <b>${wpm}단어</b>를 말했어요</p>` : ""}
      <p class="gh">얼마나 막혔나요?</p><div class="seg">${["거의 안 막힘", "조금", "자주", "계속"].map((x, i) => `<button data-k="${i + 1}" aria-pressed="false">${x}</button>`).join("")}</div>`;
    $$("[data-k]").forEach(b => b.onclick = () => { stuck = +b.dataset.k; $$("[data-k]").forEach(x => x.setAttribute("aria-pressed", x === b)); });
    $("#dock .in").innerHTML = `<button class="btn gray" id="re">다시</button><button class="btn" id="sv">저장</button>`; fitBottom();
    $("#re").onclick = () => runMonthly(back);
    $("#sv").onclick = async () => { try { await idb.put({ id: Date.now(), date: today(), blob, text: (text || "").trim(), wpm, stuck }); S.recCount = (S.recCount || 0) + 1; touch(); save(); checkAwards(); toast("저장했어요"); back(); } catch (e) { toast("저장하지 못했어요"); } };
  }
}

/* ---------- 레벨 테스트 ---------- */
function levelTest(after) {
  const T = window.LEVEL_TEST; let i = 0, got = 0, max = 0;
  leaveFn = after;
  const q = () => {
    if (i >= T.length) {
      const pct = Math.round(100 * got / max), lv = pct >= 80 ? "고급" : pct >= 50 ? "중급" : "초급"; setLevel(lv, pct);
      screen(`<div class="center" style="margin-top:10vh"><p class="sub" style="margin:0">레벨 테스트 결과</p><div class="title2" style="font-size:40px">${lv}</div><p class="sub">${T.length}문제 중 ${pct}%를 맞혔어요</p>
        <p>${lv === "초급" ? "짧은 문장부터 차근차근 가요. 하루 새 표현은 5개예요." : lv === "중급" ? "말이 바로 나오게 만드는 연습에 집중해요. 하루 새 표현은 8개예요." : "더 빠르고 자연스럽게 말하는 데 집중해요. 하루 새 표현은 10개예요."}</p></div>`,
        `<button class="btn" data-n>완료</button>`, { nav: { title: "레벨 테스트", p: 1 } });
      $("[data-x]").remove(); $("[data-n]").onclick = after; return;
    }
    const t = T[i]; let plays = 0;
    screen(`<p class="cap">${i + 1}/${T.length}</p>
      ${t.type === "listen" ? `<div class="title3">듣고 맞는 뜻을 고르세요</div><div class="center" style="margin:18px 0"><button class="circle big" data-p aria-label="듣기">${I.speaker}</button><span class="sub" style="font-size:13px">두 번까지 들을 수 있어요</span></div>` : `<div class="title3">가장 자연스러운 영어를 고르세요</div><div class="card"><div class="ko-big" style="font-size:21px">${esc(t.ko)}</div></div>`}
      <div class="choices">${shuffle(t.opts.map((o, k) => [o, k])).map(([o, k]) => `<button class="choice" data-o="${k}"><span>${esc(o)}</span></button>`).join("")}</div>`, "", { nav: { title: "레벨 테스트", p: i / T.length } });
    const p = $("[data-p]"); if (p) { p.onclick = () => { if (plays++ < 2) speak(t.say, .95); if (plays >= 2) p.disabled = true; }; }
    $$("[data-o]").forEach(b => b.onclick = () => { max += t.w; if (+b.dataset.o === t.a) got += t.w; i++; q(); });
  };
  q();
}

/* ---------- 연습 ---------- */
function vPractice() {
  const rows = [["cards", I.cards, "표현 외우기", `복습 ${dueList().length}개, 새 표현 ${newList().length}개`], ["pattern", I.swap, "바꿔 말하기", "패턴 하나로 문장 만들기"],
    ["listen", I.ear, "듣기", "듣고 문제 풀기"], ["shadow", I.repeat, "따라 말하기", "녹음해서 원래 소리와 비교"], ["role", I.people, "대화해 보기", "앱이 상대 역할을 해요"]];
  screen(`<header class="large"><h1>연습</h1></header>
    <ul class="group" style="margin-top:12px">${rows.map(([k, ic, t]) => cell({ icon: ic, color: COLOR[k], t, v: k === "cards" && dueList().length + newList().length ? `${dueList().length + newList().length}` : null, attr: `data-k="${k}"` })).join("")}</ul>
    <ul class="group">${cell({ icon: I.chat, color: COLOR.ai, t: "AI와 대화", v: aiReady() ? null : "키 필요", attr: 'data-k="ai"' })}
      ${cell({ icon: I.clock, color: COLOR.month, t: "1분 말하기", attr: 'data-k="month"' })}
      ${cell({ icon: I.headphones, color: COLOR.listen, t: "들은 시간 기록", v: `${D().listen}분`, attr: 'data-k="outside"' })}</ul>`, "");
  $$("[data-k]").forEach(b => b.onclick = () => {
    const k = b.dataset.k, nm = { cards: "표현 외우기", pattern: "바꿔 말하기", listen: "듣기", shadow: "따라 말하기", role: "대화해 보기" }[k];
    if (k === "cards") runCards(solo("practice", nm));
    if (k === "pattern") runPattern(solo("practice", nm));
    if (k === "listen") runListen(solo("practice", nm));
    if (k === "shadow") pickDialog(nm, n => runShadow(solo("practice", nm), n));
    if (k === "role") pickDialog(nm, n => runRole(solo("practice", nm), n));
    if (k === "ai") { leaveFn = () => go("practice"); runAI(); }
    if (k === "month") runMonthly(() => go("practice"));
    if (k === "outside") outside();
  });
}
function pickDialog(title, then) {
  leaveFn = () => go("practice");
  const names = Object.keys(allDialogs());
  screen(`<div class="title2" style="margin-top:4px">어떤 상황으로 할까요?</div>
    <ul class="group plain">${names.map(n => cell({ t: esc(n), attr: `data-n="${esc(n)}"` })).join("")}</ul>
    ${aiReady() ? `<button class="link" data-gen style="margin-top:12px">AI로 새 상황 만들기</button>` : ""}`, "", { nav: { title } });
  $$("[data-n]").forEach(b => b.onclick = () => then(b.dataset.n));
  const g = $("[data-gen]"); if (g) g.onclick = async () => {
    g.disabled = true; g.textContent = "만드는 중…";
    try {
      const j = parseJSON(await ai(`Write a short natural English conversation (6 lines, alternating A and B) for a Korean adult learner.
Level: ${LEVELS[S.level || "중급"]}. Pick an everyday situation different from: ${names.join(", ")}.
Return only JSON: {"title":"짧은 한국어 상황 이름","lines":[["A","English","한국어 번역"]]}`));
      if (!j.lines || j.lines.length < 4) throw {};
      S.aiDialogs = (S.aiDialogs || []).filter(d => d.title !== j.title).concat([{ title: j.title, lines: j.lines }]).slice(-40); save();
      then(j.title);
    } catch (e) { toast(aiError(e)); g.disabled = false; g.textContent = "AI로 새 상황 만들기"; }
  };
}
function outside() {
  leaveFn = () => go("practice");
  screen(`<div class="title2" style="margin-top:4px">오늘 밖에서 몇 분 들었나요?</div><p class="sub">유튜브, 팟캐스트, 드라마 모두 좋아요.</p>
    <div class="choices">${[10, 20, 30, 60].map(m => `<button class="choice" data-m="${m}"><span>${m}분</span></button>`).join("")}</div>
    <p class="gh">들을 만한 곳</p>
    <ul class="group plain">${cell({ t: "BBC Learning English", d: "수준별 짧은 영상과 오디오", href: "https://www.bbc.co.uk/learningenglish" })}
      ${cell({ t: "VOA Learning English", d: "느리고 또렷한 뉴스, 대본 있음", href: "https://learningenglish.voanews.com" })}
      ${cell({ t: "TED-Ed", d: "5분 안팎 애니메이션, 영어 자막", href: "https://www.youtube.com/@TEDEd" })}</ul>
    <p class="foot">70~80% 정도 알아듣는 수준이 가장 효과적이에요.</p>`, "", { nav: { title: "들은 시간" }, act: "listen" });
  $$("[data-m]").forEach(b => b.onclick = () => { D().listen += +b.dataset.m; S.listenTotal += +b.dataset.m; touch(); save(); chime("ok"); toast(`${b.dataset.m}분 기록했어요`); checkAwards(); go("practice"); });
}

/* ---------- 기록 ---------- */
function humanWeek() { let n = 0; for (let i = 0; i < 7; i++) { const d = S.days[plusDays(-i)]; if (d && d.human) n++; } return n; }
async function vMe() {
  const all = allPhrases(), long = all.filter(p => S.cards[p.id] && S.cards[p.id].box >= 4).length, started = all.filter(p => S.cards[p.id]).length;
  const recs = (await idb.all()).sort((a, b) => b.id - a.id);
  S.awards = S.awards || {}; const nAw = AWARDS.filter(a => S.awards[a.id]).length;
  screen(`<header class="large"><h1>기록</h1></header>
    ${weekStrip()}
    <p class="gh">배지 ${nAw}/${AWARDS.length}</p>
    <div class="group"><div class="medals">${AWARDS.map(a => `<button class="mcell" data-aw="${a.id}">${medal(a, !!S.awards[a.id])}<span>${a.name}</span></button>`).join("")}</div></div>
    <ul class="group plain" style="margin-top:12px">${cell({ t: "연속", v: `${runDays()}일`, noChev: true })}
      ${cell({ t: "완료한 레슨", v: `${(S.doneDays || []).length}일`, noChev: true })}
      ${cell({ t: "오래 기억한 표현", v: `${long}개`, noChev: true })}
      ${cell({ t: "배우는 중인 표현", v: `${started - long}개`, noChev: true })}
      ${cell({ t: "들은 시간", v: `${S.listenTotal || 0}분`, noChev: true })}
      ${cell({ t: "말한 문장", v: `${S.spokenTotal || 0}개`, noChev: true })}
      ${cell({ t: "레벨", v: S.level || "-", attr: "data-test" })}</ul>
    <p class="gh">이번 주 실제 대화</p>
    <ul class="group plain">${cell({ t: D().human ? "오늘 기록함" : "오늘 했어요", v: `${humanWeek()} / 2`, attr: D().human ? "disabled" : "data-human", noChev: true })}</ul>
    <p class="gh">1분 말하기</p>
    ${recs.length ? `<ul class="group plain">${recs.map(r => `<li class="cell" style="flex-direction:column;align-items:stretch;cursor:default"><div class="row"><span class="grow">${r.date}</span><span class="sub" style="font-size:15px">${r.wpm != null ? `분당 ${r.wpm}단어` : ""}</span></div><audio controls preload="none" data-a="${r.id}"></audio></li>`).join("")}</ul>`
      : `<ul class="group plain">${cell({ t: "첫 녹음 남기기", attr: "data-month" })}</ul>`}
    <ul class="group plain" style="margin-top:20px">${cell({ t: "설정", attr: "data-set" })}</ul>`, "");
  recs.forEach(r => { const a = $(`audio[data-a="${r.id}"]`); if (a && r.blob) a.src = URL.createObjectURL(r.blob); });
  const hm = $("[data-human]"); if (hm) hm.onclick = () => { D().human = true; touch(); save(); chime("step"); const g = checkAwards(); toast(g.length ? `새 배지: ${g[0].name}` : "기록했어요"); vMe(); };
  $("[data-test]").onclick = () => levelTest(() => go("me"));
  $$("[data-aw]").forEach(b => b.onclick = () => { const a = AWARDS.find(x => x.id === b.dataset.aw); toast(S.awards[a.id] ? `${a.desc} (${S.awards[a.id]})` : `아직: ${a.desc}`); });
  const mo = $("[data-month]"); if (mo) mo.onclick = () => runMonthly(() => go("me"));
  $("[data-set]").onclick = settings;
}
let installEvt = null;
window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); installEvt = e; });
function settings() {
  leaveFn = () => go("me");
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent), standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone;
  screen(`<div class="title2" style="margin:4px 0 0">설정</div>
    <p class="gh">하루 새 표현</p><div class="seg">${[3, 5, 8, 10, 15].map(n => `<button data-n="${n}" aria-pressed="${n === S.newPerDay}">${n}개</button>`).join("")}</div>
    <p class="gh">말하는 속도</p><div class="seg">${[[.75, "느리게"], [.9, "조금 느리게"], [1, "보통"]].map(([r, l]) => `<button data-r="${r}" aria-pressed="${r === S.rate}">${l}</button>`).join("")}</div>
    <p class="gh">효과음</p><div class="seg">${[[true, "켜기"], [false, "끄기"]].map(([v, l]) => `<button data-snd="${v}" aria-pressed="${(S.sound !== false) === v}">${l}</button>`).join("")}</div>
    <p class="gh">먼저 배울 분야</p><div class="group"><div class="chips">${CATS.map(c => `<button class="chip" data-c="${c}" aria-pressed="${S.focus.includes(c)}">${c}</button>`).join("")}</div></div>
    ${TTS && voices.length ? `<p class="gh">목소리</p><ul class="group plain"><li class="cell"><select class="field" id="voice" style="flex:1"><option value="">자동</option>${voices.map(v => `<option ${v.name === S.voice ? "selected" : ""}>${esc(v.name)}</option>`).join("")}</select><button class="link" id="vt">듣기</button></li></ul>
      <p class="foot">iPhone은 설정 › 손쉬운 사용 › 읽기 및 말하기 › 음성에서 고품질 영어 음성을 받을 수 있어요.</p>` : ""}
    <p class="gh">매일 알림</p><ul class="group plain"><li class="cell"><span class="t">알림 시간</span><input type="time" id="rt" value="${S.remindTime}" style="border:0;background:var(--fill);border-radius:8px;padding:6px 10px;font-size:17px"></li>
      <li><button class="cell" id="ics"><span class="t" style="color:var(--blue)">캘린더에 매일 알림 추가</span></button></li></ul>
    <p class="gh">홈 화면에 추가</p><ul class="group plain">${installEvt && !standalone ? `<li><button class="cell" id="inst"><span class="t" style="color:var(--blue)">지금 설치</span></button></li>` : `<li class="cell"><span class="t" style="font-size:15px">${standalone ? "설치되어 있어요. 인터넷 없이도 열려요." : ios ? "Safari 아래 공유 버튼 › 홈 화면에 추가" : "브라우저 메뉴 › 앱 설치"}</span></li>`}</ul>
    <p class="gh">AI 대화 (선택)</p>
    <ul class="group plain"><li class="cell"><input class="field" id="key" type="password" autocomplete="off" value="${esc(S.aiKey)}" placeholder="Anthropic API 키"></li>
      <li class="cell"><span class="sub" style="font-size:15px;flex:none">모델</span><input class="field" id="model" value="${esc(S.aiModel)}" style="text-align:right"></li>
      <li><button class="cell" id="ks"><span class="t" style="color:var(--blue)">저장하고 연결 확인</span></button></li>
      ${S.aiKey ? `<li><button class="cell" id="kd"><span class="t" style="color:var(--red)">키 지우기</span></button></li>` : ""}</ul>
    <p class="foot">키는 이 기기 브라우저에만 저장되고 Anthropic으로만 전송돼요. 대화 내용도 Anthropic으로 보내져요. 사용 한도를 낮게 정한 전용 키를 쓰고, 공용 기기에서는 넣지 마세요. <a href="https://console.anthropic.com/" target="_blank" rel="noopener">키 만들기</a></p>
    <p class="gh">백업</p><ul class="group plain"><li><button class="cell" id="ex"><span class="t" style="color:var(--blue)">백업 파일 받기</span></button></li>
      <li><label class="cell" style="cursor:pointer"><span class="t" style="color:var(--blue)">백업 불러오기</span><input type="file" accept="application/json" id="im" hidden></label></li></ul>
    <p class="foot">진도는 이 기기에만 저장돼요. 녹음은 백업에 포함되지 않아요.</p>
    <p class="gh">개인정보</p><ul class="group plain"><li class="cell" style="display:block;font-size:15px;line-height:1.45">말문은 서버가 없어서 아무 정보도 모으지 않아요. 진도와 녹음은 이 기기에만 저장돼요.<br><br><b>마이크로 말하기</b>를 누르면 받아쓰기를 위해 목소리가 브라우저 회사(Chrome은 Google, Safari는 Apple)로 보내질 수 있어요. 싫다면 마이크 대신 키보드 입력이나 녹음 버튼을 쓰세요. 녹음 버튼으로 남긴 소리는 기기 밖으로 나가지 않아요.</li>
      ${cell({ t: "개인정보 처리방침", href: "privacy.html" })}</ul>
    <ul class="group plain" style="margin-top:24px"><li><button class="cell" id="wipe"><span class="t" style="color:var(--red)">진도와 녹음 모두 지우기</span></button></li></ul>`, "", { nav: { title: "", back: "기록" } });
  $$("[data-n]").forEach(b => b.onclick = () => { S.newPerDay = +b.dataset.n; $$("[data-n]").forEach(x => x.setAttribute("aria-pressed", x === b)); save(); });
  $$("[data-r]").forEach(b => b.onclick = () => { S.rate = +b.dataset.r; $$("[data-r]").forEach(x => x.setAttribute("aria-pressed", x === b)); save(); speak("This is how fast I will speak."); });
  $$("[data-snd]").forEach(b => b.onclick = () => { S.sound = b.dataset.snd === "true"; $$("[data-snd]").forEach(x => x.setAttribute("aria-pressed", x === b)); save(); chime("ok"); });
  $$("[data-c]").forEach(b => b.onclick = () => { const c = b.dataset.c, i = S.focus.indexOf(c); i >= 0 ? S.focus.splice(i, 1) : S.focus.push(c); b.setAttribute("aria-pressed", i < 0); save(); });
  const vs = $("#voice"); if (vs) { vs.onchange = e => { S.voice = e.target.value; save(); }; $("#vt").onclick = () => speak("Hi! Let's practice English together."); }
  $("#ics").onclick = () => {
    const [hh, mm] = ($("#rt").value || "21:00").split(":"); S.remindTime = `${hh}:${mm}`; save();
    const st = new Date(); st.setHours(+hh, +mm, 0, 0); const en = new Date(st.getTime() + 20 * 60000);
    const loc = x => fmt(x).replace(/-/g, "") + "T" + String(x.getHours()).padStart(2, "0") + String(x.getMinutes()).padStart(2, "0") + "00";
    const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//malmun//KO", "BEGIN:VEVENT", "UID:malmun-" + Date.now() + "@malmun", "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z",
      "DTSTART:" + loc(st), "DTEND:" + loc(en), "RRULE:FREQ=DAILY", "SUMMARY:말문 영어 20분", "BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:영어 20분 할 시간이에요", "TRIGGER:PT0M", "END:VALARM", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    download("malmun-alarm.ics", new Blob([ics], { type: "text/calendar" })); toast("받은 파일을 열어 캘린더에 추가하세요");
  };
  const inst = $("#inst"); if (inst) inst.onclick = async () => { installEvt.prompt(); await installEvt.userChoice; installEvt = null; settings(); };
  $("#ks").onclick = async () => { S.aiKey = $("#key").value.trim(); S.aiModel = $("#model").value.trim() || DEF.aiModel; save(); if (!S.aiKey) return toast("키를 지웠어요"); toast("확인하는 중…"); try { await ai("Reply with OK", 5); toast("연결됐어요"); } catch (er) { toast(aiError(er)); } };
  const kd = $("#kd"); if (kd) kd.onclick = () => { S.aiKey = ""; save(); toast("키를 지웠어요"); settings(); };
  $("#ex").onclick = () => download(`malmun-backup-${today()}.json`, new Blob([JSON.stringify(Object.assign({}, S, { aiKey: "" }))], { type: "application/json" }));
  $("#im").onchange = async e => { const f = e.target.files[0]; if (!f) return; try { if (f.size > 5e6) throw 0; const j = JSON.parse(await f.text()); if (!j || !j.cards) throw 0; const key = S.aiKey; S = clean(j, false); S.aiKey = key; save(); toast("불러왔어요"); go("home"); } catch (er) { toast("말문 백업 파일이 아니에요"); } };
  $("#wipe").onclick = e => { const b = e.currentTarget, t = $(".t", b); if (!b.dataset.sure) { b.dataset.sure = 1; t.textContent = "한 번 더 누르면 모두 지워져요"; return; } S = Object.assign({}, DEF, { aiKey: S.aiKey }); save(); idb.all().then(rs => Promise.all(rs.map(r => idb.del(r.id)))).catch(() => {}); toast("진도와 녹음을 모두 지웠어요"); go("home"); };
}

/* ---------- 시작 ---------- */
window.addEventListener("offline", () => toast("오프라인이에요. AI 말고는 그대로 쓸 수 있어요"));
if ("serviceWorker" in navigator && /^https?:/.test(location.protocol)) navigator.serviceWorker.register("sw.js").catch(() => {});
go("home");
