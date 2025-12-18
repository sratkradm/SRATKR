import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    // Ambil parameter 'slug' dari URL (cth: ?slug=sejarah)
    const { slug } = req.query;

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return res.status(500).json({ error: 'Server Config Error' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        // Cari data di table 'pages' di mana column 'slug' sama dengan request
        const { data, error } = await supabase
            .from('pages')
            .select('*')
            .eq('slug', slug)
            .single(); // Kita nak satu result sahaja

        if (error) throw error;
        
        // Jika data tak jumpa
        if (!data) return res.status(404).json({ error: 'Halaman tidak dijumpai' });

        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
