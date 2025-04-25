import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
const url = process.env.DATABASE_URL || '';
const anonKey = process.env.DATABASE_ANON_KEY || '';

const supabase = createClient(url, anonKey);
