// api/semua-berita.js
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return res.status(500).json({ error: 'Server Config Error' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        // Query SEMUA berita (tiada .limit(3))
        const { data, error } = await supabase
            .from('news')
            .select('*')
            .order('date', { ascending: false }); // Susun berita baru ke lama

        if (error) throw error;

        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
