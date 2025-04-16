-- Points System Tables for Community Fridge

-- Table to track user points
CREATE TABLE IF NOT EXISTS `user_points` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `total_points` int NOT NULL DEFAULT 0,
  `level` int NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `user_points_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`userID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table to track point transactions
CREATE TABLE IF NOT EXISTS `point_transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `points` int NOT NULL,
  `action_type` enum('DONATION','RESERVATION','FEEDBACK','PICKUP','VOLUNTEER','CONTAINER_RETURN','COMMUNITY_EVENT') NOT NULL,
  `reference_id` int DEFAULT NULL,
  `description` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `point_transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`userID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table for achievements/badges
CREATE TABLE IF NOT EXISTS `achievements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` varchar(255) NOT NULL,
  `icon` varchar(100) NOT NULL,
  `points_required` int NOT NULL DEFAULT 0,
  `role` enum('Donor','Recipient','Volunteer','All') NOT NULL DEFAULT 'All',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table to track user achievements
CREATE TABLE IF NOT EXISTS `user_achievements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `achievement_id` int NOT NULL,
  `earned_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_achievement` (`user_id`,`achievement_id`),
  KEY `achievement_id` (`achievement_id`),
  CONSTRAINT `user_achievements_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`userID`) ON DELETE CASCADE,
  CONSTRAINT `user_achievements_ibfk_2` FOREIGN KEY (`achievement_id`) REFERENCES `achievements` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default achievements
INSERT INTO `achievements` (`name`, `description`, `icon`, `points_required`, `role`) VALUES
-- Recipient achievements
('Feedback Provider', 'Provided feedback on 5 food pickups', 'fa-comment', 50, 'Recipient'),
('Eco-Friendly', 'Returned 10 containers to community fridges', 'fa-recycle', 100, 'Recipient'),
('Regular Visitor', 'Made 15 food reservations', 'fa-calendar-check', 150, 'Recipient'),
('Community Supporter', 'Participated in 3 community events', 'fa-users', 200, 'Recipient'),
('Sustainability Champion', 'Reached 500 total points as a recipient', 'fa-award', 500, 'Recipient'),

-- Donor achievements
('First-Time Donor', 'Made your first food donation', 'fa-hand-holding-heart', 10, 'Donor'),
('Generous Contributor', 'Donated 10 food items', 'fa-gift', 100, 'Donor'),
('Hunger Fighter', 'Donated 25 food items', 'fa-utensils', 250, 'Donor'),
('Community Hero', 'Reached 500 total points as a donor', 'fa-medal', 500, 'Donor'),
('Sustainability Leader', 'Reached 1000 total points as a donor', 'fa-crown', 1000, 'Donor'),

-- Volunteer achievements
('Helping Hand', 'Completed 5 volunteer shifts', 'fa-hands-helping', 50, 'Volunteer'),
('Dedicated Volunteer', 'Completed 15 volunteer shifts', 'fa-clock', 150, 'Volunteer'),
('Community Pillar', 'Completed 30 volunteer shifts', 'fa-building', 300, 'Volunteer'),
('Volunteer Champion', 'Reached 500 total points as a volunteer', 'fa-star', 500, 'Volunteer'),
('Volunteer Hero', 'Reached 1000 total points as a volunteer', 'fa-trophy', 1000, 'Volunteer'),

-- General achievements for all users
('Newcomer', 'Joined the Community Fridge network', 'fa-seedling', 0, 'All'),
('Active Member', 'Been active for 30 days', 'fa-calendar-alt', 30, 'All'),
('Community Connector', 'Connected with 5 other members', 'fa-network-wired', 50, 'All'),
('Food Waste Warrior', 'Helped save 100kg of food from waste', 'fa-leaf', 200, 'All'),
('Environmental Hero', 'Reached 1000 total points across all activities', 'fa-globe-europe', 1000, 'All');

-- Insert initial points for existing users
INSERT INTO `user_points` (`user_id`, `total_points`, `level`)
SELECT `userID`, 0, 1 FROM `users`;
