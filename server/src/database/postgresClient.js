import pg from 'pg';
const { Pool } = pg;

let pool = null;

export function getPostgresPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/scam_db';
    pool = new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === 'production' && !process.env.DISABLE_DB_SSL ? { rejectUnauthorized: false } : false,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 3000,
    });

    pool.on('error', (err) => {
      console.warn('[PostgreSQL Pool Warning]', err.message);
    });
  }
  return pool;
}

export async function checkPostgresConnection() {
  try {
    const client = getPostgresPool();
    const res = await client.query('SELECT NOW() as current_time, current_database() as db_name, version() as version');
    return {
      connected: true,
      time: res.rows[0].current_time,
      database: res.rows[0].db_name,
      version: res.rows[0].version,
      connectionString: (process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/scam_db').replace(/:([^:@]+)@/, ':****@'),
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message,
      connectionString: (process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/scam_db').replace(/:([^:@]+)@/, ':****@'),
      instructions: 'Run `psql -U postgres -f src/db/postgres_schema.sql` on your local terminal to create scam_db.',
    };
  }
}
