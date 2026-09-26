const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qntijqzzuqxjryxrzwyq.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '...'; // We can get this from .env

const fs = require('fs');
const env = fs.readFileSync('apps/admin/.env.local', 'utf8');
let url = '', key = '';
env.split('\n').forEach(line => {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) url = line.split('=')[1].trim();
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) key = line.split('=')[1].trim();
});

const supabase = createClient(url, key);

async function check() {
    const { data, error } = await supabase.from('site_settings').select('*').limit(1);
    console.log("Error:", error);
    if (data && data.length > 0) {
        console.log("Columns:", Object.keys(data[0]));
    } else {
        console.log("No data returned");
    }
}
check();
