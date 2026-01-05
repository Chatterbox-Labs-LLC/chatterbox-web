
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function testAdminCreate() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  console.log('Testing admin.createUser...');
  const testEmail = `test-${Date.now()}@example.com`;
  
  const { data, error } = await supabase.auth.admin.createUser({
    email: testEmail,
    password: 'Password123!',
    email_confirm: false,
    user_metadata: {
      first_name: 'Test',
      last_name: 'User'
    }
  });

  if (error) {
    console.error('❌ admin.createUser failed:', error);
  } else {
    console.log('✅ admin.createUser success:', data.user.id);
    
    // Cleanup
    await supabase.auth.admin.deleteUser(data.user.id);
    console.log('✅ test user deleted');
  }
}

testAdminCreate();
