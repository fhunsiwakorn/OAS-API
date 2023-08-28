-- Table structure for table `app_country`; 

DROP TABLE IF EXISTS `app_country`; 

CREATE TABLE `app_country` (
  `country_id` int(11) NOT NULL AUTO_INCREMENT,
  `country_name_th` varchar(128) DEFAULT NULL,
  `country_name_eng` varchar(128) DEFAULT NULL,
  `country_official_name_th` varchar(128) DEFAULT NULL,
  `country_official_name_eng` varchar(128) DEFAULT NULL,
  `capital_name_th` varchar(128) DEFAULT NULL,
  `capital_name_eng` varchar(128) DEFAULT NULL,
  `zone` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`country_id`)
) ENGINE=InnoDB AUTO_INCREMENT=197 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Table structure for table `app_course`; 

DROP TABLE IF EXISTS `app_course`; 

CREATE TABLE `app_course` (
  `course_id` int(11) NOT NULL AUTO_INCREMENT,
  `course_cover` varchar(128) NOT NULL,
  `course_code` varchar(128) NOT NULL,
  `course_name` varchar(128) NOT NULL,
  `course_description` varchar(128) NOT NULL,
  `crt_date` datetime NOT NULL,
  `udp_date` datetime NOT NULL,
  `cancelled` int(1) NOT NULL DEFAULT 1,
  `user_crt` int(11) NOT NULL COMMENT 'app_user.user_id',
  `user_udp` int(11) NOT NULL COMMENT 'app_user.user_id',
  PRIMARY KEY (`course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Table structure for table `app_course_lesson`; 

DROP TABLE IF EXISTS `app_course_lesson`; 

CREATE TABLE `app_course_lesson` (
  `cs_id` int(11) NOT NULL AUTO_INCREMENT,
  `cs_cover` varchar(128) NOT NULL,
  `cs_name` varchar(128) NOT NULL,
  `cs_video` varchar(128) NOT NULL,
  `cs_description` text NOT NULL,
  `crt_date` datetime NOT NULL,
  `udp_date` datetime NOT NULL,
  `cancelled` int(1) NOT NULL DEFAULT 1,
  `course_id` int(11) NOT NULL COMMENT 'app_course.course_id',
  `user_crt` int(11) NOT NULL COMMENT 'app_user.user_id',
  `user_udp` int(11) NOT NULL COMMENT 'app_user.user_id',
  PRIMARY KEY (`cs_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Table structure for table `app_exam_cache`; 

DROP TABLE IF EXISTS `app_exam_cache`; 

CREATE TABLE `app_exam_cache` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ec_score` int(3) NOT NULL DEFAULT 0,
  `is_complete` int(1) NOT NULL DEFAULT 0,
  `ec_id` int(11) NOT NULL COMMENT 'app_exam_choice',
  `eq_id` int(11) NOT NULL COMMENT 'app_exam_question.eq_id',
  `em_id` int(11) NOT NULL COMMENT 'app_exam_main.em_id',
  `user_id` int(11) NOT NULL COMMENT 'app_user.user_id',
  `udp_date` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=146 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Table structure for table `app_exam_choice`; 

DROP TABLE IF EXISTS `app_exam_choice`; 

CREATE TABLE `app_exam_choice` (
  `ec_id` int(11) NOT NULL AUTO_INCREMENT,
  `ec_index` int(3) NOT NULL,
  `ec_name` varchar(512) NOT NULL,
  `ec_image` varchar(128) NOT NULL,
  `cancelled` int(1) NOT NULL DEFAULT 1,
  `eq_id` int(11) NOT NULL COMMENT 'app_exam_question.eq_id',
  `em_id` int(11) NOT NULL COMMENT 'app_exam_main.em_id',
  PRIMARY KEY (`ec_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Table structure for table `app_exam_main`; 

DROP TABLE IF EXISTS `app_exam_main`; 

CREATE TABLE `app_exam_main` (
  `em_id` int(11) NOT NULL AUTO_INCREMENT,
  `em_code` varchar(128) NOT NULL,
  `em_name` varchar(128) NOT NULL,
  `em_cover` varchar(128) NOT NULL,
  `em_description` varchar(256) NOT NULL,
  `em_random_amount` int(11) NOT NULL,
  `em_time` time NOT NULL,
  `dlt_code` varchar(3) NOT NULL,
  `crt_date` datetime NOT NULL,
  `udp_date` datetime NOT NULL,
  `cancelled` int(11) NOT NULL DEFAULT 1,
  `user_crt` int(11) NOT NULL COMMENT 'app_user.user_id',
  `user_udp` int(11) NOT NULL COMMENT 'app_user.user_id',
  PRIMARY KEY (`em_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Table structure for table `app_exam_question`; 

DROP TABLE IF EXISTS `app_exam_question`; 

CREATE TABLE `app_exam_question` (
  `eq_id` int(11) NOT NULL AUTO_INCREMENT,
  `eq_name` varchar(512) NOT NULL,
  `eq_image` varchar(128) NOT NULL,
  `eq_answer` int(3) NOT NULL,
  `cancelled` int(1) NOT NULL DEFAULT 1,
  `em_id` int(11) NOT NULL COMMENT 'app_exam_main.em_id',
  PRIMARY KEY (`eq_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Table structure for table `app_exam_result`; 

DROP TABLE IF EXISTS `app_exam_result`; 

CREATE TABLE `app_exam_result` (
  `er_id` int(11) NOT NULL AUTO_INCREMENT,
  `er_score_total` int(11) NOT NULL,
  `er_question_total` int(11) NOT NULL,
  `crt_date` datetime NOT NULL,
  `udp_date` datetime NOT NULL,
  `user_id` int(11) NOT NULL COMMENT 'app_user.user_id	',
  `em_id` int(11) NOT NULL COMMENT 'app_exam_main.em_id',
  PRIMARY KEY (`er_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Table structure for table `app_exam_time`; 

DROP TABLE IF EXISTS `app_exam_time`; 

CREATE TABLE `app_exam_time` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `et_time` time NOT NULL,
  `em_id` int(11) NOT NULL COMMENT 'app_exam_main.em_id',
  `user_id` int(11) NOT NULL COMMENT 'app_user.user_id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Table structure for table `app_news`; 

DROP TABLE IF EXISTS `app_news`; 

CREATE TABLE `app_news` (
  `news_id` int(11) NOT NULL AUTO_INCREMENT,
  `news_cover` varchar(128) NOT NULL,
  `news_title` varchar(128) NOT NULL,
  `news_description` text NOT NULL,
  `news_type` int(1) NOT NULL,
  `crt_date` datetime NOT NULL,
  `udp_date` datetime NOT NULL,
  `cancelled` int(1) NOT NULL DEFAULT 1,
  `user_crt` int(11) NOT NULL COMMENT 'app_user.user_id',
  `user_udp` int(11) NOT NULL COMMENT 'app_user.user_id',
  PRIMARY KEY (`news_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Table structure for table `app_news_image`; 

DROP TABLE IF EXISTS `app_news_image`; 

CREATE TABLE `app_news_image` (
  `ni_id` int(11) NOT NULL AUTO_INCREMENT,
  `ni_path_file` varchar(128) NOT NULL,
  `ni_name_file` varchar(128) NOT NULL,
  `news_id` int(11) NOT NULL COMMENT 'app_news.news_id',
  PRIMARY KEY (`ni_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Table structure for table `app_user`; 

DROP TABLE IF EXISTS `app_user`; 

CREATE TABLE `app_user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(64) NOT NULL,
  `user_password` varchar(128) NOT NULL,
  `user_firstname` varchar(64) NOT NULL,
  `user_lastname` varchar(64) NOT NULL,
  `user_email` varchar(64) NOT NULL,
  `user_phone` varchar(64) NOT NULL,
  `user_type` int(1) NOT NULL,
  `active` int(1) NOT NULL DEFAULT 1,
  `crt_date` datetime NOT NULL,
  `udp_date` datetime NOT NULL,
  `cancelled` int(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='ตาราง User';

-- Table structure for table `app_user_detail`; 

DROP TABLE IF EXISTS `app_user_detail`; 

CREATE TABLE `app_user_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `verify_account` char(1) NOT NULL DEFAULT 'n' COMMENT 'n , y',
  `user_img` varchar(128) NOT NULL,
  `user_birthday` date NOT NULL,
  `user_address` varchar(128) NOT NULL,
  `location_id` int(11) NOT NULL COMMENT 'app_zipcode_lao.id',
  `country_id` int(11) NOT NULL COMMENT 'app_country.country_id',
  `user_id` int(11) NOT NULL COMMENT 'app_user.user_id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Table structure for table `app_user_otp`; 

DROP TABLE IF EXISTS `app_user_otp`; 

CREATE TABLE `app_user_otp` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `otp_code` varchar(6) NOT NULL,
  `otp_ref` varchar(10) NOT NULL,
  `total_request` int(11) NOT NULL,
  `crt_date` datetime NOT NULL,
  `udp_date` datetime NOT NULL,
  `user_id` int(11) NOT NULL COMMENT 'app_user.user_id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- Table structure for table `app_zipcode_lao`; 

DROP TABLE IF EXISTS `app_zipcode_lao`; 

CREATE TABLE `app_zipcode_lao` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `zipcode` varchar(128) NOT NULL,
  `zipcode_name` varchar(128) NOT NULL,
  `amphur_code` varchar(128) NOT NULL,
  `amphur_name` varchar(128) NOT NULL,
  `province_code` varchar(128) NOT NULL,
  `province_name` varchar(128) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=165 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci COMMENT='ตารางรหัสไปรษณีย์ลาว';

