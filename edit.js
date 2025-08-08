// edit.js import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"; import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = { apiKey: "AIzaSyCioXkddP8t8EbR0ayetCcJy9d-RRVPlZE", authDomain: "blognerts.firebaseapp.com", projectId: "blognerts", storageBucket: "blognerts.firebasestorage.app", messagingSenderId: "395665771531", appId: "1:395665771531:web:49a8dbf9379cb2df6d4b0e", measurementId: "G-43CFW5FB41" };

const app = initializeApp(firebaseConfig); const db = getFirestore(app);

const ADMIN_USERNAME = "admin"; const ADMIN_HASHED_PASSWORD = "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92"; // SHA256 dari 123456

const quill = new Quill("#editor-container", { theme: "snow", modules: { toolbar: [ [{ header: [1, 2, false] }], ["bold", "italic", "underline"], [{ color: [] }], [{ align: [] }], ["link", "image"] ] } });

window.login = function login() { const u = document.getElementById("username").value.trim(); const p = document.getElementById("password").value; const hashed = CryptoJS.SHA256(p).toString();

if (u === ADMIN_USERNAME && hashed === ADMIN_HASHED_PASSWORD) { document.getElementById("login-box").style.display = "none"; document.getElementById("editor-section").style.display = "block"; } else { alert("Username atau password salah!"); } };

document.getElementById("saveBtn").onclick = async () => { const title = document.getElementById("titleInput").value.trim(); const content = quill.root.innerHTML;

if (!title || content.trim() === "<p><br></p>") { alert("Judul dan isi artikel tidak boleh kosong!"); return; }

const plainText = quill.getText().slice(0, 60) + "..."; const image = "https://via.placeholder.com/50x50?text=" + encodeURIComponent(title);

try { await addDoc(collection(db, "articles"), { title, content, description: plainText, image, createdAt: Date.now() }); alert("✅ Artikel berhasil disimpan!"); } catch (e) { alert("❌ Gagal menyimpan artikel: " + e.message); } };

document.getElementById("copyBtn").onclick = () => { const tempDiv = document.createElement("div"); tempDiv.innerHTML = quill.root.innerHTML; const txt = tempDiv.innerText; navigator.clipboard.writeText(txt).then(() => alert("Teks berhasil disalin!")); };

document.getElementById("previewBtn").onclick = () => { const box = document.getElementById("livePreview"); if (box.style.display === "block") { box.style.display = "none"; return; } const title = document.getElementById("titleInput").value.trim(); const content = quill.root.innerHTML;

if (!title || content.trim() === "<p><br></p>") { alert("Judul dan isi artikel tidak boleh kosong!"); return; }

box.innerHTML = <h3>${title}</h3>${content}; box.classList.add("ql-editor"); box.style.display = "block"; };

document.getElementById("addLinkBtn").onclick = () => { const url = document.getElementById("customLinkURL").value.trim(); const name = document.getElementById("customLinkText").value.trim();

if (!url || !name) { alert("Isi URL dan Nama Tampilan dulu."); return; }

const range = quill.getSelection(true); quill.insertText(range.index, name, { link: url }); quill.setSelection(range.index + name.length);

document.getElementById("customLinkURL").value = ""; document.getElementById("customLinkText").value = ""; document.getElementById("customLinkForm").style.display = "none"; };

document.getElementById("cancelLinkBtn").onclick = () => { document.getElementById("customLinkForm").style.display = "none"; };

