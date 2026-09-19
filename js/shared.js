/* =========================================
   STEMBridge Tools — Shared JS
   ========================================= */

// ---- Mobile Nav Toggle ----
document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("navHamburger");
  const mobileNav = document.getElementById("navMobile");

  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", function () {
      mobileNav.classList.toggle("open");
    });
  }

  // Highlight active nav link
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a, .nav-mobile a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPath || (currentPath === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
});

// ---- Utility: Wrap text in result step ----
function buildStep(number, title, content) {
  return `<div class="output-step">
    <div class="step-row">
      <span class="step-number">${number}</span>
      <div class="step-content">
        <div class="step-title">${title}</div>
        <div>${content}</div>
      </div>
    </div>
  </div>`;
}

function buildResult(label) {
  return `<div class="result-badge">✅ ${label}</div>`;
}

function buildError(msg) {
  return `<div class="result-badge error-badge">⚠️ ${msg}</div>`;
}
