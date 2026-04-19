/**
 * Migration script — applies schema changes + adds new content keys without
 * clobbering any content edited from the admin UI.
 *
 * Usage:
 *   DATABASE_URL="postgresql://..." node scripts/migrate.js
 *
 * Safe to run multiple times (idempotent).
 */

import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL env var is required');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function alterSchema() {
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS video_url TEXT`;
  console.log('✓ projects.video_url column ensured');

  // Widen the images.category CHECK constraint to include 'gallery' and 'solution'.
  await sql`ALTER TABLE images DROP CONSTRAINT IF EXISTS images_category_check`;
  await sql`
    ALTER TABLE images ADD CONSTRAINT images_category_check
    CHECK (category IN ('project', 'hero', 'general', 'pillar', 'gallery', 'solution'))
  `;
  console.log('✓ images.category constraint updated (now includes gallery, solution)');

  // Login rate-limiting store — feed by api/lib/rateLimit.js
  await sql`
    CREATE TABLE IF NOT EXISTS login_attempts (
      id SERIAL PRIMARY KEY,
      ip_hash TEXT NOT NULL,
      attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      success BOOLEAN NOT NULL DEFAULT FALSE
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_login_attempts_ip_time ON login_attempts (ip_hash, attempted_at)`;
  console.log('✓ login_attempts table ensured');
}

async function seedNewContent() {
  // Only new keys — uses DO NOTHING to preserve any edits the client has made.
  const newEntries = {
    nav: {
      nav_home:     ['בית', 'Home'],
      nav_about:    ['מי אנחנו', 'About Us'],
      nav_model:    ['המודל שלנו', 'Our Model'],
      nav_solutions:['פתרונות', 'Solutions'],
      nav_projects: ['פרויקטים', 'Projects'],
      nav_gallery:  ['גלריה', 'Gallery'],
      nav_contact:  ['צור קשר', 'Contact Us'],
      nav_cta:      ['הקימו מרכז', 'Partner With Us'],
    },
    about: {
      page_label: ['מי אנחנו', 'About Us'],
      page_title: ['הסיפור שלנו', 'Our Story'],
      about_p1: [
        'מלבלב הוא ארגון חברתי שמקים מרכזי טבע קהילתיים ברחבי ישראל. אנחנו מאמינים שחיבור לטבע, לאדמה ולקהילה הוא מרכיב חיוני לחוסן אישי וקולקטיבי.',
        'Melavlev is a social organization that establishes community nature centers across Israel. We believe that connection to nature, the land, and the community is a vital component of personal and collective resilience.',
      ],
      about_p2: [
        'הצוות שלנו כולל אדריכלים, מתכננים, מנחי קבוצות ואנשי חינוך סביבתי, שכולם חולקים חזון אחד: ליצור מרחבים שמצמיחים קשרים.',
        'Our team includes architects, planners, group facilitators, and environmental educators — all sharing one vision: to create spaces that grow connections.',
      ],
      about_p3: [
        'כל פרויקט מתחיל בהקשבה לקהילה, נמשך בהקמה משותפת, וממשיך בליווי ארוך-טווח. אנחנו לא עוזבים כשהשתילים באדמה.',
        "Every project starts by listening to the community, continues through joint construction, and is followed by long-term support. We don't leave when the saplings are in the ground.",
      ],
      cta_title: ['רוצים להכיר אותנו?', 'Want to get to know us?'],
      cta_text: [
        'נשמח לשיחה — כדי להבין איך הטבע והקהילה יכולים לצמוח אצלכם.',
        "We'd love to chat — to understand how nature and community can grow in your area.",
      ],
    },
    gallery: {
      page_label: ['גלריה', 'Gallery'],
      page_title: ['רגעים מהשטח', 'Moments from the Field'],
      page_subtitle: [
        'אוסף תמונות ממרכזי הטבע והקהילות שאנחנו מלווים.',
        'A collection of images from the nature centers and communities we accompany.',
      ],
    },
  };

  for (const [tab, entries] of Object.entries(newEntries)) {
    for (const [key, [he, en]] of Object.entries(entries)) {
      await sql`
        INSERT INTO content (tab, key, value_he, value_en)
        VALUES (${tab}, ${key}, ${he}, ${en})
        ON CONFLICT (tab, key) DO NOTHING
      `;
    }
  }
  console.log('✓ New content keys added (existing edits preserved)');
}

async function main() {
  console.log('Running Melavlev migrations...\n');
  await alterSchema();
  await seedNewContent();
  console.log('\n✓ Migrations done.');
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
