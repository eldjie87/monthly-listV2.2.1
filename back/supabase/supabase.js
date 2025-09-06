import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://igdtfarocjagurgkuyuy.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlnZHRmYXJvY2phZ3VyZ2t1eXV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNzk2NDIsImV4cCI6MjA3MjY1NTY0Mn0.EwQLApddErqDsd329RCz9JGE_GGlTeNQe9Yah6nvoGI');

export default supabase;