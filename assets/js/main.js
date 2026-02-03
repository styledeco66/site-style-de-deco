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
  const dotsContainer = carousel.querySelector("[data-carousel-dots]");
  const prevBtn = carousel.querySelector("[data-carousel-prev]");
  const nextBtn = carousel.querySelector("[data-carousel-next]");
  let index = 0;
  let timer = null;
  const interval = 6000;

  const update = () => {
    if (!track) return;
    const gapValue = parseFloat(getComputedStyle(track).gap || "0");
    const slideWidth = slides[0] ? slides[0].getBoundingClientRect().width : 0;
    const offset = index * (slideWidth + gapValue);
    track.style.transform = `translateX(-${offset}px)`;
    if (dotsContainer) {
      dotsContainer.querySelectorAll(".carousel-dot").forEach((dot, i) => {
        dot.classList.toggle("is-active", i === index);
      });
    }
  };

  if (dotsContainer) {
    dotsContainer.innerHTML = "";
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel-dot" + (i === 0 ? " is-active" : "");
      dot.setAttribute("aria-label", `Aller à l'avis ${i + 1}`);
      dot.addEventListener("click", () => {
        index = i;
        update();
      });
      dotsContainer.appendChild(dot);
    });
  }

  const goNext = () => {
    index = (index + 1) % slides.length;
    update();
  };

  const goPrev = () => {
    index = (index - 1 + slides.length) % slides.length;
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

  update();
  start();
}




