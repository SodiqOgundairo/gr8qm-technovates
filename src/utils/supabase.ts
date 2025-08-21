import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kvvzzwypcdorrzvdslfl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2dnp6d3lwY2RvcnJ6dmRzbGZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3OTkwMjgsImV4cCI6MjA3MTM3NTAyOH0.JXpsQoXsBoz0lq3JZiEsHlL5jg9EL3aqGUzvamiM_vk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
