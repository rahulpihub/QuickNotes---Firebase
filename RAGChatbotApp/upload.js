// upload.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import { firebaseConfig } from "./config";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function uploadPDF(file) {
  const reader = new FileReader();
  reader.onload = function () {
    const base64Data = reader.result.split(',')[1]; // remove "data:application/pdf;base64,"
    const filename = Date.now() + "_" + file.name;
    set(ref(db, "pdfs/" + filename), {
      content: base64Data,
      name: file.name,
      uploadedAt: new Date().toISOString(),
    }).then(() => {
      alert("Upload successful");
    });
  };
  reader.readAsDataURL(file); // reads file as base64
}

// Usage example:
document.getElementById("pdfInput").addEventListener("change", (e) => {
  uploadPDF(e.target.files[0]);
});
