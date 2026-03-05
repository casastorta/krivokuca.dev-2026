// Status punchline rotator
const punchlines = [
  "teaching robots how to tie knots",
  "teaching robots how to pour beer",
  "outrunning the robots",
  "putting robot brains to the cloud",
  "beep-bee-bee-boop-bee-doo-weep",
];
const el = document.getElementById("status-punchline");
const shuffled = [...punchlines].sort(() => Math.random() - 0.5);
let idx = 0;
const TYPE_SPEED = 48; // ms per character
const CYCLE = 6900; // total ms per punchline (type + hold + delete + gap)
const DELETE_GAP = 350; // pause after last word deleted before next starts
const WORD_DELETE = 250; // ms between each word deletion

function type(text, done) {
  let i = 0;
  (function next() {
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(next, TYPE_SPEED);
    } else {
      done();
    }
  })();
}

function cycle() {
  const text = shuffled[idx];
  idx = (idx + 1) % shuffled.length;
  type(text, () => {
    const typed = text.length * TYPE_SPEED;
    const wordCount = text.split(" ").length;
    const deleteTime = wordCount * WORD_DELETE;
    const hold = Math.max(CYCLE - typed - deleteTime - DELETE_GAP, 2000);
    setTimeout(() => {
      // cmd+backspace word by word from the end
      const words = el.textContent.split(" ");
      (function deleteNext() {
        if (words.length > 0) {
          words.pop();
          el.textContent = words.join(" ");
          setTimeout(deleteNext, WORD_DELETE);
        } else {
          setTimeout(cycle, DELETE_GAP);
        }
      })();
    }, hold);
  });
}

cycle();
document.getElementById("footer-punchline").textContent =
  punchlines[Math.floor(Math.random() * punchlines.length)];

// Mobile menu
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const menuOpenIcon = document.getElementById("menu-open-icon");
const menuCloseIcon = document.getElementById("menu-close-icon");

menuToggle.addEventListener("click", () => {
  const isOpen = !mobileMenu.classList.contains("hidden");
  mobileMenu.classList.toggle("hidden");
  menuOpenIcon.classList.toggle("hidden");
  menuCloseIcon.classList.toggle("hidden");
});

function closeMobileMenu() {
  mobileMenu.classList.add("hidden");
  menuOpenIcon.classList.remove("hidden");
  menuCloseIcon.classList.add("hidden");
}

// "Get in touch" — scroll to hero and blink social icons
function highlightSocials() {
  const socialIcons = document.getElementById("social-icons");
  socialIcons.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
  socialIcons.classList.remove("social-blink");
  void socialIcons.offsetWidth; // reflow to restart animation
  socialIcons.classList.add("social-blink");
  setTimeout(() => socialIcons.classList.remove("social-blink"), 1000);
}

// Loading progress bars
const loadingItems = [
  { label: "learning Rust 🦀", pct: 21, color: "#f97316" }, // orange — close but no cigar
  { label: "inbox zero", pct: 3, color: "#0ea5e9" }, // sky
  { label: "finishing side projects", pct: 61, color: "#a78bfa" }, // violet
  { label: "work-life balance", pct: 71, color: "#34d399" }, // emerald
  { label: "understanding monads", pct: 12, color: "#f97316" }, // orange — hopeless
  { label: "yak shaving", pct: 100, color: "#0ea5e9" }, // the one that's done
];

const barsContainer = document.getElementById("loading-bars");
if (barsContainer) {
  loadingItems.forEach(({ label, pct, color }) => {
    const row = document.createElement("div");
    row.innerHTML = `
            <div class="flex justify-between items-baseline mb-1">
                <span style="color:#d6d3d1;font-size:0.75rem;">${label}</span>
                <span style="color:#78716c;font-size:0.7rem;">${pct}%</span>
            </div>
            <div style="height:6px;background:#292524;border-radius:9999px;overflow:hidden;">
                <div class="loading-bar-fill" style="height:100%;width:0%;background:${color};border-radius:9999px;transition:width 1.2s cubic-bezier(0.4,0,0.2,1);opacity:${pct === 100 ? "0.4" : "0.85"};"></div>
            </div>`;
    barsContainer.appendChild(row);
  });

  // Animate in after paint
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      const fills = barsContainer.querySelectorAll(".loading-bar-fill");
      loadingItems.forEach(({ pct }, i) => {
        fills[i].style.width = pct + "%";
      });
    }),
  );

  // Nudge the incomplete bars every ~8s to feel alive
  setInterval(() => {
    const fills = barsContainer.querySelectorAll(".loading-bar-fill");
    loadingItems.forEach(({ pct }, i) => {
      if (pct < 100) {
        const nudge = (Math.random() - 0.5) * 2; // ±1%
        fills[i].style.width = Math.min(99, Math.max(1, pct + nudge)) + "%";
      }
    });
  }, 8000);
}

// Pin robot-bg height to footer height
const robotBg = document.querySelector('img[src="images/robot-bg.svg"]');
const footer = document.getElementById("site-footer");
function syncRobotHeight() {
  robotBg.style.maxHeight = footer.offsetHeight + "px";
}
syncRobotHeight();
new ResizeObserver(syncRobotHeight).observe(footer);
