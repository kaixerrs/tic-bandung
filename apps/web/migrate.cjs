require("dotenv").config({ path: ".env.local" });
const { Client } = require("pg");

async function migrate() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  
  await client.connect();
  console.log("Connected to DB.");

  const queries = [
    `ALTER TABLE destinations 
     ADD COLUMN IF NOT EXISTS name_en VARCHAR(255),
     ADD COLUMN IF NOT EXISTS description_en TEXT,
     ADD COLUMN IF NOT EXISTS price_info_en VARCHAR(255),
     ADD COLUMN IF NOT EXISTS content_en TEXT;`,
     
    `ALTER TABLE news_articles 
     ADD COLUMN IF NOT EXISTS title_en VARCHAR(255),
     ADD COLUMN IF NOT EXISTS content_en TEXT;`,
     
    `ALTER TABLE hero_sliders 
     ADD COLUMN IF NOT EXISTS title_en VARCHAR(255),
     ADD COLUMN IF NOT EXISTS subtitle_en TEXT;`,
     
    `ALTER TABLE galleries 
     ADD COLUMN IF NOT EXISTS title_en VARCHAR(255),
     ADD COLUMN IF NOT EXISTS description_en TEXT;`,
     
    `ALTER TABLE categories 
     ADD COLUMN IF NOT EXISTS name_en VARCHAR(255),
     ADD COLUMN IF NOT EXISTS description_en TEXT;`,
     
    `ALTER TABLE events 
     ADD COLUMN IF NOT EXISTS title_en VARCHAR(255),
     ADD COLUMN IF NOT EXISTS description_en TEXT;`
  ];

  for (let q of queries) {
    try {
      await client.query(q);
      console.log("Executed: ", q.substring(0, 50).trim() + "...");
    } catch (e) {
      console.error("Error executing query:", e.message);
    }
  }

  // Best effort to auto-populate some EN data just so it doesn't break front-end
  try {
    await client.query(`UPDATE news_articles SET title_en = title || ' (EN)', content_en = content WHERE title_en IS NULL;`);
    await client.query(`UPDATE destinations SET name_en = name, description_en = description WHERE name_en IS NULL;`);
    await client.query(`UPDATE hero_sliders SET title_en = title, subtitle_en = subtitle WHERE title_en IS NULL;`);
  } catch (e) {
    console.error("Error updating defaults:", e.message);
  }

  await client.end();
  console.log("Migration complete.");
}

migrate();
