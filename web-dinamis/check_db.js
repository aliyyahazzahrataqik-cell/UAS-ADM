const mysql = require('mysql2/promise');


async function check() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'alyauas046',
    password: 'uas123',
    database: 'dbuas'
  });
  
  const [rows] = await conn.execute(`SELECT p.*, c.name as category_name, 
     (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, sort_order ASC LIMIT 1) as primary_image
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.is_active = 1
     ORDER BY p.created_at DESC`);
  console.log('Query Products:', rows.length);
  if (rows.length > 0) {
    console.log(rows[0]);
  }
  
  process.exit();
}
check().catch(console.error);
