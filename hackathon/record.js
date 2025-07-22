let medicines = [];

function addMedicine() {
    const medicineName = document.getElementById('medicine-name').value;
    const medicineDose = document.getElementById('medicine-dose').value;
    const medicineTime = document.getElementById('medicine-time').value;
    const medicineFrequency = parseInt(document.getElementById('medicine-frequency').value, 10);

    const medicine = {
        name: medicineName,
        dose: medicineDose,
        time: medicineTime,
        taken: false,
        frequency: medicineFrequency
    };

    medicines.push(medicine);

    document.getElementById('medicine-name').value = '';
    document.getElementById('medicine-dose').value = '';
    document.getElementById('medicine-time').value = '';

    updateMedicineList();
    saveMedicines();
    setReminders(medicine);
}
function updateMedicineList() {
    const medicinesList = document.getElementById('medicines');
    medicinesList.innerHTML = '';

    medicines.forEach((medicine, index) => {
        const listItem = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = medicine.taken;
        checkbox.addEventListener('change', () => {
            medicine.taken = checkbox.checked;
            saveMedicines();
        });
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => {
            removeMedicine(index);
        });
        listItem.innerHTML = `${medicine.name} - Dose: ${medicine.dose} - Time: ${medicine.time}`;
        listItem.appendChild(checkbox);
        listItem.appendChild(removeButton);
        medicinesList.appendChild(listItem);
    });
}

function setReminders(medicine) {
    const currentTime = new Date();
    const [hours, minutes] = medicine.time.split(':');
    const reminderTime = new Date();
    reminderTime.setHours(hours);
    reminderTime.setMinutes(minutes);
    reminderTime.setSeconds(0);

    if (reminderTime < currentTime) {
        reminderTime.setDate(reminderTime.getDate() + 1);
    }

    for (let i = 0; i < medicine.frequency; i++) {
        const timeDifference = reminderTime - currentTime;

        setTimeout(() => {
            remindToTakeMedicine(medicine);
        }, timeDifference);

        // Increase the reminder time for the next instance
        reminderTime.setHours(reminderTime.getHours() + (24 / medicine.frequency));
    }
}

function remindToTakeMedicine(medicine) {
    if (!medicine.taken) {
        const confirmation = confirm(`Bro What are u doing have yours. ${medicine.name} (${medicine.dose})! Did you take it?`);

        if (confirmation) {
            medicine.taken = true;
        } else {
            medicine.taken = false;
        }


        updateMedicineList();


        saveMedicines();


        if ('Notification' in window && Notification.permission === 'granted') {
            const notification = new Notification(`Take ${medicine.name} (${medicine.dose})`, {
                body: `It's time to take ${medicine.name} (${medicine.dose})!`,
                icon: 'notification-icon.png'
            });
        }
    }


    setReminder(medicine);
}


function removeMedicine(index) {
    medicines.splice(index, 1);


    updateMedicineList();


    saveMedicines();
}


function saveMedicines() {
    localStorage.setItem('medicines', JSON.stringify(medicines));
}


function loadMedicines() {
    const savedMedicines = localStorage.getItem('medicines');
    if (savedMedicines) {
        medicines = JSON.parse(savedMedicines);
        updateMedicineList();
    }
}


loadMedicines();


if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission();
}

