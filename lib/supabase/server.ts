import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Cliente Supabase para uso en Server Components y API Routes
export const supabaseServer = createClient(supabaseUrl, supabaseAnonKey);

// Alias 'db' para compatibilidad con algunos archivos existentes
export const db = supabaseServer;
