// admin.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

// Import firebaseConfig from config.js
import { firebaseConfig } from '../config.js';

// Initialize Firebase app and auth
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Get DOM elements
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const messageEl = document.getElementById("message");

document.getElementById("registerBtn").addEventListener("click", () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      messageEl.style.color = "green";
      messageEl.textContent = "Registration successful! You can now log in.";
    })
    .catch((error) => {
      messageEl.style.color = "red";
      messageEl.textContent = `Error: ${error.message}`;
    });
});

document.getElementById("loginBtn").addEventListener("click", () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      messageEl.style.color = "green";
      messageEl.textContent = "Login successful! Redirecting...";
      setTimeout(() => {
        window.location.href = "user-dashboard.html"; // Redirect to admin dashboard page
      }, 1500);
    })
    .catch((error) => {
      messageEl.style.color = "red";
      messageEl.textContent = `Error: ${error.message}`;
    });
});
