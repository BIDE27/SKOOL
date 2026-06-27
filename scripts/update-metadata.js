require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const testUsers = [
  { email: 'founder@skool.test', role: 'founder', name: 'Fondé Test' },
  { email: 'director@skool.test', role: 'director', name: 'Directrice Test' },
  { email: 'secretary@skool.test', role: 'secretary', name: 'Secrétaire Test' },
  { email: 'accountant@skool.test', role: 'accountant', name: 'Comptable Test' },
  { email: 'teacher@skool.test', role: 'teacher', name: 'Enseignant Test' },
  { email: 'parent@skool.test', role: 'parent', name: 'Parent Test' },
];

async function updateMetadata() {
  console.log('Updating user metadata...');
  
  const { data: { users }, error: fetchError } = await supabase.auth.admin.listUsers();
  if (fetchError) {
    console.error('Failed to list users:', fetchError);
    return;
  }
  
  for (const user of testUsers) {
    const foundUser = users.find(u => u.email === user.email);
    if (foundUser) {
      const { error } = await supabase.auth.admin.updateUserById(foundUser.id, {
        user_metadata: { role: user.role, full_name: user.name }
      });
      if (error) {
        console.error(`Error updating metadata for ${user.email}:`, error);
      } else {
        console.log(`Updated metadata for ${user.email}`);
      }
    }
  }
  console.log('Done.');
}

updateMetadata();
