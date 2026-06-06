const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let pool;

async function initializeDatabase() {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    console.log('Database Connected!');
  } catch (error) {
    console.error('Database connection failed:', error);
    setTimeout(initializeDatabase, 5000);
  }
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Categories API
app.get('/api/categories', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM categories WHERE is_active = 1 ORDER BY sort_order');
    connection.release();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Products API
app.get('/api/products', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const category_id = req.query.category_id;
    let query = 'SELECT * FROM products WHERE is_active = 1';
    const params = [];

    if (category_id) {
      query += ' AND category_id = ?';
      params.push(category_id);
    }

    query += ' ORDER BY created_at DESC';
    const [rows] = await connection.query(query, params);
    connection.release();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Single Product
app.get('/api/products/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    const [images] = await connection.query('SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order', [req.params.id]);
    connection.release();

    if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });

    res.json({ ...rows[0], images });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Customers API
app.post('/api/customers', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)',
      [name, email, phone]
    );
    connection.release();
    res.json({ id: result.insertId, name, email, phone });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Customer Orders
app.get('/api/customers/:id/orders', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [orders] = await connection.query(
      'SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC',
      [req.params.id]
    );
    connection.release();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Orders API
app.post('/api/orders', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const { customer_id, recipient_name, recipient_phone, address_street, address_city,
            address_province, address_postal, card_message, delivery_date, delivery_time,
            subtotal, shipping_cost, discount_amount, total, coupon_code, items } = req.body;

    const order_number = 'ORD-' + Date.now();

    const [orderResult] = await connection.query(
      `INSERT INTO orders
       (order_number, customer_id, recipient_name, recipient_phone, address_street,
        address_city, address_province, address_postal, card_message, delivery_date,
        delivery_time, subtotal, shipping_cost, discount_amount, total, coupon_code, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [order_number, customer_id, recipient_name, recipient_phone, address_street,
       address_city, address_province, address_postal, card_message, delivery_date,
       delivery_time, subtotal, shipping_cost, discount_amount, total, coupon_code]
    );

    const orderId = orderResult.insertId;

    for (let item of items) {
      await connection.query(
        `INSERT INTO order_items
         (order_id, product_id, product_name, price, quantity, subtotal)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, item.product_id, item.product_name, item.price, item.quantity, item.subtotal]
      );
    }

    connection.release();
    res.json({ id: orderId, order_number, message: 'Order created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Order Details
app.get('/api/orders/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [order] = await connection.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    const [items] = await connection.query('SELECT * FROM order_items WHERE order_id = ?', [req.params.id]);
    connection.release();

    if (order.length === 0) return res.status(404).json({ error: 'Order not found' });

    res.json({ ...order[0], items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Coupons API
app.get('/api/coupons/:code', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT * FROM coupons WHERE code = ? AND is_active = 1 AND expired_at > NOW()',
      [req.params.code]
    );
    connection.release();

    if (rows.length === 0) return res.status(404).json({ error: 'Coupon not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;

initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
