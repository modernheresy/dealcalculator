function calculate() {
  const price = parseFloat(document.getElementById("price").value);
  const deposit = parseFloat(document.getElementById("deposit").value) / 100;
  const rate = parseFloat(document.getElementById("rate").value) / 100;
  const type = document.getElementById("type").value;
  const rent = parseFloat(document.getElementById("rent").value);
  const costs = parseFloat(document.getElementById("costs").value);

  if (!price || !rent) {
    alert("Please enter price and rent");
    return;
  }

  const loan = price * (1 - deposit);

  let mortgage = 0;

  if (type === "interest") {
    mortgage = (loan * rate) / 12;
  } else {
    // simple approximation for V1 (good enough for validation)
    const months = 30 * 12;
    const monthlyRate = rate / 12;
    mortgage = loan * (monthlyRate * Math.pow(1 + monthlyRate, months)) /
               (Math.pow(1 + monthlyRate, months) - 1);
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
    label = "Bad deal";
    cls = "bad";
  }

  const result = document.getElementById("result");

  result.classList.remove("hidden");

  result.innerHTML = `
    <h2 class="${cls}">${cashflow > 0 ? "+" : ""}£${cashflow.toFixed(0)}/month</h2>
    <p>${label}</p>
    <hr/>
    <p>Annual: £${annual.toFixed(0)}</p>
    <p>Yield: ${yieldVal.toFixed(2)}%</p>
  `;
}
