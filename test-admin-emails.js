const { createPublicClient } = require('./lib/supabase/public.js');

async function testAdminEmails() {
  console.log('🔍 Testing admin email retrieval...');
  
  try {
    const supabase = createPublicClient();
    
    console.log('📊 Checking admin_profiles table...');
    const { data: adminProfiles, error } = await supabase
      .from('admin_profiles')
      .select('*');
    
    if (error) {
      console.error('❌ Error fetching admin profiles:', error);
      return;
    }
    
    console.log('✅ Admin profiles found:', adminProfiles);
    
    if (adminProfiles && adminProfiles.length > 0) {
      console.log('📧 Admin emails:');
      adminProfiles.forEach(profile => {
        console.log(`  - ${profile.email} (${profile.full_name || 'No name'})`);
      });
    } else {
      console.log('⚠️  No admin profiles found in database');
      console.log('💡 You may need to create an admin profile first');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAdminEmails();
