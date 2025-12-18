// api/berita.js
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    // 1. Ambil kunci dari Environment Variables Vercel
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    // 2. Jika kunci tiada (Lupa set di Vercel), pulangkan error
    if (!supabaseUrl || !supabaseKey) {
        return res.status(500).json({ 
            error: 'Server Error: Kunci Supabase tidak ditemui di Vercel Environment Variables.' 
        });
    }

    // 3. Setup Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        // 4. Tarik data dari table 'news'
        const { data, error } = await supabase
            .from('news')
            .select('*')
            .order('date', { ascending: false })
            .limit(3);

        if (error) throw error;

        // 5. Berjaya: Hantar data JSON ke frontend
        return res.status(200).json(data);

    } catch (error) {
        // 6. Gagal
        return res.status(500).json({ error: error.message });
    }
}
