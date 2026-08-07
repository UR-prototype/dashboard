const sections = [...document.querySelectorAll("[data-section]")];
const links = [...document.querySelectorAll("[data-nav]")];
const page = document.querySelector("[data-page]");
const rail = document.querySelector(".rail");
const total = String(sections.length).padStart(2, "0");

function setPage(index) {
  if (page) page.textContent = `${String(index + 1).padStart(2, "0")} / ${total}`;
}

function activateNav(sectionIndex) {
  links.forEach((link) => {
    const target = document.querySelector(link.hash);
    const targetIndex = target ? sections.indexOf(target) : -1;
    link.classList.toggle("active", targetIndex === sectionIndex);
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const index = sections.indexOf(entry.target);
      setPage(index);
      activateNav(index);
    });
  },
  { threshold: 0.4 }
);

sections.forEach((section) => observer.observe(section));
setPage(0);
activateNav(0);

document.querySelector("[data-menu]")?.addEventListener("click", () => rail?.classList.toggle("open"));
links.forEach((link) =>
  link.addEventListener("click", () => {
    rail?.classList.remove("open");
    const target = document.querySelector(link.hash);
    const index = target ? sections.indexOf(target) : -1;
    if (index !== -1) {
      setPage(index);
      activateNav(index);
    }
  })
);

const slider = document.querySelector("[data-slider]");
const before = document.querySelector("[data-before]");
const line = document.querySelector("[data-line]");

function applySlider(value) {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  if (before) before.style.clipPath = `inset(0 ${100 - v}% 0 0)`;
  if (line) line.style.left = `${v}%`;
}

if (slider) {
  applySlider(Number(slider.value) || 50);
  slider.addEventListener("input", (event) => applySlider(Number(event.target.value)));
}
