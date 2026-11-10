"use strict";

// A static site: no build step and no third-party JavaScript.
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#navigation");
function closeMenu() {
  navigation.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
}
menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Open navigation",
  );
  navigation.classList.toggle("is-open", isOpen);
});
navigation
  .querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    menuToggle.getAttribute("aria-expanded") === "true"
  ) {
    closeMenu();
    menuToggle.focus();
  }
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) closeMenu();
});
window.matchMedia("(min-width: 561px)").addEventListener("change", closeMenu);

const themeToggle = document.querySelector(".theme-toggle");
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute(
    "aria-label",
    `Switch to ${theme === "dark" ? "light" : "dark"} theme`,
  );
  document.querySelector('meta[name="theme-color"]').content =
    theme === "dark" ? "#101311" : "#f4f5ef";
}
let savedTheme;
try {
  savedTheme = localStorage.getItem("amir-portfolio-theme");
} catch {
  /* Storage is optional. */
}
applyTheme(savedTheme === "light" ? "light" : "dark");
themeToggle.addEventListener("click", () => {
  const theme =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(theme);
  try {
    localStorage.setItem("amir-portfolio-theme", theme);
  } catch {
    /* Storage may be disabled. */
  }
});

const systemModes = {
  embedded: {
    title: "EMBEDDED",
    input: "Sensors",
    process: "Embedded C",
    connect: "Device I/O",
    output: "Control",
    description: "From sensor input to purposeful device control.",
  },
  edge: {
    title: "EDGE AI",
    input: "Camera / Audio",
    process: "AI inference",
    connect: "On-device",
    output: "Recognition",
    description: "Bringing intelligence closer to the device.",
  },
  robotics: {
    title: "ROBOTICS",
    input: "Perception",
    process: "Decision logic",
    connect: "Controllers",
    output: "Movement",
    description: "Connecting perception, decisions, and physical action.",
  },
};
document.querySelectorAll("[data-system]").forEach((button) => {
  button.addEventListener("click", () => {
    const mode = systemModes[button.dataset.system];
    document.querySelectorAll("[data-system]").forEach((item) => {
      item.classList.toggle("active", item === button);
      item.setAttribute("aria-pressed", String(item === button));
    });
    document.querySelector("#chip-title").textContent = mode.title;
    ["input", "process", "connect", "output", "description"].forEach((key) => {
      document.querySelector(`#system-${key}`).textContent = mode[key];
    });
  });
});

const projects = [...document.querySelectorAll("[data-categories]")];
document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach((item) => {
      item.classList.toggle("active", item === button);
      item.setAttribute("aria-pressed", String(item === button));
    });
    let count = 0;
    projects.forEach((project) => {
      const visible = project.dataset.categories
        .split(" ")
        .includes(button.dataset.filter);
      project.hidden = !visible;
      if (visible) count += 1;
    });
    document.querySelector("#project-count").textContent =
      `${count} ${count === 1 ? "project" : "projects"}`;
  });
});

const skillTabs = [...document.querySelectorAll('[role="tab"]')];
function selectSkillTab(tab) {
  skillTabs.forEach((item) => {
    const selected = item === tab;
    item.setAttribute("aria-selected", String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute("aria-controls")).hidden =
      !selected;
  });
}
skillTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectSkillTab(tab));
  tab.addEventListener("keydown", (event) => {
    let target;
    if (event.key === "ArrowRight")
      target = skillTabs[(index + 1) % skillTabs.length];
    if (event.key === "ArrowLeft")
      target = skillTabs[(index - 1 + skillTabs.length) % skillTabs.length];
    if (event.key === "Home") target = skillTabs[0];
    if (event.key === "End") target = skillTabs[skillTabs.length - 1];
    if (target) {
      event.preventDefault();
      selectSkillTab(target);
      target.focus();
    }
  });
});

document.querySelector("#copy-email").addEventListener("click", async () => {
  const status = document.querySelector("#copy-status");
  try {
    await navigator.clipboard.writeText("sohelamir051@gmail.com");
    status.textContent = "Email address copied.";
  } catch {
    status.textContent =
      "Select the email address above to copy it, or click it to open your email app.";
  }
});
document.querySelector("#year").textContent = new Date().getFullYear();

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navigation.querySelectorAll("a").forEach((link) => {
          const active = link.hash === `#${entry.target.id}`;
          link.classList.toggle("active", active);
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    },
    { rootMargin: "-15% 0px -65% 0px", threshold: 0 },
  );
  document
    .querySelectorAll("main section[id]")
    .forEach((section) => observer.observe(section));
}
