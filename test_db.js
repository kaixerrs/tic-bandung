const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ntiouktlfnttwkkoclrr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50aW91a3RsZm50dHdra29jbHJyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjM0NjQ3MiwiZXhwIjoyMTAxOTIyNDcyfQ.eGwp67fohFkVa3hPss7HRn8WBGR1yh62WwhPodhBB_A'
);

async function checkSubmissions() {
  const { data, error } = await supabase
    .from('event_submissions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) {
    console.error('Error fetching submissions:', error);
  } else {
    console.log('Most recent submission:', JSON.stringify(data[0], null, 2));
  }
}

checkSubmissions();
