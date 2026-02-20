import mysql from 'mysql2/promise';

import { chromium } from "playwright";
//import fetch from 'node-fetch';
//const mysql = require('mysql2/promise');
//const fetch = require('node-fetch');

async function main() {
  // Connect to DB
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

  console.log('Connected to database');

const browser = await chromium.launch({
 // executablePath: "/usr/bin/chromium-browser",   // or /usr/bin/chromium
  headless: true,
  args: [
    "--no-sandbox",
//    "--disable-gpu",
//    "--disable-dev-shm-usage",
   // "--disable-setuid-sandbox",
//    "--disable-software-rasterizer"
  ]
});

const page = await browser.newPage();

await page.goto("https://plants.usda.gov/plant-profile/ABBA", {
  waitUntil: "networkidle"
});

const traits = await page.evaluate(() => {
  const rows = Array.from(document.querySelectorAll("tr"));
  const data = {};
  for (const row of rows) {
    const key = row.querySelector("th")?.innerText;
    const val = row.querySelector("td")?.innerText;
    if (key && val) data[key] = val;
  }
  return data;
});

console.log('Data scarped:', traits);


await browser.close();

//insert into DB
await connection.execute(
	  'INSERT INTO raw_harvest (source, plant_identifier, data_type, raw_json) VALUES (?, ?, ?, ?)',
	  ['usda', 'abbot', 'traits', JSON.stringify(traits)]
);

console.log('Data inserted into database');
// clean up 

await connection.end();
console.log("connection closed");
process.exit(0);
}
main().catch(error => {
  console.error('Error in main function:', error);
  process.exit(1);
});
/**
 * code refrence if above dosnt work
 * 
 * const mysql = require('mysql2/promise');
const fetch = require('node-fetch');

async function main() {
  // Connect to DB
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

  console.log('Connected to database');

  // Fetch one piece of USDA data (adjust your existing code here)
  const response = await fetch('YOUR_USDA_API_URL');
  const data = await response.json();

  // Insert into DB
  await connection.execute(
    'INSERT INTO raw_harvest (source, plant_name, data_type, raw_json) VALUES (?, ?, ?, ?)',
    ['usda', 'tomato', 'test', JSON.stringify(data)]
  );

  console.log('Data inserted');
  
  await connection.end();
  process.exit(0);
}

main().catch(console.error);
 * 
 */