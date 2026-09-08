const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const dropdowns = document.querySelectorAll(".nav-dropdown");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    document.body.classList.toggle("nav-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

dropdowns.forEach((dropdown) => {
  const trigger = dropdown.querySelector("button");

  trigger?.addEventListener("click", () => {
    const willOpen = !dropdown.classList.contains("open");
    dropdowns.forEach((item) => {
      item.classList.remove("open");
      item.querySelector("button")?.setAttribute("aria-expanded", "false");
    });
    dropdown.classList.toggle("open", willOpen);
    trigger.setAttribute("aria-expanded", String(willOpen));
  });
});

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }

  if (!target.closest(".nav-dropdown")) {
    dropdowns.forEach((dropdown) => {
      dropdown.classList.remove("open");
      dropdown.querySelector("button")?.setAttribute("aria-expanded", "false");
    });
  }
});

document.querySelectorAll(".site-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    siteNav?.classList.remove("open");
    document.body.classList.remove("nav-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});
