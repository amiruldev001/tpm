const machines = ["Machine A", "Machine B", "Machine C"];

const inspectionItems = [
  "Check Oil Level",
  "Check Temperature",
  "Check Noise",
  "Check Vibration"
];

let selectedDay = null;
let selectedMachine = null;

// Init
window.onload = () => {
  loadMachines();
  generateCalendar();
};

// Machine dropdown
function loadMachines() {
  const select = document.getElementById("machineSelect");

  machines.forEach(machine => {
    let option = document.createElement("option");
    option.value = machine;
    option.textContent = machine;
    select.appendChild(option);
  });

  select.addEventListener("change", (e) => {
    selectedMachine = e.target.value;
  });
}

// Calendar
function generateCalendar() {
  const calendar = document.getElementById("calendar");

  for (let i = 1; i <= 31; i++) {
    let day = document.createElement("div");
    day.className = "day";
    day.textContent = i;

    day.onclick = () => {
      selectedDay = i;
      loadChecklist();
    };

    calendar.appendChild(day);
  }
}

// Checklist UI
function loadChecklist() {
  const container = document.getElementById("checkItems");
  container.innerHTML = "";

  inspectionItems.forEach(item => {
    let div = document.createElement("div");
    div.className = "check-item";

    div.innerHTML = `
      <label>${item}</label>
      <select data-item="${item}">
        <option value="OK">OK</option>
        <option value="NG">NG</option>
      </select>
    `;

    container.appendChild(div);
  });

  loadSavedData();
}

// Save to LocalStorage
function saveChecklist() {
  if (!selectedMachine || !selectedDay) {
    alert("Select machine and day first!");
    return;
  }

  const selects = document.querySelectorAll("#checkItems select");
  let record = {};

  selects.forEach(sel => {
    record[sel.dataset.item] = sel.value;
  });

  let key = `${selectedMachine}-${selectedDay}`;
  localStorage.setItem(key, JSON.stringify(record));

  alert("Saved!");
}

// Load data
function loadSavedData() {
  let key = `${selectedMachine}-${selectedDay}`;
  let saved = localStorage.getItem(key);

  if (!saved) return;

  let data = JSON.parse(saved);
  const selects = document.querySelectorAll("#checkItems select");

  selects.forEach(sel => {
    sel.value = data[sel.dataset.item] || "OK";
  });
}
``
