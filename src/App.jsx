import { useState, useEffect, useRef, useCallback } from "react";

// ─── Datos de afirmaciones por categoría ───────────────────────────────────
const CATEGORIES = [
  {
    id: "morning",
    label: "Mañana Milagrosa",
    icon: "🌅",
    color: "#FF8C42",
    author: "Hal Elrod",
    affirmations: [
      "Hoy es el mejor día de mi vida.",
      "Tengo todo lo que necesito para lograr mis sueños.",
      "Me despierto con energía y entusiasmo.",
      "Soy capaz de superar cualquier desafío.",
      "Mi mente está clara y enfocada.",
      "Elijo la felicidad en cada momento.",
      "Soy suficiente tal como soy.",
      "Hoy tomo acción hacia mis metas.",
      "Merezco lo mejor que la vida tiene para ofrecer.",
      "Mi potencial es ilimitado.",
      "Cada día me acerco más a mis sueños.",
      "Soy disciplinado, enfocado y persistente.",
    ],
  },
  {
    id: "prayer",
    label: "Oración",
    icon: "🙏",
    color: "#9B59B6",
    author: "Joel Osteen",
    affirmations: [
      "Soy bendecido y altamente favorecido.",
      "La gracia de Dios me rodea en todo momento.",
      "Tengo fe en que lo mejor está por venir.",
      "Soy una obra maestra creada con propósito.",
      "Mi vida está llena de milagros y bendiciones.",
      "La bondad y la misericordia me acompañan.",
      "Tengo paz que sobrepasa todo entendimiento.",
      "Soy amado incondicionalmente.",
      "Mi corazón está lleno de gratitud.",
      "Cada día es un regalo precioso.",
    ],
  },
  {
    id: "motivation",
    label: "Motivación",
    icon: "🔥",
    color: "#E74C3C",
    author: "Terri Levine",
    affirmations: [
      "Soy imparable e incontenible.",
      "Tengo la fortaleza para lograr cualquier cosa.",
      "Me levanto más fuerte ante cada obstáculo.",
      "Soy un líder nato y confiado.",
      "Mi determinación es inquebrantable.",
      "Convierto los sueños en realidad con acción.",
      "Soy valiente y tomo riesgos calculados.",
      "Mi éxito es inevitable.",
      "Trabajo con pasión y propósito.",
      "Soy resiliente y perseverante.",
      "Supero mis miedos cada día.",
      "Atraigo oportunidades brillantes.",
    ],
  },
  {
    id: "anxiety",
    label: "Ansiedad y Fuerza",
    icon: "🧘",
    color: "#27AE60",
    author: "Aryana Rollins",
    affirmations: [
      "Estoy tranquilo y en paz ahora mismo.",
      "Respiro profundo y suelto toda tensión.",
      "Tengo control sobre mis pensamientos.",
      "Mi mente y cuerpo están en perfecta armonía.",
      "Elijo la calma sobre el caos.",
      "Soy más fuerte que mis miedos.",
      "Este momento es seguro y estoy bien.",
      "Mi ansiedad no me define.",
      "Confío en el proceso de la vida.",
      "Cada respiración me trae más paz.",
      "Soy capaz de manejar lo que venga.",
    ],
  },
  {
    id: "entrepreneurship",
    label: "Emprendimiento",
    icon: "💼",
    color: "#F39C12",
    author: "Sheryl Kline",
    affirmations: [
      "Soy un emprendedor brillante y exitoso.",
      "Mis ideas tienen valor e impacto en el mundo.",
      "Atraigo abundancia y prosperidad financiera.",
      "Tengo la visión y el coraje para innovar.",
      "Mi negocio crece y florece cada día.",
      "Soy un experto en lo que hago.",
      "Las personas confían en mí y en mi trabajo.",
      "Creo riqueza con integridad y propósito.",
      "Cada inversión de tiempo y dinero da frutos.",
      "Soy generoso con mi éxito y comparto con otros.",
    ],
  },
  {
    id: "users",
    label: "Recomendadas",
    icon: "⭐",
    color: "#3498DB",
    author: "Comunidad",
    affirmations: [
      "Soy amor y doy amor a todos a mi alrededor.",
      "Mi cuerpo es sano, fuerte y lleno de vitalidad.",
      "Merezco relaciones profundas y significativas.",
      "Soy una persona de alto valor e impacto.",
      "La abundancia fluye hacia mí naturalmente.",
      "Soy creativo e innovador en todo lo que hago.",
      "Aprendo y crezco con cada experiencia.",
      "Soy la mejor versión de mí mismo hoy.",
      "Mi vida tiene propósito y significado.",
      "Elijo pensamientos positivos en todo momento.",
      "Soy agradecido por cada bendición en mi vida.",
      "Tengo una mente poderosa y enfocada.",
    ],
  },
];

// ─── Música de fondo (simulada) ────────────────────────────────────────────
const MUSIC_OPTIONS = [
  { id: "none", label: "Sin música", icon: "🔇" },
  { id: "nature", label: "Naturaleza", icon: "🌿" },
  { id: "meditation", label: "Meditación", icon: "🎵" },
  { id: "piano", label: "Piano suave", icon: "🎹" },
  { id: "binaural", label: "Binaural", icon: "🎧" },
];

// ─── Paleta de colores principal ───────────────────────────────────────────
const COLORS = {
  bg: "#0A0E1A",
  bgCard: "#141828",
  bgCardLight: "#1C2235",
  primary: "#7C5CBF",
  primaryLight: "#9B7FD4",
  primaryDark: "#5A3F9A",
  accent: "#FFD166",
  accentOrange: "#FF8C42",
  text: "#F0F0F5",
  textSub: "#9A9BB0",
  textMuted: "#5A5B70",
  border: "#252840",
  success: "#4ECDC4",
  danger: "#FF6B6B",
  navBg: "#0D1120",
};

// ─── Utilidades ────────────────────────────────────────────────────────────
const formatTime = (s) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

// ─── Componente: Pantalla de Inicio (Today) ────────────────────────────────
function HomeScreen({ myAffirmations, onStartSession, onNavigate }) {
  const [greeting, setGreeting] = useState("");
  const [quote, setQuote] = useState("");
  const today = new Date();
  const dateStr = today.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const quotes = [
    "La mente es todo. Te conviertes en lo que piensas.",
    "El éxito no es accidental. Es trabajo duro, perseverancia, aprendizaje y sacrificio.",
    "Cree que puedes y ya estás a mitad del camino.",
    "No cuentes los días, haz que los días cuenten.",
    "Tu único límite eres tú mismo.",
  ];

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Buenos días ☀️");
    else if (hour < 18) setGreeting("Buenas tardes 🌤️");
    else setGreeting("Buenas noches 🌙");
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  const streak = 7; // TODO: persistir racha real en localStorage

  return (
    <div style={{ padding: "24px 20px", paddingBottom: "100px" }}>
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <p style={{ color: COLORS.textSub, fontSize: "14px", margin: 0 }}>
          {dateStr}
        </p>
        <h1
          style={{
            color: COLORS.text,
            fontSize: "26px",
            fontWeight: "700",
            margin: "4px 0 0",
          }}
        >
          {greeting}
        </h1>
      </div>

      {/* Racha */}
      <div
        style={{
          background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
          borderRadius: "20px",
          padding: "20px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", margin: 0 }}>
            Racha actual
          </p>
          <p
            style={{
              color: "#fff",
              fontSize: "32px",
              fontWeight: "800",
              margin: "4px 0",
            }}
          >
            🔥 {streak} días
          </p>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", margin: 0 }}>
            ¡Sigue así! La repetición hace la diferencia
          </p>
        </div>
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
          }}
        >
          🏆
        </div>
      </div>

      {/* Cita del día */}
      <div
        style={{
          background: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
          borderRadius: "16px",
          padding: "18px",
          marginBottom: "20px",
        }}
      >
        <p style={{ color: COLORS.accent, fontSize: "12px", fontWeight: "600", margin: "0 0 8px" }}>
          ✨ PENSAMIENTO DEL DÍA
        </p>
        <p
          style={{
            color: COLORS.text,
            fontSize: "15px",
            lineHeight: "1.6",
            margin: 0,
            fontStyle: "italic",
          }}
        >
          "{quote}"
        </p>
      </div>

      {/* Botón de sesión */}
      <button
        onClick={onStartSession}
        style={{
          width: "100%",
          padding: "18px",
          background: `linear-gradient(135deg, ${COLORS.accentOrange}, #FF6B6B)`,
          border: "none",
          borderRadius: "16px",
          color: "#fff",
          fontSize: "17px",
          fontWeight: "700",
          cursor: "pointer",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          boxShadow: `0 8px 24px rgba(255,140,66,0.35)`,
        }}
      >
        <span style={{ fontSize: "22px" }}>▶</span>
        Iniciar sesión de afirmaciones
      </button>

      {/* Mis afirmaciones preview */}
      <div
        style={{
          background: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
          borderRadius: "16px",
          padding: "18px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "14px",
          }}
        >
          <p
            style={{
              color: COLORS.text,
              fontSize: "15px",
              fontWeight: "600",
              margin: 0,
            }}
          >
            Mis afirmaciones
          </p>
          <button
            onClick={() => onNavigate("mylist")}
            style={{
              background: "none",
              border: "none",
              color: COLORS.primaryLight,
              fontSize: "13px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Ver todas →
          </button>
        </div>
        {myAffirmations.length === 0 ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <p style={{ color: COLORS.textMuted, fontSize: "14px", margin: "0 0 12px" }}>
              Aún no has añadido afirmaciones
            </p>
            <button
              onClick={() => onNavigate("explore")}
              style={{
                background: COLORS.primary,
                border: "none",
                borderRadius: "10px",
                color: "#fff",
                padding: "10px 20px",
                fontSize: "13px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              + Explorar afirmaciones
            </button>
          </div>
        ) : (
          myAffirmations.slice(0, 3).map((aff, i) => (
            <div
              key={i}
              style={{
                padding: "10px 12px",
                background: COLORS.bgCardLight,
                borderRadius: "10px",
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span style={{ fontSize: "16px" }}>
                {aff.recorded ? "🎙️" : "💬"}
              </span>
              <p
                style={{
                  color: COLORS.text,
                  fontSize: "13px",
                  margin: 0,
                  flex: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {aff.text}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Consejos */}
      <div
        style={{
          background: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
          borderRadius: "16px",
          padding: "18px",
        }}
      >
        <p
          style={{
            color: COLORS.accent,
            fontSize: "12px",
            fontWeight: "600",
            margin: "0 0 12px",
          }}
        >
          💡 CONSEJOS
        </p>
        {[
          "Selecciona al menos 10 afirmaciones",
          "Escucha 5 minutos al día antes de dormir",
          "Practica el mismo conjunto por 21 días",
          "Usa auriculares para mayor concentración",
          "Graba con tu propia voz para mayor impacto",
        ].map((tip, i) => (
          <div
            key={i}
            style={{ display: "flex", gap: "10px", marginBottom: "8px" }}
          >
            <span style={{ color: COLORS.success, fontSize: "14px" }}>✓</span>
            <p style={{ color: COLORS.textSub, fontSize: "13px", margin: 0 }}>
              {tip}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Componente: Explorar Categorías ──────────────────────────────────────
function ExploreScreen({ myAffirmations, setMyAffirmations }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState("");

  const toggleAffirmation = (text, catColor) => {
    const exists = myAffirmations.find((a) => a.text === text);
    if (exists) {
      setMyAffirmations(myAffirmations.filter((a) => a.text !== text));
    } else {
      setMyAffirmations([
        ...myAffirmations,
        { text, recorded: false, audioUrl: null, color: catColor, id: Date.now() + Math.random() },
      ]);
    }
  };

  const isSelected = (text) => myAffirmations.some((a) => a.text === text);

  if (selectedCategory) {
    const cat = CATEGORIES.find((c) => c.id === selectedCategory);
    const filtered = cat.affirmations.filter((a) =>
      a.toLowerCase().includes(search.toLowerCase())
    );
    return (
      <div style={{ paddingBottom: "100px" }}>
        {/* Header categoría */}
        <div
          style={{
            background: `linear-gradient(180deg, ${cat.color}33 0%, ${COLORS.bg} 100%)`,
            padding: "24px 20px 20px",
          }}
        >
          <button
            onClick={() => { setSelectedCategory(null); setSearch(""); }}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "none",
              borderRadius: "10px",
              color: COLORS.text,
              padding: "8px 14px",
              fontSize: "14px",
              cursor: "pointer",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            ← Volver
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <span
              style={{
                fontSize: "36px",
                background: `${cat.color}33`,
                padding: "12px",
                borderRadius: "16px",
              }}
            >
              {cat.icon}
            </span>
            <div>
              <h2 style={{ color: COLORS.text, fontSize: "20px", fontWeight: "700", margin: 0 }}>
                {cat.label}
              </h2>
              <p style={{ color: COLORS.textSub, fontSize: "13px", margin: "4px 0 0" }}>
                por {cat.author} · {cat.affirmations.length} afirmaciones
              </p>
            </div>
          </div>
          {/* Buscador */}
          <div
            style={{
              marginTop: "16px",
              background: COLORS.bgCard,
              border: `1px solid ${COLORS.border}`,
              borderRadius: "12px",
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span style={{ color: COLORS.textMuted }}>🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar afirmación..."
              style={{
                background: "none",
                border: "none",
                color: COLORS.text,
                fontSize: "14px",
                flex: 1,
                outline: "none",
              }}
            />
          </div>
        </div>

        <div style={{ padding: "0 20px" }}>
          <p style={{ color: COLORS.textSub, fontSize: "13px", marginBottom: "12px" }}>
            Toca para añadir a tu lista · {myAffirmations.length} seleccionadas
          </p>
          {filtered.map((aff, i) => {
            const selected = isSelected(aff);
            return (
              <button
                key={i}
                onClick={() => toggleAffirmation(aff, cat.color)}
                style={{
                  width: "100%",
                  background: selected ? `${cat.color}22` : COLORS.bgCard,
                  border: `1px solid ${selected ? cat.color : COLORS.border}`,
                  borderRadius: "14px",
                  padding: "16px",
                  marginBottom: "10px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  textAlign: "left",
                  transition: "all 0.2s",
                }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    border: `2px solid ${selected ? cat.color : COLORS.textMuted}`,
                    background: selected ? cat.color : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {selected && (
                    <span style={{ color: "#fff", fontSize: "14px" }}>✓</span>
                  )}
                </div>
                <p
                  style={{
                    color: selected ? COLORS.text : COLORS.textSub,
                    fontSize: "14px",
                    margin: 0,
                    lineHeight: "1.5",
                    fontWeight: selected ? "600" : "400",
                  }}
                >
                  {aff}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px 20px", paddingBottom: "100px" }}>
      <h2
        style={{
          color: COLORS.text,
          fontSize: "22px",
          fontWeight: "700",
          margin: "0 0 6px",
        }}
      >
        Explorar categorías
      </h2>
      <p style={{ color: COLORS.textSub, fontSize: "14px", margin: "0 0 24px" }}>
        Selecciona afirmaciones de expertos reconocidos
      </p>

      {CATEGORIES.map((cat) => {
        const added = myAffirmations.filter((a) => a.color === cat.color).length;
        return (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            style={{
              width: "100%",
              background: COLORS.bgCard,
              border: `1px solid ${COLORS.border}`,
              borderRadius: "18px",
              padding: "18px",
              marginBottom: "12px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              textAlign: "left",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "14px",
                background: `${cat.color}22`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                flexShrink: 0,
              }}
            >
              {cat.icon}
            </div>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  color: COLORS.text,
                  fontSize: "15px",
                  fontWeight: "600",
                  margin: "0 0 3px",
                }}
              >
                {cat.label}
              </p>
              <p style={{ color: COLORS.textSub, fontSize: "12px", margin: 0 }}>
                {cat.author} · {cat.affirmations.length} afirmaciones
              </p>
              {added > 0 && (
                <p
                  style={{
                    color: cat.color,
                    fontSize: "12px",
                    margin: "4px 0 0",
                    fontWeight: "600",
                  }}
                >
                  {added} añadidas ✓
                </p>
              )}
            </div>
            <span style={{ color: cat.color, fontSize: "20px" }}>›</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Componente: Mi Lista ──────────────────────────────────────────────────
function MyListScreen({ myAffirmations, setMyAffirmations, onStartSession }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAffText, setNewAffText] = useState("");
  const [recording, setRecording] = useState(null); // id de afirmación grabando
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const removeAffirmation = (id) => {
    setMyAffirmations(myAffirmations.filter((a) => a.id !== id));
  };

  const addCustomAffirmation = () => {
    if (!newAffText.trim()) return;
    setMyAffirmations([
      ...myAffirmations,
      {
        text: newAffText.trim(),
        recorded: false,
        audioUrl: null,
        color: COLORS.primary,
        id: Date.now(),
        custom: true,
      },
    ]);
    setNewAffText("");
    setShowAddModal(false);
  };

  const startRecording = async (id) => {
    // TODO: Implementar grabación real con MediaRecorder API
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      mr.ondataavailable = (e) => chunksRef.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setMyAffirmations((prev) =>
          prev.map((a) =>
            a.id === id ? { ...a, recorded: true, audioUrl: url } : a
          )
        );
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.start();
      setRecording(id);
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => setRecordingSeconds((s) => s + 1), 1000);
    } catch (err) {
      alert("No se pudo acceder al micrófono. Por favor, permite el acceso.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    clearInterval(timerRef.current);
    setRecording(null);
    setRecordingSeconds(0);
  };

  const playAudio = (url) => {
    if (!url) return;
    new Audio(url).play();
  };

  return (
    <div style={{ paddingBottom: "100px" }}>
      {/* Header */}
      <div
        style={{
          padding: "24px 20px 16px",
          borderBottom: `1px solid ${COLORS.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "12px",
          }}
        >
          <div>
            <h2
              style={{
                color: COLORS.text,
                fontSize: "22px",
                fontWeight: "700",
                margin: "0 0 4px",
              }}
            >
              Mi lista
            </h2>
            <p style={{ color: COLORS.textSub, fontSize: "13px", margin: 0 }}>
              {myAffirmations.length} afirmaciones · {myAffirmations.filter((a) => a.recorded).length} grabadas 🎙️
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              background: COLORS.primary,
              border: "none",
              borderRadius: "12px",
              color: "#fff",
              padding: "10px 16px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            + Añadir
          </button>
        </div>

        {myAffirmations.length >= 3 && (
          <button
            onClick={onStartSession}
            style={{
              width: "100%",
              padding: "14px",
              background: `linear-gradient(135deg, ${COLORS.accentOrange}, #FF6B6B)`,
              border: "none",
              borderRadius: "14px",
              color: "#fff",
              fontSize: "15px",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            ▶ Iniciar sesión con estas afirmaciones
          </button>
        )}
      </div>

      {/* Lista */}
      <div style={{ padding: "16px 20px" }}>
        {myAffirmations.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: COLORS.textMuted,
            }}
          >
            <p style={{ fontSize: "48px", margin: "0 0 16px" }}>🌟</p>
            <p style={{ fontSize: "16px", margin: "0 0 8px", color: COLORS.textSub }}>
              Tu lista está vacía
            </p>
            <p style={{ fontSize: "14px", margin: 0 }}>
              Explora categorías o crea tus propias afirmaciones
            </p>
          </div>
        ) : (
          myAffirmations.map((aff) => (
            <div
              key={aff.id}
              style={{
                background: COLORS.bgCard,
                border: `1px solid ${aff.color}33`,
                borderLeft: `3px solid ${aff.color}`,
                borderRadius: "14px",
                padding: "14px",
                marginBottom: "10px",
              }}
            >
              <p
                style={{
                  color: COLORS.text,
                  fontSize: "14px",
                  margin: "0 0 12px",
                  lineHeight: "1.5",
                }}
              >
                {aff.text}
              </p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {/* Grabar */}
                {recording === aff.id ? (
                  <button
                    onClick={stopRecording}
                    style={{
                      background: COLORS.danger,
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                      padding: "7px 12px",
                      fontSize: "12px",
                      cursor: "pointer",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    ⏹ Parar ({recordingSeconds}s)
                  </button>
                ) : (
                  <button
                    onClick={() => startRecording(aff.id)}
                    style={{
                      background: aff.recorded ? `${COLORS.success}22` : COLORS.bgCardLight,
                      border: `1px solid ${aff.recorded ? COLORS.success : COLORS.border}`,
                      borderRadius: "8px",
                      color: aff.recorded ? COLORS.success : COLORS.textSub,
                      padding: "7px 12px",
                      fontSize: "12px",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    🎙️ {aff.recorded ? "Re-grabar" : "Grabar mi voz"}
                  </button>
                )}

                {/* Reproducir */}
                {aff.audioUrl && (
                  <button
                    onClick={() => playAudio(aff.audioUrl)}
                    style={{
                      background: `${COLORS.primary}22`,
                      border: `1px solid ${COLORS.primary}`,
                      borderRadius: "8px",
                      color: COLORS.primaryLight,
                      padding: "7px 12px",
                      fontSize: "12px",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    ▶ Escuchar
                  </button>
                )}

                {/* Eliminar */}
                <button
                  onClick={() => removeAffirmation(aff.id)}
                  style={{
                    background: "none",
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: "8px",
                    color: COLORS.textMuted,
                    padding: "7px 12px",
                    fontSize: "12px",
                    cursor: "pointer",
                    marginLeft: "auto",
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal añadir afirmación personalizada */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "flex-end",
            zIndex: 1000,
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              background: COLORS.bgCard,
              borderRadius: "24px 24px 0 0",
              padding: "24px 20px 40px",
              width: "100%",
              border: `1px solid ${COLORS.border}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: "40px",
                height: "4px",
                background: COLORS.border,
                borderRadius: "2px",
                margin: "0 auto 20px",
              }}
            />
            <h3
              style={{
                color: COLORS.text,
                fontSize: "18px",
                fontWeight: "700",
                margin: "0 0 16px",
              }}
            >
              Crear afirmación personal
            </h3>
            <p style={{ color: COLORS.textSub, fontSize: "13px", margin: "0 0 14px" }}>
              Escríbela en primera persona, presente positivo
            </p>
            <textarea
              value={newAffText}
              onChange={(e) => setNewAffText(e.target.value)}
              placeholder='Ej: "Soy una persona llena de amor y gratitud"'
              rows={3}
              style={{
                width: "100%",
                background: COLORS.bgCardLight,
                border: `1px solid ${COLORS.border}`,
                borderRadius: "12px",
                color: COLORS.text,
                fontSize: "15px",
                padding: "14px",
                outline: "none",
                resize: "none",
                boxSizing: "border-box",
                lineHeight: "1.5",
              }}
            />
            <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  flex: 1,
                  padding: "14px",
                  background: COLORS.bgCardLight,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: "12px",
                  color: COLORS.textSub,
                  fontSize: "15px",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={addCustomAffirmation}
                style={{
                  flex: 2,
                  padding: "14px",
                  background: COLORS.primary,
                  border: "none",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Añadir afirmación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Componente: Reproductor / Sesión ─────────────────────────────────────
function PlayerScreen({ myAffirmations, onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutos
  const [selectedMusic, setSelectedMusic] = useState("none");
  const [showMusicPicker, setShowMusicPicker] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const affIntervalRef = useRef(null);

  const affirmations =
    myAffirmations.length > 0
      ? myAffirmations
      : CATEGORIES[0].affirmations.map((text) => ({
          text,
          recorded: false,
          audioUrl: null,
          color: COLORS.primary,
          id: Math.random(),
        }));

  const current = affirmations[currentIndex % affirmations.length];

  useEffect(() => {
    if (isPlaying) {
      // Temporizador sesión
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            clearInterval(affIntervalRef.current);
            setIsPlaying(false);
            setSessionDone(true);
            return 0;
          }
          return t - 1;
        });
        setProgress((p) => Math.min(p + 100 / 300, 100));
      }, 1000);

      // Rotar afirmaciones cada 12 segundos
      affIntervalRef.current = setInterval(() => {
        setCurrentIndex((i) => i + 1);
      }, 12000);
    } else {
      clearInterval(intervalRef.current);
      clearInterval(affIntervalRef.current);
    }
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(affIntervalRef.current);
    };
  }, [isPlaying]);

  const resetSession = () => {
    setIsPlaying(false);
    setTimeLeft(300);
    setProgress(0);
    setCurrentIndex(0);
    setSessionDone(false);
  };

  const skipNext = () => setCurrentIndex((i) => i + 1);
  const skipPrev = () => setCurrentIndex((i) => Math.max(0, i - 1));

  // Reproducir audio grabado si existe
  useEffect(() => {
    if (isPlaying && current?.audioUrl) {
      new Audio(current.audioUrl).play().catch(() => {});
    }
  }, [currentIndex, isPlaying]);

  if (sessionDone) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          background: COLORS.bg,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "72px", marginBottom: "20px" }}>🌟</div>
        <h2
          style={{
            color: COLORS.text,
            fontSize: "26px",
            fontWeight: "800",
            margin: "0 0 12px",
          }}
        >
          ¡Sesión completada!
        </h2>
        <p style={{ color: COLORS.textSub, fontSize: "15px", margin: "0 0 8px" }}>
          Has completado 5 minutos de afirmaciones positivas.
        </p>
        <p style={{ color: COLORS.textMuted, fontSize: "13px", margin: "0 0 32px" }}>
          La repetición hace la diferencia. ¡Vuelve mañana!
        </p>
        <div
          style={{
            background: `${COLORS.success}22`,
            border: `1px solid ${COLORS.success}`,
            borderRadius: "16px",
            padding: "16px 24px",
            marginBottom: "28px",
          }}
        >
          <p style={{ color: COLORS.success, fontSize: "13px", margin: 0, fontWeight: "600" }}>
            🔥 Tu racha continúa. ¡Sigue 21 días más!
          </p>
        </div>
        <button
          onClick={resetSession}
          style={{
            background: COLORS.primary,
            border: "none",
            borderRadius: "14px",
            color: "#fff",
            padding: "16px 32px",
            fontSize: "16px",
            fontWeight: "700",
            cursor: "pointer",
            marginBottom: "12px",
            width: "100%",
            maxWidth: "320px",
          }}
        >
          🔁 Repetir sesión
        </button>
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: `1px solid ${COLORS.border}`,
            borderRadius: "14px",
            color: COLORS.textSub,
            padding: "14px 32px",
            fontSize: "15px",
            cursor: "pointer",
            width: "100%",
            maxWidth: "320px",
          }}
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `radial-gradient(ellipse at top, ${current.color || COLORS.primary}22 0%, ${COLORS.bg} 60%)`,
        display: "flex",
        flexDirection: "column",
        paddingBottom: "100px",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          padding: "20px 20px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "none",
            borderRadius: "10px",
            color: COLORS.text,
            padding: "8px 14px",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          ← Salir
        </button>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: COLORS.textSub, fontSize: "12px", margin: 0 }}>
            {currentIndex % affirmations.length + 1} / {affirmations.length}
          </p>
        </div>
        <button
          onClick={() => setShowMusicPicker(!showMusicPicker)}
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "none",
            borderRadius: "10px",
            color: selectedMusic !== "none" ? COLORS.accent : COLORS.textSub,
            padding: "8px 14px",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          🎵 {MUSIC_OPTIONS.find((m) => m.id === selectedMusic)?.icon}
        </button>
      </div>

      {/* Picker de música */}
      {showMusicPicker && (
        <div
          style={{
            margin: "12px 20px",
            background: COLORS.bgCard,
            border: `1px solid ${COLORS.border}`,
            borderRadius: "14px",
            padding: "12px",
          }}
        >
          <p style={{ color: COLORS.textSub, fontSize: "12px", margin: "0 0 10px", fontWeight: "600" }}>
            🎵 MÚSICA DE FONDO
          </p>
          {/* TODO: Implementar reproducción real de música de fondo */}
          {MUSIC_OPTIONS.map((m) => (
            <button
              key={m.id}
              onClick={() => { setSelectedMusic(m.id); setShowMusicPicker(false); }}
              style={{
                width: "100%",
                background: selectedMusic === m.id ? `${COLORS.primary}22` : "none",
                border: `1px solid ${selectedMusic === m.id ? COLORS.primary : "transparent"}`,
                borderRadius: "10px",
                color: selectedMusic === m.id ? COLORS.primaryLight : COLORS.textSub,
                padding: "10px 12px",
                fontSize: "14px",
                cursor: "pointer",
                textAlign: "left",
                marginBottom: "4px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span style={{ fontSize: "18px" }}>{m.icon}</span> {m.label}
              {selectedMusic === m.id && <span style={{ marginLeft: "auto" }}>✓</span>}
            </button>
          ))}
        </div>
      )}

      {/* Temporizador */}
      <div style={{ textAlign: "center", padding: "28px 20px 16px" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            background: `conic-gradient(${current.color || COLORS.primary} ${progress * 3.6}deg, ${COLORS.bgCard} 0deg)`,
            padding: "4px",
          }}
        >
          <div
            style={{
              width: "86px",
              height: "86px",
              borderRadius: "50%",
              background: COLORS.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p
              style={{
                color: COLORS.text,
                fontSize: "22px",
                fontWeight: "700",
                margin: 0,
              }}
            >
              {formatTime(timeLeft)}
            </p>
          </div>
        </div>
      </div>

      {/* Afirmación actual */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px 28px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          {current.recorded && (
            <p
              style={{
                color: COLORS.success,
                fontSize: "12px",
                fontWeight: "600",
                margin: "0 0 16px",
                letterSpacing: "1px",
              }}
            >
              🎙️ TU VOZ
            </p>
          )}
          <p
            style={{
              color: COLORS.text,
              fontSize: "22px",
              fontWeight: "700",
              lineHeight: "1.5",
              margin: "0 0 24px",
              letterSpacing: "-0.3px",
            }}
          >
            {current.text}
          </p>
          <div
            style={{
              width: "60px",
              height: "3px",
              background: current.color || COLORS.primary,
              borderRadius: "2px",
              margin: "0 auto",
              opacity: isPlaying ? 1 : 0.3,
            }}
          />
        </div>
      </div>

      {/* Controles */}
      <div style={{ padding: "0 20px 24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
            marginBottom: "20px",
          }}
        >
          <button
            onClick={skipPrev}
            style={{
              background: COLORS.bgCard,
              border: `1px solid ${COLORS.border}`,
              borderRadius: "50%",
              width: "52px",
              height: "52px",
              color: COLORS.textSub,
              fontSize: "20px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ⏮
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              background: `linear-gradient(135deg, ${current.color || COLORS.primary}, ${COLORS.primaryDark})`,
              border: "none",
              borderRadius: "50%",
              width: "72px",
              height: "72px",
              color: "#fff",
              fontSize: "26px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 8px 24px ${(current.color || COLORS.primary)}55`,
            }}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>

          <button
            onClick={skipNext}
            style={{
              background: COLORS.bgCard,
              border: `1px solid ${COLORS.border}`,
              borderRadius: "50%",
              width: "52px",
              height: "52px",
              color: COLORS.textSub,
              fontSize: "20px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ⏭
          </button>
        </div>

        <p style={{ textAlign: "center", color: COLORS.textMuted, fontSize: "12px", margin: 0 }}>
          {isPlaying ? "Sesión en curso — relájate y escucha" : "Toca ▶ para comenzar la sesión"}
        </p>
      </div>
    </div>
  );
}

// ─── Componente: Configuración / Perfil ───────────────────────────────────
function SettingsScreen({ notifications, setNotifications }) {
  const [morningTime, setMorningTime] = useState("07:00");
  const [eveningTime, setEveningTime] = useState("22:00");
  const [sessionDays, setSessionDays] = useState(0);

  useEffect(() => {
    // TODO: Persistir configuración en localStorage
    const days = parseInt(localStorage.getItem("sessionDays") || "0");
    setSessionDays(days);
  }, []);

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    // TODO: Implementar notificaciones push reales con Web Notifications API
  };

  return (
    <div style={{ padding: "24px 20px", paddingBottom: "100px" }}>
      <h2
        style={{
          color: COLORS.text,
          fontSize: "22px",
          fontWeight: "700",
          margin: "0 0 24px",
        }}
      >
        Configuración
      </h2>

      {/* Progreso */}
      <div
        style={{
          background: `linear-gradient(135deg, ${COLORS.primary}33, ${COLORS.primaryDark}33)`,
          border: `1px solid ${COLORS.primary}44`,
          borderRadius: "18px",
          padding: "20px",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        <p style={{ color: COLORS.primaryLight, fontSize: "12px", margin: "0 0 4px", fontWeight: "600" }}>
          TU PROGRESO
        </p>
        <p
          style={{
            color: COLORS.text,
            fontSize: "36px",
            fontWeight: "800",
            margin: "0 0 4px",
          }}
        >
          🔥 7 días
        </p>
        <p style={{ color: COLORS.textSub, fontSize: "13px", margin: "0 0 12px" }}>
          ¡Practica 21 días para un cambio real!
        </p>
        {/* Barra de progreso */}
        <div
          style={{
            background: COLORS.bgCard,
            borderRadius: "8px",
            height: "8px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${(7 / 21) * 100}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.accentOrange})`,
              borderRadius: "8px",
            }}
          />
        </div>
        <p style={{ color: COLORS.textMuted, fontSize: "12px", margin: "8px 0 0" }}>
          7 / 21 días completados
        </p>
      </div>

      {/* Notificaciones */}
      <div
        style={{
          background: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
          borderRadius: "18px",
          padding: "20px",
          marginBottom: "16px",
        }}
      >
        <p
          style={{
            color: COLORS.accent,
            fontSize: "12px",
            fontWeight: "600",
            margin: "0 0 16px",
          }}
        >
          🔔 RECORDATORIOS
        </p>

        {[
          { key: "morning", label: "Sesión matutina", sub: "Empieza el día con positividad", time: morningTime, setTime: setMorningTime },
          { key: "evening", label: "Sesión nocturna", sub: "Antes de dormir (recomendado)", time: eveningTime, setTime: setEveningTime },
        ].map(({ key, label, sub, time, setTime }) => (
          <div
            key={key}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: "14px",
              marginBottom: "14px",
              borderBottom: `1px solid ${COLORS.border}`,
            }}
          >
            <div style={{ flex: 1 }}>
              <p style={{ color: COLORS.text, fontSize: "14px", fontWeight: "600", margin: "0 0 2px" }}>
                {label}
              </p>
              <p style={{ color: COLORS.textSub, fontSize: "12px", margin: 0 }}>
                {sub}
              </p>
              {notifications[key] && (
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  style={{
                    marginTop: "8px",
                    background: COLORS.bgCardLight,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: "8px",
                    color: COLORS.text,
                    padding: "6px 10px",
                    fontSize: "13px",
                    outline: "none",
                  }}
                />
              )}
            </div>
            {/* Toggle */}
            <div
              onClick={() => toggleNotification(key)}
              style={{
                width: "48px",
                height: "26px",
                borderRadius: "13px",
                background: notifications[key] ? COLORS.primary : COLORS.bgCardLight,
                border: `1px solid ${notifications[key] ? COLORS.primary : COLORS.border}`,
                cursor: "pointer",
                position: "relative",
                transition: "all 0.2s",
                flexShrink: 0,
                marginLeft: "12px",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "3px",
                  left: notifications[key] ? "24px" : "3px",
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  background: "#fff",
                  transition: "left 0.2s",
                }}
              />
            </div>
          </div>
        ))}

        <p style={{ color: COLORS.textMuted, fontSize: "12px", margin: "4px 0 0", textAlign: "center" }}>
          {/* TODO: Implementar notificaciones push reales */}
          ⚠️ Las notificaciones reales requieren permisos del navegador
        </p>
      </div>

      {/* Opciones de sesión */}
      <div
        style={{
          background: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
          borderRadius: "18px",
          padding: "20px",
          marginBottom: "16px",
        }}
      >
        <p style={{ color: COLORS.accent, fontSize: "12px", fontWeight: "600", margin: "0 0 16px" }}>
          ⚙️ SESIÓN
        </p>
        {[
          { label: "Duración de sesión", value: "5 minutos" },
          { label: "Cambio de afirmación", value: "Cada 12 seg" },
          { label: "Repetir ciclo", value: "Activado" },
          { label: "Reproducir en loop", value: "Activado" },
        ].map(({ label, value }, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: i < 3 ? "12px" : 0,
              marginBottom: i < 3 ? "12px" : 0,
              borderBottom: i < 3 ? `1px solid ${COLORS.border}` : "none",
            }}
          >
            <p style={{ color: COLORS.textSub, fontSize: "14px", margin: 0 }}>{label}</p>
            <p style={{ color: COLORS.text, fontSize: "14px", fontWeight: "600", margin: 0 }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Sobre la app */}
      <div
        style={{
          background: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
          borderRadius: "18px",
          padding: "20px",
        }}
      >
        <p style={{ color: COLORS.accent, fontSize: "12px", fontWeight: "600", margin: "0 0 12px" }}>
          ℹ️ ACERCA DE
        </p>
        <p style={{ color: COLORS.textSub, fontSize: "13px", margin: "0 0 8px", lineHeight: "1.5" }}>
          ThinkUp es una app de afirmaciones positivas para desarrollar la mentalidad y motivación
          que necesitas para el éxito.
        </p>
        <p style={{ color: COLORS.textMuted, fontSize: "12px", margin: "0 0 8px" }}>
          🙏 Con afirmaciones de Joel Osteen, Hal Elrod, Terri Levine, Aryana Rollins y Sheryl Kline.
        </p>
        <p style={{ color: COLORS.textMuted, fontSize: "11px", margin: 0 }}>
          Versión 1.0.0 · Salud y Fitness
        </p>
      </div>
    </div>
  );
}

// ─── Componente Principal App ──────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("home");
  const [myAffirmations, setMyAffirmations] = useState(() => {
    try {
      const saved = localStorage.getItem("myAffirmations");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [playerActive, setPlayerActive] = useState(false);
  const [notifications, setNotifications] = useState({
    morning: false,
    evening: false,
  });

  // Persistir afirmaciones
  useEffect(() => {
    localStorage.setItem("myAffirmations", JSON.stringify(myAffirmations));
  }, [myAffirmations]);

  const startSession = useCallback(() => {
    setPlayerActive(true);
  }, []);

  const navItems = [
    { id: "home", label: "Hoy", icon: "🏠" },
    { id: "explore", label: "Explorar", icon: "🔍" },
    { id: "mylist", label: "Mi lista", icon: "📋" },
    { id: "settings", label: "Ajustes", icon: "⚙️" },
  ];

  const renderScreen = () => {
    switch (tab) {
      case "home":
        return (
          <HomeScreen
            myAffirmations={myAffirmations}
            onStartSession={startSession}
            onNavigate={setTab}
          />
        );
      case "explore":
        return (
          <ExploreScreen
            myAffirmations={myAffirmations}
            setMyAffirmations={setMyAffirmations}
          />
        );
      case "mylist":
        return (
          <MyListScreen
            myAffirmations={myAffirmations}
            setMyAffirmations={setMyAffirmations}
            onStartSession={startSession}
          />
        );
      case "settings":
        return (
          <SettingsScreen
            notifications={notifications}
            setNotifications={setNotifications}
          />
        );
      default:
        return null;
    }
  };

  // Pantalla del reproductor (modal full-screen)
  if (playerActive) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: COLORS.bg,
          fontFamily: "'Inter', 'Segoe UI', sans-serif",
          maxWidth: "430px",
          margin: "0 auto",
          position: "relative",
        }}
      >
        <PlayerScreen
          myAffirmations={myAffirmations}
          onBack={() => setPlayerActive(false)}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.bg,
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        maxWidth: "430px",
        margin: "0 auto",
        position: "relative",
      }}
    >
      {/* Contenido de la pantalla */}
      <div style={{ minHeight: "100vh", overflowY: "auto" }}>
        {renderScreen()}
      </div>

      {/* Barra de navegación inferior */}
      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: "430px",
          background: COLORS.navBg,
          borderTop: `1px solid ${COLORS.border}`,
          display: "flex",
          padding: "10px 0 16px",
          zIndex: 100,
          backdropFilter: "blur(12px)",
        }}
      >
        {navItems.map(({ id, label, icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                flex: 1,
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                padding: "4px 0",
              }}
            >
              <span
                style={{
                  fontSize: "22px",
                  filter: active ? "none" : "grayscale(80%)",
                  opacity: active ? 1 : 0.5,
                  transition: "all 0.2s",
                }}
              >
                {icon}
              </span>
              <span
                style={{
                  fontSize: "11px",
                  color: active ? COLORS.primaryLight : COLORS.textMuted,
                  fontWeight: active ? "700" : "400",
                  transition: "color 0.2s",
                }}
              >
                {label}
              </span>
              {active && (
                <div
                  style={{
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    background: COLORS.primaryLight,
                    position: "absolute",
                    bottom: "6px",
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Indicador de afirmaciones seleccionadas (badge) */}
      {myAffirmations.length > 0 && tab !== "mylist" && (
        <button
          onClick={startSession}
          style={{
            position: "fixed",
            bottom: "88px",
            right: "calc(50% - 195px)",
            background: `linear-gradient(135deg, ${COLORS.accentOrange}, #FF6B6B)`,
            border: "none",
            borderRadius: "50px",
            color: "#fff",
            padding: "12px 18px",
            fontSize: "13px",
            fontWeight: "700",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 6px 20px rgba(255,140,66,0.4)",
            zIndex: 99,
          }}
        >
          ▶ {myAffirmations.length} afirmaciones
        </button>
      )}
    </div>
  );
}