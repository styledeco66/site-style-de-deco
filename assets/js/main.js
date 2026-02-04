const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const heroImg = document.querySelector(".hero picture img");
if (heroImg) {
  heroImg.addEventListener("error", () => {
    const hero = document.querySelector(".hero");
    if (hero) hero.classList.add("hero--fallback");
  });
}

const forms = document.querySelectorAll("form[data-guard]");
forms.forEach((form) => {
  const startTime = Date.now();
  const fastLimit = Number(form.dataset.guard) || 3000;
  form.addEventListener("submit", (event) => {
    const honeypot = form.querySelector("input[name='company']");
    if (honeypot && honeypot.value.trim() !== "") {
      event.preventDefault();
      return;
    }

    if (Date.now() - startTime < fastLimit) {
      event.preventDefault();
      alert("Merci de patienter quelques secondes avant d'envoyer votre demande.");
    }
  });
});

const carousel = document.querySelector("[data-carousel]");
if (carousel) {
  const track = carousel.querySelector("[data-carousel-track]");
  const slides = track ? Array.from(track.children) : [];
  const prevBtn = carousel.querySelector("[data-carousel-prev]");
  const nextBtn = carousel.querySelector("[data-carousel-next]");
  let index = 0;
  let timer = null;
  const interval = 6000;
  let visibleCount = 1;
  let maxIndex = 0;
  let currentVisible = 0;

  const buildClones = () => {
    if (!track) return;
    track.querySelectorAll("[data-clone]").forEach((clone) => clone.remove());
    const cloneCount = Math.min(visibleCount, slides.length);
    for (let i = 0; i < cloneCount; i += 1) {
      const clone = slides[i].cloneNode(true);
      clone.setAttribute("data-clone", "true");
      track.appendChild(clone);
    }
    maxIndex = slides.length;
  };

  const update = () => {
    if (!track) return;
    const gapValue = parseFloat(getComputedStyle(track).gap || "0");
    const slideWidth = slides[0] ? slides[0].getBoundingClientRect().width : 0;
    const trackWidth = track.parentElement
      ? track.parentElement.getBoundingClientRect().width
      : 0;
    visibleCount = slideWidth ? Math.max(1, Math.round(trackWidth / (slideWidth + gapValue))) : 1;
    if (visibleCount !== currentVisible) {
      currentVisible = visibleCount;
      buildClones();
    }
    const offset = index * (slideWidth + gapValue);
    track.style.transform = `translateX(-${offset}px)`;
  };

  const goNext = () => {
    index = index + 1;
    update();
  };

  const goPrev = () => {
    index = index <= 0 ? 0 : index - 1;
    update();
  };

  if (nextBtn) nextBtn.addEventListener("click", goNext);
  if (prevBtn) prevBtn.addEventListener("click", goPrev);

  const start = () => {
    if (timer || slides.length <= 1) return;
    timer = setInterval(goNext, interval);
  };

  const stop = () => {
    if (!timer) return;
    clearInterval(timer);
    timer = null;
  };

  carousel.addEventListener("mouseenter", stop);
  carousel.addEventListener("mouseleave", start);
  window.addEventListener("resize", update);
  if (track) {
    track.addEventListener("transitionend", () => {
      if (index >= maxIndex) {
        track.style.transition = "none";
        index = 0;
        const gapValue = parseFloat(getComputedStyle(track).gap || "0");
        const slideWidth = slides[0] ? slides[0].getBoundingClientRect().width : 0;
        track.style.transform = `translateX(0px)`;
        void track.offsetHeight;
        track.style.transition = "transform 0.5s ease";
      }
    });
  }

  update();
  start();
}

const compare = document.querySelector("[data-compare]");
if (compare) {
  const range = compare.querySelector(".ba-compare__range");
  let introAnimation = null;
  const updatePos = (value) => {
    compare.style.setProperty("--pos", `${value}%`);
  };

  if (range) {
    updatePos(range.value || 55);
    range.addEventListener("input", (event) => {
      updatePos(event.target.value);
    });
  }

  let dragging = false;
  const setFromEvent = (event) => {
    const rect = compare.getBoundingClientRect();
    const x = Math.min(Math.max(event.clientX - rect.left, 0), rect.width);
    const percent = Math.round((x / rect.width) * 100);
    updatePos(percent);
    if (range) range.value = percent;
  };

  const cancelIntro = () => {
    if (!introAnimation) return;
    cancelAnimationFrame(introAnimation);
    introAnimation = null;
  };

  compare.addEventListener("pointerdown", (event) => {
    cancelIntro();
    dragging = true;
    compare.setPointerCapture(event.pointerId);
    setFromEvent(event);
  });

  compare.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    setFromEvent(event);
  });

  compare.addEventListener("pointerup", () => {
    dragging = false;
  });

  compare.addEventListener("pointerleave", () => {
    dragging = false;
  });

  const startIntro = () => {
    if (introAnimation) return;
    const start = performance.now();
    const duration = 1800;
    const sweep = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 0.5 - Math.cos(t * Math.PI * 2) / 2;
      const pos = 35 + ease * 30;
      updatePos(Math.round(pos));
      if (range) range.value = Math.round(pos);
      if (t < 1) {
        introAnimation = requestAnimationFrame(sweep);
      } else {
        introAnimation = null;
        updatePos(55);
        if (range) range.value = 55;
      }
    };
    introAnimation = requestAnimationFrame(sweep);
  };

  startIntro();
}

