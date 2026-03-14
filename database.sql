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

-- ==========================================
-- PHASE 8: NEW FEATURES (COMMENTS & DAILY TASKS)
-- ==========================================

-- Create the comments table
CREATE TABLE public.comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    airdrop_id UUID REFERENCES public.airdrops(id) ON DELETE CASCADE,
    username TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read and create comments (Anonymous discussion board)
CREATE POLICY "Allow public read access on comments" ON public.comments
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow public insert on comments" ON public.comments
    FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on comments" ON public.comments
    FOR DELETE TO authenticated USING (true);


-- Create the daily_tasks table (Admin sets the tasks)
CREATE TABLE public.daily_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    reward_desc TEXT,
    link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.daily_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on daily_tasks" ON public.daily_tasks
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated insert on daily_tasks" ON public.daily_tasks
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update on daily_tasks" ON public.daily_tasks
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated delete on daily_tasks" ON public.daily_tasks
    FOR DELETE TO authenticated USING (true);

-- Insert dummy daily tasks
INSERT INTO public.daily_tasks (title, reward_desc, link)
VALUES 
    ('Claim Daily Faucet Sepolia', '0.5 Sepolia ETH', 'https://sepoliafaucet.com/'),
    ('Checkin Web3 Game', '10 EXP', 'https://examplegame.com');

-- ==========================================
-- PHASE 9: ADVANCED METADATA & GLOBAL SETTINGS
-- ==========================================

-- 1. Add new columns to existing airdrops table
ALTER TABLE public.airdrops 
ADD COLUMN IF NOT EXISTS network TEXT DEFAULT 'TBA',
ADD COLUMN IF NOT EXISTS funded TEXT DEFAULT 'TBA',
ADD COLUMN IF NOT EXISTS supply TEXT DEFAULT 'TBA';

-- 2. Create Global Settings table
CREATE TABLE public.global_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    telegram_link TEXT DEFAULT 'https://t.me/',
    community_count TEXT DEFAULT '1,200',
    twitter_link TEXT DEFAULT 'https://twitter.com/',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.global_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on global_settings" ON public.global_settings
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated full access on global_settings" ON public.global_settings
    FOR ALL TO authenticated USING (true);

-- Insert default settings row
INSERT INTO public.global_settings (telegram_link, community_count, twitter_link)
VALUES ('https://t.me/your_telegram_group', '10,500', 'https://twitter.com/your_twitter');

