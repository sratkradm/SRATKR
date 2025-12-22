/**
 * script.js
 * Logik Frontend untuk Laman Web SRA Taman Kajang Raya
 */

// Variable Global untuk simpan data berita (supaya boleh dibaca oleh Modal)
let allNewsData = [];

document.addEventListener('DOMContentLoaded', () => {
    
    // Jalankan fungsi-fungsi utama
    fetchNews();
    initAnnouncementSlider();
    initMobileMenu();

});

// ==========================================
// 1. FUNGSI BERITA TERKINI (DARI API)
// ==========================================
async function fetchNews() {
    const newsContainer = document.getElementById('news-container');

    // Jika container tiada dalam page (contoh: page galeri), jangan buat apa-apa
    if (!newsContainer) return;

    try {
        // Panggil API Vercel
        const response = await fetch('/api/berita');
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        
        // Simpan data ke variable global
        allNewsData = data; 

        // Jika tiada data
        if (!data || data.length === 0) {
            newsContainer.innerHTML = `
                <div class="col-span-3 text-center py-10 bg-white rounded-lg shadow border border-gray-100">
                    <p class="text-gray-500">Tiada berita terkini untuk dipaparkan.</p>
                </div>
            `;
            return;
        }

        // Kosongkan loading spinner
        newsContainer.innerHTML = '';

        // Generate HTML untuk setiap berita
        data.forEach(item => {
            // Format Tarikh (12 Dis 2025)
            const dateObj = new Date(item.date);
            const dateStr = dateObj.toLocaleDateString('ms-MY', {
                day: 'numeric', month: 'short', year: 'numeric'
            });

            // Gambar Fallback jika tiada
            const imgUrl = item.image_url || 'https://placehold.co/400x250/004D40/FFF?text=Berita+Rasmi';

            const html = `
            <article class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 flex flex-col h-full border border-gray-100">
                <img src="${imgUrl}" alt="${item.title}" class="w-full h-48 object-cover">
                <div class="p-6 flex flex-col flex-grow">
                    <span class="text-xs font-bold text-sra-accent uppercase tracking-wider mb-1">Terkini</span>
                    <h3 class="text-xl font-bold text-gray-800 mb-3 leading-tight line-clamp-2">${item.title}</h3>
                    
                    <!-- line-clamp-3: Potong teks jika terlalu panjang -->
                    <p class="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                        ${item.content}
                    </p>
                    
                    <div class="flex justify-between items-center text-xs text-gray-400 border-t pt-4 mt-auto">
                        <span><i class="far fa-calendar mr-1"></i> ${dateStr}</span>
                        
                        <!-- Butang Buka Modal -->
                        <button onclick="openModal(${item.id})" class="text-sra-primary font-bold hover:text-sra-accent transition cursor-pointer focus:outline-none flex items-center">
                            Baca Lagi <i class="fas fa-arrow-right ml-1 text-[10px]"></i>
                        </button>
                    </div>
                </div>
            </article>
            `;
            newsContainer.innerHTML += html;
        });

    } catch (err) {
        console.error('Ralat mengambil berita:', err);
        newsContainer.innerHTML = `
            <div class="col-span-3 text-center text-red-500 py-10 bg-red-50 rounded border border-red-100">
                <p class="font-bold mb-1">Gagal memuat turun berita.</p>
                <p class="text-sm">Sila pastikan sambungan internet anda baik.</p>
            </div>
        `;
    }
}

// ==========================================
// 2. FUNGSI PENGUMUMAN (SLIDER DARI DB)
// ==========================================
async function initAnnouncementSlider() {
    const sliderElement = document.getElementById('announcement-slider');
    
    if (!sliderElement) return;

    let announcements = [];

    try {
        // Tarik data dari API Pengumuman
        const res = await fetch('/api/pengumuman');
        
        if (res.ok) {
            const data = await res.json();
            // Ambil teks sahaja dari object data
            if (data && data.length > 0) {
                announcements = data.map(item => item.text);
            }
        }
    } catch (err) {
        console.error('Gagal tarik pengumuman:', err);
    }

    // Fallback jika DB kosong atau API error
    if (announcements.length === 0) {
        announcements = ["Selamat Datang ke Laman Web Rasmi SRATKR"];
    }

    // Mula Animasi Slider
    let currentIndex = 0;
    
    // Set teks pertama
    sliderElement.innerText = announcements[0];

    // Hanya buat loop jika ada lebih dari 1 pengumuman
    if (announcements.length > 1) {
        setInterval(() => {
            sliderElement.style.opacity = 0; // Fade out
            
            setTimeout(() => {
                currentIndex = (currentIndex + 1) % announcements.length;
                sliderElement.innerText = announcements[currentIndex];
                sliderElement.style.opacity = 1; // Fade in
            }, 500); // Tunggu CSS transition (0.5s)
            
        }, 5000); // Tukar setiap 5 saat
    }
}

// ==========================================
// 3. FUNGSI MOBILE MENU
// ==========================================
function initMobileMenu() {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            
            // Tukar ikon hamburger ke 'X' (Optional UI polish)
            const icon = mobileBtn.querySelector('i');
            if (mobileMenu.classList.contains('hidden')) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            } else {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            }
        });
    }
}

// ==========================================
// 4. FUNGSI MODAL POPUP (GLOBAL SCOPE)
// ==========================================
// Diletakkan di luar DOMContentLoaded supaya boleh dipanggil oleh 'onclick' HTML

function openModal(id) {
    // Cari berita spesifik dalam array global
    const newsItem = allNewsData.find(item => item.id == id);
    
    if (!newsItem) return;

    // Format tarikh
    const dateObj = new Date(newsItem.date);
    const dateStr = dateObj.toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' });
    
    // Gambar default
    const imgUrl = newsItem.image_url || 'https://placehold.co/600x400/004D40/FFF?text=Berita+SRA';

    // Masukkan data ke dalam elemen HTML Modal
    document.getElementById('modal-title').innerText = newsItem.title;
    
    // Gunakan innerText atau textContent untuk keselamatan (elak XSS), 
    // tapi CSS 'whitespace-pre-wrap' akan kekalkan format perenggan.
    document.getElementById('modal-content').innerText = newsItem.content; 
    
    document.getElementById('modal-date').innerHTML = `<i class="far fa-calendar-alt mr-2"></i> ${dateStr}`;
    document.getElementById('modal-image').src = imgUrl;

    // Tunjuk Modal
    const modal = document.getElementById('news-modal');
    modal.classList.remove('hidden');
    
    // Halang body dari scroll
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    // Sorok Modal
    const modal = document.getElementById('news-modal');
    modal.classList.add('hidden');
    
    // Benarkan body scroll semula
    document.body.style.overflow = 'auto';
}

// Tutup modal jika klik di luar kotak (Backdrop click)
window.onclick = function(event) {
    const modal = document.getElementById('news-modal');
    // Cek jika yang diklik adalah background gelap (bukan content modal)
    // Note: Kita ada div backdrop asing sebenarnya, tapi ini extra safety.
    if (event.target == modal) {
        closeModal();
    }
}
