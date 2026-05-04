-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 05, 2026 at 01:29 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `support`
--

-- --------------------------------------------------------

--
-- Table structure for table `car`
--

CREATE TABLE `car` (
  `PlateNumber` varchar(40) NOT NULL,
  `type` varchar(50) NOT NULL,
  `Model` varchar(40) DEFAULT NULL,
  `ManufacturingYear` int(11) DEFAULT NULL,
  `DriverPhone` varchar(20) NOT NULL,
  `MechanicName` varchar(140) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `car`
--

INSERT INTO `car` (`PlateNumber`, `type`, `Model`, `ManufacturingYear`, `DriverPhone`, `MechanicName`) VALUES
('5', 'Sedan', '5', 5, '5', '5'),
('RAE 550 B', 'SUV', 'Toyota Land Cruiser', 2022, '0788123456', 'Jean-Paul'),
('REG100H', 'Truck', 'Toyota', 2024, '0781013100', 'Guillaume');

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `PaymentNumber` int(11) NOT NULL,
  `RecordNumber` int(11) NOT NULL,
  `AmountPaid` decimal(10,2) NOT NULL,
  `PaymentDate` timestamp NULL DEFAULT current_timestamp(),
  `ReceivedBy` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`PaymentNumber`, `RecordNumber`, `AmountPaid`, `PaymentDate`, `ReceivedBy`) VALUES
(3, 23, 80000.00, '2026-04-30 10:38:55', 3),
(4, 24, 60000.00, '2026-05-04 07:43:43', 3),
(5, 25, 60000.00, '2026-05-04 21:43:51', 3),
(6, 26, 60000.00, '2026-05-04 22:25:46', 4);

-- --------------------------------------------------------

--
-- Table structure for table `servicerecord`
--

CREATE TABLE `servicerecord` (
  `RecordNumber` int(11) NOT NULL,
  `ServiceDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `PlateNumber` varchar(40) NOT NULL,
  `ServiceCode` int(11) NOT NULL,
  `Notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `servicerecord`
--

INSERT INTO `servicerecord` (`RecordNumber`, `ServiceDate`, `PlateNumber`, `ServiceCode`, `Notes`) VALUES
(23, '2026-04-30 10:38:55', '5', 2, '44444'),
(24, '2026-05-04 07:43:43', '5', 3, '99'),
(25, '2026-05-04 21:43:51', 'REG100H', 3, 'note that'),
(26, '2026-05-04 22:25:46', 'REG100H', 3, 'hy');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `ServiceCode` int(11) NOT NULL,
  `ServiceName` varchar(100) NOT NULL,
  `ServicePrice` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`ServiceCode`, `ServiceName`, `ServicePrice`) VALUES
(1, 'Engine repair', 150000.00),
(2, 'Transmission repair', 80000.00),
(3, 'Oil Change', 60000.00),
(4, 'Chain replacement', 40000.00),
(5, 'Disc replacement', 400000.00),
(6, 'Wheel alignment', 5000.00),
(7, 'Oil Chane 2', 20000.00),
(8, 'qq', 545.00);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `created_at`) VALUES
(1, 'chief_mechanic', '$2b$12$Ck.ly3bN67HhH7.DgQrAjuRf/euFweLTD8DIIiNcwQHfjJWBkxSq.', '2026-04-30 02:00:54'),
(3, 'amani', '$2b$12$.9yjhDX9G5GUVLKrRNYDOu.lbUHkLioR0Vp7PFDhuS.eQSw8TjGdi', '2026-04-30 08:51:08'),
(4, 'imfura', '$2b$12$7aCkU8LRZlZa.tRwzOwhgOw/qMX5527zCGNPWliKTEkgLQYbjGFwy', '2026-05-04 21:51:46');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `car`
--
ALTER TABLE `car`
  ADD PRIMARY KEY (`PlateNumber`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`PaymentNumber`),
  ADD KEY `FK_ServiceRecord` (`RecordNumber`),
  ADD KEY `FK_User` (`ReceivedBy`);

--
-- Indexes for table `servicerecord`
--
ALTER TABLE `servicerecord`
  ADD PRIMARY KEY (`RecordNumber`),
  ADD KEY `FK_Car` (`PlateNumber`),
  ADD KEY `FK_Service` (`ServiceCode`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`ServiceCode`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `PaymentNumber` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `servicerecord`
--
ALTER TABLE `servicerecord`
  MODIFY `RecordNumber` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `ServiceCode` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `FK_ServiceRecord` FOREIGN KEY (`RecordNumber`) REFERENCES `servicerecord` (`RecordNumber`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_User` FOREIGN KEY (`ReceivedBy`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `servicerecord`
--
ALTER TABLE `servicerecord`
  ADD CONSTRAINT `FK_Car` FOREIGN KEY (`PlateNumber`) REFERENCES `car` (`PlateNumber`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_Service` FOREIGN KEY (`ServiceCode`) REFERENCES `services` (`ServiceCode`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
