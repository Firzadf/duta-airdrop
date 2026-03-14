-- Copy and Paste this entire script into your Supabase SQL Editor and click "Run"

-- Create the airdrops table
CREATE TABLE public.airdrops (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tutorial_steps TEXT[] NOT NULL DEFAULT '{}',
    referral_link TEXT,
    banner_image_url TEXT,
    logo_image_url TEXT,
    status TEXT NOT NULL DEFAULT 'Active',
    cost_type TEXT NOT NULL DEFAULT 'Free'
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.airdrops ENABLE ROW LEVEL SECURITY;

-- Create policies so anyone can READ the airdrops, but only authenticated users can insert/update/delete
CREATE POLICY "Allow public read access" ON public.airdrops
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated insert" ON public.airdrops
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON public.airdrops
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated delete" ON public.airdrops
    FOR DELETE TO authenticated USING (true);


-- OPTIONAL: Insert some dummy data so your website isn't empty on launch
INSERT INTO public.airdrops (title, description, tutorial_steps, referral_link, banner_image_url, logo_image_url, status, cost_type)
VALUES (
    'LunaDrop Finance',
    'Decentralized exchange pertama di jaringan Luna yang membagikan 50% supply tokennya untuk airdrop.',
    ARRAY['Kunjungi link referral di bawah', 'Connect wallet Metamask', 'Follow Twitter & Join Discord', 'Lakukan Bridge 1 kali'],
    'https://lunadrop.finance/ref/1234',
    'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=200&auto=format&fit=crop',
    'Active',
    'Free'
);
