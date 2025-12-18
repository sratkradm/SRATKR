document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. FETCH BERITA DARI VERCEL API
    // ==========================================
    async function fetchNews() {
        const newsContainer = document.getElementById('news-container');

        try {
            // Kita panggil API sendiri, bukan Supabase terus
            const response = await fetch('/api/berita');
            
            // Cek status network
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();

            // Jika tiada berita
            if (!data || data.length === 0) {
                newsContainer.innerHTML = `
                    <div class="col-span-3 text-center py-10 bg-white rounded-lg shadow">
                        <p class="text-gray-500">Tiada berita terkini.</p>
                    </div>
                `;
                return;
            }

            // Kosongkan container (buang loading spinner)
            newsContainer.innerHTML = '';

            // Generate HTML untuk setiap berita
            data.forEach(item => {
                const dateObj = new Date(item.date);
                const dateStr = dateObj.toLocaleDateString('ms-MY', {
                    day: 'numeric', month: 'short', year: 'numeric'
                });

                // Gambar default jika tiada
                const imgUrl = item.image_url || 'https://placehold.co/400x250/004D40/FFF?text=Berita+SRA';

                const html = `
                <article class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300">
                    <img src="${imgUrl}" alt="${item.title}" class="w-full h-48 object-cover">
                    <div class="p-6">
                        <span class="text-xs font-bold text-sra-accent uppercase tracking-wider">Terkini</span>
                        <h3 class="text-xl font-bold text-gray-800 mt-2 mb-3 leading-tight">${item.title}</h3>
                        <p class="text-gray-600 text-sm mb-4 line-clamp-3">
                            ${item.content}
                        </p>
                        <div class="flex justify-between items-center text-xs text-gray-400 border-t pt-4">
                            <span><i class="far fa-calendar mr-1"></i> ${dateStr}</span>
                            <a href="#" class="text-sra-primary font-bold hover:underline">Baca Lagi</a>
                        </div>
                    </div>
                </article>
                `;
                newsContainer.innerHTML += html;
            });

        } catch (err) {
            console.error('Ralat mengambil berita:', err);
            newsContainer.innerHTML = `
                <div class="col-span-3 text-center text-red-500 py-10 bg-white rounded border border-red-200">
                    <p class="font-bold">Gagal memuat turun berita.</p>
                    <p class="text-sm">Sila pastikan sambungan internet baik.</p>
                </div>
            `;
        }
    }

    // Jalankan fungsi
    fetchNews();


    // ==========================================
    // 2. UI LOGIC (MENU & SLIDER)
    // ==========================================
    
    // Mobile Menu Toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Announcement Slider
    const announcements = [
        "Pendaftaran Murid Tahun 1 Sesi 2025 Kini Dibuka!",
        "Hari Sukan Sekolah akan diadakan pada 25 Mei 2025.",
        "Sila jelaskan yuran PIBG sebelum akhir bulan ini."
    ];
    
    const sliderElement = document.getElementById('announcement-slider');
    let currentIndex = 0;

    if (sliderElement) {
        sliderElement.innerText = announcements[0];

        setInterval(() => {
            sliderElement.style.opacity = 0; // Fade out
            
            setTimeout(() => {
                currentIndex = (currentIndex + 1) % announcements.length;
                sliderElement.innerText = announcements[currentIndex];
                sliderElement.style.opacity = 1; // Fade in
            }, 500); // Tunggu CSS transition
            
        }, 4000); // Tukar setiap 4 saat
    }
});
