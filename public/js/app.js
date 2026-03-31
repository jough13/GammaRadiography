// public/js/app.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// TODO: Replace this with your own Firebase project configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    // Show default module
    showSection('dashboard');
    loadAllData();
});

// Expose showSection globally so inline onclick handlers in HTML continue to work
window.showSection = function(sectionId) {
    // Hide all sections
    document.querySelectorAll('.module').forEach(el => {
        el.classList.remove('active');
        el.style.display = 'none';
    });

    // Show the selected section
    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.add('active');
        target.style.display = 'block';
    }

    // Hide dashboard if showing another section
    if (sectionId !== 'dashboard') {
        const dashboard = document.getElementById('dashboard');
        if(dashboard) dashboard.style.display = 'none';
    } else {
        const dashboard = document.getElementById('dashboard');
        if(dashboard) dashboard.style.display = 'block';
    }
}

// Fetch placeholder data from Firestore
async function loadAllData() {
    await Promise.all([
        fetchData('equipment', 'equipment-list'),
        fetchData('sources', 'sources-list'),
        fetchData('work_plans', 'work-plans-list'),
        fetchData('dosimetry_logs', 'dosimetry-list'),
        fetchData('post_job_reports', 'reports-list')
    ]);
}

async function fetchData(collectionName, listId) {
    const ul = document.getElementById(listId);
    if (!ul) return;

    try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        ul.innerHTML = '';

        if (querySnapshot.empty) {
            ul.innerHTML = `<li>No data found in ${collectionName}.</li>`;
            return;
        }

        querySnapshot.forEach((doc) => {
            const item = doc.data();
            const li = document.createElement('li');

            // Format basic string based on first few keys of object, excluding the ID
            const values = Object.values(item).slice(0, 3).join(' - ');
            li.textContent = `ID ${doc.id}: ${values}`;
            ul.appendChild(li);
        });
    } catch (err) {
        console.error(`Error fetching collection ${collectionName}:`, err);
        ul.innerHTML = `<li style="color:red;">Error loading data or Firestore configured incorrectly.</li>`;
    }
}
