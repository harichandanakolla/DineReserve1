const steps = document.querySelectorAll(".step");
const stepIndicator = document.getElementById("stepIndicator");
const form = document.getElementById("bookingForm");
const summary = document.getElementById("bookingSummary");
const confirmation = document.getElementById("confirmation");
const menuList = document.getElementById("menuList");

const menuItems = [
  { name: "Paneer Butter Masala", price: 180 },
  { name: "Veg Biryani", price: 150 },
  { name: "Gobi Manchurian", price: 130 },
  { name: "Tandoori Roti", price: 25 },
  { name: "Ice Cream", price: 60 },
];

let currentStep = 1;

function updateStepIndicator(step) {
  stepIndicator.innerText = `Step ${step} of 10`;
}

function nextStep(step) {
  const current = document.getElementById(`step${step}`);
  const next = document.getElementById(`step${step + 1}`);
  if (!validateStep(current)) return;

  current.classList.add("hidden");
  next.classList.remove("hidden");
  currentStep++;
  updateStepIndicator(currentStep);
}

function validateStep(stepElement) {
  const inputs = stepElement.querySelectorAll("input, select");
  for (let input of inputs) {
    if (input.hasAttribute("required") && !input.value) {
      alert("Please fill out this field.");
      return false;
    }
  }
  return true;
}

// Populate menu
function renderMenu() {
  menuItems.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `
      <input type="checkbox" value="${item.name}" data-price="${item.price}" />
      ${item.name} - ₹${item.price}
    `;
    menuList.appendChild(li);
  });
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const city = document.getElementById("city").value;
  const area = document.getElementById("area").value;
  const restaurant = document.getElementById("restaurant").value;
  const diningArea = document.getElementById("diningArea").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const guests = document.getElementById("guests").value;
  const payment = document.querySelector("input[name='payment']:checked").value;

  const selectedMenu = Array.from(menuList.querySelectorAll("input[type='checkbox']:checked"))
    .map(cb => `${cb.value} (₹${cb.dataset.price})`);

  const summaryHTML = `
    <p><strong>City:</strong> ${city}</p>
    <p><strong>Area:</strong> ${area}</p>
    <p><strong>Restaurant:</strong> ${restaurant}</p>
    <p><strong>Dining Area:</strong> ${diningArea}</p>
    <p><strong>Date:</strong> ${date}</p>
    <p><strong>Time:</strong> ${time}</p>
    <p><strong>Guests:</strong> ${guests}</p>
    <p><strong>Menu:</strong> ${selectedMenu.join(", ") || "None"}</p>
    <p><strong>Payment:</strong> ${payment}</p>
  `;

  summary.innerHTML = summaryHTML;
  generatePDF(summaryHTML);

  confirmation.classList.remove("hidden");
  confirmation.innerHTML = `
    <h3>Booking Confirmed!</h3>
    <p>Thank you for booking with us, Harshini! A confirmation email will be sent (mock).</p>
    <button onclick="location.reload()">Book Another</button>
  `;
});

// PDF Generation
function generatePDF(summaryHTML) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text("Restaurant Booking Receipt", 20, 20);

  const lines = summaryHTML.replace(/<\/?[^>]+(>|$)/g, "").split('\n');
  let y = 30;
  lines.forEach(line => {
    doc.text(line.trim(), 20, y);
    y += 10;
  });

  doc.save("booking_receipt.pdf");
}

// Initial setup
renderMenu();
updateStepIndicator(currentStep);