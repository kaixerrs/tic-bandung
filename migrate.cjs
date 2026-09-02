const { Pool } = require("pg");
require("dotenv").config({ path: "apps/web/.env.local" });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    
    // destinations
    await client.query(`
      ALTER TABLE destinations
      ADD COLUMN IF NOT EXISTS name_en text,
      ADD COLUMN IF NOT EXISTS description_en text,
      ADD COLUMN IF NOT EXISTS price_info_en text,
      ADD COLUMN IF NOT EXISTS content_en text;
    `);

    // news_articles
    await client.query(`
      ALTER TABLE news_articles
      ADD COLUMN IF NOT EXISTS title_en text,
      ADD COLUMN IF NOT EXISTS content_en text;
    `);

    // hero_sliders
    await client.query(`
      ALTER TABLE hero_sliders
      ADD COLUMN IF NOT EXISTS title_en text,
      ADD COLUMN IF NOT EXISTS subtitle_en text;
    `);

    // galleries
    await client.query(`
      ALTER TABLE galleries
      ADD COLUMN IF NOT EXISTS title_en text,
      ADD COLUMN IF NOT EXISTS description_en text;
    `);

    // categories
    await client.query(`
      ALTER TABLE categories
      ADD COLUMN IF NOT EXISTS name_en text,
      ADD COLUMN IF NOT EXISTS description_en text;
    `);

    // events
    await client.query(`
      ALTER TABLE events
      ADD COLUMN IF NOT EXISTS title_en text,
      ADD COLUMN IF NOT EXISTS description_en text,
      ADD COLUMN IF NOT EXISTS location_name_en text;
    `);

    // Update existing rows with current values as a starting point
    await client.query(`UPDATE destinations SET name_en = name, description_en = description, content_en = content WHERE name_en IS NULL;`);
    await client.query(`UPDATE news_articles SET title_en = title, content_en = content WHERE title_en IS NULL;`);
    await client.query(`UPDATE hero_sliders SET title_en = title, subtitle_en = subtitle WHERE title_en IS NULL;`);
    await client.query(`UPDATE galleries SET title_en = title WHERE title_en IS NULL;`);
    await client.query(`UPDATE categories SET name_en = name, description_en = description WHERE name_en IS NULL;`);
    await client.query(`UPDATE events SET title_en = title, description_en = description WHERE title_en IS NULL;`);

    await client.query("COMMIT");
    console.log("Migration successful!");
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("Migration failed:", e);
  } finally {
    client.release();
    pool.end();
  }
}

migrate();
