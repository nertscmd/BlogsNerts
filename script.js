// ========== ARTIKEL DEFAULT ========== //
const defaultArticles = [
  {
    title: "Script Ling MLBB",
    description: "Script hero Ling.",
    content: "Script untuk hero Ling Mobile Legends yang meningkatkan kecepatan dan damage.",
    image: "https://via.placeholder.com/50x50?text=Ling"
  },
  {
    title: "Script Layla MLBB",
    description: "Script Layla memperluas jarak tembak dan efek visual.",
    content: "Script Layla untuk memperluas jarak serang dan efek visual.",
    image: "https://via.placeholder.com/50x50?text=Layla"
  },
  {
    title: "Script Alucard MLBB",
    description: "Script Alucard menambah efek blink dan lifesteal.",
    content: "Script Alucard menambahkan efek blink dan lifesteal.",
    image: "https://via.placeholder.com/50x50?text=Alucard"
  },
  {
    title: "Script Gusion MLBB",
    description: "Script combo cepat dan cooldown lebih singkat.",
    content: "Script Gusion untuk combo cepat dan cooldown lebih singkat.",
    image: "https://via.placeholder.com/50x50?text=Gusion"
  },
  {
    title: "Script Nana MLBB",
    description: "Script support dan crowd control maksimal.",
    content: "Script Nana untuk mode support dan crowd control maksimal.",
    image: "https://via.placeholder.com/50x50?text=Nana"
  }
];

const userArticles = JSON.parse(localStorage.getItem("customArticles") || "[]");

// ========== FIREBASE ========== //
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCioXkddP8t8EbR0ayetCcJy9d-RRVPlZE",
  authDomain: "blognerts.firebaseapp.com",
  projectId: "blognerts",
  storageBucket: "blognerts.firebasestorage.app",
  messagingSenderId: "395665771531",
  appId: "1:395665771531:web:49a8dbf9379cb2df6d4b0e",
  measurementId: "G-43CFW5FB41"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const snapshot = await getDocs(query(collection(db, "articles"), orderBy("createdAt", "desc")));
const firebaseArticles = snapshot.docs.map(doc => doc.data());

// Gabungkan semua artikel (firebase, user, default)
const articles = [...firebaseArticles, ...userArticles, ...defaultArticles];

// ========== DOM ELEMENT ========== //
const homepage = document.getElementById("homepage");
const articlePage = document.getElementById("articlePage");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const articleContent = document.getElementById("articleContent");

// ========== SEARCH & VIEW ========== //
function normalize(t) {
  return t.toLowerCase().replace(/\s+/g, ' ').trim();
}

function openArticle(title) {
  const found = articles.find(a => a.title === title);
  if (!found) return;
  articleContent.innerHTML = `<h2>${found.title}</h2><p>${found.content}</p>`;
  homepage.classList.add("hidden");
  articlePage.classList.remove("hidden");
  setTimeout(() => articlePage.classList.add("active"), 10);
}

function goHome() {
  articlePage.classList.remove("active");
  setTimeout(() => {
    articlePage.classList.add("hidden");
    homepage.classList.remove("hidden");
    searchInput.value = "";
    searchResults.innerHTML = "";
  }, 300);
}

searchInput.addEventListener("input", () => {
  const kw = normalize(searchInput.value);
  searchResults.innerHTML = "";

  if (!kw) {
    searchInput.classList.remove("error");
    return;
  }

  const matches = articles.filter(a => normalize(a.title).includes(kw)).slice(0, 4);

  if (matches.length === 0) {
    searchResults.innerHTML = "<p>Tidak ada hasil ditemukan.</p>";
    searchInput.classList.add("error");
    return;
  }

  searchInput.classList.remove("error");

  matches.forEach((a, i) => {
    const el = document.createElement("a");
    el.href = "#";
    el.className = "search-item";
    el.style.animationDelay = `${i * 100}ms`;
    el.onclick = () => openArticle(a.title);

    el.innerHTML = `
      <img src="${a.image}">
      <div class="search-text">
        <div class="search-title">${a.title}</div>
        <div class="search-description">${a.description}</div>
      </div>`;

    searchResults.appendChild(el);
    setTimeout(() => el.classList.add("animated"), i * 100 + 400);
  });
});

goHome();

// ========== SIDEBAR & TEMA ========== //
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

menuBtn.addEventListener("click", () => {
  sidebar.classList.add("active");
  overlay.style.display = "block";
});

overlay.addEventListener("click", () => {
  sidebar.classList.remove("active");
  overlay.style.display = "none";
});

// ========== TEMA & FONT ========== //
const themeSelect = document.getElementById("themeSelect");
const savedTheme = localStorage.getItem("theme") || "dark";

if (savedTheme === "light") {
  document.body.classList.add("light-mode");
}
themeSelect.value = savedTheme;

themeSelect.addEventListener("change", () => {
  const selectedTheme = themeSelect.value;
  document.body.classList.toggle("light-mode", selectedTheme === "light");
  localStorage.setItem("theme", selectedTheme);
});

// ========== FONT SIZE ========== //
const fontSizeSelect = document.getElementById("fontSizeSelect");
if (fontSizeSelect) {
  fontSizeSelect.addEventListener("change", () => {
    document.body.style.fontSize =
      fontSizeSelect.value === "large" ? "18px" :
      fontSizeSelect.value === "xlarge" ? "20px" : "16px";
    localStorage.setItem("fontSize", fontSizeSelect.value);
  });

  const savedSize = localStorage.getItem("fontSize");
  if (savedSize) {
    fontSizeSelect.value = savedSize;
    fontSizeSelect.dispatchEvent(new Event("change"));
  }
}