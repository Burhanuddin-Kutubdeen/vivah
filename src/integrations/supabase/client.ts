// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qvoulnpgfkvzgsgavmho.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2b3VsbnBnZmt2emdzZ2F2bWhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwMTY5MjAsImV4cCI6MjA1NzU5MjkyMH0.vFYGv68GaP4i-fv1jLGrpC6hAs49FBDH93E3L4Dpjuo";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);