// Variable Global untuk simpan data berita
let allNewsData = [];

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. FETCH BERITA DARI VERCEL API
    // ==========================================
    async function fetchNews() {
        const newsContainer = document.getElementById('news-container');

        try {
            const response = await fetch('/api/berita');
            
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            
            // SIMPAN DATA KE VARIABLE GLOBAL SUPAYA BOLEH DIBACA OLEH MODAL
            allNewsData = data; 

            if (!data || data.length === 0) {
                newsContainer.innerHTML = `
                    <div class="col-span-3 text-center py-10 bg-white rounded-lg shadow">
                        <p class="text-gray-500">Tiada berita terkini.</p>
                    </div>
                `;
                return;
            }

            newsContainer.innerHTML = '';

            data.forEach(item => {
                const dateObj = new Date(item.date);
                const dateStr = dateObj.toLocaleDateString('ms-MY', {
                    day: 'numeric', month: 'short', year: 'numeric'
                });

                const imgUrl = item.image_url || 'https://placehold.co/400x250/004D40/FFF?text=Berita+SRA';

                // PERUBAHAN DI SINI:
                // Kita tukar <a href> kepada <button onclick="openModal(...)">
                // Kita pass ID berita tersebut ke function openModal
                
                const html = `
                <article class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 flex flex-col h-full">
                    <img src="${imgUrl}" alt="${item.title}" class="w-full h-48 object-cover">
                    <div class="p-6 flex flex-col flex-grow">
                        <span class="text-xs font-bold text-sra-accent uppercase tracking-wider">Terkini</span>
                        <h3 class="text-xl font-bold text-gray-800 mt-2 mb-3 leading-tight">${item.title}</h3>
                        
                        <!-- line-clamp-3 memotong teks panjang untuk preview -->
                        <p class="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                            ${item.content}
                        </p>
                        
                        <div class="flex justify-between items-center text-xs text-gray-400 border-t pt-4 mt-auto">
                            <span><i class="far fa-calendar mr-1"></i> ${dateStr}</span>
                            
                            <!-- BUTANG BACA LAGI -->
                            <button onclick="openModal(${item.id})" class="text-sra-primary font-bold hover:text-sra-accent transition cursor-pointer focus:outline-none">
                                Baca Lagi &rarr;
                            </button>
                        </div>
                    </div>
                </article>
                `;
                newsContainer.innerHTML += html;
            });

        } catch (err) {
            console.error('Ralat:', err);
            newsContainer.innerHTML = `
                <div class="col-span-3 text-center text-red-500 py-4">
                    Gagal memuat turun berita.
                </div>
            `;
        }
    }

    fetchNews();

    // ==========================================
    // 2. UI LOGIC (MENU & SLIDER) - SAMA SEPERTI DULU
    // ==========================================
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    const sliderElement = document.getElementById('announcement-slider');
    const announcements = [
        "Pendaftaran Murid Tahun 1 Sesi 2025 Kini Dibuka!",
        "Hari Sukan Sekolah akan diadakan pada 25 Mei 2025.",
        "Sila jelaskan yuran PIBG sebelum akhir bulan ini."
    ];
    let currentIndex = 0;

    if (sliderElement) {
        sliderElement.innerText = announcements[0];
        setInterval(() => {
            sliderElement.style.opacity = 0;
            setTimeout(() => {
                currentIndex = (currentIndex + 1) % announcements.length;
                sliderElement.innerText = announcements[currentIndex];
                sliderElement.style.opacity = 1;
            }, 500);
        }, 4000);
    }
});

// ==========================================
// 3. FUNGSI MODAL (DILUAR DOMContentLoaded)
// ==========================================
// Kita letak di luar supaya HTML onclick="openModal()" boleh nampak function ini

function openModal(id) {
    // 1. Cari berita berdasarkan ID dari variable global allNewsData
    const newsItem = allNewsData.find(item => item.id == id);
    
    if (!newsItem) return;

    // 2. Isi data ke dalam Modal HTML
    const dateObj = new Date(newsItem.date);
    const dateStr = dateObj.toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' });
    const imgUrl = newsItem.image_url || 'https://placehold.co/600x400/004D40/FFF?text=Berita+SRA';

    document.getElementById('modal-title').innerText = newsItem.title;
    document.getElementById('modal-content').innerText = newsItem.content; // textContent mengekalkan formatting asas
    document.getElementById('modal-date').innerHTML = `<i class="far fa-calendar-alt"></i> ${dateStr}`;
    document.getElementById('modal-image').src = imgUrl;

    // 3. Tunjuk Modal (Buang class hidden)
    const modal = document.getElementById('news-modal');
    modal.classList.remove('hidden');
    
    // Halang body dari scroll masa modal buka
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    // 1. Sorok Modal
    const modal = document.getElementById('news-modal');
    modal.classList.add('hidden');
    
    // 2. Benarkan body scroll semula
    document.body.style.overflow = 'auto';
}
