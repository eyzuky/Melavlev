import { neon } from '@neondatabase/serverless';

let sql;

export default function getDb() {
  if (!sql) {
    sql = neon(process.env.DATABASE_URL);
  }
  return sql;
}
