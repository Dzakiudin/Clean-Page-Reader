// File: background.js
// Deskripsi: Script ini berjalan di latar belakang, mendengarkan event klik pada ikon ekstensi.

// Listener untuk saat ikon ekstensi di-klik
chrome.action.onClicked.addListener((tab) => {
  // Mengeksekusi content script (cleaner.js) pada tab yang sedang aktif
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['cleaner.js']
  });
});
