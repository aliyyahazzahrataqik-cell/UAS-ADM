-- phpMyAdmin SQL Dump
-- Host: localhost:3306
-- Server version: 8.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
/*!40101 SET NAMES utf8mb4 */;

-- Database: `dbuas`

CREATE TABLE `addresses` (
  `id` int NOT NULL,
  `customer_id` int NOT NULL,
  `label` varchar(50) DEFAULT 'Rumah',
  `recipient` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `street` text NOT NULL,
  `city` varchar(100) NOT NULL,
  `province` varchar(100) NOT NULL,
  `postal_code` varchar(10) NOT NULL,
  `is_default` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `admins` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('super_admin','admin','staff') NOT NULL DEFAULT 'staff',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `admins` (`id`, `name`, `email`, `password`, `role`) VALUES
(1, 'Super Admin', 'admin@florist.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'super_admin');

CREATE TABLE `categories` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `description` text,
  `image_url` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `sort_order` int DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `is_active`, `sort_order`) VALUES
(1, 'Buket Bunga', 'buket-bunga', 'Rangkaian bunga cantik untuk berbagai acara', 1, 1),
(2, 'Bunga Papan', 'bunga-papan', 'Karangan bunga berdiri untuk peresmian & ucapan', 1, 2),
(3, 'Hand Bouquet', 'hand-bouquet', 'Buket elegan untuk wisuda dan pernikahan', 1, 3),
(4, 'Bunga Meja', 'bunga-meja', 'Dekorasi bunga segar untuk meja & ruangan', 1, 4),
(5, 'Hamper Bunga', 'hamper-bunga', 'Paket hamper bunga dan hadiah spesial', 1, 5),
(6, 'Bunga Pernikahan', 'bunga-pernikahan', 'Dekorasi pernikahan & aksesoris pengantin', 1, 6);

CREATE TABLE `coupons` (
  `id` int NOT NULL,
  `code` varchar(50) NOT NULL,
  `type` enum('percent','fixed') NOT NULL,
  `value` decimal(10,2) NOT NULL,
  `min_purchase` decimal(12,2) DEFAULT '0.00',
  `max_discount` decimal(12,2) DEFAULT NULL,
  `usage_limit` int DEFAULT '1',
  `used_count` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `expired_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `coupons` (`id`, `code`, `type`, `value`, `min_purchase`, `usage_limit`, `expired_at`) VALUES
(1, 'WELCOME10', 'percent', 10.00, 100000.00, 100, '2027-12-31 23:59:59'),
(2, 'DISKON50K', 'fixed', 50000.00, 200000.00, 50, '2027-12-31 23:59:59');

CREATE TABLE `customers` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `google_id` varchar(100) DEFAULT NULL,
  `email_verified` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `order_number` varchar(30) NOT NULL,
  `customer_id` int NOT NULL,
  `recipient_name` varchar(100) NOT NULL,
  `recipient_phone` varchar(20) NOT NULL,
  `address_street` text NOT NULL,
  `address_city` varchar(100) NOT NULL,
  `address_province` varchar(100) NOT NULL,
  `address_postal` varchar(10) NOT NULL,
  `card_message` text,
  `delivery_date` date DEFAULT NULL,
  `delivery_time` enum('08:00-12:00','12:00-16:00','16:00-20:00') DEFAULT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  `shipping_cost` decimal(12,2) NOT NULL DEFAULT '0.00',
  `discount_amount` decimal(12,2) DEFAULT '0.00',
  `total` decimal(12,2) NOT NULL,
  `coupon_id` int DEFAULT NULL,
  `coupon_code` varchar(50) DEFAULT NULL,
  `status` enum('pending','paid','processing','shipped','delivered','cancelled','refunded') NOT NULL DEFAULT 'pending',
  `payment_method` varchar(50) DEFAULT NULL,
  `payment_status` enum('unpaid','paid','failed','refunded') DEFAULT 'unpaid',
  `paid_at` datetime DEFAULT NULL,
  `notes` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `order_items` (
  `id` int NOT NULL,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `product_name` varchar(200) NOT NULL,
  `product_image` varchar(255) DEFAULT NULL,
  `price` decimal(12,2) NOT NULL,
  `quantity` int NOT NULL,
  `subtotal` decimal(12,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `products` (
  `id` int NOT NULL,
  `category_id` int NOT NULL,
  `name` varchar(200) NOT NULL,
  `slug` varchar(200) NOT NULL,
  `description` text,
  `short_desc` varchar(255) DEFAULT NULL,
  `price` decimal(12,2) NOT NULL,
  `discount_price` decimal(12,2) DEFAULT NULL,
  `sku` varchar(50) DEFAULT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `weight_gram` int DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `total_sold` int DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `short_desc`, `price`, `stock`, `is_featured`, `is_active`) VALUES
(1, 1, 'Buket Mawar Merah Premium', 'buket-mawar-merah-premium', '24 tangkai mawar merah segar pilihan', 350000.00, 20, 1, 1),
(2, 1, 'Buket Tulip Pastel', 'buket-tulip-pastel', 'Mix tulip warna pastel yang romantis', 420000.00, 15, 1, 1),
(3, 2, 'Bunga Papan Selamat Sukses', 'bunga-papan-selamat-sukses', 'Papan bunga megah untuk peresmian kantor', 750000.00, 10, 0, 1),
(4, 3, 'Hand Bouquet Wisuda', 'hand-bouquet-wisuda', 'Buket wisuda elegant dengan pita satin', 280000.00, 30, 1, 1),
(5, 4, 'Rangkaian Meja Minimalis', 'rangkaian-meja-minimalis', 'Dekorasi meja segar bertema modern', 195000.00, 25, 0, 1);

CREATE TABLE `product_images` (
  `id` int NOT NULL,
  `product_id` int NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `alt_text` varchar(200) DEFAULT NULL,
  `is_primary` tinyint(1) DEFAULT '0',
  `sort_order` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `reviews` (
  `id` int NOT NULL,
  `product_id` int NOT NULL,
  `customer_id` int NOT NULL,
  `order_id` int NOT NULL,
  `rating` tinyint NOT NULL,
  `comment` text,
  `is_approved` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- *** TABEL USERS UNTUK LOGIN ADMIN ***
CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) DEFAULT 'admin'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `users` (`id`, `username`, `password`, `role`) VALUES
(1, 'admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Indexes
ALTER TABLE `addresses` ADD PRIMARY KEY (`id`), ADD KEY `customer_id` (`customer_id`);
ALTER TABLE `admins` ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `email` (`email`);
ALTER TABLE `categories` ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `slug` (`slug`);
ALTER TABLE `coupons` ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `code` (`code`);
ALTER TABLE `customers` ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `email` (`email`);
ALTER TABLE `orders` ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `order_number` (`order_number`), ADD KEY `customer_id` (`customer_id`), ADD KEY `coupon_id` (`coupon_id`);
ALTER TABLE `order_items` ADD PRIMARY KEY (`id`), ADD KEY `order_id` (`order_id`), ADD KEY `product_id` (`product_id`);
ALTER TABLE `products` ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `slug` (`slug`), ADD KEY `category_id` (`category_id`);
ALTER TABLE `product_images` ADD PRIMARY KEY (`id`), ADD KEY `product_id` (`product_id`);
ALTER TABLE `reviews` ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `unique_review` (`order_id`,`product_id`), ADD KEY `customer_id` (`customer_id`), ADD KEY `product_id` (`product_id`);
ALTER TABLE `users` ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `username` (`username`);

-- AUTO_INCREMENT
ALTER TABLE `addresses` MODIFY `id` int NOT NULL AUTO_INCREMENT;
ALTER TABLE `admins` MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
ALTER TABLE `categories` MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
ALTER TABLE `coupons` MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
ALTER TABLE `customers` MODIFY `id` int NOT NULL AUTO_INCREMENT;
ALTER TABLE `orders` MODIFY `id` int NOT NULL AUTO_INCREMENT;
ALTER TABLE `order_items` MODIFY `id` int NOT NULL AUTO_INCREMENT;
ALTER TABLE `products` MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
ALTER TABLE `product_images` MODIFY `id` int NOT NULL AUTO_INCREMENT;
ALTER TABLE `reviews` MODIFY `id` int NOT NULL AUTO_INCREMENT;
ALTER TABLE `users` MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

-- Foreign Keys
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE;
ALTER TABLE `orders` ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`), ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`);
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE, ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
ALTER TABLE `products` ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);
ALTER TABLE `product_images` ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`), ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`), ADD CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

COMMIT;