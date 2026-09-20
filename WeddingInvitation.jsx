import { useEffect, useId, useMemo, useRef, useState } from "react";

/* ==================================================================== */
/*  CONTENT — edit everything here                                       */
/* ==================================================================== */
const CONFIG = {
  bride: { name: "Manali", mother: "Smt. Chandrikaben Parsotambhai Dayani", father: "Sh. Parsotambhai Gagadasbhai Dayani", place: "Dhavada Mota" },
  groom: { name: "Harshal", mother: "Smt. Kavitaben Dilipbhai Bhimani", father: "Sh. Dilipbhai Vithalbhai Bhimani", place: "Devpar - Yaksh" },

  weddingDate: "2026-12-03T07:30:00+05:30",
  calendarUrl:
    "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Manali+%26+Harshal+Wedding&details=You+are+cordially+invited+to+celebrate+the+wedding+of+Harshal+%26+Manali.&location=Taj+Lake+Palace%2C+Lake+Pichola%2C+Udaipur%2C+Rajasthan+313001&dates=20261203T073000%2F20261203T235900&ctz=Asia%2FKolkata",

  // Music, video and photos: put your files in /public at these paths.
  // (The flower corners and Ganesha ji are already embedded in this file — see EMBEDDED_IMAGES
  //  at the bottom. To swap them, add e.g.  ganesha: "/images/ganesha.png"  below.)
  assets: {
    introVideo: "/video/intro.mp4",
    portrait: "/img1.png",
  },

  story: {
    intro:
      "Some love stories are written in the stars — ours began with a single glance across a crowded room and has only grown more beautiful with every passing season.",
    chapters: [
      ["Chapter One", "The Meeting", "Two families met — and two hearts quietly recognised each other."],
      ["Chapter Two", "The Knowing", "Slow conversations turned into the certainty of finding the right person."],
      ["Chapter Three", "The Promise", "With blessings all around, a connection became a forever promise."],
      ["Chapter Four", "Forever Begins", "Surrounded by love, the most beautiful chapter of our lives begins."],
    ],
  },

  gallery: [
    { src: "/img2.png", alt: "Bride and groom making memories" },
    { src: "/img3.jpeg", alt: "Bride and groom" },
  ],

  events: [
    {
      name: "Ganesh Sthapana", icon: "🪔", image: "/GaneshSthapana.png",
      day: "Wednesday", date: "December 2, 2026",
      blurb: "Bidding welcome to Lord Ganesha, as the celebrations begin.",
      whenLabel: "As The Blessings Begin", time: "7:30 AM",
      whereLabel: "At The Chosen Venue", place: "Shri Laxmi Narayan Sanatan Samaj, Devpar-Yaksh",
    },
    {
      name: "Mandva Rupan", icon: "🌸", image: "/MandvaRopan.png",
      day: "Wednesday", date: "December 2, 2026",
      blurb: "Adorning the sacred mandap for the ceremonies ahead.",
      whenLabel: "As The Mandap Comes Alive", time: "8:00 AM",
      whereLabel: "At The Chosen Venue", place: "Shri Laxmi Narayan Sanatan Samaj, Devpar-Yaksh",
    },
    {
      name: "Rudu Mameru", icon: "🧡", image: "/RuduMameru.png",
      day: "Wednesday", date: "December 2, 2026",
      blurb: "A cherished tradition of warmth and good wishes from the families.",
      whenLabel: "As Love Pours In", time: "2:30 PM",
      whereLabel: "At The Chosen Venue", place: "Shri Laxmi Narayan Sanatan Samaj, Devpar-Yaksh",
    },
    {
      name: "Bhojan Samarambh", icon: "🍽️", image: "/BhojanSamaram.png",
      day: "Wednesday", date: "December 2, 2026",
      blurb: "A joyous feast to share love, laughter & delicious food.",
      whenLabel: "As Tables Are Set", time: "7:30 PM",
      whereLabel: "At The Chosen Venue", place: "Shri Laxmi Narayan Sanatan Samaj, Devpar-Yaksh",
    },
    {
      name: "Hast Melap", icon: "💍", image: "/HastMelap.png",
      day: "Thursday", date: "December 3, 2026",
      blurb: "The sacred union of two hearts, two souls, two families.",
      whenLabel: "As The Vows Are Sealed", time: "8:30 AM",
      whereLabel: "At The Chosen Venue", place: "Shri Laxmi Narayan Sanatan Samaj, Dhavada Mota",
    },
  ],

  venue: {
    mapEmbed: "https://www.google.com/maps?q=Shri+Laxmi+Narayan+Sanatan+Samaj+Dhavada+Mota&output=embed",
    directions: "https://maps.google.com/?q=Shri+Laxmi+Narayan+Sanatan+Samaj+Dhavada+Mota",
  },

  footer: {
    // Studio credit block — replace with your own details
    MadeBy: "Harsh Patel",
    studioInsta: "harshpatel_htp",
  },
};

/* ==================================================================== */
/*  Helpers                                                              */
/* ==================================================================== */
const pad = (n) => String(n).padStart(2, "0");

function useCountdown(iso) {
  const target = useMemo(() => new Date(iso).getTime(), [iso]);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const d = Math.max(0, target - now);
  return {
    days: Math.floor(d / 86400000),
    hours: Math.floor((d / 3600000) % 24),
    minutes: Math.floor((d / 60000) % 60),
    seconds: Math.floor((d / 1000) % 60),
  };
}

function rng(seed) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") { setShown(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${shown ? "in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function Photo({ src, alt, className = "", children }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`photo ${className}`}>
      {failed ? (
        <div className="photo-fallback" role="img" aria-label={alt}><span>{alt}</span></div>
      ) : (
        <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
      )}
      {children}
    </div>
  );
}

/* ==================================================================== */
/*  Small SVG ornaments                                                  */
/* ==================================================================== */
function Lotus({ size = 16, fill, stroke }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="0.8" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3C8.5 7.5 8.5 14 12 19C15.5 14 15.5 7.5 12 3Z" />
      <path d="M12 19C7.5 18 3.5 14.5 2 9.5C6.5 9.5 10.5 12.5 12 19Z" />
      <path d="M12 19C16.5 18 20.5 14.5 22 9.5C17.5 9.5 13.5 12.5 12 19Z" />
      <path d="M4 20C8 22 16 22 20 20C16 19 8 19 4 20Z" />
    </svg>
  );
}

function LotusDivider() {
  return (
    <div className="lotus" aria-hidden="true">
      <i />
      <Lotus size={17} fill="#6f6152" stroke="#6f6152" />
      <Lotus size={24} fill="#f4b6c6" stroke="#e0708f" />
      <Lotus size={17} fill="#6f6152" stroke="#6f6152" />
      <i />
    </div>
  );
}

function Divider({ mark = "dot" }) {
  return (
    <div className={`div div-${mark}`} aria-hidden="true">
      <i />
      {mark === "star" ? <b>✦</b> : <b />}
      <i />
    </div>
  );
}

function LeafOrnament({ className }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="leafg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e6c26f" />
          <stop offset="1" stopColor="#c9993a" />
        </linearGradient>
      </defs>
      <path d="M4 44C4 24 16 8 40 6C40 26 28 42 4 44Z" fill="url(#leafg)" opacity=".7" />
      <path d="M8 40C16 28 26 18 38 9" stroke="#f6e2a6" strokeWidth=".9" fill="none" />
      <path d="M14 46C18 36 28 30 44 30C40 40 30 46 14 46Z" fill="url(#leafg)" opacity=".55" />
      <path d="M8 6C12 4 16 6 18 10C14 12 9 11 8 6Z" fill="url(#leafg)" opacity=".6" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" />
    </svg>
  );
}

function InstaIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r="1" fill="currentColor" />
    </svg>
  );
}

/* ==================================================================== */
/*  Fixed floral corners (image, with a drawn fallback)                  */
/* ==================================================================== */
const ROSE = ["#fbf1e0", "#f6e3d3", "#f3bcbc", "#f8d3cc", "#fff8ea", "#efa9ad"];
const LEAF = ["#7c9a7a", "#5f8467", "#8fae8a", "#6f8f6b"];

function buildCluster(seed, segments) {
  const r = rng(seed);
  const leaves = [], roses = [], dots = [];
  segments.forEach(({ count, path, rMax, rMin }) => {
    for (let i = 0; i < count; i++) {
      const t = count === 1 ? 0 : i / (count - 1);
      const [x, y] = path(t);
      const rad = rMax - (rMax - rMin) * t * (0.75 + r() * 0.25);
      for (let k = 0; k < 2; k++) {
        leaves.push({
          x: x + (r() - 0.5) * rad * 3, y: y + (r() - 0.5) * rad * 3,
          rx: 14 + r() * 14, ry: 5 + r() * 4, rot: r() * 360, fill: LEAF[Math.floor(r() * LEAF.length)],
        });
      }
      roses.push({
        x: x + (r() - 0.5) * 30, y: y + (r() - 0.5) * 30, r: rad,
        fill: r() < 0.16 ? "#f39a2b" : ROSE[Math.floor(r() * ROSE.length)],
        marigold: false,
      });
      for (let k = 0; k < 4; k++) dots.push({ x: x + (r() - 0.5) * rad * 3.4, y: y + (r() - 0.5) * rad * 3.4, r: 1.6 + r() * 2 });
    }
  });
  roses.forEach((o) => { o.marigold = o.fill === "#f39a2b"; });
  return { leaves, roses, dots };
}

const CLUSTER_TL = buildCluster(7, [
  { count: 9, rMax: 30, rMin: 22, path: (t) => [30 + t * 160, 52 + Math.sin(t * 3.2) * 16] },
  { count: 16, rMax: 30, rMin: 11, path: (t) => [38 + 62 * Math.sin(t * 3) * (1 - t * 0.35), 70 + t * 270] },
]);
const CLUSTER_BR = buildCluster(21, [
  { count: 15, rMax: 14, rMin: 30, path: (t) => [10 + t * 262, 200 - Math.pow(t, 2.4) * 170] },
]);

function FloralSvg({ variant, className }) {
  const tl = variant === "tl";
  const c = tl ? CLUSTER_TL : CLUSTER_BR;
  return (
    <svg className={className} viewBox={tl ? "0 0 340 500" : "0 0 280 212"} aria-hidden="true">
      <defs>
        <linearGradient id={`drape-${variant}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbe4e4" /><stop offset=".6" stopColor="#f4bfc4" /><stop offset="1" stopColor="#fae9e6" />
        </linearGradient>
      </defs>
      {tl ? (
        <>
          <path d="M0 10C60 38 130 76 196 64C250 54 300 20 340 22L340 84C292 98 244 136 172 126C112 118 52 84 0 62Z" fill="url(#drape-tl)" />
          <path d="M20 40C90 74 160 86 250 52" stroke="#fff" strokeOpacity=".55" strokeWidth="3" fill="none" />
          <path d="M30 330C24 390 40 440 46 500M52 330C60 400 56 450 70 500" stroke="#fff" strokeOpacity=".65" strokeWidth="5" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <path d="M0 212C40 170 110 158 190 168C230 100 250 40 262 0L280 0L280 212Z" fill="url(#drape-br)" opacity=".7" />
      )}
      {c.leaves.map((l, i) => (
        <ellipse key={`l${i}`} cx={l.x} cy={l.y} rx={l.rx} ry={l.ry} fill={l.fill} transform={`rotate(${l.rot} ${l.x} ${l.y})`} />
      ))}
      {c.roses.map((o, i) => (
        <g key={`r${i}`}>
          <circle cx={o.x} cy={o.y} r={o.r} fill={o.fill} stroke="rgba(120,60,50,.28)" strokeWidth=".8" />
          {!o.marigold && (
            <>
              <circle cx={o.x} cy={o.y} r={o.r * 0.68} fill="none" stroke="rgba(120,60,50,.3)" strokeWidth=".8" />
              <circle cx={o.x + o.r * 0.06} cy={o.y - o.r * 0.04} r={o.r * 0.38} fill="none" stroke="rgba(120,60,50,.35)" strokeWidth=".8" />
              <path d={`M${o.x - o.r * 0.2} ${o.y} q${o.r * 0.2} ${-o.r * 0.25} ${o.r * 0.4} 0`} stroke="rgba(120,60,50,.4)" strokeWidth=".8" fill="none" />
            </>
          )}
          {o.marigold && <circle cx={o.x} cy={o.y} r={o.r * 0.5} fill="#f8b64a" />}
        </g>
      ))}
      {c.dots.map((d, i) => <circle key={`d${i}`} cx={d.x} cy={d.y} r={d.r} fill="#fffdf4" opacity=".95" />)}
    </svg>
  );
}

function Florals({ src, variant }) {
  const [failed, setFailed] = useState(false);
  const cls = `floral ${variant}`;
  if (failed) return <FloralSvg variant={variant} className={cls} />;
  return <img className={cls} src={src} alt="" draggable={false} onError={() => setFailed(true)} />;
}

/* ==================================================================== */
/*  Butterflies                                                          */
/* ==================================================================== */
const BUTTERFLIES = [
  { x: 74, y: 30, s: 66, v: "gold", p: 1, dur: 38, delay: 0 },
  { x: 52, y: 64, s: 46, v: "gold", p: 2, dur: 46, delay: -10 },
  { x: 82, y: 46, s: 44, v: "pale", p: 3, dur: 52, delay: -20 },
  { x: 88, y: 12, s: 34, v: "pale", p: 2, dur: 40, delay: -5 },
  { x: 66, y: 80, s: 32, v: "gold", p: 1, dur: 44, delay: -15 },
  { x: 32, y: 72, s: 38, v: "gold", p: 3, dur: 50, delay: -25 },
  { x: 90, y: 68, s: 26, v: "gold", p: 2, dur: 36, delay: -8 },
];

function Butterfly({ b }) {
  const id = useId().replace(/:/g, "");
  const gold = b.v === "gold";
  return (
    <div className={`bfly p${b.p}`} style={{ left: `${b.x}vw`, top: `${b.y}vh`, width: b.s, animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s` }}>
      <svg viewBox="0 0 60 50" className={gold ? "bf gold" : "bf pale"}>
        <defs>
          <linearGradient id={`bg${id}`} x1="0" y1="0" x2="1" y2="1">
            {gold ? (
              <><stop offset="0" stopColor="#ecca70" /><stop offset=".55" stopColor="#b98a1f" /><stop offset="1" stopColor="#8a6410" /></>
            ) : (
              <><stop offset="0" stopColor="#f8f8ee" /><stop offset="1" stopColor="#c6d1b5" /></>
            )}
          </linearGradient>
        </defs>
        <g className="flap" fill={`url(#bg${id})`} stroke={gold ? "#7a570e" : "#98a688"} strokeWidth=".6" strokeOpacity=".55">
          <path d="M30 24C22 6 6 2 3 13C1 23 16 30 30 27Z" />
          <path d="M30 28C20 31 8 38 13 46C19 51 28 40 30 31Z" />
          <path d="M30 24C38 6 54 2 57 13C59 23 44 30 30 27Z" />
          <path d="M30 28C40 31 52 38 47 46C41 51 32 40 30 31Z" />
        </g>
        <ellipse cx="30" cy="27" rx="1.7" ry="9" fill={gold ? "#5b3f08" : "#7f8a70"} />
      </svg>
    </div>
  );
}

/* ==================================================================== */
/*  Ganesha (image, with a golden Om fallback)                           */
/* ==================================================================== */
function Ganesha({ src }) {
  const [failed, setFailed] = useState(false);
  if (!failed) return <img className="ganesha" src={src} alt="श्री गणेशाय नमः" onError={() => setFailed(true)} />;
  return (
    <svg className="ganesha" viewBox="0 0 120 120" role="img" aria-label="श्री गणेशाय नमः">
      <defs>
        <radialGradient id="omhalo"><stop offset="0" stopColor="#f4d27a" stopOpacity=".9" /><stop offset="1" stopColor="#f4d27a" stopOpacity="0" /></radialGradient>
        <linearGradient id="omgold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f2cf6b" /><stop offset="1" stopColor="#a8741a" /></linearGradient>
      </defs>
      <circle cx="60" cy="60" r="58" fill="url(#omhalo)" />
      <circle cx="60" cy="60" r="44" fill="none" stroke="url(#omgold)" strokeWidth="1.4" />
      <text x="60" y="80" textAnchor="middle" fontSize="60" fill="url(#omgold)" fontFamily="'Tiro Devanagari Hindi', serif">ॐ</text>
    </svg>
  );
}

/* ==================================================================== */
/*  Scratch-to-reveal heart                                              */
/* ==================================================================== */
const HEART =
  "M50 92C12 62 2 42 2 28C2 12 14 4 27 4C38 4 46 10 50 20C54 10 62 4 73 4C86 4 98 12 98 28C98 42 88 62 50 92Z";
const CW = 760, CH = 730;

function ScratchHeart({ reveal, onDone }) {
  const canvasRef = useRef(null);
  const state = useRef({ drawing: false, last: null, base: 1, moves: 0 });
  const [touched, setTouched] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const cv = canvasRef.current;
    const ctx = cv.getContext("2d", { willReadFrequently: true });
    const path = new Path2D(HEART);
    ctx.save();
    ctx.scale(CW / 100, CH / 96);
    const g = ctx.createLinearGradient(0, 0, 100, 96);
    g.addColorStop(0, "#6f001d"); g.addColorStop(0.5, "#98002a"); g.addColorStop(1, "#7a001c");
    ctx.fillStyle = g;
    ctx.fill(path);
    ctx.clip(path);
    const r = rng(11);
    for (let i = 0; i < 70; i++) {
      ctx.fillStyle = `rgba(232,160,90,${0.25 + r() * 0.35})`;
      ctx.beginPath(); ctx.arc(6 + r() * 88, 8 + r() * 76, 0.25 + r() * 0.5, 0, 7); ctx.fill();
    }
    for (let i = 0; i < 6; i++) {
      const x = 22 + r() * 56, y = 14 + r() * 50, s = 1.6 + r() * 1.8;
      ctx.fillStyle = "rgba(226,160,90,.85)";
      ctx.beginPath();
      ctx.moveTo(x, y - s); ctx.quadraticCurveTo(x, y, x + s, y); ctx.quadraticCurveTo(x, y, x, y + s);
      ctx.quadraticCurveTo(x, y, x - s, y); ctx.quadraticCurveTo(x, y, x, y - s); ctx.fill();
    }
    ctx.restore();
    state.current.base = opaque(ctx) || 1;
  }, []);

  function opaque(ctx) {
    const { data } = ctx.getImageData(0, 0, CW, CH);
    let n = 0;
    for (let y = 0; y < CH; y += 12) for (let x = 0; x < CW; x += 12) if (data[(y * CW + x) * 4 + 3] > 128) n++;
    return n;
  }

  const pos = (e) => {
    const b = canvasRef.current.getBoundingClientRect();
    return [((e.clientX - b.left) / b.width) * CW, ((e.clientY - b.top) / b.height) * CH];
  };

  const scratch = (e) => {
    const s = state.current;
    if (!s.drawing || done) return;
    const ctx = canvasRef.current.getContext("2d", { willReadFrequently: true });
    const [x, y] = pos(e);
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 60; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(...(s.last || [x, y])); ctx.lineTo(x, y); ctx.stroke();
    s.last = [x, y];
    if (++s.moves % 14 === 0 && opaque(ctx) / s.base < 0.5) finish();
  };

  const finish = () => {
    if (done) return;
    setDone(true);
    onDone?.();
  };

  const down = (e) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    state.current.drawing = true; state.current.last = null;
    setTouched(true);
    scratch(e);
  };
  const up = () => { state.current.drawing = false; state.current.last = null; };

  return (
    <div className="heart">
      <svg className="heart-under" viewBox="0 0 100 96" aria-hidden="true">
        <defs>
          <linearGradient id="hu" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fbf0d4" /><stop offset="1" stopColor="#f0d99b" /></linearGradient>
        </defs>
        <path d={HEART} fill="url(#hu)" stroke="#d3a444" strokeWidth=".6" />
      </svg>
      <div className="heart-reveal">
        <p className="hr-kicker">Save the date</p>
        <p className="hr-day">{reveal.day}</p>
        <p className="hr-month">{reveal.month}</p>
        <p className="hr-note">{reveal.note}</p>
      </div>
      <canvas
        ref={canvasRef} width={CW} height={CH}
        className={`heart-cv ${done ? "gone" : ""}`}
        onPointerDown={down} onPointerMove={scratch} onPointerUp={up} onPointerCancel={up}
      />
      <div className={`heart-hint ${touched ? "hide" : ""}`} aria-hidden="true">
        <span>✧</span><p>Scratch to reveal</p><span>✧</span>
      </div>
      {!done && <button className="sr-only" onClick={finish}>Reveal the wedding date</button>}
    </div>
  );
}

/* ==================================================================== */
/*  Main component                                                       */
/* ==================================================================== */
export default function WeddingInvitation() {
  const { bride, groom, story, gallery, events, venue, footer } = CONFIG;
  const assets = { ...EMBEDDED_IMAGES, ...CONFIG.assets };
  const [phase, setPhase] = useState("closed");
  const [videoOk, setVideoOk] = useState(true);
  const [lightbox, setLightbox] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [fine, setFine] = useState(false);
  const barRef = useRef(null);
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const time = useCountdown(CONFIG.weddingDate);

  const revealText = useMemo(() => {
    const d = new Date(CONFIG.weddingDate);
    const f = (o) => new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", ...o }).format(d);
    return {
      day: f({ day: "numeric" }),
      month: `${f({ month: "long" })} ${f({ year: "numeric" })}`,
      note: `${f({ weekday: "long" })} · ${f({ hour: "numeric", minute: "2-digit", hour12: true })}`,
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = phase === "open" ? "" : "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [phase]);

  useEffect(() => {
    if (!lightbox) return;
    const k = (e) => e.key === "Escape" && setLightbox(null);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [lightbox]);

  // scroll progress bar (right edge)
  useEffect(() => {
    const on = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      if (barRef.current) barRef.current.style.height = `${max > 0 ? (h.scrollTop / max) * 100 : 0}%`;
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); };
  }, []);

  // gold ring + dot cursor (mouse only)
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia("(pointer: fine)").matches) return;
    setFine(true);
    let tx = -100, ty = -100, rx = -100, ry = -100, raf;
    const move = (e) => {
      tx = e.clientX; ty = e.clientY;
      if (dotRef.current) dotRef.current.style.transform = `translate(${tx}px,${ty}px)`;
      const hot = !!(e.target.closest && e.target.closest("a,button,canvas"));
      ringRef.current?.classList.toggle("big", hot);
    };
    const loop = () => {
      rx += (tx - rx) * 0.2; ry += (ty - ry) * 0.2;
      if (ringRef.current) ringRef.current.style.transform = `translate(${rx}px,${ry}px)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move);
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);

  const openInvitation = () => {
    if (phase !== "closed") return;
    setPhase("opening");
    setTimeout(() => setPhase("open"), 1100);
  };

  return (
    <div className={`inv ${fine ? "fine" : ""}`}>
      <style>{CSS}</style>

      {/* fixed decoration */}
      <div className="progress" aria-hidden="true"><i ref={barRef} /></div>
      <Florals src={assets.cornerTopLeft} variant="tl" />
      <Florals src={assets.cornerBottomRight} variant="br" />
      <div className="bflies" aria-hidden="true">{BUTTERFLIES.map((b, i) => <Butterfly key={i} b={b} />)}</div>

      {/* cover */}
      {phase !== "open" && (
        <div className={`cover ${phase === "opening" ? "going" : ""}`}>
          {videoOk && <video className="cover-video" src={assets.introVideo} autoPlay muted loop playsInline onError={() => setVideoOk(false)} />}
          <div className="cover-body">
            <p className="deva cover-deva">श्री गणेशाय नमः</p>
            <h1 className="cover-names">{groom.name} <em>&</em> {bride.name}</h1>
            <Divider mark="bar" />
            <button className="cover-btn" onClick={openInvitation}>Tap to open</button>
          </div>
        </div>
      )}

      <main>
        {/* ---------- Blessing ---------- */}
        <section className="hero">
          <Reveal>
            <Ganesha src={assets.ganesha} />
            <Divider mark="dot" />
            <p className="shloka">वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।</p>
            <p className="shloka">निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥</p>
            <p className="shloka-sign">— श्री गणेशाय नमः</p>
          </Reveal>
        </section>

        {/* ---------- Bride & Groom card ---------- */}
        <section className="couple">
          <Reveal className="card">
            <LeafOrnament className="leaf tl" /><LeafOrnament className="leaf tr" />
            <LeafOrnament className="leaf bl" /><LeafOrnament className="leaf br" />

            <div className="person">
              <p className="lbl-deva">वधू परिचय</p>
              <h2 className="name">{bride.name}</h2>
              <p className="role">The Bride</p>
              <p className="par">D/o. {bride.mother}</p>
              <p className="par-amp">&</p>
              <p className="par">{bride.father}</p>
              <p className="city">[{bride.place.replace(/[[\]]/g, "")}]</p>
            </div>

            <div className="card-amp" aria-hidden="true"><i /><span>&</span><i /></div>

            <div className="person">
              <p className="lbl-deva">वर परिचय</p>
              <h2 className="name">{groom.name}</h2>
              <p className="role">The Groom</p>
              <p className="par">S/o. {groom.mother}</p>
              <p className="par-amp">&</p>
              <p className="par">{groom.father}</p>
              <p className="city">[{groom.place.replace(/[[\]]/g, "")}]</p>
            </div>

            <Divider mark="star" />
            <p className="wish"><span className="deva">सर्वे भवन्तु सुखिनः</span> — May all be happy.</p>
          </Reveal>
        </section>

        <LotusDivider />

        {/* ---------- Countdown + scratch heart ---------- */}
        <section className="countdown">
          <h2 className="cd-title">Until Two Souls Become One</h2>
          <div className="cd-row" role="timer" aria-live="off">
            {[["Days", time.days], ["Hours", time.hours], ["Minutes", time.minutes], ["Seconds", time.seconds]].map(([label, value], i) => (
              <div className="cd-wrap" key={label}>
                {i > 0 && <span className="cd-sep" aria-hidden="true"><b /><b /></span>}
                <div className="cd">
                  <div className="cd-box"><i /><i /><i /><i /><span>{pad(value)}</span></div>
                  <span className="cd-label">{label}</span>
                </div>
              </div>
            ))}
          </div>

          <ScratchHeart reveal={revealText} onDone={() => setRevealed(true)} />
          <p className="cd-note">{revealed ? "We can't wait to celebrate with you ✨" : "Go on... reveal the date of our special day ✨"}</p>

          <a className="btn" href={CONFIG.calendarUrl} target="_blank" rel="noreferrer">
            <CalendarIcon /> Add to Calendar
          </a>
        </section>

        <LotusDivider />

        {/* ---------- Our Story ---------- */}
        <section className="band story">
          <div className="sec-title">
            <p className="kicker">How It All Began</p>
            <h2>Our Story</h2>
            <Divider mark="star" />
          </div>
          <Reveal><p className="story-intro">{story.intro}</p></Reveal>

          <Reveal>
            <Photo src={assets.portrait} alt={`${groom.name} & ${bride.name}`} className="portrait">
              <div className="portrait-caption">{groom.name}<em>&</em>{bride.name}</div>
            </Photo>
          </Reveal>

          <ol className="chapters">
            {story.chapters.map(([label, title, text], i) => (
              <Reveal key={title} delay={i * 80}>
                <li className="chapter">
                  <span className="chapter-label">{label}</span>
                  <h4>{title}</h4>
                  <p>{text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* ---------- Gallery ---------- */}
        <section className="gallery">
          <div className="sec-title">
            <p className="kicker">Moments Together</p>
            <h2>The Gallery</h2>
            <Divider mark="bar" />
          </div>
          <div className="gallery-grid">
            {gallery.map((g, i) => (
              <Reveal key={g.src} delay={i * 120}>
                <button className="tile" onClick={() => setLightbox(g)} aria-label={`View: ${g.alt}`}>
                  <Photo src={g.src} alt={g.alt} />
                  <span className="tile-view">View</span>
                </button>
              </Reveal>
            ))}
          </div>
        </section>

        <LotusDivider />

        {/* ---------- Celebrations ---------- */}
        <section className="band events">
          <div className="sec-title">
            <p className="kicker">Join Us In Celebration</p>
            <h2>The Celebrations</h2>
            <Divider mark="bar" />
          </div>
          <div className="timeline">
            {events.map((ev, i) => (
              <Reveal key={ev.name} className={`ev ${i % 2 ? "flip" : ""}`}>
                <Photo src={ev.image} alt={ev.name} className="ev-photo" />
                <div className="ev-body">
                  <span className="ev-icon" aria-hidden="true">{ev.icon}</span>
                  <p className="ev-date"><b />{ev.day}<em>·</em>{ev.date}</p>
                  <h3>{ev.name}</h3>
                  <p className="ev-blurb">{ev.blurb}</p>
                  <p className="ev-lbl">{ev.whenLabel}</p>
                  <p className="ev-val">{ev.time}</p>
                  <hr />
                  <p className="ev-lbl">{ev.whereLabel}</p>
                  <p className="ev-place">{ev.place}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------- Venue ---------- */}
        <section className="venue">
  <div className="sec-title">
    <p className="kicker">Find Your Way To Us</p>
    <h2>The Venue</h2>
    <Divider mark="bar" />
  </div>

  <Reveal>
    <div className="map">
      <iframe
        title="Wedding venue map"
        src={venue.mapEmbed}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>

    <a
  className="btn"
  href="https://www.google.com/maps/search/?api=1&query=23.3178125,69.3206094"
  target="_blank"
  rel="noreferrer"
>
  Get Directions
</a>
  </Reveal>
</section>
      </main>

      {/* ---------- Footer ---------- */}
      <footer className="foot">
        <h2 className="foot-names">{groom.name} <em>&</em> {bride.name}</h2>
        <Divider mark="bar" />
        <p className="foot-deva">शुभं भवतु</p>
        
        <hr className="foot-rule" />
        <p className="foot-credit">
          Crafted with love by<br />
          <a href={footer.studioUrl} target="_blank" rel="noreferrer">{footer.studioName}</a>
        </p>
        <p className="foot-contact">
          <a href={`https://instagram.com/${footer.studioInsta}`} target="_blank" rel="noreferrer"><InstaIcon /> @{footer.studioInsta}</a>
        </p>
      </footer>

      {lightbox && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setLightbox(null)}>
          <button className="lightbox-x" aria-label="Close" onClick={() => setLightbox(null)}>×</button>
          <Photo src={lightbox.src} alt={lightbox.alt} className="lightbox-photo" />
        </div>
      )}

      <div className="cur-ring" ref={ringRef}><i /></div>
      <div className="cur-dot" ref={dotRef} />
    </div>
  );
}

/* ==================================================================== */
/*  Styles                                                               */
/* ==================================================================== */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&family=Raleway:wght@300;400;500&family=Tiro+Devanagari+Hindi:ital@0;1&family=Libre+Baskerville&display=swap');

.inv {
  --cream: #fdf5e3;
  --parch: #f2e1b3;
  --gold: #c8922e;
  --gold-soft: #e3bd66;
  --gold-text: #9a7424;
  --ink: #2a1114;
  --rose: #d24a6e;
  --glow: 0 0 16px rgba(222, 100, 125, .32);
  position: relative; min-height: 100vh; overflow-x: clip;
  background: var(--cream); color: var(--ink);
  font-family: 'Raleway', system-ui, sans-serif; font-weight: 300; font-size: 16px; line-height: 1.6;
}
.inv *, .inv *::before, .inv *::after { box-sizing: border-box; }
.inv h1, .inv h2, .inv h3, .inv h4, .inv p, .inv ol, .inv hr { margin: 0; padding: 0; }
.inv img { max-width: 100%; display: block; }
.inv a { color: inherit; }
.inv button { font: inherit; cursor: pointer; }
.inv :focus-visible { outline: 2px solid var(--gold); outline-offset: 3px; }
.inv .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.inv.fine, .inv.fine * { cursor: none; }

.inv .deva { font-family: 'Tiro Devanagari Hindi', serif; }
.inv .reveal { opacity: 0; transform: translateY(14px); transition: opacity .9s ease, transform .9s ease; }
.inv .reveal.in { opacity: 1; transform: none; }

/* ---- fixed decoration ---- */
.inv .progress { position: fixed; top: 0; right: 0; bottom: 0; width: 4px; background: rgba(200, 146, 46, .16); z-index: 90; }
.inv .progress i { display: block; width: 100%; height: 0; background: linear-gradient(#b8801a, #8f5e0f); }
.inv .floral { position: fixed; pointer-events: none; z-index: 30; user-select: none; }
.inv .floral.tl { top: 0; left: 0; width: min(340px, 46vw); height: auto; }
.inv .floral.br { bottom: 0; right: 0; width: min(285px, 42vw); height: auto; }

.inv .bflies { position: fixed; inset: 0; pointer-events: none; z-index: 40; overflow: hidden; }
.inv .bfly { position: absolute; animation: wander1 40s ease-in-out infinite; filter: drop-shadow(0 4px 6px rgba(120, 80, 10, .35)); }
.inv .bfly.p2 { animation-name: wander2; }
.inv .bfly.p3 { animation-name: wander3; }
.inv .bf { width: 100%; height: auto; overflow: visible; }
.inv .bf.pale { opacity: .72; }
.inv .flap { transform-origin: 30px 27px; animation: flap .38s ease-in-out infinite alternate; }
@keyframes flap { from { transform: scaleX(1); } to { transform: scaleX(.34); } }
@keyframes wander1 { 0%,100% { transform: translate(0,0) rotate(14deg); } 25% { transform: translate(-24vw,-10vh) rotate(-14deg); } 50% { transform: translate(-8vw,-26vh) rotate(22deg); } 75% { transform: translate(-30vw,8vh) rotate(-6deg); } }
@keyframes wander2 { 0%,100% { transform: translate(0,0) rotate(-10deg); } 30% { transform: translate(-16vw,14vh) rotate(18deg); } 60% { transform: translate(-36vw,-8vh) rotate(-20deg); } 80% { transform: translate(-12vw,-18vh) rotate(10deg); } }
@keyframes wander3 { 0%,100% { transform: translate(0,0) rotate(8deg); } 20% { transform: translate(-10vw,18vh) rotate(-16deg); } 55% { transform: translate(-30vw,10vh) rotate(20deg); } 80% { transform: translate(-18vw,-14vh) rotate(-8deg); } }

.inv .cur-ring, .inv .cur-dot { display: none; position: fixed; top: 0; left: 0; pointer-events: none; z-index: 9999; }
.inv.fine .cur-ring, .inv.fine .cur-dot { display: block; }
.inv .cur-ring { width: 32px; height: 32px; margin: -16px 0 0 -16px; }
.inv .cur-ring i { display: block; width: 100%; height: 100%; border: 1px solid var(--gold); border-radius: 50%; transition: transform .25s ease, background .25s; }
.inv .cur-ring.big i { transform: scale(1.7); background: rgba(200, 146, 46, .12); }
.inv .cur-dot { width: 8px; height: 8px; margin: -4px 0 0 -4px; border-radius: 50%; background: #b9801a; }

/* ---- ornaments ---- */
.inv .lotus { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 28px 0; }
.inv .lotus i { width: 78px; height: 1px; background: linear-gradient(90deg, transparent, #6f6152); }
.inv .lotus i:last-child { transform: scaleX(-1); }

.inv .div { display: flex; align-items: center; justify-content: center; gap: 14px; color: var(--gold); }
.inv .div i { width: 82px; height: 1px; background: linear-gradient(90deg, transparent, var(--gold)); }
.inv .div i:last-child { transform: scaleX(-1); }
.inv .div b { font-weight: 400; font-size: .8rem; line-height: 1; }
.inv .div-dot b { width: 6px; height: 6px; border-radius: 50%; background: var(--gold); }
.inv .div-bar b { width: 16px; height: 3px; background: var(--gold); }

/* ---- buttons ---- */
.inv .btn {
  display: inline-flex; align-items: center; gap: 12px; margin-top: 28px; padding: 14px 40px;
  border: 1px solid var(--gold-soft); background: rgba(255, 255, 255, .28); color: var(--ink); text-decoration: none;
  font-family: 'Cormorant Garamond', serif; font-weight: 500; font-size: .92rem; text-transform: uppercase; letter-spacing: .38em;
  text-shadow: var(--glow); transition: background .3s, border-color .3s;
}
.inv .btn:hover { background: rgba(227, 189, 102, .3); border-color: var(--gold); }

/* ---- generic ---- */
.inv .photo { position: relative; overflow: hidden; background: #efe2c8; }
.inv .photo img { width: 100%; height: 100%; object-fit: cover; }
.inv .photo-fallback {
  width: 100%; height: 100%; min-height: 220px; display: grid; place-items: center; padding: 1rem; text-align: center;
  color: var(--gold-text); font-family: 'Cormorant Garamond', serif; font-style: italic;
  background: repeating-linear-gradient(135deg, #f3e7cc 0 14px, #ecdcb8 14px 28px);
}
.inv .sec-title { text-align: center; padding: 0 1.5rem; margin-bottom: 42px; }
.inv .kicker { font-family: 'Cormorant Garamond', serif; font-weight: 500; text-transform: uppercase; letter-spacing: .5em; font-size: .95rem; text-shadow: var(--glow); margin-right: -.5em; }
.inv .sec-title h2 {
  font-family: 'Cormorant Garamond', serif; font-weight: 500; font-size: clamp(3.2rem, 9vw, 5.2rem); line-height: 1.1;
  color: var(--ink); text-shadow: var(--glow); margin: 10px 0 20px;
}

/* ---- cover ---- */
.inv .cover {
  position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; text-align: center;
  background: radial-gradient(ellipse at 50% 42%, #f4e2b0, var(--cream) 70%);
  transition: opacity 1s ease, transform 1.1s ease;
}
.inv .cover.going { opacity: 0; transform: scale(1.05); pointer-events: none; }
.inv .cover-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: .55; }
.inv .cover-body { position: relative; padding: 2rem; }
.inv .cover-deva { color: var(--gold-text); font-style: italic; letter-spacing: .2em; }
.inv .cover-names { font-family: 'Cormorant Garamond', serif; font-weight: 500; font-size: clamp(2.6rem, 9vw, 5rem); line-height: 1.1; margin: 14px 0 18px; text-shadow: var(--glow); }
.inv .cover-names em { color: var(--rose); font-size: .6em; padding: 0 .1em; }
.inv .cover-btn {
  margin-top: 34px; padding: 14px 44px; background: rgba(255, 255, 255, .35); border: 1px solid var(--gold-soft); color: var(--ink);
  font-family: 'Cormorant Garamond', serif; font-weight: 500; text-transform: uppercase; letter-spacing: .38em; font-size: .95rem;
  animation: pulse 2.6s ease-in-out infinite;
}
@keyframes pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(200,146,46,.35); } 50% { box-shadow: 0 0 0 14px rgba(200,146,46,0); } }

/* ---- blessing ---- */
.inv .hero {
  position: relative; text-align: center; padding: 216px 1.5rem 150px; min-height: 100vh;
  background: radial-gradient(ellipse 58% 46% at 50% 44%, rgba(236, 210, 140, .6), rgba(246, 225, 215, .35) 48%, transparent 78%);
}
.inv .hero::before { content: ""; position: absolute; top: 128px; left: 50%; width: 120px; height: 1px; margin-left: -60px; background: linear-gradient(90deg, transparent, #b98c3e, transparent); }
.inv .ganesha { width: 123px; height: auto; margin: 0 auto 46px; filter: drop-shadow(0 8px 18px rgba(200, 146, 46, .35)); }
.inv .hero .div { margin-bottom: 26px; }
.inv .hero .div i { width: 84px; }
.inv .shloka { font-family: 'Tiro Devanagari Hindi', serif; font-style: italic; font-size: clamp(1.1rem, 3.6vw, 1.4rem); line-height: 1.5; color: #3a1f1a; margin-bottom: 24px; }
.inv .shloka-sign { font-family: 'Tiro Devanagari Hindi', serif; font-size: .82rem; letter-spacing: .32em; color: var(--gold-text); }

/* ---- couple card ---- */
.inv .couple { display: flex; justify-content: center; padding: 20px 1.5rem 40px; }
.inv .card {
  position: relative; width: min(448px, 100%); padding: 58px 28px 62px; text-align: center;
  background: linear-gradient(180deg, #f3e3b6, #f0dfae 50%, #f3e4b8); border: 1px solid #d9b45a;
  box-shadow: 0 0 60px rgba(214, 170, 70, .3), inset 0 0 44px rgba(226, 190, 100, .45);
}
.inv .leaf { position: absolute; width: 48px; height: 48px; }
.inv .leaf.tl { top: 12px; left: 12px; }
.inv .leaf.tr { top: 12px; right: 12px; transform: scaleX(-1); }
.inv .leaf.bl { bottom: 12px; left: 12px; transform: scaleY(-1); }
.inv .leaf.br { bottom: 12px; right: 12px; transform: scale(-1, -1); }
.inv .lbl-deva { font-family: 'Tiro Devanagari Hindi', serif; font-size: .85rem; letter-spacing: .32em; color: #c58225; text-shadow: 0 0 10px rgba(226, 150, 60, .4); }
.inv .name { font-family: 'Cormorant Garamond', serif; font-weight: 500; font-size: 3.1rem; line-height: 1.15; margin: 6px 0 2px; text-shadow: var(--glow); }
.inv .role { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: .95rem; color: #5a2a2f; margin-bottom: 26px; }
.inv .par { font-size: 1rem; color: #3a2a1a; }
.inv .par-amp { color: var(--gold); margin: 8px 0; }
.inv .city { margin-top: 12px; font-family: 'Cormorant Garamond', serif; font-weight: 500; font-size: .74rem; letter-spacing: .3em; text-transform: uppercase; color: #c9822a; text-shadow: 0 0 10px rgba(226, 150, 60, .5); }
.inv .card-amp { display: flex; align-items: center; justify-content: center; gap: 16px; margin: 30px -10px 34px; }
.inv .card-amp i { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, rgba(200, 146, 46, .6)); }
.inv .card-amp i:last-child { transform: scaleX(-1); }
.inv .card-amp span { font-family: 'Cormorant Garamond', serif; font-size: 3rem; line-height: 1; color: #c0761a; text-shadow: 0 0 14px rgba(226, 130, 60, .55); }
.inv .card .div { margin: 34px 0 20px; }
.inv .card .div i { width: 42px; }
.inv .wish { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 1.05rem; color: #5a2a2f; text-shadow: var(--glow); }
.inv .wish .deva { font-weight: 400; }

/* ---- countdown ---- */
.inv .countdown {
  position: relative; text-align: center; padding: 110px 1.5rem 120px;
  background: radial-gradient(ellipse 55% 38% at 50% 62%, rgba(232, 204, 130, .55), transparent 72%);
}
.inv .cd-title { font-family: 'Cormorant Garamond', serif; font-weight: 500; text-transform: uppercase; letter-spacing: .5em; font-size: clamp(.85rem, 2.6vw, 1.15rem); margin-right: -.5em; text-shadow: var(--glow); color: var(--ink); }
.inv .cd-row { display: flex; justify-content: center; align-items: flex-start; margin-top: 34px; }
.inv .cd-wrap { display: flex; align-items: flex-start; }
.inv .cd-sep { display: flex; flex-direction: column; gap: 8px; align-items: center; margin: 44px clamp(10px, 3vw, 22px) 0; }
.inv .cd-sep b { display: block; width: 5px; height: 5px; border-radius: 50%; background: var(--gold); }
.inv .cd-sep b + b { opacity: .5; }
.inv .cd { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.inv .cd-box {
  position: relative; width: 108px; height: 120px; display: grid; place-items: center; border: 1px solid var(--gold-soft);
  background: radial-gradient(circle at 50% 55%, rgba(232, 200, 120, .5), rgba(232, 200, 120, .12) 60%, transparent 80%);
}
.inv .cd-box i { position: absolute; width: 12px; height: 12px; border: 0 solid rgba(200, 146, 46, .65); }
.inv .cd-box i:nth-child(1) { top: 8px; left: 8px; border-top-width: 1px; border-left-width: 1px; }
.inv .cd-box i:nth-child(2) { top: 8px; right: 8px; border-top-width: 1px; border-right-width: 1px; }
.inv .cd-box i:nth-child(3) { bottom: 8px; left: 8px; border-bottom-width: 1px; border-left-width: 1px; }
.inv .cd-box i:nth-child(4) { bottom: 8px; right: 8px; border-bottom-width: 1px; border-right-width: 1px; }
.inv .cd-box span { font-family: 'Cormorant Garamond', serif; font-weight: 400; font-size: 3.7rem; line-height: 1; color: #24100f; }
.inv .cd-label { font-family: 'Cormorant Garamond', serif; text-transform: uppercase; letter-spacing: .3em; font-size: .72rem; color: #7a4a4a; margin-right: -.3em; }

.inv .heart { position: relative; width: min(380px, 88vw); aspect-ratio: 380 / 365; margin: 44px auto 22px; }
.inv .heart-under, .inv .heart-cv { position: absolute; inset: 0; width: 100%; height: 100%; }
.inv .heart-cv { touch-action: none; user-select: none; filter: drop-shadow(0 10px 22px rgba(120, 0, 30, .35)); transition: opacity .9s ease; }
.inv .heart-cv.gone { opacity: 0; pointer-events: none; }
.inv .heart-reveal { position: absolute; inset: 12% 14% 24%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
.inv .hr-kicker { font-family: 'Cormorant Garamond', serif; font-style: italic; color: #8a3a44; font-size: 1.1rem; }
.inv .hr-day { font-family: 'Cormorant Garamond', serif; font-weight: 500; font-size: 5.4rem; line-height: 1; color: var(--ink); text-shadow: var(--glow); }
.inv .hr-month { font-family: 'Cormorant Garamond', serif; font-weight: 500; text-transform: uppercase; letter-spacing: .3em; font-size: .95rem; margin-right: -.3em; }
.inv .hr-note { font-family: 'Cormorant Garamond', serif; font-style: italic; color: #7a4a3a; margin-top: 6px; }
.inv .heart-hint { position: absolute; left: 0; right: 0; top: 50%; transform: translateY(-50%); pointer-events: none; text-align: center; color: rgba(255, 216, 224, .72); transition: opacity .4s; }
.inv .heart-hint.hide { opacity: 0; }
.inv .heart-hint p { font-family: 'Inter', system-ui, sans-serif; font-weight: 300; font-size: .98rem; letter-spacing: .24em; text-transform: uppercase; margin: 6px 0; }
.inv .heart-hint span { color: #fff; font-size: .9rem; opacity: .9; }
.inv .cd-note { font-family: 'Libre Baskerville', Georgia, serif; font-size: .92rem; color: var(--gold-text); letter-spacing: .02em; }

/* ---- story ---- */
.inv .band { background: linear-gradient(180deg, #f9e7e0 0, #fbeed9 30%, var(--cream) 100%); padding: 120px 0 30px; position: relative; isolation: isolate; }
.inv .band .sec-title { position: relative; }
.inv .band .sec-title::before { content: ""; position: absolute; left: 50%; top: 40%; width: min(760px, 100%); height: 300px; transform: translate(-50%, -50%); background: radial-gradient(ellipse, rgba(232, 204, 130, .5), transparent 70%); z-index: -1; }
.inv .story-intro { max-width: 580px; margin: -6px auto 56px; padding: 0 1.5rem; text-align: center; font-size: 1.15rem; line-height: 1.75; color: var(--gold-text); }
.inv .portrait { width: min(520px, calc(100% - 3rem)); aspect-ratio: 4 / 5; margin: 0 auto; padding: 10px; background: #f6e9c8; border: 1px solid var(--gold-soft); }
.inv .portrait > img, .inv .portrait > .photo-fallback { height: 100%; }
.inv .portrait-caption { position: absolute; left: 10px; right: 10px; bottom: 10px; padding: 3rem 1rem 1.2rem; text-align: center; color: #fff8ea; font-family: 'Cormorant Garamond', serif; font-weight: 500; font-size: 2.1rem; background: linear-gradient(transparent, rgba(50, 12, 18, .72)); }
.inv .portrait-caption em { padding: 0 .35em; color: #f4b6c6; }
.inv .chapters { list-style: none; width: min(560px, calc(100% - 3rem)); margin: 56px auto 0; padding-left: 28px; border-left: 1px solid var(--gold-soft); }
.inv .chapter { position: relative; padding-bottom: 34px; }
.inv .chapter::before { content: "✦"; position: absolute; left: -35px; top: 2px; font-size: .8rem; color: var(--gold); background: #fbeed9; }
.inv .chapter-label { font-family: 'Cormorant Garamond', serif; font-style: italic; color: var(--gold); }
.inv .chapter h4 { font-family: 'Cormorant Garamond', serif; font-weight: 500; font-size: 1.9rem; line-height: 1.2; text-shadow: var(--glow); }
.inv .chapter p { color: var(--gold-text); }

/* ---- gallery ---- */
.inv .gallery { max-width: 980px; margin: 0 auto; padding: 100px 1.5rem 20px; }
.inv .gallery-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.inv .tile { position: relative; display: block; width: 100%; padding: 0; border: 1px solid var(--gold-soft); background: none; aspect-ratio: 3 / 4; overflow: hidden; }
.inv .tile .photo { height: 100%; }
.inv .tile img { transition: transform .9s ease; }
.inv .tile:hover img { transform: scale(1.05); }
.inv .tile-view { position: absolute; right: 12px; bottom: 12px; padding: 5px 18px; background: rgba(253, 245, 227, .92); font-family: 'Cormorant Garamond', serif; font-style: italic; }
.inv .lightbox { position: fixed; inset: 0; z-index: 200; background: rgba(38, 10, 14, .92); display: grid; place-items: center; padding: 1.5rem; }
.inv .lightbox-photo { max-width: min(92vw, 900px); max-height: 86vh; background: transparent; }
.inv .lightbox-photo img { object-fit: contain; max-height: 86vh; }
.inv .lightbox-x { position: absolute; top: 14px; right: 20px; background: none; border: 0; color: #fff8ea; font-size: 2.6rem; line-height: 1; }

/* ---- celebrations ---- */
.inv .events { padding-top: 130px; }
.inv .timeline { position: relative; width: min(1024px, calc(100% - 3rem)); margin: 0 auto; display: grid; gap: 20px; }
.inv .timeline::before { content: ""; position: absolute; left: 50%; top: -30px; bottom: -30px; width: 1px; background: var(--gold-soft); }
.inv .ev { position: relative; display: grid; grid-template-columns: 42% 1fr; min-height: 398px; border: 1px solid var(--gold-soft); background: linear-gradient(120deg, #f8e8c8, #fbf1dc); }
.inv .ev.flip { grid-template-columns: 1fr 42%; }
.inv .ev.flip .ev-photo { order: 2; }
.inv .ev-photo { height: 100%; min-height: 260px; }
.inv .ev-body { position: relative; display: flex; flex-direction: column; justify-content: center; padding: 38px 40px; }
.inv .ev-icon { position: absolute; top: 38px; right: 40px; font-size: 1.4rem; filter: grayscale(.45) sepia(.3); opacity: .85; }
.inv .ev-date { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; font-family: 'Cormorant Garamond', serif; font-weight: 500; text-transform: uppercase; letter-spacing: .36em; font-size: .9rem; text-shadow: var(--glow); }
.inv .ev-date b { width: 18px; height: 1px; background: var(--gold); }
.inv .ev-date em { font-style: normal; color: var(--gold); }
.inv .ev h3 { font-family: 'Cormorant Garamond', serif; font-weight: 500; font-size: 2.9rem; line-height: 1.15; margin: 8px 0 8px; text-shadow: var(--glow); }
.inv .ev-blurb { max-width: 360px; color: var(--gold-text); margin-bottom: 22px; }
.inv .ev-lbl { font-family: 'Cormorant Garamond', serif; font-weight: 500; text-transform: uppercase; letter-spacing: .3em; font-size: .78rem; color: #5a3238; }
.inv .ev-val { font-family: 'Cormorant Garamond', serif; font-weight: 500; font-size: 1.6rem; line-height: 1.3; text-shadow: var(--glow); }
.inv .ev hr { width: 48px; height: 1px; border: 0; background: #e2a3ab; margin: 14px 0 14px; }
.inv .ev-place { font-family: 'Cormorant Garamond', serif; font-weight: 500; font-size: 1.15rem; text-shadow: var(--glow); }

/* ---- venue ---- */
.inv .venue { max-width: 900px; margin: 0 auto; padding: 120px 1.5rem 110px; text-align: center; }
.inv .map { padding: 8px; border: 1px solid var(--gold-soft); background: #f8ecd0; }
.inv .map iframe { display: block; width: 100%; height: min(58vh, 420px); border: 0; filter: sepia(.25) saturate(.9); }

/* ---- footer ---- */
.inv .foot {
  position: relative; text-align: center; padding: 120px 1.5rem 90px;
  background: radial-gradient(ellipse 45% 28% at 50% 100%, rgba(232, 204, 130, .55), transparent 75%);
}
.inv .foot::before { content: ""; position: absolute; top: 60px; left: 4%; right: 4%; height: 1px; background: linear-gradient(90deg, transparent, #e3bd66 20%, #e3bd66 80%, transparent); }
.inv .foot-names { font-family: 'Cormorant Garamond', serif; font-weight: 500; font-size: clamp(2.6rem, 8.5vw, 5.2rem); line-height: 1.15; text-shadow: var(--glow); margin-bottom: 14px; }
.inv .foot-names em { font-size: .55em; color: var(--rose); padding: 0 .12em; }
.inv .foot .div { margin-bottom: 20px; }
.inv .foot .div i { width: 60px; }
.inv .foot-deva { font-family: 'Tiro Devanagari Hindi', serif; font-style: italic; font-size: 1.4rem; color: #6b2a2f; margin-bottom: 22px; }
.inv .foot-links { display: flex; justify-content: center; gap: 28px; flex-wrap: wrap; }
.inv .foot-links a, .inv .foot-contact a { display: inline-flex; align-items: center; gap: 8px; text-decoration: none; }
.inv .foot-links a { font-family: 'Cormorant Garamond', serif; font-weight: 500; text-transform: uppercase; letter-spacing: .24em; font-size: .72rem; color: #a06a2a; }
.inv .foot-links svg, .inv .foot-contact svg { color: var(--gold); }
.inv .foot-rule { width: min(320px, 70%); height: 1px; border: 0; background: rgba(154, 116, 36, .3); margin: 26px auto 24px; }
.inv .foot-credit { font-weight: 400; text-transform: uppercase; letter-spacing: .26em; font-size: .74rem; color: var(--gold-text); line-height: 2; }
.inv .foot-credit a { color: #c9a24a; text-decoration: none; }
.inv .foot-contact { display: flex; justify-content: center; align-items: center; gap: 26px; flex-wrap: wrap; margin-top: 10px; }
.inv .foot-contact a { font-weight: 400; font-size: .85rem; color: #5a3a1a; }
.inv .foot-contact a + a { text-transform: uppercase; letter-spacing: .14em; font-size: .7rem; color: var(--gold-text); }

/* ---- small screens ---- */
@media (max-width: 760px) {
  .inv .floral.tl { width: 38vw; }
  .inv .floral.br { width: 36vw; }
  .inv .hero { padding: 150px 1.25rem 110px; }
  .inv .card { padding: 50px 20px 54px; }
  .inv .name { font-size: 2.6rem; }
  .inv .cd-box { width: 70px; height: 84px; }
  .inv .cd-box span { font-size: 2.5rem; }
  .inv .cd-sep { margin-top: 30px; }
  .inv .ev, .inv .ev.flip { grid-template-columns: 1fr; }
  .inv .ev.flip .ev-photo { order: 0; }
  .inv .ev-photo { aspect-ratio: 4 / 3; }
  .inv .ev-body { padding: 28px 24px 34px; }
  .inv .ev-icon { top: 24px; right: 24px; }
  .inv .timeline::before { display: none; }
  .inv .band { padding-top: 90px; }
  .inv .events { padding-top: 90px; }
  .inv .gallery-grid { grid-template-columns: 1fr; }
}

@media (prefers-reduced-motion: reduce) {
  .inv .bflies { display: none; }
  .inv .reveal { opacity: 1; transform: none; transition: none; }
  .inv .cover-btn { animation: none; }
  .inv .cover, .inv .tile img { transition: none; }
}
`;

/* ==================================================================== */
/*  Embedded images (transparent WebP) — flower corners + Ganesha ji     */
/* ==================================================================== */
const EMBEDDED_IMAGES = {
  cornerTopLeft: "data:image/webp;base64,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",
  cornerBottomRight: "data:image/webp;base64,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",
  ganesha: "data:image/webp;base64,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",
};
