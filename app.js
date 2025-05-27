// app.js

// Import Firebase modules from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import {
  getFirestore, collection, addDoc,
  deleteDoc, doc, onSnapshot, query, where
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import {
  getAuth, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAq8qrXM0lw6c2OyUhV2oMpqpaLq1BA3SA",
  authDomain: "quicknotesapp-8119c.firebaseapp.com",
  projectId: "quicknotesapp-8119c",
  storageBucket: "quicknotesapp-8119c.firebasestorage.app",
  messagingSenderId: "287276885660",
  appId: "1:287276885660:web:0e6d3560a9d989a5a0ef59"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// DOM elements
const noteInput = document.getElementById('noteInput');
const addNoteBtn = document.getElementById('addNoteBtn');
const notesList = document.getElementById('notesList');

const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userInfo = document.getElementById('userInfo');

let currentUser = null;

// Render notes for current user
function renderNotes(notes) {
  notesList.innerHTML = '';
  notes.forEach(note => {
    const li = document.createElement('li');
    li.textContent = note.text;

    // Delete button
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.classList.add('delete-btn');
    delBtn.onclick = async () => {
      await deleteDoc(doc(db, 'notes', note.id));
    };

    li.appendChild(delBtn);
    notesList.appendChild(li);
  });
}

// Load notes for logged in user only
function loadNotes(user) {
  if (!user) {
    notesList.innerHTML = '';
    return;
  }
  const notesCol = collection(db, 'notes');
  // Query notes where userId == current user uid
  const q = query(notesCol, where('userId', '==', user.uid));

  // Listen for realtime updates
  onSnapshot(q, snapshot => {
    const notes = snapshot.docs.map(doc => ({
      id: doc.id,
      text: doc.data().text
    }));
    renderNotes(notes);
  });
}

// Add note
addNoteBtn.addEventListener('click', async () => {
  if (!currentUser) {
    alert('Please log in to add notes.');
    return;
  }
  const text = noteInput.value.trim();
  if (!text) {
    alert('Please enter a note');
    return;
  }
  await addDoc(collection(db, 'notes'), {
    text,
    userId: currentUser.uid,
    createdAt: new Date()
  });
  noteInput.value = '';
});

// Register new user
registerBtn.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  if (!email || !password) {
    alert('Please enter email and password');
    return;
  }
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    alert('Registration error: ' + error.message);
  }
});

// Login existing user
loginBtn.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  if (!email || !password) {
    alert('Please enter email and password');
    return;
  }
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    alert('Login error: ' + error.message);
  }
});

// Logout user
logoutBtn.addEventListener('click', async () => {
  await signOut(auth);
});

// Track auth state changes
onAuthStateChanged(auth, user => {
  currentUser = user;
  if (user) {
    userInfo.textContent = `Logged in as: ${user.email}`;
    loginForm.style.display = 'none';
    noteInput.style.display = 'inline-block';
    addNoteBtn.style.display = 'inline-block';
    logoutBtn.style.display = 'inline-block';
    loadNotes(user);
  } else {
    userInfo.textContent = 'Not logged in';
    loginForm.style.display = 'block';
    noteInput.style.display = 'none';
    addNoteBtn.style.display = 'none';
    logoutBtn.style.display = 'none';
    notesList.innerHTML = '';
  }
});
