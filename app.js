// --- Helpers ---
function getValue(id) {
  const val = parseFloat(document.getElementById(id).value);
  return isNaN(val) ? 0 : val;
}

// --- Core calculation ---
function calculate() {
  const price = getValue("price");
  const deposit = getValue("deposit") / 100;
  const rate = getValue("rate") / 100;
  const type = document.getElementById("type").value;
  const rent = getValue("rent");
  const costs = getValue("costs");

  // Prevent nonsense output if key fields missing
  if (price <= 0 || rent <= 0) {
    renderEmpty();
    return;
  }

  const loan = price * (1 - deposit);

  let mortgage = 0;

  if (type === "interest") {
    mortgage = (loan * rate) / 12;
  } else {
    // Standard repayment formula
    const months = 30 * 12;
    const monthlyRate = rate / 12;

    if (monthlyRate === 0) {
      mortgage = loan / months;
    } else {
      mortgage =
        (loan *
          monthlyRate *
          Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);
    }
  }

  const cashflow = rent - mortgage - costs;
  const annual = cashflow * 12;
  const yieldVal = (rent * 12) / price;

  let label = "";
  let cls = "";

  if (cashflow > 100) {
    label = "Good deal";
    cls = "good";
  } else if (cashflow > 0) {
    label = "Borderline";
    cls = "";
  } else {
    label = "Losing money";
    cls = "bad";
  }

  renderResult(cashflow, annual, yieldVal, label, cls);
}

// --- Render functions ---
function renderResult(cashflow, annual, yieldVal, label, cls) {
  const result = document.getElementById("result");

  result.classList.remove("hidden");

  document.getElementById("cashflow").textContent =
    `${cashflow > 0 ? "+" : ""}£${cashflow.toFixed(0)}/month`;

  document.getElementById("cashflow").className = cls;

  document.getElementById("label").textContent = label;

  document.getElementById("annual").textContent =
    `£${annual.toFixed(0)}/year`;

  document.getElementById("yield").textContent =
    `${(yieldVal * 100).toFixed(2)}%`;
}

function renderEmpty() {
  document.getElementById("cashflow").textContent = "£0/month";
  document.getElementById("label").textContent = "Enter numbers to begin";
  document.getElementById("annual").textContent = "£0/year";
  document.getElementById("yield").textContent = "0%";
}

// --- Init ---
document.addEventListener("DOMContentLoaded", () => {
  // Attach live calculation
  document.querySelectorAll("input, select").forEach((el) => {
    el.addEventListener("input", calculate);
  });

  // Run once on load (uses default values)
  calculate();
});
