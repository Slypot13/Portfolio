// Sélecteurs rapides
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ========= Loader =========
function initLoader() {
  const loader = $("#loader");
  if (!loader) return;

  window.addEventListener("load", () => {
    loader.classList.add("loader-hidden");
  });
}

// ========= Curseur custom =========
function initCustomCursor() {
  const cursor = $("#cursor");
  if (!cursor) return;

  window.addEventListener("mousemove", (event) => {
    const { clientX, clientY } = event;
    cursor.style.transform = `translate(${clientX}px, ${clientY}px)`;
  });

  const hoverTargets = [...$$("a"), ...$$("button"), ...$$(".project-card")];

  hoverTargets.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      document.body.classList.add("cursor-hover");
    });
    el.addEventListener("mouseleave", () => {
      document.body.classList.remove("cursor-hover");
    });
  });
}

// ========= Barre de progression du scroll =========
function initScrollProgress() {
  const bar = $("#scrollProgress");
  if (!bar) return;

  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = progress + "%";
  };

  window.addEventListener("scroll", update);
  update();
}

// ========= Compteur de visites (localStorage) =========
function initVisitCounter() {
  const countSpan = $("#visitCount");
  if (!countSpan) return;

  let count = parseInt(localStorage.getItem("visitCount") || "0", 10);
  count += 1;
  localStorage.setItem("visitCount", String(count));
  countSpan.textContent = count;
}

// ========= Thème clair / sombre =========
function initTheme() {
  const toggleBtn = $("#themeToggle");
  if (!toggleBtn) return;

  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    if (savedTheme === "light") {
      document.body.classList.add("light");
      toggleBtn.textContent = "🌙";
    } else {
      toggleBtn.textContent = "☀️";
    }
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
    document.body.classList.add("light");
    toggleBtn.textContent = "🌙";
  } else {
    toggleBtn.textContent = "☀️";
  }

  toggleBtn.addEventListener("click", () => {
    const isLight = document.body.classList.toggle("light");
    toggleBtn.textContent = isLight ? "🌙" : "☀️";
    localStorage.setItem("theme", isLight ? "light" : "dark");
  });
}

// ========= Carrousel de projets =========
function initProjectCarousel() {
  const items = $$(".carousel-item");
  const prevBtn = $("#prevProject");
  const nextBtn = $("#nextProject");
  if (!items.length || !prevBtn || !nextBtn) return;

  let currentIndex = 0;

  const showItem = (index) => {
    items.forEach((item, i) => {
      item.classList.toggle("active", i === index);
    });
  };

  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    showItem(currentIndex);
  });

  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % items.length;
    showItem(currentIndex);
  });
}

// ========= Filtrage des projets =========
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
        const category = card.dataset.category;
        if (filter === "all" || category === filter) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });
}

// ========= Modal projet =========
function initProjectModal() {
  const cards = $$(".project-card");
  const modal = $("#projectModal");
  if (!cards.length || !modal) return;

  const modalTitle = $("#modalTitle");
  const modalTech = $("#modalTech");
  const modalDescription = $("#modalDescription");
  const modalLink = $("#modalLink");
  const modalCloseBtn = $("#modalCloseBtn");
  const backdrop = modal.querySelector(".modal-backdrop");

  const closeModal = () => {
    modal.classList.remove("open");
  };

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const title = card.dataset.title || "";
      const tech = card.dataset.tech || "";
      const description = card.dataset.description || "";
      const link = card.dataset.link || "#";

      modalTitle.textContent = title;
      modalTech.textContent = tech;
      modalDescription.textContent = description;
      modalLink.href = link;

      modal.classList.add("open");
    });
  });

  modalCloseBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("open")) {
      closeModal();
    }
  });
}

// ========= Validation du formulaire en temps réel =========
function validateName(value) {
  if (!value.trim()) return "Le nom est obligatoire.";
  if (value.trim().length < 2) return "Le nom doit contenir au moins 2 caractères.";
  return "";
}

function validateEmail(value) {
  if (!value.trim()) return "L'e-mail est obligatoire.";
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!pattern.test(value)) return "L'e-mail n'est pas valide.";
  return "";
}

function validateMessage(value) {
  if (!value.trim()) return "Le message est obligatoire.";
  if (value.trim().length < 10) return "Le message doit contenir au moins 10 caractères.";
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

  const liveValidate = (input, validator, errorElement) => {
    const errorMsg = validator(input.value);
    errorElement.textContent = errorMsg;
    return !errorMsg;
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

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const isNameValid = liveValidate(nameInput, validateName, nameError);
    const isEmailValid = liveValidate(emailInput, validateEmail, emailError);
    const isMessageValid = liveValidate(
      messageInput,
      validateMessage,
      messageError
    );

    if (isNameValid && isEmailValid && isMessageValid) {
      status.style.color = "lightgreen";
      status.textContent =
        "Message envoyé avec succès (simulation côté front, sans back-end).";
      form.reset();
    } else {
      status.style.color = "salmon";
      status.textContent =
        "Veuillez corriger les erreurs avant d'envoyer le formulaire.";
    }
  });
}

// ========= Animations d'entrée (IntersectionObserver + stagger) =========
function initRevealAnimations() {
  const reveals = $$(".reveal");
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const isStagger = target.hasAttribute("data-stagger");

          // On affiche toujours la section elle-même
          target.classList.add("in-view");

          // Stagger sur les enfants (pour un effet encore plus smooth)
          if (isStagger) {
            const children = [...target.querySelectorAll(":scope > *")];
            children.forEach((child, index) => {
              setTimeout(() => {
                child.classList.add("in-view");
              }, index * 90);
            });
          }

          // Remplissage des barres de compétences quand la section "skills" apparaît
          if (target.id === "skills") {
            const bars = target.querySelectorAll(".skill-bar");
            bars.forEach((bar) => {
              const span = bar.querySelector("span");
              const level = bar.dataset.level || "0";
              requestAnimationFrame(() => {
                span.style.width = level + "%";
              });
            });
          }

          observer.unobserve(target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  reveals.forEach((el) => observer.observe(el));
}

// ========= Bouton retour en haut =========
function initScrollTopButton() {
  const btn = $("#scrollTopBtn");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      btn.style.display = "flex";
    } else {
      btn.style.display = "none";
    }
  });

  btn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// ========= Année dynamique dans le footer =========
function setCurrentYear() {
  const yearSpan = $("#year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

// ========= Effet machine à écrire =========
function initTypewriter() {
  const target = $("#typewriter");
  if (!target) return;

  const phrases = [
    "Je suis développeur web en formation.",
    "J'aime créer des interfaces modernes et animées.",
    "Je cherche à progresser sur des projets concrets.",
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const typeSpeed = 60;
  const deleteSpeed = 35;
  const pauseBetween = 1200;

  function tick() {
    const currentPhrase = phrases[phraseIndex];

    if (!deleting) {
      charIndex++;
      target.textContent = currentPhrase.slice(0, charIndex);

      if (charIndex === currentPhrase.length) {
        deleting = true;
        setTimeout(tick, pauseBetween);
        return;
      }
    } else {
      charIndex--;
      target.textContent = currentPhrase.slice(0, charIndex);

      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }

    setTimeout(tick, deleting ? deleteSpeed : typeSpeed);
  }

  tick();
}

// ========= Effet tilt (3D léger sur les cartes) =========
function initTiltCards() {
  const cards = $$(".tilt-card");
  if (!cards.length) return;

  cards.forEach((card) => {
    const maxRotation = 10;

    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const rotateY = ((x / rect.width) - 0.5) * 2 * maxRotation;
      const rotateX = ((y / rect.height) - 0.5) * -2 * maxRotation;

      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "rotateX(0deg) rotateY(0deg) translateZ(0)";
    });
  });
}

// ========= Boutons magnétiques =========
function initMagneticButtons() {
  const buttons = $$(".btn-magnetic");
  if (!buttons.length) return;

  const strength = 20;

  buttons.forEach((btn) => {
    btn.addEventListener("mousemove", (event) => {
      const rect = btn.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const moveX = ((x / rect.width) - 0.5) * strength;
      const moveY = ((y / rect.height) - 0.5) * strength;

      btn.style.transform = `translate(${moveX}px, ${moveY}px)`;
      btn.style.boxShadow = "0 16px 40px rgba(79, 70, 229, 0.4)";
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0, 0)";
      btn.style.boxShadow = "";
    });
  });
}

// ========= Initialisation globale =========
document.addEventListener("DOMContentLoaded", () => {
  initLoader();
  initCustomCursor();
  initScrollProgress();
  initVisitCounter();
  initTheme();
  initProjectCarousel();
  initProjectFilters();
  initProjectModal();
  initContactForm();
  initRevealAnimations();
  initScrollTopButton();
  setCurrentYear();
  initTypewriter();
  initTiltCards();
  initMagneticButtons();
});
