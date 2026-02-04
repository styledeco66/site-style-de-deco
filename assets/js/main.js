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

const miniSliders = document.querySelectorAll("[data-mini-slider]");
miniSliders.forEach((card) => {
  const track = card.querySelector("[data-mini-track]");
  const slides = track ? Array.from(track.children) : [];
  if (!track || slides.length === 0) return;
  const prevBtn = card.querySelector("[data-mini-prev]");
  const nextBtn = card.querySelector("[data-mini-next]");
  const link = card.dataset.link;
  let index = 0;
  let timer = null;
  const interval = 3500;

  const update = () => {
    track.style.transform = `translateX(-${index * 100}%)`;
  };

  const setIndex = (nextIndex) => {
    index = Math.min(Math.max(nextIndex, 0), slides.length - 1);
    update();
  };

  const goNext = () => {
    index = (index + 1) % slides.length;
    update();
  };

  const goPrev = () => {
    index = (index - 1 + slides.length) % slides.length;
    update();
  };

  const start = () => {
    if (timer || slides.length <= 1) return;
    timer = setInterval(goNext, interval);
  };

  const stop = () => {
    if (!timer) return;
    clearInterval(timer);
    timer = null;
  };

  if (nextBtn) {
    nextBtn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      goNext();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      goPrev();
    });
  }

  card.addEventListener("mouseenter", stop);
  card.addEventListener("mouseleave", start);

  if (link) {
    card.addEventListener("click", (event) => {
      const target = event.target;
      if (target && (target.closest("[data-mini-prev]") || target.closest("[data-mini-next]") || target.closest("a"))) {
        return;
      }
      window.location.href = link;
    });
  }

  const thumbs = card.querySelectorAll("[data-mini-thumb]");
  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      const nextIndex = Number(thumb.dataset.index);
      stop();
      if (!Number.isNaN(nextIndex)) {
        setIndex(nextIndex);
      }
    });
  });

  update();
  start();

  // Zoom behavior removed by request.
});

const videoCards = document.querySelectorAll("[data-video-card]");
if (videoCards.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target.querySelector("video");
        if (!video) return;
        if (entry.isIntersecting) {
          // Try to autoplay with sound; if blocked, fall back to muted autoplay.
          video.muted = false;
          const playPromise = video.play();
          if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(() => {
              video.muted = true;
              video.play().catch(() => {});
            });
          }
        } else {
          video.pause();
        }
      });
    },
    { threshold: 0.5 }
  );

  videoCards.forEach((card) => {
    const video = card.querySelector("video");
    const button = card.querySelector(".video-sound");
    const endButton = card.querySelector(".video-end");
    if (video) {
      video.muted = true;
      observer.observe(card);
    }
    if (button && video) {
      button.addEventListener("click", () => {
        video.muted = !video.muted;
        button.setAttribute("aria-pressed", String(!video.muted));
        button.textContent = video.muted ? "Activer le son" : "Couper le son";
        if (!video.muted) {
          const playPromise = video.play();
          if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(() => {});
          }
        }
      });
    }
    if (video && endButton) {
      endButton.classList.remove("is-visible");
      video.addEventListener("ended", () => {
        endButton.classList.add("is-visible");
      });
      video.addEventListener("play", () => {
        endButton.classList.remove("is-visible");
      });
    }

    if (video && card.dataset.videoLink) {
      video.addEventListener("click", () => {
        window.location.href = card.dataset.videoLink;
      });
    }
  });
}
