import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dqxhifnqspzagspycejg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxeGhpZm5xc3B6YWdzcHljZWpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxMDE3MzEsImV4cCI6MjA3NzY3NzczMX0.V9ZFJddp5YxZ0A6BJfv5GVNnn6vRXiVS0qL-IuaJvx8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
