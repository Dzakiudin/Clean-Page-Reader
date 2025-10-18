// File: cleaner.js
// Deskripsi: Script ini adalah inti dari ekstensi.
// Akan diinjeksikan ke halaman web untuk membersihkan dan menampilkan mode baca.

(function() {
    // Mencegah script berjalan dua kali
    if (document.getElementById('clean-reader-view-container')) {
        return;
    }

    /**
     * Mencari elemen konten utama di dalam halaman.
     * Menggunakan beberapa strategi untuk menemukan artikel/berita utama.
     */
    function findMainContent() {
        const candidates = document.querySelectorAll('article, main, #main, #content, .post, .entry-content');
        
        // Jika menemukan kandidat yang jelas, langsung gunakan
        for (let candidate of candidates) {
            if (candidate.textContent.length > 500) { // Cek apakah kontennya cukup panjang
                return candidate;
            }
        }
        
        // Strategi cadangan: cari elemen dengan paragraf terbanyak
        let bestCandidate = null;
        let maxParagraphs = 0;
        const allDivs = document.querySelectorAll('div');

        allDivs.forEach(div => {
            const paragraphs = div.querySelectorAll('p');
            const paragraphCount = paragraphs.length;

            // Memfilter div yang terlalu kecil atau kemungkinan adalah menu/iklan
            if (paragraphCount > maxParagraphs && div.textContent.length > 300) {
                let isLikelyAdOrMenu = /nav|menu|sidebar|comment|ad|footer|header/i.test(div.className) || /nav|menu|sidebar|comment|ad|footer|header/i.test(div.id);
                if (!isLikelyAdOrMenu) {
                    maxParagraphs = paragraphCount;
                    bestCandidate = div;
                }
            }
        });

        return bestCandidate || document.body; // Jika tidak ditemukan, gunakan body sebagai fallback
    }

    /**
     * Menyiapkan dan menampilkan tampilan mode baca yang bersih.
     * @param {HTMLElement} contentElement - Elemen yang berisi konten utama.
     */
    function displayReaderMode(contentElement) {
        if (!contentElement) return;

        const originalContentHTML = contentElement.innerHTML;

        // Kosongkan isi body
        document.body.innerHTML = '';
        
        // CSS untuk mode baca
        const styles = `
            :root {
                --reader-bg: #f9f9f9;
                --reader-text: #212121;
                --reader-body-bg: #e0e0e0;
                --reader-link: #0d47a1;
            }
            body {
                background-color: var(--reader-body-bg) !important;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                margin: 0;
                padding: 0;
            }
            #clean-reader-view-container {
                max-width: 720px;
                margin: 4rem auto;
                padding: 3rem;
                background-color: var(--reader-bg);
                color: var(--reader-text);
                font-size: 1.1em;
                line-height: 1.8;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            #clean-reader-view-container h1, h2, h3 {
                line-height: 1.3;
            }
            #clean-reader-view-container p {
                margin-bottom: 1.2em;
            }
            #clean-reader-view-container a {
                color: var(--reader-link);
                text-decoration: none;
                border-bottom: 1px solid #bbdefb;
            }
            #clean-reader-view-container a:hover {
                color: #1565c0;
            }
            #clean-reader-view-container img, 
            #clean-reader-view-container video, 
            #clean-reader-view-container figure {
                max-width: 100%;
                height: auto;
                margin: 1.5em 0;
                border-radius: 6px;
            }
            .reader-mode-exit-button {
                position: fixed;
                top: 20px;
                right: 20px;
                background-color: var(--reader-bg);
                color: var(--reader-text);
                border: 1px solid #ccc;
                padding: 10px 15px;
                border-radius: 50px;
                cursor: pointer;
                font-weight: bold;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                z-index: 99999;
                transition: background-color 0.2s;
            }
            .reader-mode-exit-button:hover {
                background-color: #f0f0f0;
            }
        `;

        // Buat elemen style dan tambahkan ke head
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);

        // Buat container untuk konten
        const container = document.createElement('div');
        container.id = 'clean-reader-view-container';
        container.innerHTML = originalContentHTML;
        
        // Buat tombol kembali
        const exitButton = document.createElement('button');
        exitButton.innerText = '✕ Kembali ke Halaman Asli';
        exitButton.className = 'reader-mode-exit-button';
        exitButton.onclick = () => {
            window.location.reload();
        };

        // Tambahkan elemen ke body
        document.body.appendChild(container);
        document.body.appendChild(exitButton);
    }
    
    // Jalankan fungsi
    const mainContent = findMainContent();
    if (mainContent) {
        displayReaderMode(mainContent);
    } else {
        alert('Maaf, konten utama tidak dapat ditemukan di halaman ini.');
    }

})();
