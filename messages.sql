-- Table structure for table `messages`
CREATE TABLE `messages` (
  `messageID` int NOT NULL AUTO_INCREMENT,
  `senderID` int NOT NULL,
  `receiverID` int NOT NULL,
  `subject` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `isRead` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`messageID`),
  KEY `senderID` (`senderID`),
  KEY `receiverID` (`receiverID`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`senderID`) REFERENCES `users` (`userID`) ON DELETE CASCADE,
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiverID`) REFERENCES `users` (`userID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Sample data for messages table
INSERT INTO `messages` (`senderID`, `receiverID`, `subject`, `content`, `isRead`, `created_at`) VALUES
(2, 1, 'Thank you for your donation', 'Hi Ray, thank you for donating apples to our Camden fridge. They will help many families!', 0, '2025-04-09 15:30:00'),
(1, 2, 'New donation coming', 'Hello Stacy, I will be bringing some fresh vegetables tomorrow around 2pm.', 1, '2025-04-09 16:45:00'),
(3, 2, 'Question about food availability', 'Hi Stacy, I was wondering if there are any dairy products available at the Brixton fridge?', 0, '2025-04-09 17:20:00'),
(2, 3, 'Re: Question about food availability', 'Hello Dylan, yes we currently have milk and yogurt available at the Brixton location. They expire in 3 days.', 0, '2025-04-09 18:10:00'),
(4, 6, 'Expiring items', 'Hi Adrian, just to let you know that some of the items I donated last week will be expiring soon. You might want to prioritize them.', 0, '2025-04-09 19:00:00');
