-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: May 20, 2026 at 06:22 PM
-- Server version: 8.2.0
-- PHP Version: 8.2.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `student_management_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
CREATE TABLE IF NOT EXISTS `attendance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `course_id` int NOT NULL,
  `date` date NOT NULL,
  `status` enum('present','absent','late') NOT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `marked_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_attendance` (`student_id`,`course_id`,`date`),
  KEY `course_id` (`course_id`),
  KEY `marked_by` (`marked_by`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
CREATE TABLE IF NOT EXISTS `courses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `course_name` varchar(150) NOT NULL,
  `course_code` varchar(20) NOT NULL,
  `department_id` int NOT NULL,
  `credits` int DEFAULT '3',
  `semester` int NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `course_code` (`course_code`),
  KEY `department_id` (`department_id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `course_name`, `course_code`, `department_id`, `credits`, `semester`, `description`, `created_at`) VALUES
(1, 'Data Structures', 'CS101', 1, 4, 1, NULL, '2026-05-17 09:47:50'),
(2, 'Database Management', 'CS201', 1, 4, 2, NULL, '2026-05-17 09:47:50'),
(3, 'Web Technologies', 'CS301', 1, 3, 3, NULL, '2026-05-17 09:47:50'),
(4, 'Operating Systems', 'CS401', 1, 4, 4, NULL, '2026-05-17 09:47:50'),
(5, 'Software Engineering', 'CS501', 1, 3, 5, NULL, '2026-05-17 09:47:50'),
(6, 'Machine Learning', 'CS601', 1, 4, 6, NULL, '2026-05-17 09:47:50');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
CREATE TABLE IF NOT EXISTS `departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `code` varchar(10) NOT NULL,
  `hod_name` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `name`, `code`, `hod_name`, `created_at`) VALUES
(1, 'Computer Science', 'CS', 'Dr. A. Sharma', '2026-05-17 09:47:50'),
(2, 'Information Technology', 'IT', 'Dr. B. Verma', '2026-05-17 09:47:50'),
(3, 'Electronics', 'EC', 'Dr. C. Patel', '2026-05-17 09:47:50');

-- --------------------------------------------------------

--
-- Table structure for table `enrollments`
--

DROP TABLE IF EXISTS `enrollments`;
CREATE TABLE IF NOT EXISTS `enrollments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `course_id` int NOT NULL,
  `faculty_id` int DEFAULT NULL,
  `semester` int NOT NULL,
  `year` int NOT NULL,
  `status` enum('active','dropped','completed') DEFAULT 'active',
  `enrolled_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_enrollment` (`student_id`,`course_id`,`semester`,`year`),
  KEY `course_id` (`course_id`),
  KEY `faculty_id` (`faculty_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `faculty`
--

DROP TABLE IF EXISTS `faculty`;
CREATE TABLE IF NOT EXISTS `faculty` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `faculty_code` varchar(20) NOT NULL,
  `first_name` varchar(80) NOT NULL,
  `last_name` varchar(80) NOT NULL,
  `department_id` int NOT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `faculty_code` (`faculty_code`),
  KEY `user_id` (`user_id`),
  KEY `department_id` (`department_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `faculty`
--

INSERT INTO `faculty` (`id`, `user_id`, `faculty_code`, `first_name`, `last_name`, `department_id`, `designation`, `phone`, `created_at`) VALUES
(1, 2, 'FAC001', 'John', 'Faculty', 1, 'Assistant Professor', NULL, '2026-05-17 09:47:50');

-- --------------------------------------------------------

--
-- Table structure for table `fees`
--

DROP TABLE IF EXISTS `fees`;
CREATE TABLE IF NOT EXISTS `fees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `fee_type` enum('tuition','hostel','library','lab','exam','other') NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `due_date` date NOT NULL,
  `paid_date` date DEFAULT NULL,
  `status` enum('pending','paid','overdue','partial') DEFAULT 'pending',
  `payment_method` enum('cash','online','cheque','dd') DEFAULT 'cash',
  `transaction_id` varchar(100) DEFAULT NULL,
  `semester` int DEFAULT NULL,
  `year` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `marks`
--

DROP TABLE IF EXISTS `marks`;
CREATE TABLE IF NOT EXISTS `marks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `course_id` int NOT NULL,
  `exam_type` enum('internal1','internal2','midterm','final','assignment','practical') NOT NULL,
  `max_marks` decimal(5,2) NOT NULL DEFAULT '100.00',
  `obtained_marks` decimal(5,2) NOT NULL,
  `grade` varchar(5) DEFAULT NULL,
  `semester` int NOT NULL,
  `year` int NOT NULL,
  `remarks` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  KEY `course_id` (`course_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notices`
--

DROP TABLE IF EXISTS `notices`;
CREATE TABLE IF NOT EXISTS `notices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `content` text NOT NULL,
  `posted_by` int NOT NULL,
  `target_role` enum('all','student','faculty') DEFAULT 'all',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `posted_by` (`posted_by`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `notices`
--

INSERT INTO `notices` (`id`, `title`, `content`, `posted_by`, `target_role`, `is_active`, `created_at`) VALUES
(1, 'Welcome to SMS', 'Student Management System is live!', 1, 'all', 1, '2026-05-17 09:47:50'),
(2, 'Fee Deadline', 'Last date for fee submission: 30 June 2026.', 1, 'student', 1, '2026-05-17 09:47:50');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
CREATE TABLE IF NOT EXISTS `students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `student_code` varchar(20) NOT NULL,
  `first_name` varchar(80) NOT NULL,
  `last_name` varchar(80) NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `address` text,
  `department_id` int NOT NULL,
  `current_semester` int DEFAULT '1',
  `enrollment_year` int DEFAULT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_code` (`student_code`),
  KEY `user_id` (`user_id`),
  KEY `department_id` (`department_id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `user_id`, `student_code`, `first_name`, `last_name`, `date_of_birth`, `gender`, `phone`, `address`, `department_id`, `current_semester`, `enrollment_year`, `photo_url`, `created_at`, `updated_at`) VALUES
(1, 3, 'STU001', 'Alice', 'Student', NULL, 'Female', NULL, NULL, 1, 3, 2024, NULL, '2026-05-17 09:47:50', '2026-05-17 09:47:50'),
(2, 4, 'STU622698', 'Bharti1', 'Godewar', '2026-04-29', 'Female', '454545', 'Nagpur', 1, 1, 2026, NULL, '2026-05-17 13:30:22', '2026-05-17 13:34:37'),
(3, 5, 'STU413683', 'Mangesh', 'Bhute', '2026-05-14', 'Male', '123456789', 'Nagpur', 1, 2, 2026, NULL, '2026-05-17 16:13:33', '2026-05-17 16:13:33');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','faculty','student') NOT NULL DEFAULT 'student',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Admin User', 'admin@sms.com', '$2a$10$H1TkoNTXuKfrle1EyJfsce4g60eHu/7soHAzQwYznzHMKT6fPPCMK', 'admin', 1, '2026-05-17 09:47:50', '2026-05-17 09:47:50'),
(2, 'John Faculty', 'faculty@sms.com', '$2a$10$0cVQ4KdMXu4AoZxQW1aD7eyU.qdUicC/aOSZLTvc.BvJh2YfSQWSe', 'faculty', 1, '2026-05-17 09:47:50', '2026-05-17 09:47:50'),
(3, 'Alice Student', 'student@sms.com', '$2a$10$K1qEA8gd7v5tRWjS/ZIO0e.6Y0AeebZObkIGxMLhP5CogJNtJJdXe', 'student', 1, '2026-05-17 09:47:50', '2026-05-17 09:47:50'),
(4, 'Bharti Godewar', 'bharti@123', '$2a$10$3.O4p0v3aknc9C1FZVFPBe8ckABNTVQX6RNgc5JbSaOttIXvG.9Pu', 'student', 1, '2026-05-17 13:30:22', '2026-05-17 13:30:22'),
(5, 'Mangesh Bhute', 'mangesh@sms.com', '$2a$10$Oomm4Yy3zEVGdYiwWpyKP.AxyLGNQv3jfitLgq6Uq4UhhITS9optm', 'student', 1, '2026-05-17 16:13:33', '2026-05-17 16:13:33');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
