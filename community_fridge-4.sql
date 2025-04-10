-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Apr 10, 2025 at 09:48 AM
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
(3, 4, 'Rice', 20, '2025-06-15', 'Available', 3, '', '2025-03-11 15:49:02'),
(4, 4, 'Chicken Breast', 6, '2025-04-05', 'Available', 1, '', '2025-03-11 15:49:02'),
(5, 1, 'Canned Beans', 12, '2026-01-01', 'Available', 2, '', '2025-03-11 15:49:02'),
(544, 1, 'kufteta', 4, '2025-04-16', 'Available', 1, 'Other', '2025-04-09 22:24:44'),
(545, 1, 'ruska salata', 31, '2025-04-16', 'Available', 1, 'Other', '2025-04-09 22:27:57'),
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
-- Table structure for table `reservations`
--

CREATE TABLE `reservations` (
  `reservationID` int NOT NULL,
  `recipientID` int NOT NULL,
  `foodID` int NOT NULL,
  `status` enum('Pending','Confirmed','Completed') DEFAULT 'Pending',
  `pickupDate` date NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `reservations`
--

INSERT INTO `reservations` (`reservationID`, `recipientID`, `foodID`, `status`, `pickupDate`, `created_at`) VALUES
(1, 3, 1, 'Confirmed', '2025-04-02', '2025-03-11 15:49:10'),
(2, 5, 2, 'Pending', '2025-03-29', '2025-03-11 15:49:10'),
(3, 5, 2, 'Pending', '2025-04-11', '2025-04-10 09:19:39'),
(4, 5, 1, 'Pending', '2025-04-11', '2025-04-10 09:19:39'),
(5, 5, 546, 'Pending', '2025-04-11', '2025-04-10 09:19:39'),
(6, 5, 544, 'Pending', '2025-04-11', '2025-04-10 09:27:24'),
(7, 5, 545, 'Pending', '2025-04-11', '2025-04-10 09:27:24'),
(8, 5, 1, 'Pending', '2025-04-11', '2025-04-10 09:27:24'),
(9, 5, 544, 'Pending', '2025-04-11', '2025-04-10 09:28:41'),
(10, 5, 545, 'Pending', '2025-04-11', '2025-04-10 09:28:41'),
(11, 5, 1, 'Pending', '2025-04-11', '2025-04-10 09:28:41'),
(12, 5, 4, 'Pending', '2025-04-11', '2025-04-10 09:30:53'),
(13, 5, 1, 'Pending', '2025-04-26', '2025-04-10 09:33:25'),
(14, 5, 4, 'Pending', '2025-04-26', '2025-04-10 09:33:25');

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
-- Indexes for table `donations`
--
ALTER TABLE `donations`
  ADD PRIMARY KEY (`donation_id`),
  ADD KEY `donor_id` (`donor_id`);

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
-- AUTO_INCREMENT for table `donations`
--
ALTER TABLE `donations`
  MODIFY `donation_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

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
-- AUTO_INCREMENT for table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `reservationID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

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
-- Constraints for table `volunteer_shifts`
--
ALTER TABLE `volunteer_shifts`
  ADD CONSTRAINT `volunteer_shifts_ibfk_1` FOREIGN KEY (`volunteerID`) REFERENCES `users` (`userID`),
  ADD CONSTRAINT `volunteer_shifts_ibfk_2` FOREIGN KEY (`fridgeID`) REFERENCES `fridges` (`fridgeID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
