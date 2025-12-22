import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return res.status(500).json({ error: 'Server Config Error' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        // Ambil semua album, susun ikut tarikh terkini
        const { data, error } = await supabase
            .from('gallery_albums')
            .select('*')
            .order('event_date', { ascending: false });

        if (error) throw error;

        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
