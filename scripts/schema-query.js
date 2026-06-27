const { Client } = require('pg');
require('dotenv').config();

const password = encodeURIComponent(process.env.SUPABASE_DB_PASSWORD);
const connectionString = `postgresql://postgres:${password}@db.jwuvpcfmyixoohltjwps.supabase.co:5432/postgres`;

async function run() {
  const client = new Client({ connectionString });
  await client.connect();
  const res = await client.query(`
    SELECT table_name, column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name IN ('students', 'classes', 'enrollments', 'attendance', 'finances', 'payments', 'academic_records', 'complaints')
  `);
  console.log(JSON.stringify(res.rows, null, 2));
  await client.end();
}
run();
