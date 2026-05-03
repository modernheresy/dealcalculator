// --- Helpers ---
function getValue(id) {
  const val = parseFloat(document.getElementById(id).value);
  return isNaN(val) ? 0 : val;
}

function fmt(n, prefix = "£") {
  const abs = Math.abs(Math.round(n));
  const sign = n < 0 ? "−" : "+";
  return `${sign}${prefix}${abs.toLocaleString("en-GB")}`;
}

// --- Core calculation ---
function calculate() {
  const price   = getValue("price");
  const deposit = getValue("deposit") / 100;
  const rate    = getValue("rate") / 100;
  const term    = getValue("term");
  const type    = document.getElementById("type").value;
  const rent    = getValue("rent");
  const costs   = getValue("costs");

  if (price <= 0 || rent <= 0) {
    renderEmpty();
    return;
  }

  const loan = price * (1 - deposit);
  const depositAmount = price * deposit;
  let mortgage = 0;

  if (type === "interest") {
    mortgage = (loan * rate) / 12;
  } else {
    const months = Math.max(term, 1) * 12;
    const monthlyRate = rate / 12;
    if (monthlyRate === 0) {
      mortgage = loan / months;
    } else {
      mortgage =
        (loan * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);
    }
  }

  const cashflow = rent - mortgage - costs;
  const annual   = cashflow * 12;
  const yieldVal = (rent * 12) / price;
  const roi      = depositAmount > 0 ? annual / depositAmount : 0;

  let cls = "";
  let verdict = "";

  if (cashflow > 100) {
    cls = "good";
    verdict = "Good deal";
  } else if (cashflow >= 0) {
    cls = "warn";
    verdict = "Borderline";
  } else {
    cls = "bad";
    verdict = "Loss making";
  }

  renderResult({ cashflow, annual, yieldVal, roi, mortgage, cls, verdict });
}

// --- Render ---
function renderResult({ cashflow, annual, yieldVal, roi, mortgage, cls, verdict }) {
  const result = document.getElementById("result");

  // Card border colour
  result.className = `result-card ${cls}`;

  // Cashflow number
  const cfEl = document.getElementById("cashflow");
  cfEl.textContent = `${cashflow < 0 ? "−" : "+"}£${Math.abs(Math.round(cashflow)).toLocaleString("en-GB")}`;
  cfEl.className = `cashflow-number ${cls}`;

  // Label
  document.getElementById("label").textContent = "Monthly cashflow";

  // Badge
  const badge = document.getElementById("badge");
  badge.textContent = verdict;
  badge.className = `verdict-badge ${cls}`;

  // Stats
  document.getElementById("annual").textContent =
    `${annual < 0 ? "−" : "+"}£${Math.abs(Math.round(annual)).toLocaleString("en-GB")}`;

  document.getElementById("yield-val").textContent =
    `${(yieldVal * 100).toFixed(2)}%`;

  document.getElementById("roi").textContent =
    `${(roi * 100).toFixed(1)}%`;

  document.getElementById("mortgage-val").textContent =
    `£${Math.round(mortgage).toLocaleString("en-GB")}`;
}

function renderEmpty() {
  const result = document.getElementById("result");
  result.className = "result-card";

  document.getElementById("cashflow").textContent = "—";
  document.getElementById("cashflow").className = "cashflow-number";
  document.getElementById("label").textContent = "Enter numbers above";
  document.getElementById("badge").className = "verdict-badge";
  document.getElementById("badge").textContent = "";
  document.getElementById("annual").textContent = "—";
  document.getElementById("yield-val").textContent = "—";
  document.getElementById("roi").textContent = "—";
  document.getElementById("mortgage-val").textContent = "—";
}

// --- Init ---
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("input, select").forEach((el) => {
    el.addEventListener("input", calculate);
  });
  calculate();
});
