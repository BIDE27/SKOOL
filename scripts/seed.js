require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const testUsers = [
  { email: 'founder@skool.test', password: 'password123', role: 'founder', name: 'Fondé Test' },
  { email: 'director@skool.test', password: 'password123', role: 'director', name: 'Directrice Test' },
  { email: 'secretary@skool.test', password: 'password123', role: 'secretary', name: 'Secrétaire Test' },
  { email: 'accountant@skool.test', password: 'password123', role: 'accountant', name: 'Comptable Test' },
  { email: 'teacher@skool.test', password: 'password123', role: 'teacher', name: 'Enseignant Test' },
  { email: 'parent@skool.test', password: 'password123', role: 'parent', name: 'Parent Test' },
];

async function seed() {
  console.log('Starting seed...');
  for (const user of testUsers) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
    });

    if (error) {
      console.error(`Error creating user ${user.email}:`, error.message);
    } else {
      console.log(`Created user ${user.email}`);
      // If the schema is already loaded, we could also insert into the public.users table here,
      // but if there's a trigger on auth.users in the SQL (which we didn't add, we should probably add one,
      // or insert manually).
      const { error: insertError } = await supabase.from('users').insert({
        id: data.user.id,
        role: user.role,
        full_name: user.name,
        email: user.email,
      });
      if (insertError) {
        console.error(`Error inserting into public.users for ${user.email}:`, insertError.message);
      } else {
        console.log(`Added user ${user.email} to public.users table with role ${user.role}`);
      }
    }
  }
  console.log('Seed finished.');
}

seed();
