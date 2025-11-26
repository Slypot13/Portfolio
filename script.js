// Sélecteurs rapides
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

/* ========= Intro overlay + loader ========= */
function initIntro() {
  const intro = $("#introOverlay");
  const skipBtn = $("#introSkipBtn");
  const loader = $("#loader");

  if (!intro) return;

  let closed = false;

  const closeIntro = () => {
    if (closed) return;
    closed = true;

    // Marque le site comme chargé => header/main/footer apparaissent
    document.body.classList.add("site-loaded");

    intro.classList.add("hidden");
    if (loader) {
      setTimeout(() => loader.classList.add("hidden"), 250);
    }
  };

  // Quand tout est chargé, on laisse l’animation se jouer ~2.4s
  window.addEventListener("load", () => {
    setTimeout(closeIntro, 2400);
  });

  // Bouton "Entrer maintenant"
  if (skipBtn) {
    skipBtn.addEventListener("click", closeIntro);
  }
}

/* ========= Canvas d'intro : orbites lumineuses ========= */
function initIntroCanvas() {
  const canvas = document.getElementById("introCanvas");
  const overlay = document.getElementById("introOverlay");
  if (!canvas || !overlay) return;

  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const ORBIT_COUNT = 6;
  const POINTS_PER_ORBIT = 80;
  const orbits = [];

  for (let i = 0; i < ORBIT_COUNT; i++) {
    orbits.push({
      radius: 80 + i * 35,
      speed: (0.3 + i * 0.12) * (Math.random() > 0.5 ? 1 : -1),
      thickness: 0.6 + i * 0.15,
      hue: 210 + i * 18,
      phase: Math.random() * Math.PI * 2
    });
  }

  function draw(time) {
    if (overlay.classList.contains("hidden")) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const t = time * 0.001;

    ctx.fillStyle = "rgba(3, 6, 18, 0.75)";
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.translate(cx, cy);

    orbits.forEach((orbit, index) => {
      const angleOffset = t * orbit.speed + orbit.phase;

      for (let i = 0; i < POINTS_PER_ORBIT; i++) {
        const p = i / POINTS_PER_ORBIT;
        const angle = p * Math.PI * 2 + angleOffset;
        const wave = Math.sin(p * Math.PI * 4 + t * 2) * 6;
        const r = orbit.radius + wave;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r * 0.9;

        const alpha = 0.2 + 0.8 * Math.abs(Math.sin(p * Math.PI));

        ctx.beginPath();
        ctx.fillStyle = `hsla(${orbit.hue}, 80%, 60%, ${alpha})`;
        ctx.arc(
          x,
          y,
          orbit.thickness + (index === ORBIT_COUNT - 1 ? 0.4 : 0),
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    });

    ctx.restore();

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
}

/* ========= Canvas : champ de force 3D + étoiles + étoiles filantes ========= */
function initCanvasBackground() {
  const canvas = $("#bgCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  // Étoiles fixes / scintillantes
  const STAR_COUNT = 120;
  const stars = [];
  function createStars() {
    stars.length = 0;
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 0.7 + Math.random() * 1.4,
        speed: 0.8 + Math.random() * 1.4,
        phase: Math.random() * Math.PI * 2,
        depth: 0.2 + Math.random() * 0.8
      });
    }
  }
  createStars();
  window.addEventListener("resize", createStars);

  // Lignes d'énergie (champ de force)
  const LINE_COUNT = 42;
  const SEGMENTS = 42;
  const lines = [];
  for (let i = 0; i < LINE_COUNT; i++) {
    lines.push({
      angle: (i / LINE_COUNT) * Math.PI * 2,
      radius: 180 + Math.random() * 140,
      amp: 25 + Math.random() * 35,
      speed: 0.4 + Math.random() * 0.6,
      seed: Math.random() * Math.PI * 2,
      hue: 200 + Math.random() * 80,
      intensity: 0.4 + Math.random() * 0.6
    });
  }

  let parallaxX = 0;
  let parallaxY = 0;
  window.addEventListener("mousemove", (e) => {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    parallaxX = x * 60;
    parallaxY = y * 60;
  });

  /* ========= Étoiles filantes (NOUVEAU) ========= */
  const SHOOTING_MAX = 4;      // maximum d’étoiles filantes simultanées
  const shootingStars = [];

  function spawnShootingStar() {
    if (shootingStars.length >= SHOOTING_MAX) return;

    // Une étoile filante part un peu en dehors de l'écran
    const fromLeft = Math.random() > 0.5;

    const startX = fromLeft ? -50 : canvas.width + 50;
    const startY = Math.random() * (canvas.height * 0.4); // plutôt vers le haut
    const angle = fromLeft
      ? (Math.PI / 4) + Math.random() * 0.2          // diagonale vers le bas/droite
      : (3 * Math.PI) / 4 - Math.random() * 0.2;    // diagonale vers le bas/gauche

    const speed = 700 + Math.random() * 300;        // px / seconde
    const length = 120 + Math.random() * 80;        // longueur de la traînée
    const life = 0.7 + Math.random() * 0.6;         // durée en secondes

    shootingStars.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      length,
      life,
      age: 0,
      hue: 200 + Math.random() * 80
    });
  }

  function updateAndDrawShooting(deltaSeconds) {
    // Petite probabilité de spawn à chaque frame
    if (Math.random() < 0.02) {
      spawnShootingStar();
    }

    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const s = shootingStars[i];
      s.age += deltaSeconds;

      // Mise à jour de la position
      s.x += s.vx * deltaSeconds;
      s.y += s.vy * deltaSeconds;

      const progress = s.age / s.life;
      if (progress >= 1) {
        shootingStars.splice(i, 1);
        continue;
      }

      const alpha = (1 - progress) * 0.9;

      // Point de fin (tête de l'étoile)
      const ex = s.x;
      const ey = s.y;
      // Point de départ (queue de la traînée)
      const sx = ex - (s.vx / Math.hypot(s.vx, s.vy)) * s.length;
      const sy = ey - (s.vy / Math.hypot(s.vx, s.vy)) * s.length;

      const grad = ctx.createLinearGradient(sx, sy, ex, ey);
      grad.addColorStop(0, `hsla(${s.hue}, 80%, 65%, 0)`);
      grad.addColorStop(0.3, `hsla(${s.hue}, 80%, 70%, ${alpha * 0.3})`);
      grad.addColorStop(1, `hsla(${s.hue}, 90%, 80%, ${alpha})`);

      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
      ctx.stroke();

      // Petite tête brillante
      ctx.fillStyle = `hsla(${s.hue}, 100%, 90%, ${alpha})`;
      ctx.beginPath();
      ctx.arc(ex, ey, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* ========= Boucle d'animation ========= */
  let lastTime = performance.now();

  function drawFrame(time) {
    const w = canvas.width;
    const h = canvas.height;
    const t = time * 0.001;

    const deltaSeconds = (time - lastTime) / 1000;
    lastTime = time;

    // Fond dégradé
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, "#020617");
    bg.addColorStop(1, "#050016");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Étoiles scintillantes
    stars.forEach((s) => {
      const twinkle =
        0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase));
      const px = s.x + parallaxX * s.depth * 0.5;
      const py = s.y + parallaxY * s.depth * 0.5;

      ctx.fillStyle = `rgba(226,232,240,${twinkle})`;
      ctx.beginPath();
      ctx.arc(px, py, s.r, 0, Math.PI * 2);
      ctx.fill();
    });

    const cx = w / 2 + parallaxX * 0.35;
    const cy = h / 2 + parallaxY * 0.35;

    // Champ de force
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.lineWidth = 1.1;

    lines.forEach((line, index) => {
      const localTime = t * line.speed;
      const angleBase =
        line.angle + Math.sin(localTime * 0.7 + line.seed) * 0.4;
      const baseRadius =
        line.radius + Math.sin(localTime * 1.2 + line.seed) * 35;

      ctx.beginPath();
      for (let s = 0; s <= SEGMENTS; s++) {
        const p = s / SEGMENTS;
        const curve = (p - 0.5) * 0.9;
        const wave =
          Math.sin(p * Math.PI * 2 + localTime * 2 + line.seed) * line.amp;
        const r = baseRadius + wave;
        const theta = angleBase + curve;

        const x =
          cx +
          Math.cos(theta) * r +
          parallaxX * (index / LINE_COUNT) * 0.25;
        const y =
          cy +
          Math.sin(theta) * r +
          parallaxY * (index / LINE_COUNT) * 0.25;

        if (s === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      const alpha = 0.25 + 0.45 * line.intensity;
      ctx.strokeStyle = `hsla(${line.hue}, 80%, 60%, ${alpha})`;
      ctx.stroke();
    });

    ctx.restore();

    // Étoiles filantes (après le champ de force, pour qu’elles soient bien visibles)
    updateAndDrawShooting(deltaSeconds);

    requestAnimationFrame(drawFrame);
  }

  requestAnimationFrame(drawFrame);
}

/* ========= Curseur custom ========= */
function initCustomCursor() {
  const cursor = $("#cursor");
  if (!cursor) return;

  window.addEventListener("mousemove", (e) => {
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  });

  const hoverTargets = [
    ...$$("a"),
    ...$$("button"),
    ...$$(".project-card"),
    ...$$(".bubble-hover")
  ];
  hoverTargets.forEach((el) => {
    el.addEventListener("mouseenter", () =>
      document.body.classList.add("cursor-hover")
    );
    el.addEventListener("mouseleave", () =>
      document.body.classList.remove("cursor-hover")
    );
  });
}

/* ========= Scroll progress ========= */
function initScrollProgress() {
  const bar = $("#scrollProgress");
  if (!bar) return;

  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = progress + "%";
  };

  window.addEventListener("scroll", update);
  update();
}

/* ========= Compteur visites ========= */
function initVisitCounter() {
  const span = $("#visitCount");
  if (!span) return;

  let count = parseInt(localStorage.getItem("visitCount") || "0", 10);
  count += 1;
  localStorage.setItem("visitCount", String(count));
  span.textContent = count;
}

/* ========= Thème clair/sombre ========= */
function initTheme() {
  const toggle = $("#themeToggle");
  if (!toggle) return;

  const saved = localStorage.getItem("theme");
  if (saved === "light") {
    document.body.classList.add("light");
    toggle.textContent = "🌙";
  } else if (saved === "dark") {
    toggle.textContent = "☀️";
  } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    document.body.classList.add("light");
    toggle.textContent = "🌙";
  } else {
    toggle.textContent = "☀️";
  }

  toggle.addEventListener("click", () => {
    const isLight = document.body.classList.toggle("light");
    localStorage.setItem("theme", isLight ? "light" : "dark");
    toggle.textContent = isLight ? "🌙" : "☀️";
  });
}

/* ========= Panneau de paramètres (accent + reduce motion) ========= */
function applyAccentPalette(name) {
  const root = document.documentElement;
  if (name === "teal") {
    root.style.setProperty("--accent", "#14b8a6");
    root.style.setProperty("--accent-2", "#22c55e");
  } else if (name === "sunset") {
    root.style.setProperty("--accent", "#f97316");
    root.style.setProperty("--accent-2", "#ec4899");
  } else {
    root.style.setProperty("--accent", "#6366f1");
    root.style.setProperty("--accent-2", "#ec4899");
  }
}

function initSettingsPanel() {
  const toggleBtn = $("#settingsToggle");
  const panel = $("#settingsPanel");
  if (!toggleBtn || !panel) return;

  const accentButtons = $$(".accent-swatch");
  const reduceMotionToggle = $("#reduceMotionToggle");

  // Charger préférences
  const savedAccent = localStorage.getItem("accentPalette") || "indigo";
  applyAccentPalette(savedAccent);
  accentButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.accent === savedAccent);
  });

  const savedReduce = localStorage.getItem("reduceMotion") === "true";
  if (savedReduce) {
    document.body.classList.add("reduce-motion");
    if (reduceMotionToggle) reduceMotionToggle.checked = true;
  }

  // Ouvrir/fermer panneau
  toggleBtn.addEventListener("click", () => {
    panel.classList.toggle("open");
  });

  // Changer d'accent
  accentButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.accent || "indigo";
      applyAccentPalette(name);
      localStorage.setItem("accentPalette", name);
      accentButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  // Réduire les animations
  if (reduceMotionToggle) {
    reduceMotionToggle.addEventListener("change", () => {
      const value = reduceMotionToggle.checked;
      document.body.classList.toggle("reduce-motion", value);
      localStorage.setItem("reduceMotion", String(value));
    });
  }
}

/* ========= Carrousel ========= */
function initProjectCarousel() {
  const items = $$(".carousel-item");
  const prev = $("#prevProject");
  const next = $("#nextProject");
  if (!items.length || !prev || !next) return;

  let index = 0;
  const show = (i) =>
    items.forEach((el, idx) => el.classList.toggle("active", idx === i));

  prev.addEventListener("click", () => {
    index = (index - 1 + items.length) % items.length;
    show(index);
  });
  next.addEventListener("click", () => {
    index = (index + 1) % items.length;
    show(index);
  });
}

/* ========= Filtrage projets ========= */
function initProjectFilters() {
  const buttons = $$(".filter-btn");
  const cards = $$(".project-card");
  if (!buttons.length || !cards.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;
      cards.forEach((card) => {
        const cat = card.dataset.category;
        card.classList.toggle(
          "hidden",
          filter !== "all" && cat !== filter
        );
      });
    });
  });
}

/* ========= Modal projet ========= */
function initProjectModal() {
  const cards = $$(".project-card");
  const modal = $("#projectModal");
  if (!cards.length || !modal) return;

  const modalTitle = $("#modalTitle");
  const modalTech = $("#modalTech");
  const modalDesc = $("#modalDescription");
  const modalLink = $("#modalLink");
  const closeBtn = $("#modalCloseBtn");
  const backdrop = modal.querySelector(".modal-backdrop");

  const close = () => modal.classList.remove("open");

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      modalTitle.textContent = card.dataset.title || "";
      modalTech.textContent = card.dataset.tech || "";
      modalDesc.textContent = card.dataset.description || "";
      modalLink.href = card.dataset.link || "#";
      modal.classList.add("open");
    });
  });

  closeBtn.addEventListener("click", close);
  backdrop.addEventListener("click", close);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) close();
  });
}

/* ========= Mode Story / Parcours ========= */
function initStoryMode() {
  const steps = $$(".story-step");
  const titleEl = $("#storyTitle");
  const textEl = $("#storyText");
  const tagEl = $("#storyTag");
  const listEl = $("#storyHighlights");
  if (!steps.length || !titleEl || !textEl || !tagEl || !listEl) return;

  const data = [
    {
      title: "Débuts",
      text: "Apres l'obtention de mon Bac Général, je découvre le développement web et les bases de HTML, CSS et JavaScript.",
      highlights: [
        "Compréhension de la structure d'une page web.",
        "Premières pages statiques en HTML/CSS.",
        "Découverte des outils (VS Code, navigateur, DevTools)."
      ]
    },
    {
      title: "Premiers projets",
      text: "Des les premieres semaines à Aix-Ynov Campus, je réalise des petits projets concrets pour appliquer ce que j'apprends. Comme le Projet Red dispobile sur Github",
      highlights: [
        "Création de mini-sites vitrines.",
        "Premier Projet de jeu.",
        "Premiers scripts JavaScript."
      ]
    },
    {
      title: "Focus",
      text: "je programme dans un peu de tout, mai j'ai un penchant vers le developpement web , les animations et les micro-interactions.",
      highlights: [
        "Canvas animé et effets de fond personnalisés.",
        "Animations CSS et JS (hover, scroll, carrousel).",
        "Organisation du code et structuration d'un projet ."
      ]
    },
    {
      title: "Objectifs",
      text: "Continuer à monter en compétences et travailler sur des projets réels.",
      highlights: [
        "Rejoindre une équipe en stage / alternance.",
        "Participer à des projets.",
        "Perserverer et lancer des projets personnel."
      ]
    }
  ];

  function renderStep(index) {
    const step = data[index];
    tagEl.textContent = `Étape ${index + 1}/${data.length}`;
    titleEl.textContent = step.title;
    textEl.textContent = step.text;

    listEl.innerHTML = "";
    step.highlights.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      listEl.appendChild(li);
    });
  }

  steps.forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.step || "0", 10);
      steps.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderStep(idx);
    });
  });

  renderStep(0);
}

/* ========= Validation formulaire ========= */
function validateName(v) {
  if (!v.trim()) return "Le nom est obligatoire.";
  if (v.trim().length < 2)
    return "Le nom doit contenir au moins 2 caractères.";
  return "";
}
function validateEmail(v) {
  if (!v.trim()) return "L'e-mail est obligatoire.";
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!pattern.test(v)) return "L'e-mail n'est pas valide.";
  return "";
}
function validateMessage(v) {
  if (!v.trim()) return "Le message est obligatoire.";
  if (v.trim().length < 10)
    return "Le message doit contenir au moins 10 caractères.";
  return "";
}

function initContactForm() {
  const form = $("#contactForm");
  if (!form) return;

  const nameInput = $("#name");
  const emailInput = $("#email");
  const messageInput = $("#message");
  const nameError = $("#nameError");
  const emailError = $("#emailError");
  const messageError = $("#messageError");
  const status = $("#formStatus");

  const liveValidate = (input, validator, errorEl) => {
    const msg = validator(input.value);
    errorEl.textContent = msg;
    return !msg;
  };

  nameInput.addEventListener("input", () =>
    liveValidate(nameInput, validateName, nameError)
  );
  emailInput.addEventListener("input", () =>
    liveValidate(emailInput, validateEmail, emailError)
  );
  messageInput.addEventListener("input", () =>
    liveValidate(messageInput, validateMessage, messageError)
  );

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const okName = liveValidate(nameInput, validateName, nameError);
    const okEmail = liveValidate(emailInput, validateEmail, emailError);
    const okMsg = liveValidate(messageInput, validateMessage, messageError);

    if (okName && okEmail && okMsg) {
      status.style.color = "lightgreen";
      status.textContent =
        "Message envoyé (simulation front, sans back-end).";
      form.reset();
    } else {
      status.style.color = "salmon";
      status.textContent = "Corrige les erreurs avant d'envoyer.";
    }
  });
}

/* ========= Reveal on scroll + skills bar ========= */
function initRevealAnimations() {
  const reveals = $$(".reveal");
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add("in-view");

        if (el.hasAttribute("data-stagger")) {
          const children = [...el.querySelectorAll(":scope > *")];
          children.forEach((child, i) => {
            setTimeout(() => child.classList.add("in-view"), i * 90);
          });
        }

        if (el.id === "skills") {
          const bars = el.querySelectorAll(".skill-bar");
          bars.forEach((bar) => {
            const span = bar.querySelector("span");
            const level = bar.dataset.level || "0";
            requestAnimationFrame(() => {
              span.style.width = level + "%";
            });
          });
        }

        observer.unobserve(el);
      });
    },
    { threshold: 0.15 }
  );

  reveals.forEach((el) => observer.observe(el));
}

/* ========= Scroll top ========= */
function initScrollTopButton() {
  const btn = $("#scrollTopBtn");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    btn.style.display = window.scrollY > 300 ? "flex" : "none";
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ========= Footer year ========= */
function setCurrentYear() {
  const span = $("#year");
  if (span) span.textContent = new Date().getFullYear();
}

/* ========= Typewriter ========= */
function initTypewriter() {
  const target = $("#typewriter");
  if (!target) return;

  const phrases = [
    "Je construis des interfaces web animées.",
    "Je pratique HTML, CSS et JavaScript.",
    "Je cherche à progresser sur des projets concrets."
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const typeSpeed = 60;
  const deleteSpeed = 35;
  const pause = 1200;

  function tick() {
    const phrase = phrases[phraseIndex];
    if (!deleting) {
      charIndex++;
      target.textContent = phrase.slice(0, charIndex);
      if (charIndex === phrase.length) {
        deleting = true;
        setTimeout(tick, pause);
        return;
      }
    } else {
      charIndex--;
      target.textContent = phrase.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }
    setTimeout(tick, deleting ? deleteSpeed : typeSpeed);
  }

  tick();
}

/* ========= Tilt cards ========= */
function initTiltCards() {
  const cards = $$(".tilt-card");
  if (!cards.length) return;

  cards.forEach((card) => {
    const maxRot = 10;
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotY = ((x / rect.width) - 0.5) * 2 * maxRot;
      const rotX = ((y / rect.height) - 0.5) * -2 * maxRot;
      card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "rotateX(0deg) rotateY(0deg)";
    });
  });
}

/* ========= Boutons magnétiques ========= */
function initMagneticButtons() {
  const buttons = $$(".btn-magnetic");
  if (!buttons.length) return;

  const strength = 20;
  buttons.forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const moveX = ((x / rect.width) - 0.5) * strength;
      const moveY = ((y / rect.height) - 0.5) * strength;
      btn.style.transform = `translate(${moveX}px, ${moveY}px)`;
      btn.style.boxShadow = "0 18px 45px rgba(79,70,229,0.4)";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0,0)";
      btn.style.boxShadow = "";
    });
  });
}

/* ========= Ripple sur boutons ========= */
function initButtonRipple() {
  const buttons = $$(
    ".btn-primary, .btn-ghost, .btn-magnetic"
  );
  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const ripple = document.createElement("span");
      ripple.className = "btn-ripple-circle";
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";

      btn.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    });
  });
}

/* ========= Scroll spy (nav active) ========= */
function initNavScrollSpy() {
  const sections = ["hero", "about", "skills", "story", "projects", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const links = [...$$(".site-nav a")];

  function update() {
    let currentId = null;
    sections.forEach((sec) => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom >= 120) currentId = sec.id;
    });
    links.forEach((link) => {
      const href = link.getAttribute("href");
      const id = href && href.startsWith("#") ? href.slice(1) : null;
      link.classList.toggle("active", id === currentId);
    });
  }

  window.addEventListener("scroll", update);
  update();
}
function initMiniGame() {
  const grid = document.querySelectorAll(".mini-cell");
  const scoreSpan = document.getElementById("mg-score");
  const timeSpan = document.getElementById("mg-time");
  const startBtn = document.getElementById("mg-start");
  const message = document.getElementById("mg-message");

  if (!grid.length || !scoreSpan || !timeSpan || !startBtn || !message) return;

  let score = 0;
  let timeLeft = 20;
  let activeIndex = null;
  let gameInterval = null;
  let timeInterval = null;
  let playing = false;

  function setRandomCell() {
    if (activeIndex !== null) {
      grid[activeIndex].classList.remove("active");
    }
    const idx = Math.floor(Math.random() * grid.length);
    activeIndex = idx;
    grid[idx].classList.add("active");
  }

  function startGame() {
    if (playing) return;
    playing = true;
    score = 0;
    timeLeft = 20;
    scoreSpan.textContent = score;
    timeSpan.textContent = timeLeft;
    message.textContent = "";
    startBtn.disabled = true;

    setRandomCell();

    gameInterval = setInterval(setRandomCell, 800);
    timeInterval = setInterval(() => {
      timeLeft--;
      timeSpan.textContent = timeLeft;
      if (timeLeft <= 0) endGame();
    }, 1000);
  }

  function endGame() {
    playing = false;
    startBtn.disabled = false;
    clearInterval(gameInterval);
    clearInterval(timeInterval);
    if (activeIndex !== null) {
      grid[activeIndex].classList.remove("active");
      activeIndex = null;
    }
    if (score >= 10) {
      message.textContent = `Bien joué ! ${score} points 🎉`;
    } else {
      message.textContent = `Seulement ${score} points… tu peux faire mieux 😉`;
    }
  }

  grid.forEach((cell, index) => {
    cell.addEventListener("click", () => {
      if (!playing) return;
      if (index === activeIndex) {
        score++;
        scoreSpan.textContent = score;
        setRandomCell();
      } else {
        score = Math.max(0, score - 1);
        scoreSpan.textContent = score;
        cell.classList.add("wrong");
        setTimeout(() => cell.classList.remove("wrong"), 150);
      }
    });
  });

  startBtn.addEventListener("click", startGame);
}


/* ========= DOMContentLoaded ========= */
document.addEventListener("DOMContentLoaded", () => {
  initIntro();
  initIntroCanvas();
  initCanvasBackground();
  initCustomCursor();
  initScrollProgress();
  initVisitCounter();
  initTheme();
  initSettingsPanel();
  initProjectCarousel();
  initProjectFilters();
  initProjectModal();
  initStoryMode();
  initContactForm();
  initRevealAnimations();
  initScrollTopButton();
  setCurrentYear();
  initTypewriter();
  initTiltCards();
  initMagneticButtons();
  initButtonRipple();
  initNavScrollSpy();
  initMiniGame();
});
