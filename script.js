/* =========================
   DATE HELPERS
========================= */

function today() {
  return new Date().toISOString().split("T")[0];
}

/* =========================
   STORAGE HELPERS
========================= */

function getHistory() {
  return JSON.parse(localStorage.getItem("onlyThreeHistory") || "{}");
}

function saveHistory(history) {
  localStorage.setItem("onlyThreeHistory", JSON.stringify(history));
}

/* =========================
   DAILY RESET
========================= */

function checkNewDay() {
  const last = localStorage.getItem("onlyThreeLastVisit");
  const now = today();

  if (last && last !== now) {
    const yesterdayTasks = localStorage.getItem("onlyThreeCurrent");
    if (yesterdayTasks) {
      const history = getHistory();
      history[last] = JSON.parse(yesterdayTasks);
      saveHistory(history);
    }

    localStorage.removeItem("onlyThreeCurrent");
    localStorage.removeItem("onlyThreeLocked");
  }

  localStorage.setItem("onlyThreeLastVisit", now);
}

/* =========================
   UI RENDERING
========================= */

function renderChosen(tasks) {
  const el = document.getElementById("chosenThree");
  el.innerHTML = "";

  tasks.forEach(task => {
    const div = document.createElement("div");
    div.className = "chosen-task";
    div.textContent = task;
    el.appendChild(div);
  });
}

function renderHistory() {
  const container = document.getElementById("pastDays");
  container.innerHTML = "";

  const history = getHistory();
  const dates = Object.keys(history).sort().reverse();

  dates.forEach(date => {
    const section = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = date;

    section.appendChild(title);

    history[date].forEach(task => {
      const div = document.createElement("div");
      div.className = "chosen-task";
      div.textContent = task;
      section.appendChild(div);
    });

    container.appendChild(section);
  });
}

function lockUI() {
  document.getElementById("generateThree").disabled = true;
  document.getElementById("generateThree").textContent =
    "Today’s focus is set";
  document.getElementById("lockHint").style.display = "block";
}

/* =========================
   APP STARTUP
========================= */

checkNewDay();
renderHistory();

const saved = localStorage.getItem("onlyThreeCurrent");
const locked = localStorage.getItem("onlyThreeLocked");

if (saved && locked) {
  renderChosen(JSON.parse(saved));
  lockUI();
}

/* =========================
   BUTTON ACTION
========================= */

document.getElementById("generateThree").addEventListener("click", () => {
  const input = document.getElementById("brainDump").value.trim();
  if (!input) return;

  const tasks = input
    .split("\n")
    .map(t => t.trim())
    .filter(Boolean);

  const shuffled = [...tasks].sort(() => Math.random() - 0.5);
  const chosen = shuffled.slice(0, 3);

  renderChosen(chosen);

  localStorage.setItem("onlyThreeCurrent", JSON.stringify(chosen));
  localStorage.setItem("onlyThreeLocked", "true");

  lockUI();
});

document.getElementById("upgradeBtn")?.addEventListener("click", () => {
  alert(
    "Only Three Pro is coming soon.\n\nIf this helped you today, you’ll be able to upgrade for $5/month."
  );
});