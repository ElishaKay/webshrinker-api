CREATE TABLE `domain` (
    `domain_id` int(11) UNSIGNED NOT NULL Auto_increment primary key,
    `url` varchar(50) DEFAULT NULL,
    `category_id` varchar(50) DEFAULT NULL,
    `category_label` varchar(50) DEFAULT NULL,
    `category_parent` varchar(50) DEFAULT NULL,
    `category_score` int(11) UNSIGNED DEFAULT NULL,
    `category_confident` ENUM('true','false') DEFAULT NULL,
    `domain_saved_date` timestamp NULL DEFAULT NULL
);
