const { Client } = require('pg');
require('dotenv').config();

const password = encodeURIComponent(process.env.SUPABASE_DB_PASSWORD);
const connectionString = `postgresql://postgres:${password}@db.jwuvpcfmyixoohltjwps.supabase.co:5432/postgres`;

async function addPolicies() {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log('Connected to Postgres');

    const queries = [
      `ALTER TABLE users ENABLE ROW LEVEL SECURITY;`,
      `DROP POLICY IF EXISTS "Auth users can read all users" ON users;`,
      `CREATE POLICY "Auth users can read all users" ON users FOR SELECT USING (auth.role() = 'authenticated');`,
      
      `ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;`,
      `DROP POLICY IF EXISTS "Auth users can read complaints" ON complaints;`,
      `CREATE POLICY "Auth users can read complaints" ON complaints FOR SELECT USING (auth.role() = 'authenticated');`,
      `DROP POLICY IF EXISTS "Auth users can insert complaints" ON complaints;`,
      `CREATE POLICY "Auth users can insert complaints" ON complaints FOR INSERT WITH CHECK (auth.role() = 'authenticated');`,

      `ALTER TABLE payments ENABLE ROW LEVEL SECURITY;`,
      `DROP POLICY IF EXISTS "Auth users can read payments" ON payments;`,
      `CREATE POLICY "Auth users can read payments" ON payments FOR SELECT USING (auth.role() = 'authenticated');`,
      `DROP POLICY IF EXISTS "Auth users can insert payments" ON payments;`,
      `CREATE POLICY "Auth users can insert payments" ON payments FOR INSERT WITH CHECK (auth.role() = 'authenticated');`,
      
      `ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;`,
      `DROP POLICY IF EXISTS "Auth users can insert attendance" ON attendance;`,
      `CREATE POLICY "Auth users can insert attendance" ON attendance FOR INSERT WITH CHECK (auth.role() = 'authenticated');`,
      `DROP POLICY IF EXISTS "Auth users can read attendance" ON attendance;`,
      `CREATE POLICY "Auth users can read attendance" ON attendance FOR SELECT USING (auth.role() = 'authenticated');`
    ];

    for (let query of queries) {
      await client.query(query);
      console.log('Executed:', query.split('ON ')[0]); // Log safely
    }

    console.log('Successfully updated RLS policies.');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

addPolicies();
