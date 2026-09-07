// Default initial mock items matching the uploaded sample structure
let meals = JSON.parse(localStorage.getItem('pwa_meals')) || [
    { id: 1, category: 'Breakfast', name: 'Kerabu Sayur', cal: 150 },
    { id: 2, category: 'Breakfast', name: 'Telu Rebus 1Biji', cal: 80 },
    { id: 3, category: 'Breakfast', name: 'Buah pear 1 Biji', cal: 80 },
    { id: 4, category: 'Snack am', name: 'Buah Dragon Fruit 1/2', cal: 70 },
    { id: 5, category: 'Snack am', name: 'Oat Biscuit', cal: 120 },
    { id: 6, category: 'Lunch', name: 'Kerabu Sayur', cal: 150 },
    { id: 7, category: 'Lunch', name: 'Telu Rebus 1Biji', cal: 80 },
    { id: 8, category: 'Snack pm', name: 'Buah pear 1 Biji', cal: 80 },
    { id: 9, category: 'Dinner', name: 'Protein Shake', cal: 127 }
];

const weightInput = document.getElementById('weight');
const heightInput = document.getElementById('height');
const ageInput = document.getElementById('age');
const genderSelect = document.getElementById('gender');
const activitySelect = document.getElementById('activity');

const bmrVal = document.getElementById('bmr-val');
const tdeeVal = document.getElementById('tdee-val');
const intakeVal = document.getElementById('intake-val');
const deficitVal = document.getElementById('deficit-val');
const mealContainer = document.getElementById('meal-container');

// Modal Elements
const modal = document.getElementById('food-modal');
const addItemBtn = document.getElementById('add-item-btn');
const closeModalBtn = document.getElementById('close-modal');
const saveFoodBtn = document.getElementById('save-food');
const foodCategory = document.getElementById('food-category');
const foodName = document.getElementById('food-name');
const foodCal = document.getElementById('food-cal');

function calculate() {
    const w = parseFloat(weightInput.value) || 0;
    const h = parseFloat(heightInput.value) || 0;
    const a = parseFloat(ageInput.value) || 0;
    const gender = genderSelect.value;
    const activityFactor = parseFloat(activitySelect.value);

    // Mifflin-St Jeor Formula
    // Man: (10 x weight) + (6.25 x height) - (5 x age) + 5
    // Woman: (10 x weight) + (6.25 x height) - (5 x age) - 161
    let bmr = (10 * w) + (6.25 * h) - (5 * a);
    if (gender === 'male') {
        bmr += 5;
    } else {
        bmr -= 161;
    }

    const tdee = bmr * activityFactor;
    
    // Total Intake Calculation
    const totalIntake = meals.reduce((sum, item) => sum + item.cal, 0);
    const deficit = tdee - totalIntake;

    // Render UI Stats
    bmrVal.textContent = bmr.toFixed(2);
    tdeeVal.textContent = tdee.toFixed(3);
    intakeVal.textContent = totalIntake;
    deficitVal.textContent = deficit.toFixed(3);

    renderMeals();
    localStorage.setItem('pwa_meals', JSON.stringify(meals));
}

function renderMeals() {
    mealContainer.innerHTML = '';
    const categories = ['Breakfast', 'Snack am', 'Lunch', 'Snack pm', 'Dinner'];

    categories.forEach(cat => {
        const catItems = meals.filter(m => m.category === cat);
        if (catItems.length > 0) {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'meal-group';
            
            let html = `<div class="meal-title">${cat}</div>`;
            catItems.forEach(item => {
                html += `
                    <div class="meal-item">
                        <span>${item.name}</span>
                        <div>
                            <span style="margin-right: 10px; font-weight: 500;">${item.cal} kcal</span>
                            <button onclick="deleteMeal(${item.id})">Padam</button>
                        </div>
                    </div>
                `;
            });
            groupDiv.innerHTML = html;
            mealContainer.appendChild(groupDiv);
        }
    });
}

window.deleteMeal = function(id) {
    meals = meals.filter(m => m.id !== id);
    calculate();
};

// Event Listeners for inputs
[weightInput, heightInput, ageInput, genderSelect, activitySelect].forEach(element => {
    element.addEventListener('input', calculate);
});

// Modal toggles
addItemBtn.addEventListener('click', () => modal.classList.add('active'));
closeModalBtn.addEventListener('click', () => modal.classList.remove('active'));

saveFoodBtn.addEventListener('click', () => {
    const name = foodName.value.trim();
    const cal = parseFloat(foodCal.value);
    const cat = foodCategory.value;

    if (name && !isNaN(cal)) {
        meals.push({ id: Date.now(), category: cat, name, cal });
        foodName.value = '';
        foodCal.value = '';
        modal.classList.remove('active');
        calculate();
    }
});

const resetBtn = document.getElementById('reset-btn');

resetBtn.addEventListener('click', () => {
    weightInput.value = '91.3';
    heightInput.value = '144';
    ageInput.value = '45';
    genderSelect.value = 'female';
    activitySelect.value = '1.375';
    calculate();
});


// Initial run
calculate();
