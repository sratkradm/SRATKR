// api/calendar.js
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    // 1. Dapatkan kunci rahsia dari Environment Variables Vercel
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    // 2. Semak jika kunci wujud
    if (!supabaseUrl || !supabaseKey) {
        return res.status(500).json({ 
            error: 'Server Configuration Error: Supabase keys are missing.' 
        });
    }

    // 3. Initialize Supabase Client
    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        // 4. Query Database
        // Kita hanya ambil event yang 'is_published' = true
        // Susun mengikut tarikh mula (Awal -> Akhir)
        const { data, error } = await supabase
            .from('school_events')
            .select('*')
            .eq('is_published', true) 
            .order('start_date', { ascending: true });

        if (error) {
            throw error;
        }

        // 5. Berjaya: Pulangkan data JSON
        return res.status(200).json(data);

    } catch (error) {
        // 6. Gagal: Pulangkan error message
        console.error('Database Error:', error.message);
        return res.status(500).json({ error: error.message });
    }
}
