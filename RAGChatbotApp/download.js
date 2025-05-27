// download.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, child } from "firebase/database";
import { firebaseConfig } from "./config";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function downloadPDF(filename) {
  get(child(ref(db), "pdfs/" + filename)).then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const base64 = data.content;
      const pdfBlob = base64ToBlob(base64, "application/pdf");

      const link = document.createElement("a");
      link.href = URL.createObjectURL(pdfBlob);
      link.download = data.name || "downloaded.pdf";
      link.click();
    } else {
      alert("No such file found!");
    }
  });
}

function base64ToBlob(base64, contentType) {
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let i = 0; i < byteCharacters.length; i += 512) {
    const slice = byteCharacters.slice(i, i + 512);
    const byteNumbers = new Array(slice.length);
    for (let j = 0; j < slice.length; j++) {
      byteNumbers[j] = slice.charCodeAt(j);
    }
    byteArrays.push(new Uint8Array(byteNumbers));
  }

  return new Blob(byteArrays, { type: contentType });
}
