-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 06, 2026 at 06:00 AM
-- Server version: 8.4.3
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dbuas`
--

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('super_admin','admin','staff') NOT NULL DEFAULT 'staff',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `name`, `email`, `password`, `role`, `created_at`, `updated_at`) VALUES
(1, 'Super Admin', 'admin@florist.com', '$2y$12$placeholder_hashed_password', 'super_admin', '2026-06-06 13:00:21', '2026-06-06 13:00:21');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `description` text,
  `image_url` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `sort_order` int DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image_url`, `is_active`, `sort_order`, `created_at`) VALUES
(1, 'Buket Bunga', 'buket-bunga', 'Rangkaian bunga cantik untuk berbagai acara', NULL, 1, 1, '2026-06-06 13:00:21'),
(2, 'Bunga Papan', 'bunga-papan', 'Karangan bunga berdiri untuk peresmian & ucapan', NULL, 1, 2, '2026-06-06 13:00:21'),
(3, 'Hand Bouquet', 'hand-bouquet', 'Buket elegan untuk wisuda dan pernikahan', NULL, 1, 3, '2026-06-06 13:00:21'),
(4, 'Bunga Meja', 'bunga-meja', 'Dekorasi bunga segar untuk meja & ruangan', NULL, 1, 4, '2026-06-06 13:00:21'),
(5, 'Hamper Bunga', 'hamper-bunga', 'Paket hamper bunga dan hadiah spesial', NULL, 1, 5, '2026-06-06 13:00:21'),
(6, 'Bunga Pernikahan', 'bunga-pernikahan', 'Dekorasi pernikahan & aksesoris pengantin', NULL, 1, 6, '2026-06-06 13:00:21');

-- --------------------------------------------------------

--
-- Table structure for table `coupons`
--

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `coupons`
--

INSERT INTO `coupons` (`id`, `code`, `type`, `value`, `min_purchase`, `max_discount`, `usage_limit`, `used_count`, `is_active`, `expired_at`, `created_at`) VALUES
(1, 'WELCOME10', 'percent', 10.00, 100000.00, NULL, 100, 0, 1, '2025-12-31 23:59:59', '2026-06-06 13:00:21'),
(2, 'DISKON50K', 'fixed', 50000.00, 200000.00, NULL, 50, 0, 1, '2025-12-31 23:59:59', '2026-06-06 13:00:21');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int NOT NULL,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `product_name` varchar(200) NOT NULL,
  `product_image` varchar(255) DEFAULT NULL,
  `price` decimal(12,2) NOT NULL,
  `quantity` int NOT NULL,
  `subtotal` decimal(12,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `short_desc`, `price`, `discount_price`, `sku`, `stock`, `weight_gram`, `is_featured`, `is_active`, `total_sold`, `created_at`, `updated_at`) VALUES
(1, 1, 'Buket Mawar Merah Premium', 'buket-mawar-merah-premium', NULL, '24 tangkai mawar merah segar pilihan', 350000.00, NULL, NULL, 20, NULL, 1, 1, 0, '2026-06-06 13:00:21', '2026-06-06 13:00:21'),
(2, 1, 'Buket Tulip Pastel', 'buket-tulip-pastel', NULL, 'Mix tulip warna pastel yang romantis', 420000.00, NULL, NULL, 15, NULL, 1, 1, 0, '2026-06-06 13:00:21', '2026-06-06 13:00:21'),
(3, 2, 'Bunga Papan Selamat Sukses', 'bunga-papan-selamat-sukses', NULL, 'Papan bunga megah untuk peresmian kantor', 750000.00, NULL, NULL, 10, NULL, 0, 1, 0, '2026-06-06 13:00:21', '2026-06-06 13:00:21'),
(4, 3, 'Hand Bouquet Wisuda', 'hand-bouquet-wisuda', NULL, 'Buket wisuda elegant dengan pita satin', 280000.00, NULL, NULL, 30, NULL, 1, 1, 0, '2026-06-06 13:00:21', '2026-06-06 13:00:21'),
(5, 4, 'Rangkaian Meja Minimalis', 'rangkaian-meja-minimalis', NULL, 'Dekorasi meja segar bertema modern', 195000.00, NULL, NULL, 25, NULL, 0, 1, 0, '2026-06-06 13:00:21', '2026-06-06 13:00:21');

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` int NOT NULL,
  `product_id` int NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `alt_text` varchar(200) DEFAULT NULL,
  `is_primary` tinyint(1) DEFAULT '0',
  `sort_order` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int NOT NULL,
  `product_id` int NOT NULL,
  `customer_id` int NOT NULL,
  `order_id` int NOT NULL,
  `rating` tinyint NOT NULL,
  `comment` text,
  `is_approved` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_number` (`order_number`),
  ADD KEY `coupon_id` (`coupon_id`),
  ADD KEY `idx_orders_customer` (`customer_id`),
  ADD KEY `idx_orders_status` (`status`),
  ADD KEY `idx_orders_number` (`order_number`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `idx_order_items_order` (`order_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD KEY `idx_products_category` (`category_id`),
  ADD KEY `idx_products_slug` (`slug`),
  ADD KEY `idx_products_featured` (`is_featured`,`is_active`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_review` (`order_id`,`product_id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `idx_reviews_product` (`product_id`,`is_approved`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addresses`
--
ALTER TABLE `addresses`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `coupons`
--
ALTER TABLE `coupons`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  ADD CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
