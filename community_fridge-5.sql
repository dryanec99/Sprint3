-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Apr 17, 2025 at 09:08 AM
-- Server version: 9.2.0
-- PHP Version: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `community_fridge`
--

-- --------------------------------------------------------

--
-- Table structure for table `achievements`
--

CREATE TABLE `achievements` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(255) NOT NULL,
  `icon` varchar(100) NOT NULL,
  `points_required` int NOT NULL DEFAULT '0',
  `role` enum('Donor','Recipient','Volunteer','All') NOT NULL DEFAULT 'All',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `achievements`
--

INSERT INTO `achievements` (`id`, `name`, `description`, `icon`, `points_required`, `role`, `created_at`) VALUES
(1, 'Feedback Provider', 'Provided feedback on 5 food pickups', 'fa-comment', 50, 'Recipient', '2025-04-16 17:37:19'),
(2, 'Eco-Friendly', 'Returned 10 containers to community fridges', 'fa-recycle', 100, 'Recipient', '2025-04-16 17:37:19'),
(3, 'Regular Visitor', 'Made 15 food reservations', 'fa-calendar-check', 150, 'Recipient', '2025-04-16 17:37:19'),
(4, 'Community Supporter', 'Participated in 3 community events', 'fa-users', 200, 'Recipient', '2025-04-16 17:37:19'),
(5, 'Sustainability Champion', 'Reached 500 total points as a recipient', 'fa-award', 500, 'Recipient', '2025-04-16 17:37:19'),
(6, 'First-Time Donor', 'Made your first food donation', 'fa-hand-holding-heart', 10, 'Donor', '2025-04-16 17:37:19'),
(7, 'Generous Contributor', 'Donated 10 food items', 'fa-gift', 100, 'Donor', '2025-04-16 17:37:19'),
(8, 'Hunger Fighter', 'Donated 25 food items', 'fa-utensils', 250, 'Donor', '2025-04-16 17:37:19'),
(9, 'Community Hero', 'Reached 500 total points as a donor', 'fa-medal', 500, 'Donor', '2025-04-16 17:37:19'),
(10, 'Sustainability Leader', 'Reached 1000 total points as a donor', 'fa-crown', 1000, 'Donor', '2025-04-16 17:37:19'),
(11, 'Helping Hand', 'Completed 5 volunteer shifts', 'fa-hands-helping', 50, 'Volunteer', '2025-04-16 17:37:19'),
(12, 'Dedicated Volunteer', 'Completed 15 volunteer shifts', 'fa-clock', 150, 'Volunteer', '2025-04-16 17:37:19'),
(13, 'Community Pillar', 'Completed 30 volunteer shifts', 'fa-building', 300, 'Volunteer', '2025-04-16 17:37:19'),
(14, 'Volunteer Champion', 'Reached 500 total points as a volunteer', 'fa-star', 500, 'Volunteer', '2025-04-16 17:37:19'),
(15, 'Volunteer Hero', 'Reached 1000 total points as a volunteer', 'fa-trophy', 1000, 'Volunteer', '2025-04-16 17:37:19'),
(16, 'Newcomer', 'Joined the Community Fridge network', 'fa-seedling', 0, 'All', '2025-04-16 17:37:19'),
(17, 'Active Member', 'Been active for 30 days', 'fa-calendar-alt', 30, 'All', '2025-04-16 17:37:19'),
(18, 'Community Connector', 'Connected with 5 other members', 'fa-network-wired', 50, 'All', '2025-04-16 17:37:19'),
(19, 'Food Waste Warrior', 'Helped save 100kg of food from waste', 'fa-leaf', 200, 'All', '2025-04-16 17:37:19'),
(20, 'Environmental Hero', 'Reached 1000 total points across all activities', 'fa-globe-europe', 1000, 'All', '2025-04-16 17:37:19');

-- --------------------------------------------------------

--
-- Table structure for table `donations`
--

CREATE TABLE `donations` (
  `donation_id` int NOT NULL,
  `donor_id` int NOT NULL,
  `food_name` varchar(100) NOT NULL,
  `quantity` int NOT NULL,
  `donation_date` date NOT NULL,
  `expiry_date` date DEFAULT NULL,
  `notes` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `donations`
--

INSERT INTO `donations` (`donation_id`, `donor_id`, `food_name`, `quantity`, `donation_date`, `expiry_date`, `notes`) VALUES
(3, 1, 'Test Food', 5, '2025-04-09', '2025-04-16', 'Test description'),
(4, 1, 'Test Food Item', 5, '2025-04-09', '2025-04-16', 'This is a test donation inserted directly'),
(5, 1, 'kufteta', 100, '2025-04-09', '2025-04-16', 'kuftenca'),
(6, 1, 'ruska salata', 1000, '2025-04-09', '2025-04-16', 'mnogo hubawa salata'),
(7, 1, 'pelmeni', 2, '2025-04-09', '2025-04-16', 'dasdas'),
(8, 2, 'probwane ', 1, '2025-04-10', '2025-04-17', 'dsadas');

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `reservation_id` int NOT NULL,
  `rating` int NOT NULL,
  `comments` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`id`, `user_id`, `reservation_id`, `rating`, `comments`, `created_at`) VALUES
(1, 5, 19, 5, 'very tasty', '2025-04-16 18:16:45'),
(2, 5, 18, 5, 'very fresh', '2025-04-16 18:19:13'),
(3, 5, 16, 5, 'very identical to the real recipe ', '2025-04-16 18:20:03'),
(4, 5, 14, 5, 'good packaging', '2025-04-16 18:20:14'),
(5, 5, 5, 5, 'amazing texture', '2025-04-16 18:20:32'),
(6, 5, 17, 5, 'the best rice ive ever tried ', '2025-04-16 18:20:50'),
(7, 5, 11, 5, 'great shape', '2025-04-16 18:21:29');

-- --------------------------------------------------------

--
-- Table structure for table `food_items`
--

CREATE TABLE `food_items` (
  `foodID` int NOT NULL,
  `donorID` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `quantity` int NOT NULL,
  `expirationDate` date NOT NULL,
  `status` enum('Available','Reserved','Collected') NOT NULL,
  `fridgeID` int NOT NULL,
  `category` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `food_items`
--

INSERT INTO `food_items` (`foodID`, `donorID`, `name`, `quantity`, `expirationDate`, `status`, `fridgeID`, `category`, `created_at`) VALUES
(1, 1, 'Apples', 6, '2025-04-10', 'Available', 1, '', '2025-03-11 15:49:02'),
(2, 1, 'Milk', 1, '2025-03-28', 'Reserved', 2, '', '2025-03-11 15:49:02'),
(3, 4, 'Rice', 19, '2025-06-15', 'Available', 3, '', '2025-03-11 15:49:02'),
(4, 4, 'Chicken Breast', 5, '2025-04-05', 'Available', 1, '', '2025-03-11 15:49:02'),
(5, 1, 'Canned Beans', 9, '2026-01-01', 'Available', 2, '', '2025-03-11 15:49:02'),
(544, 1, 'kufteta', 3, '2025-04-16', 'Available', 1, 'Other', '2025-04-09 22:24:44'),
(545, 1, 'ruska salata', 30, '2025-04-16', 'Available', 1, 'Other', '2025-04-09 22:27:57'),
(546, 1, 'pelmeni', 1, '2025-04-16', 'Reserved', 1, 'Other', '2025-04-09 22:32:44'),
(547, 2, 'probwane ', 1, '2025-04-17', 'Available', 1, 'Vegetables', '2025-04-10 08:58:42');

-- --------------------------------------------------------

--
-- Table structure for table `fridges`
--

CREATE TABLE `fridges` (
  `fridgeID` int NOT NULL,
  `location` varchar(255) NOT NULL,
  `capacity` int NOT NULL,
  `currentStock` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `fridges`
--

INSERT INTO `fridges` (`fridgeID`, `location`, `capacity`, `currentStock`, `created_at`) VALUES
(1, 'Community Fridge - Camden', 100, 20, '2025-03-11 15:48:57'),
(2, 'Community Fridge - Brixton', 80, 15, '2025-03-11 15:48:57'),
(3, 'Community Fridge - Hackney', 120, 30, '2025-03-11 15:48:57');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `messageID` int NOT NULL,
  `senderID` int NOT NULL,
  `receiverID` int NOT NULL,
  `subject` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `isRead` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`messageID`, `senderID`, `receiverID`, `subject`, `content`, `isRead`, `created_at`) VALUES
(1, 6, 2, 'zdrawei', 'ko praish', 1, '2025-04-10 07:20:59'),
(2, 2, 6, 'Re: zdrawei', 'nishto ti?', 0, '2025-04-10 07:27:23');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `notificationID` int NOT NULL,
  `userID` int NOT NULL,
  `message` text NOT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `point_transactions`
--

CREATE TABLE `point_transactions` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `points` int NOT NULL,
  `action_type` enum('DONATION','RESERVATION','FEEDBACK','PICKUP','VOLUNTEER','CONTAINER_RETURN','COMMUNITY_EVENT') NOT NULL,
  `reference_id` int DEFAULT NULL,
  `description` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `point_transactions`
--

INSERT INTO `point_transactions` (`id`, `user_id`, `points`, `action_type`, `reference_id`, `description`, `created_at`) VALUES
(1, 5, 15, 'FEEDBACK', 2, 'Provided feedback on food quality', '2025-04-16 18:19:13'),
(2, 5, 15, 'FEEDBACK', 3, 'Provided feedback on food quality', '2025-04-16 18:20:03'),
(3, 5, 15, 'FEEDBACK', 4, 'Provided feedback on food quality', '2025-04-16 18:20:14'),
(4, 5, 15, 'FEEDBACK', 5, 'Provided feedback on food quality', '2025-04-16 18:20:32'),
(5, 5, 15, 'FEEDBACK', 6, 'Provided feedback on food quality', '2025-04-16 18:20:50'),
(6, 5, 15, 'FEEDBACK', 7, 'Provided feedback on food quality', '2025-04-16 18:21:29');

-- --------------------------------------------------------

--
-- Table structure for table `reservations`
--

CREATE TABLE `reservations` (
  `reservationID` int NOT NULL,
  `recipientID` int NOT NULL,
  `foodID` int NOT NULL,
  `status` enum('Pending','Confirmed','Completed') DEFAULT 'Pending',
  `pickupDate` date NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `feedback_provided` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `reservations`
--

INSERT INTO `reservations` (`reservationID`, `recipientID`, `foodID`, `status`, `pickupDate`, `created_at`, `feedback_provided`) VALUES
(1, 3, 1, 'Confirmed', '2025-04-02', '2025-03-11 15:49:10', 0),
(2, 5, 2, 'Pending', '2025-03-29', '2025-03-11 15:49:10', 0),
(3, 5, 2, 'Pending', '2025-04-11', '2025-04-10 09:19:39', 0),
(4, 5, 1, 'Pending', '2025-04-11', '2025-04-10 09:19:39', 0),
(5, 5, 546, 'Pending', '2025-04-11', '2025-04-10 09:19:39', 1),
(6, 5, 544, 'Pending', '2025-04-11', '2025-04-10 09:27:24', 0),
(7, 5, 545, 'Pending', '2025-04-11', '2025-04-10 09:27:24', 0),
(8, 5, 1, 'Pending', '2025-04-11', '2025-04-10 09:27:24', 0),
(9, 5, 544, 'Pending', '2025-04-11', '2025-04-10 09:28:41', 0),
(10, 5, 545, 'Pending', '2025-04-11', '2025-04-10 09:28:41', 0),
(11, 5, 1, 'Pending', '2025-04-11', '2025-04-10 09:28:41', 1),
(12, 5, 4, 'Pending', '2025-04-11', '2025-04-10 09:30:53', 0),
(13, 5, 1, 'Pending', '2025-04-26', '2025-04-10 09:33:25', 0),
(14, 5, 4, 'Pending', '2025-04-26', '2025-04-10 09:33:25', 1),
(15, 5, 5, 'Pending', '2025-04-11', '2025-04-10 10:38:49', 0),
(16, 5, 545, 'Pending', '2025-04-11', '2025-04-10 10:41:28', 1),
(17, 5, 3, 'Confirmed', '2025-04-23', '2025-04-10 11:53:32', 1),
(18, 5, 544, 'Confirmed', '2025-04-23', '2025-04-10 11:53:32', 1),
(19, 5, 4, 'Confirmed', '2025-06-06', '2025-04-10 11:55:53', 0);

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `reviewID` int NOT NULL,
  `userID` int NOT NULL,
  `foodID` int NOT NULL,
  `rating` int DEFAULT NULL,
  `comment` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `transactionID` int NOT NULL,
  `userID` int NOT NULL,
  `foodID` int NOT NULL,
  `action` enum('Donated','Reserved','Picked Up','Expired') NOT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userID` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('Donor','Recipient','Volunteer','Admin') NOT NULL,
  `typeOfUser` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userID`, `name`, `email`, `password`, `role`, `typeOfUser`, `created_at`) VALUES
(1, 'Ray Johnson', 'rayjohn1@abv.bg', 'nyakakwaparola', 'Donor', '', '2025-03-11 15:48:42'),
(2, 'Stacy Brown', 'stacybrown1@abv.bg', 'drugaparola', 'Volunteer', '', '2025-03-11 15:48:42'),
(3, 'Dylan Smith', 'dylansmith1@abv.bg', 'otnowoparola', 'Recipient', '', '2025-03-11 15:48:42'),
(4, 'Alice Carter', 'alicecarter1@abv.bg', 'malkaparola', 'Donor', '', '2025-03-11 15:48:42'),
(5, 'Bob Wilson', 'bobwilson1@abv.bg', 'golyamataparola', 'Recipient', '', '2025-03-11 15:48:42'),
(6, 'adrian', 'pisnami@abv.bg', 'kalendara1111', 'Volunteer', 'Volunteer', '2025-04-09 14:32:57'),
(7, 'darenie', 'zabezpari@abv.bg', 'kalendar', 'Volunteer', 'Volunteer', '2025-04-09 14:54:21'),
(8, 'dfghdfg sdf s', 'dsada@abv.bg', 'dasdasfasf', 'Volunteer', 'Volunteer', '2025-04-09 15:00:34'),
(9, 'juhi', 'oihiuhyu@abv.bg', 'sfasflsdjfis', 'Volunteer', 'Volunteer', '2025-04-09 20:35:25'),
(10, 'sasha', 'sasha@abv.bg', '12345678', 'Volunteer', 'Volunteer', '2025-04-10 09:34:42');

-- --------------------------------------------------------

--
-- Table structure for table `user_achievements`
--

CREATE TABLE `user_achievements` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `achievement_id` int NOT NULL,
  `earned_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user_achievements`
--

INSERT INTO `user_achievements` (`id`, `user_id`, `achievement_id`, `earned_at`) VALUES
(1, 4, 16, '2025-04-16 17:59:59'),
(2, 5, 16, '2025-04-16 17:59:59'),
(3, 8, 16, '2025-04-16 17:59:59'),
(4, 3, 16, '2025-04-16 17:59:59'),
(5, 9, 16, '2025-04-16 17:59:59'),
(6, 6, 16, '2025-04-16 17:59:59'),
(7, 1, 16, '2025-04-16 17:59:59'),
(8, 10, 16, '2025-04-16 17:59:59'),
(9, 2, 16, '2025-04-16 17:59:59'),
(10, 7, 16, '2025-04-16 17:59:59'),
(11, 5, 1, '2025-04-16 18:25:45'),
(12, 5, 3, '2025-04-16 18:25:45'),
(13, 5, 6, '2025-04-16 18:25:45'),
(14, 5, 17, '2025-04-16 18:25:45'),
(15, 5, 11, '2025-04-16 18:25:45'),
(16, 5, 18, '2025-04-16 18:25:45');

-- --------------------------------------------------------

--
-- Table structure for table `user_points`
--

CREATE TABLE `user_points` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `total_points` int NOT NULL DEFAULT '0',
  `level` int NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user_points`
--

INSERT INTO `user_points` (`id`, `user_id`, `total_points`, `level`, `created_at`, `updated_at`) VALUES
(1, 4, 0, 1, '2025-04-16 17:37:19', '2025-04-16 17:37:19'),
(2, 5, 90, 2, '2025-04-16 17:37:19', '2025-04-16 18:21:29'),
(3, 8, 0, 1, '2025-04-16 17:37:19', '2025-04-16 17:37:19'),
(4, 3, 0, 1, '2025-04-16 17:37:19', '2025-04-16 17:37:19'),
(5, 9, 0, 1, '2025-04-16 17:37:19', '2025-04-16 17:37:19'),
(6, 6, 0, 1, '2025-04-16 17:37:19', '2025-04-16 17:37:19'),
(7, 1, 0, 1, '2025-04-16 17:37:19', '2025-04-16 17:37:19'),
(8, 10, 0, 1, '2025-04-16 17:37:19', '2025-04-16 17:37:19'),
(9, 2, 0, 1, '2025-04-16 17:37:19', '2025-04-16 17:37:19'),
(10, 7, 0, 1, '2025-04-16 17:37:19', '2025-04-16 17:37:19');

-- --------------------------------------------------------

--
-- Table structure for table `volunteer_shifts`
--

CREATE TABLE `volunteer_shifts` (
  `shiftID` int NOT NULL,
  `volunteerID` int NOT NULL,
  `fridgeID` int NOT NULL,
  `shiftDate` date NOT NULL,
  `shiftTime` time NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `achievements`
--
ALTER TABLE `achievements`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `donations`
--
ALTER TABLE `donations`
  ADD PRIMARY KEY (`donation_id`),
  ADD KEY `donor_id` (`donor_id`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reservation_id` (`reservation_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `food_items`
--
ALTER TABLE `food_items`
  ADD PRIMARY KEY (`foodID`),
  ADD KEY `donorID` (`donorID`),
  ADD KEY `fridgeID` (`fridgeID`);

--
-- Indexes for table `fridges`
--
ALTER TABLE `fridges`
  ADD PRIMARY KEY (`fridgeID`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`messageID`),
  ADD KEY `senderID` (`senderID`),
  ADD KEY `receiverID` (`receiverID`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notificationID`),
  ADD KEY `userID` (`userID`);

--
-- Indexes for table `point_transactions`
--
ALTER TABLE `point_transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`reservationID`),
  ADD KEY `recipientID` (`recipientID`),
  ADD KEY `foodID` (`foodID`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`reviewID`),
  ADD KEY `userID` (`userID`),
  ADD KEY `foodID` (`foodID`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`transactionID`),
  ADD KEY `userID` (`userID`),
  ADD KEY `foodID` (`foodID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userID`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_achievements`
--
ALTER TABLE `user_achievements`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_achievement` (`user_id`,`achievement_id`),
  ADD KEY `achievement_id` (`achievement_id`);

--
-- Indexes for table `user_points`
--
ALTER TABLE `user_points`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `volunteer_shifts`
--
ALTER TABLE `volunteer_shifts`
  ADD PRIMARY KEY (`shiftID`),
  ADD KEY `volunteerID` (`volunteerID`),
  ADD KEY `fridgeID` (`fridgeID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `achievements`
--
ALTER TABLE `achievements`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `donations`
--
ALTER TABLE `donations`
  MODIFY `donation_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `food_items`
--
ALTER TABLE `food_items`
  MODIFY `foodID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=548;

--
-- AUTO_INCREMENT for table `fridges`
--
ALTER TABLE `fridges`
  MODIFY `fridgeID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `messageID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notificationID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `point_transactions`
--
ALTER TABLE `point_transactions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `reservationID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `reviewID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `transactionID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `user_achievements`
--
ALTER TABLE `user_achievements`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `user_points`
--
ALTER TABLE `user_points`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `volunteer_shifts`
--
ALTER TABLE `volunteer_shifts`
  MODIFY `shiftID` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `donations`
--
ALTER TABLE `donations`
  ADD CONSTRAINT `donations_ibfk_1` FOREIGN KEY (`donor_id`) REFERENCES `users` (`userID`);

--
-- Constraints for table `feedback`
--
ALTER TABLE `feedback`
  ADD CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`userID`) ON DELETE CASCADE,
  ADD CONSTRAINT `feedback_ibfk_2` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`reservationID`) ON DELETE CASCADE;

--
-- Constraints for table `food_items`
--
ALTER TABLE `food_items`
  ADD CONSTRAINT `food_items_ibfk_1` FOREIGN KEY (`donorID`) REFERENCES `users` (`userID`),
  ADD CONSTRAINT `food_items_ibfk_2` FOREIGN KEY (`fridgeID`) REFERENCES `fridges` (`fridgeID`);

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`senderID`) REFERENCES `users` (`userID`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiverID`) REFERENCES `users` (`userID`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`);

--
-- Constraints for table `point_transactions`
--
ALTER TABLE `point_transactions`
  ADD CONSTRAINT `point_transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`userID`) ON DELETE CASCADE;

--
-- Constraints for table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`recipientID`) REFERENCES `users` (`userID`),
  ADD CONSTRAINT `reservations_ibfk_2` FOREIGN KEY (`foodID`) REFERENCES `food_items` (`foodID`);

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`),
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`foodID`) REFERENCES `food_items` (`foodID`);

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`),
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`foodID`) REFERENCES `food_items` (`foodID`);

--
-- Constraints for table `user_achievements`
--
ALTER TABLE `user_achievements`
  ADD CONSTRAINT `user_achievements_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`userID`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_achievements_ibfk_2` FOREIGN KEY (`achievement_id`) REFERENCES `achievements` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_points`
--
ALTER TABLE `user_points`
  ADD CONSTRAINT `user_points_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`userID`) ON DELETE CASCADE;

--
-- Constraints for table `volunteer_shifts`
--
ALTER TABLE `volunteer_shifts`
  ADD CONSTRAINT `volunteer_shifts_ibfk_1` FOREIGN KEY (`volunteerID`) REFERENCES `users` (`userID`),
  ADD CONSTRAINT `volunteer_shifts_ibfk_2` FOREIGN KEY (`fridgeID`) REFERENCES `fridges` (`fridgeID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
