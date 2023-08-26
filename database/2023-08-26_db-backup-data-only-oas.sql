-- Dumping data for table `app_course` 

INSERT INTO `app_course` VALUES('1','007','12345','เขียนโปรแกรม','ไม่มีอะไรเลย','2023-07-07 15:23:43','2023-07-07 15:23:43','1','1','1');



-- Dumping data for table `app_course_lesson` 

INSERT INTO `app_course_lesson` VALUES('1','007','12345','-','-','2023-07-07 15:23:43','2023-07-07 15:23:43','0','1','1','1');



-- Dumping data for table `app_exam_cache` 

INSERT INTO `app_exam_cache` VALUES('144','1','1','1','1','2','1','2023-08-23 15:07:26');
INSERT INTO `app_exam_cache` VALUES('145','0','1','0','2','2','1','2023-08-23 15:07:26');



-- Dumping data for table `app_exam_choice` 

INSERT INTO `app_exam_choice` VALUES('1','1','ขับรถนะ ','url/image','1','1','2');
INSERT INTO `app_exam_choice` VALUES('2','2','บ้านไผ่อยู่ จังหวัดไหน ?','url/image','1','1','2');
INSERT INTO `app_exam_choice` VALUES('3','1','เมืองพลอยู่ จังหวัดไหน ?','url/image','1','2','2');
INSERT INTO `app_exam_choice` VALUES('4','1','เมืองพลอยู่ จังหวัดไหน ?','url/image','1','3','1');
INSERT INTO `app_exam_choice` VALUES('5','3','เมืองพลอยู่ จังหวัดไหน ?','url/image','1','3','1');



-- Dumping data for table `app_exam_main` 

INSERT INTO `app_exam_main` VALUES('2','007','ขับรถยนต์','url/image','ไม่มีอะไรเลย','50','00:59:00','B','2023-08-05 16:05:31','2023-08-26 10:53:41','1','1','1');
INSERT INTO `app_exam_main` VALUES('4','013','New Jean','url/image','ไม่มีอะไรเลย','50','00:59:00','A','2023-08-26 10:52:48','2023-08-26 10:52:48','1','1','1');



-- Dumping data for table `app_exam_question` 

INSERT INTO `app_exam_question` VALUES('1','ม้าอะไรบินได้','url/image','1','1','2');
INSERT INTO `app_exam_question` VALUES('2','2 + 2 เท่ากับ','url/image','2','1','2');
INSERT INTO `app_exam_question` VALUES('3','2 + 2 เท่ากับ','url/image','2','1','1');
INSERT INTO `app_exam_question` VALUES('4','3 + 2 เท่ากับ','url/image','2','1','1');



-- Dumping data for table `app_exam_result` 

INSERT INTO `app_exam_result` VALUES('1','1','2','2023-08-23 12:55:26','2023-08-23 12:55:26','1','2');
INSERT INTO `app_exam_result` VALUES('2','0','2','2023-08-23 14:39:01','2023-08-23 14:39:01','1','2');
INSERT INTO `app_exam_result` VALUES('3','1','2','2023-08-23 15:02:00','2023-08-23 15:02:00','1','2');
INSERT INTO `app_exam_result` VALUES('4','1','2','2023-08-23 15:02:00','2023-08-23 15:02:00','1','2');



-- Dumping data for table `app_exam_time` 

INSERT INTO `app_exam_time` VALUES('2','00:25:00','2','1');



-- Dumping data for table `app_news` 

INSERT INTO `app_news` VALUES('1','fhun','12345','-----','1','2023-07-07 15:15:23','2023-07-07 15:23:43','1','1','1');
INSERT INTO `app_news` VALUES('2','fhun','12345','เจน','1','2023-07-07 15:23:43','2023-07-07 15:23:43','1','1','1');
INSERT INTO `app_news` VALUES('3','fhun','12345','เจน','1','2023-07-07 15:23:43','2023-07-07 15:23:43','1','1','1');
INSERT INTO `app_news` VALUES('4','fhun','12345','เจน','1','2023-07-07 15:23:43','2023-07-07 15:23:43','1','1','1');
INSERT INTO `app_news` VALUES('5','fhun','12345','เจน','2','2023-07-07 15:23:43','2023-07-07 15:23:43','1','1','1');
INSERT INTO `app_news` VALUES('6','fhun','12345','เจน','2','2023-07-07 17:02:00','2023-07-07 17:02:00','1','1','1');
INSERT INTO `app_news` VALUES('7','ไม่บอก อย่าหลอกถาม','12345','เจน','2','2023-07-07 17:02:00','2023-07-07 17:02:00','1','1','1');
INSERT INTO `app_news` VALUES('12','ไม่บอก อย่าหลอกถาม 55','12345','เจน','2','2023-07-07 17:05:46','2023-07-07 17:05:46','1','1','1');
INSERT INTO `app_news` VALUES('13','ไม่บอก อย่าหลอกถาม 36','12345','เจน','2','2023-07-07 17:05:46','2023-07-07 17:05:46','1','1','1');



-- Dumping data for table `app_news_image` 

INSERT INTO `app_news_image` VALUES('9','fhun','12345','1');
INSERT INTO `app_news_image` VALUES('10','fhun','12345','1');
INSERT INTO `app_news_image` VALUES('11','path','test','1');
INSERT INTO `app_news_image` VALUES('12','path','test','1');
INSERT INTO `app_news_image` VALUES('13','path','test','1');



-- Dumping data for table `app_user` 

INSERT INTO `app_user` VALUES('1','faii','$2b$08$sQQBSFKRNyqFm5V1CIlfOOaNTDKaCKYPL6kweMIq9Qo15AYoeczke','เจน','เป็นมงคล','test@gmail.com','0943908077','3','1','2023-07-07 15:15:23','2023-07-07 15:15:23','1');
INSERT INTO `app_user` VALUES('6','faii2','$2b$08$IYXlj1qutrNci..rPDPA9.8F6YpHB5HE9EuS03To.u8SuMSTGNxam','เจน','เป็นมงคล','test@gmail2.com','0943908076','3','1','2023-08-26 11:58:34','2023-08-26 11:58:34','1');



-- Dumping data for table `app_user_detail` 




-- Dumping data for table `app_zipcode_lao` 

INSERT INTO `app_zipcode_lao` VALUES('1','01000','ໄປສະນີກາງ','c345db74601792cbf388bfb943cec7af','ຈັນທະບູລີ','e3d3882b778463af79d910587471bc54','ນະຄອນຫຼວງ');
INSERT INTO `app_zipcode_lao` VALUES('2','01010','ສີໄຄ','ee884b2039581984dbd995e268ffcdfa','ສີໂຄດຕະບອງ','e3d3882b778463af79d910587471bc54','ນະຄອນຫຼວງ');
INSERT INTO `app_zipcode_lao` VALUES('3','01020','ວັດໄຕ','ee884b2039581984dbd995e268ffcdfa','ສີໂຄດຕະບອງ','e3d3882b778463af79d910587471bc54','ນະຄອນຫຼວງ');
INSERT INTO `app_zipcode_lao` VALUES('4','01030','ຈີ່ນາຍໂມ້','45ac47309ea3e56392e30ea545966a0c','ສີສັດຕະນາກ','e3d3882b778463af79d910587471bc54','ນະຄອນຫຼວງ');
INSERT INTO `app_zipcode_lao` VALUES('5','01070','ທ່າງ່ອນ','90c021683e774817ded1e6636830a4c6','ໄຊທານີ','e3d3882b778463af79d910587471bc54','ນະຄອນຫຼວງ');
INSERT INTO `app_zipcode_lao` VALUES('6','01080','ດົງໂດກ','90c021683e774817ded1e6636830a4c6','ໄຊທານີ','e3d3882b778463af79d910587471bc54','ນະຄອນຫຼວງ');
INSERT INTO `app_zipcode_lao` VALUES('7','01110','ທ່າເດື່ອ','ee382fd22a4f6f91d9c478e8d28f6da8','ຫາດຊາຍຟອງ','e3d3882b778463af79d910587471bc54','ນະຄອນຫຼວງ');
INSERT INTO `app_zipcode_lao` VALUES('8','01120','ບ້ານຫ້ອມ','ee382fd22a4f6f91d9c478e8d28f6da8','ຫາດຊາຍຟອງ','e3d3882b778463af79d910587471bc54','ນະຄອນຫຼວງ');
INSERT INTO `app_zipcode_lao` VALUES('9','01140','ນາຊາຍທອງ','204405ec75594c72ed5b5f1de82adea7','ນາຊາຍທອງ','e3d3882b778463af79d910587471bc54','ນະຄອນຫຼວງ');
INSERT INTO `app_zipcode_lao` VALUES('10','01160','ທາດຫຼວງ','50e9e73fe33cf75e1ce01810b8da0a9f','ໄຊເສດຖາ','e3d3882b778463af79d910587471bc54','ນະຄອນຫຼວງ');
INSERT INTO `app_zipcode_lao` VALUES('11','01170','ດອນໜູນ','90c021683e774817ded1e6636830a4c6','ໄຊທານີ','e3d3882b778463af79d910587471bc54','ນະຄອນຫຼວງ');
INSERT INTO `app_zipcode_lao` VALUES('12','01180','ທ່ານາແລ້ງ','ee382fd22a4f6f91d9c478e8d28f6da8','ຫາດຊາຍຟອງ','e3d3882b778463af79d910587471bc54','ນະຄອນຫຼວງ');
INSERT INTO `app_zipcode_lao` VALUES('13','01190','ສັງທອງ','11efee15ff277116c844a178a1dc6f6b','ສັງທອງ','e3d3882b778463af79d910587471bc54','ນະຄອນຫຼວງ');
INSERT INTO `app_zipcode_lao` VALUES('14','01200','ປາກງື່ມ','d2ae7aa3e01a2c4ba60d68f52ca93185','ປາກງື່ມ','e3d3882b778463af79d910587471bc54','ນະຄອນຫຼວງ');
INSERT INTO `app_zipcode_lao` VALUES('15','01210','ຊ້າງຄູ້','90c021683e774817ded1e6636830a4c6','ໄຊທານີ','e3d3882b778463af79d910587471bc54','ນະຄອນຫຼວງ');
INSERT INTO `app_zipcode_lao` VALUES('16','01220','ດົງຄຳຊ້າງ','ee382fd22a4f6f91d9c478e8d28f6da8','ຫາດຊາຍຟອງ','e3d3882b778463af79d910587471bc54','ນະຄອນຫຼວງ');
INSERT INTO `app_zipcode_lao` VALUES('17','02000','ຜົ້ງສາລີ','b6734805c6d50f688bdd2aa1e140aafc','ຜົ້ງສາລີ','b6734805c6d50f688bdd2aa1e140aafc','ຜົ້ງສາລີ');
INSERT INTO `app_zipcode_lao` VALUES('18','02010','ເມືອງຂວາ','8ac050e82d2f4164a00b3b2887d4f853','ຂວາ','b6734805c6d50f688bdd2aa1e140aafc','ຜົ້ງສາລີ');
INSERT INTO `app_zipcode_lao` VALUES('19','02030','ສຳພັນ','47c8ce687076b3746721c6f963273c53','ສຳພັນ','b6734805c6d50f688bdd2aa1e140aafc','ຜົ້ງສາລີ');
INSERT INTO `app_zipcode_lao` VALUES('20','02040','ເມືອງໃໝ່','0de22506456a41604240ce96de63256e','ໃໝ່','b6734805c6d50f688bdd2aa1e140aafc','ຜົ້ງສາລີ');
INSERT INTO `app_zipcode_lao` VALUES('21','02050','ບຸນເໜືອ','b02fa3128741df4256978390895738a6','ບຸນເໜືອ','b6734805c6d50f688bdd2aa1e140aafc','ຜົ້ງສາລີ');
INSERT INTO `app_zipcode_lao` VALUES('22','02060','ບຸນໃຕ້','e1b909fcfac04975be1b04e8db80ce3f','ບຸນໃຕ້','b6734805c6d50f688bdd2aa1e140aafc','ຜົ້ງສາລີ');
INSERT INTO `app_zipcode_lao` VALUES('23','02070','ຍອດອູ','c34d0b6eea8126012435022622689acb','ຍອດອູ','b6734805c6d50f688bdd2aa1e140aafc','ຜົ້ງສາລີ');
INSERT INTO `app_zipcode_lao` VALUES('24','03000','ຫຼວງນ້ຳທາ','1b3aa3c4c06eb2b5564a33df20ce5640','ຫຼວງນ້ຳທາ','1b3aa3c4c06eb2b5564a33df20ce5640','ຫຼວງນ້ຳທາ');
INSERT INTO `app_zipcode_lao` VALUES('25','03010','ເມືອງສິງ','2578898fdbd71377ddab511ee1fd054c','ສິງ','1b3aa3c4c06eb2b5564a33df20ce5640','ຫຼວງນ້ຳທາ');
INSERT INTO `app_zipcode_lao` VALUES('26','03020','ນາແລ','c1f1ac0264c726d8678fd49365dfd43b','ນາແລ','1b3aa3c4c06eb2b5564a33df20ce5640','ຫຼວງນ້ຳທາ');
INSERT INTO `app_zipcode_lao` VALUES('27','03030','ວຽງພູຄາ','e8b7601b756a9ccfd82e6572a7ed1f49','ວຽງພູຄາ','1b3aa3c4c06eb2b5564a33df20ce5640','ຫຼວງນ້ຳທາ');
INSERT INTO `app_zipcode_lao` VALUES('28','3040','ເມືອງລອງ','a2dd864ce653205f7babaa7878de26ba','ລອງ','1b3aa3c4c06eb2b5564a33df20ce5640','ຫຼວງນ້ຳທາ');
INSERT INTO `app_zipcode_lao` VALUES('29','04000','ອຸດົມໄຊ','030e542cf9b293a3fe5bf37cef15853a','ໄຊ','2982159c3df2f6a87f5cdaf6f83d1b1b','ອຸດົມໄຊ');
INSERT INTO `app_zipcode_lao` VALUES('30','04010','ເມືອງຫຼາ','1bf4881fce68c426d7926abd9faeed42','ຫຼາ','2982159c3df2f6a87f5cdaf6f83d1b1b','ອຸດົມໄຊ');
INSERT INTO `app_zipcode_lao` VALUES('31','04020','ນາໝໍ້','e5a59eac17361c994193880a94dca6eb','ນາໝໍ້','2982159c3df2f6a87f5cdaf6f83d1b1b','ອຸດົມໄຊ');
INSERT INTO `app_zipcode_lao` VALUES('32','04030','ເມືອງງາ','1e341f889badec3a72852c00718c61c0','ງາ','2982159c3df2f6a87f5cdaf6f83d1b1b','ອຸດົມໄຊ');
INSERT INTO `app_zipcode_lao` VALUES('33','04040','ເມືອງແບ່ງ','69e617793ed65b35173237b2a9a4bac6','ແບ່ງ','2982159c3df2f6a87f5cdaf6f83d1b1b','ອຸດົມໄຊ');
INSERT INTO `app_zipcode_lao` VALUES('34','04050','ເມືອງຮຸນ','11c48c2229dcd1a804ef550f7184adf8','ຮຸນ','2982159c3df2f6a87f5cdaf6f83d1b1b','ອຸດົມໄຊ');
INSERT INTO `app_zipcode_lao` VALUES('35','04053','ຍາຊຽງດີ','11c48c2229dcd1a804ef550f7184adf8','ຮຸນ','2982159c3df2f6a87f5cdaf6f83d1b1b','ອຸດົມໄຊ');
INSERT INTO `app_zipcode_lao` VALUES('36','04060','ປາກແບ່ງ','51d970351dfa2ce9b08a88c73a1a3c40','ປາກແບ່ງ','2982159c3df2f6a87f5cdaf6f83d1b1b','ອຸດົມໄຊ');
INSERT INTO `app_zipcode_lao` VALUES('37','05000','ຫ້ວຍຊາຍ','fec574653d9e1df2f75fb851d744a771','ຫ້ວຍຊາຍ','c1ae7c1b7b1f88c97075dc6cdb4233f6','ບໍ່ແກ້ວ');
INSERT INTO `app_zipcode_lao` VALUES('38','05010','ຕົ້ນເຜິ້ງ','703c0ba928230455c513ab1b61433349','ຕົ້ນເຜິ້ງ','c1ae7c1b7b1f88c97075dc6cdb4233f6','ບໍ່ແກ້ວ');
INSERT INTO `app_zipcode_lao` VALUES('39','05020','ເມືອງເມິງ','025cb070ee4b683a1deecba4b646aeec','ເມິງ','c1ae7c1b7b1f88c97075dc6cdb4233f6','ບໍ່ແກ້ວ');
INSERT INTO `app_zipcode_lao` VALUES('40','05030','ປາກທາ','8f77d5e38ebda5e3605511f06d33befa','ປາກທາ','c1ae7c1b7b1f88c97075dc6cdb4233f6','ບໍ່ແກ້ວ');
INSERT INTO `app_zipcode_lao` VALUES('41','05040','ຜາອຸດົມ','bbcc76b86e2489b217aad4e93052955d','ຜາອຸດົມ','c1ae7c1b7b1f88c97075dc6cdb4233f6','ບໍ່ແກ້ວ');
INSERT INTO `app_zipcode_lao` VALUES('42','06000','ຫຼວງພະບາງ','a35e3e6e78f721e43d9f436427619c01','ຫຼວງພະບາງ','a35e3e6e78f721e43d9f436427619c01','ຫຼວງພະບາງ');
INSERT INTO `app_zipcode_lao` VALUES('43','06010','ຊຽງເງິນ','0639cee842c407fde858908ab73fe7d0','ຊຽງເງິນ','a35e3e6e78f721e43d9f436427619c01','ຫຼວງພະບາງ');
INSERT INTO `app_zipcode_lao` VALUES('44','06020','ເມືອງນານ','2174af4f4ebec63083e3cbc647acd941','ນານ','a35e3e6e78f721e43d9f436427619c01','ຫຼວງພະບາງ');
INSERT INTO `app_zipcode_lao` VALUES('45','06030','ປາກອູ','5b9be9a585c54336c2d62ebddce2674f','ປາກອູ','a35e3e6e78f721e43d9f436427619c01','ຫຼວງພະບາງ');
INSERT INTO `app_zipcode_lao` VALUES('46','06040','ນ້ຳບາກ','a29d2b70e315bfef8159f248fdeb3d83','ນ້ຳບາກ','a35e3e6e78f721e43d9f436427619c01','ຫຼວງພະບາງ');
INSERT INTO `app_zipcode_lao` VALUES('47','06050','ເມືອງງອຍ','787c48344cff553f0b9c5f0308059455','ງອຍ','a35e3e6e78f721e43d9f436427619c01','ຫຼວງພະບາງ');
INSERT INTO `app_zipcode_lao` VALUES('48','06060','ປາກແຊງ','9542f7f9737eddaf1a5ab169b398287b','ປາກແຊງ','a35e3e6e78f721e43d9f436427619c01','ຫຼວງພະບາງ');
INSERT INTO `app_zipcode_lao` VALUES('49','06070','ໂພນໄຊ','758dd625ec83e26024abb53f54d5ddbb','ໂພນໄຊ','a35e3e6e78f721e43d9f436427619c01','ຫຼວງພະບາງ');
INSERT INTO `app_zipcode_lao` VALUES('50','06080','ເມືອງຂາຍ','a35e3e6e78f721e43d9f436427619c01','ຫຼວງພະບາງ','a35e3e6e78f721e43d9f436427619c01','ຫຼວງພະບາງ');
INSERT INTO `app_zipcode_lao` VALUES('51','06090','ວຽງຄຳ','30dea0f91873c4de0ce64dedb82f5e66','ວຽງຄຳ','a35e3e6e78f721e43d9f436427619c01','ຫຼວງພະບາງ');
INSERT INTO `app_zipcode_lao` VALUES('52','06100','ພູຄູນ','527759d2463cb25f8e93081525fa3095','ພູຄູນ','a35e3e6e78f721e43d9f436427619c01','ຫຼວງພະບາງ');
INSERT INTO `app_zipcode_lao` VALUES('53','06110','ຈອມເພັດ','e0165b14c9ad24204ea63d802f6448d0','ຈອມເພັດ','a35e3e6e78f721e43d9f436427619c01','ຫຼວງພະບາງ');
INSERT INTO `app_zipcode_lao` VALUES('54','06130','ກິ່ວກະຈາ','4c09e6191c12c5f87ac91fce29feab01','ຊຽງເງິຮ','a35e3e6e78f721e43d9f436427619c01','ຫຼວງພະບາງ');
INSERT INTO `app_zipcode_lao` VALUES('55','06140','ນ້ຳຖ້ວມ','a29d2b70e315bfef8159f248fdeb3d83','ນ້ຳບາກ','a35e3e6e78f721e43d9f436427619c01','ຫຼວງພະບາງ');
INSERT INTO `app_zipcode_lao` VALUES('56','06160','ມະຫາວິທະຍາໄລ ສຸພານຸວົງ','a35e3e6e78f721e43d9f436427619c01','ຫຼວງພະບາງ','a35e3e6e78f721e43d9f436427619c01','ຫຼວງພະບາງ');
INSERT INTO `app_zipcode_lao` VALUES('57','07000','ຊຳເໜືອ','908578a284ff7536543fdd72c31d448a','ຊຳເໜືອ','5ded2fd54a24fa19351f508cfa8e865d','ຫົວພັນ');
INSERT INTO `app_zipcode_lao` VALUES('58','07010','ຊຽງຄໍ້','8f45a0c06f46645c91c8be9e41bde3cd','ຊຽງຄໍ້','5ded2fd54a24fa19351f508cfa8e865d','ຫົວພັນ');
INSERT INTO `app_zipcode_lao` VALUES('59','07020','ວຽງທອງ','9bcc8d5b8dcef863b63494cdafdacc48','ວຽງທອງ','5ded2fd54a24fa19351f508cfa8e865d','ຫົວພັນ');
INSERT INTO `app_zipcode_lao` VALUES('60','07030','ວຽງໄຊ','38599476e43e2d7067c5f05d1a8ce3fa','ວຽງໄຊ','5ded2fd54a24fa19351f508cfa8e865d','ຫົວພັນ');
INSERT INTO `app_zipcode_lao` VALUES('61','07040','ຫົວເມືອງ','1a5ad80a3602494931a8fc8b49ff9615','ຫົວເມືອງ','5ded2fd54a24fa19351f508cfa8e865d','ຫົວພັນ');
INSERT INTO `app_zipcode_lao` VALUES('62','07050','ຊຳໃຕ້','25899599fdb09f734e6bb034c60f6708','ຊຳໃຕ້','5ded2fd54a24fa19351f508cfa8e865d','ຫົວພັນ');
INSERT INTO `app_zipcode_lao` VALUES('63','07060','ເມືອງແອດ','837bf0d8c857aa33e2e0059d95536684','ແອດ','5ded2fd54a24fa19351f508cfa8e865d','ຫົວພັນ');
INSERT INTO `app_zipcode_lao` VALUES('64','07070','ສົບເບົາ','7cc90df36c0072c447f543f185690757','ສົບເບົາ','5ded2fd54a24fa19351f508cfa8e865d','ຫົວພັນ');
INSERT INTO `app_zipcode_lao` VALUES('65','08000','ໄຊຍະບູລີ','2e16d9b84b20671bb6e93715f1eb9c73','ໄຊຍະບູລີ','2e16d9b84b20671bb6e93715f1eb9c73','ໄຊຍະບູລີ');
INSERT INTO `app_zipcode_lao` VALUES('66','08010','ເມືອງພຽງ','631977b3951c10af693a64905cf6bc83','ພຽງ','2e16d9b84b20671bb6e93715f1eb9c73','ໄຊຍະບູລີ');
INSERT INTO `app_zipcode_lao` VALUES('67','08020','ປາກລາຍ','5b5d3ccb19521029466d7135cd001320','ປາກລາຍ','2e16d9b84b20671bb6e93715f1eb9c73','ໄຊຍະບູລີ');
INSERT INTO `app_zipcode_lao` VALUES('68','08030','ແກ່ນທ້າວ','d3e421ad75c975c3316d20490bef9133','ແກ່ນທ້າວ','2e16d9b84b20671bb6e93715f1eb9c73','ໄຊຍະບູລີ');
INSERT INTO `app_zipcode_lao` VALUES('69','08040','ຫົງສ','5df1a1cbe3d76ed81b0640f06ade3e80','ຫົງສ','2e16d9b84b20671bb6e93715f1eb9c73','ໄຊຍະບູລີ');
INSERT INTO `app_zipcode_lao` VALUES('70','08050','ຊຽງຮ່ອນ','ad3fb3e79f744d2a7406fd891e4d36bf','ຊຽງຮ່ອນ','2e16d9b84b20671bb6e93715f1eb9c73','ໄຊຍະບູລີ');
INSERT INTO `app_zipcode_lao` VALUES('71','08060','ເມືອງເງິນ','4c6b477668dcb96f004e49ecb41a7129','ເມືອງເງິນ','2e16d9b84b20671bb6e93715f1eb9c73','ໄຊຍະບູລີ');
INSERT INTO `app_zipcode_lao` VALUES('72','08070','ເມືອງຄອບ','f7c6500eaae4f9b244f4d5a670fd7833','ຄອບ','2e16d9b84b20671bb6e93715f1eb9c73','ໄຊຍະບູລີ');
INSERT INTO `app_zipcode_lao` VALUES('73','08090','ທົ່ງມີໄຊ','ac53b6c525ce574d86b7da0c1fe978bb','ທົ່ງມີໄຊ','2e16d9b84b20671bb6e93715f1eb9c73','ໄຊຍະບູລີ');
INSERT INTO `app_zipcode_lao` VALUES('74','08100','ນ້ຳປຸຍ','631977b3951c10af693a64905cf6bc83','ພຽງ','2e16d9b84b20671bb6e93715f1eb9c73','ໄຊຍະບູລີ');
INSERT INTO `app_zipcode_lao` VALUES('75','09000','ໂພນສະຫວັນ','b32b54f1e3138b477d707c3997792aa4','ແປກ','9c6201b031799ba3ea02214d115e3b21','ຊຽງຂວາງ');
INSERT INTO `app_zipcode_lao` VALUES('76','09010','ເມືອງຄຳ','f1861f555a0f8d728883e26868053b92','ຄຳ','9c6201b031799ba3ea02214d115e3b21','ຊຽງຂວາງ');
INSERT INTO `app_zipcode_lao` VALUES('77','09030','ເມືອງຄູນ','b1608ebb6ba3a9c2914ccca52e96fa13','ຄູນ','9c6201b031799ba3ea02214d115e3b21','ຊຽງຂວາງ');
INSERT INTO `app_zipcode_lao` VALUES('78','09040','ໜອງແຮດ','ea50daabaa0535600782e08672e5141d','ໜອງແຮດ','9c6201b031799ba3ea02214d115e3b21','ຊຽງຂວາງ');
INSERT INTO `app_zipcode_lao` VALUES('79','09050','ຜາໄຊ','a1a3a99b4f8e248d73c3f1bbbfd4d9a2','ຜາໄຊ','9c6201b031799ba3ea02214d115e3b21','ຊຽງຂວາງ');
INSERT INTO `app_zipcode_lao` VALUES('80','09060','ນ້ຳຫງຳ','b32b54f1e3138b477d707c3997792aa4','ແປກ','9c6201b031799ba3ea02214d115e3b21','ຊຽງຂວາງ');
INSERT INTO `app_zipcode_lao` VALUES('81','09070','ໜອງເປັດ','b32b54f1e3138b477d707c3997792aa4','ແປກ','9c6201b031799ba3ea02214d115e3b21','ຊຽງຂວາງ');
INSERT INTO `app_zipcode_lao` VALUES('82','09080','ເມືອງໝອກ','a08c8f627e80573015d199383ea0ec0b','ໝອກ','9c6201b031799ba3ea02214d115e3b21','ຊຽງຂວາງ');
INSERT INTO `app_zipcode_lao` VALUES('83','09090','ພູກູດ','fd2d943151ca87e0675aec70bbd611bc','ພູກູດ','9c6201b031799ba3ea02214d115e3b21','ຊຽງຂວາງ');
INSERT INTO `app_zipcode_lao` VALUES('84','09100','ທ່າວຽງໄຊ','59061ceac4c25d156ebe7ad6c948e991','ທ່າໂທມ','9c6201b031799ba3ea02214d115e3b21','ຊຽງຂວາງ');
INSERT INTO `app_zipcode_lao` VALUES('85','09110','ລ້ອງມັດໃຕ້','f1861f555a0f8d728883e26868053b92','ຄຳ','9c6201b031799ba3ea02214d115e3b21','ຊຽງຂວາງ');
INSERT INTO `app_zipcode_lao` VALUES('86','09130','ບ້ານສຸຍ','fd2d943151ca87e0675aec70bbd611bc','ພູກູດ','9c6201b031799ba3ea02214d115e3b21','ຊຽງຂວາງ');
INSERT INTO `app_zipcode_lao` VALUES('87','10000','ໂພນໂຮງ','2235090b793065d208b7a7235e2f5fb9','ໂພນໂຮງ','9fd4a5106385b2bf9a16e01e56b4651c','ວຽງຈັນ');
INSERT INTO `app_zipcode_lao` VALUES('88','10010','ບ້ານເກິນ','66dcface3b50e87a9ed31b650348664a','ທຸລະຄົມ','9fd4a5106385b2bf9a16e01e56b4651c','ວຽງຈັນ');
INSERT INTO `app_zipcode_lao` VALUES('89','10020','ທ່າລາດ','b4404484192719872f73a8c3c77069c7','ແກ້ວອຸດົມ','9fd4a5106385b2bf9a16e01e56b4651c','ວຽງຈັນ');
INSERT INTO `app_zipcode_lao` VALUES('90','10030','ວັງວຽງ','819fa8aa09ea27c1e11e78a402d490d8','ວັງວຽງ','9fd4a5106385b2bf9a16e01e56b4651c','ວຽງຈັນ');
INSERT INTO `app_zipcode_lao` VALUES('91','10040','ໄຊສົມບູນ','24ea2b0ae414af94c3cbfb42b570ddad','ໄຊສົມບູນ','9fd4a5106385b2bf9a16e01e56b4651c','ວຽງຈັນ');
INSERT INTO `app_zipcode_lao` VALUES('92','10050','ເມືອງເຟືອງ','3e077a7cb467e6f4cb2acf625576e83c','ເຟືອງ','9fd4a5106385b2bf9a16e01e56b4651c','ວຽງຈັນ');
INSERT INTO `app_zipcode_lao` VALUES('93','10060','ຊະນະຄາມ','150ce882d8508cfc277ddea930ca6fdd','ຊະນະຄາມ','9fd4a5106385b2bf9a16e01e56b4651c','ວຽງຈັນ');
INSERT INTO `app_zipcode_lao` VALUES('94','10070','ກາສີ','4dae2ce3b27719e2d109f2d6e124cd26','ກາສີ','9fd4a5106385b2bf9a16e01e56b4651c','ວຽງຈັນ');
INSERT INTO `app_zipcode_lao` VALUES('95','10080','ຜາລະແວກ','f39f572829d39ec2533b4a9bc0dd3072','ຮົ່ມ','9fd4a5106385b2bf9a16e01e56b4651c','ວຽງຈັນ');
INSERT INTO `app_zipcode_lao` VALUES('96','10100','ຫຼັກ52','2235090b793065d208b7a7235e2f5fb9','ໂພນໂຮງ','9fd4a5106385b2bf9a16e01e56b4651c','ວຽງຈັນ');
INSERT INTO `app_zipcode_lao` VALUES('97','10110','ໂຮງຮຽນເຕັກນິກ','30dea0f91873c4de0ce64dedb82f5e66','ວຽງຄຳ','9fd4a5106385b2bf9a16e01e56b4651c','ວຽງຈັນ');
INSERT INTO `app_zipcode_lao` VALUES('98','10120','ໂນນໄຮ','30dea0f91873c4de0ce64dedb82f5e66','ວຽງຄຳ','9fd4a5106385b2bf9a16e01e56b4651c','ວຽງຈັນ');
INSERT INTO `app_zipcode_lao` VALUES('99','10130','ລ້ອງຊານ','f39f572829d39ec2533b4a9bc0dd3072','ຮົ່ມ','9fd4a5106385b2bf9a16e01e56b4651c','ວຽງຈັນ');
INSERT INTO `app_zipcode_lao` VALUES('100','10140','516','f39f572829d39ec2533b4a9bc0dd3072','ຮົ່ມ','9fd4a5106385b2bf9a16e01e56b4651c','ວຽງຈັນ');
INSERT INTO `app_zipcode_lao` VALUES('101','10150','ເມືອງແມດ','d492b92af53b4d9b0d4da1c3558a9491','ແມດ','9fd4a5106385b2bf9a16e01e56b4651c','ວຽງຈັນ');
INSERT INTO `app_zipcode_lao` VALUES('102','10160','ຫີນຫົວເສືອ','24ea2b0ae414af94c3cbfb42b570ddad','ໄຊສົມບູນ','9fd4a5106385b2bf9a16e01e56b4651c','ວຽງຈັນ');
INSERT INTO `app_zipcode_lao` VALUES('103','10170','ນ້ຳຍອນ','24ea2b0ae414af94c3cbfb42b570ddad','ໄຊສົມບູນ','9fd4a5106385b2bf9a16e01e56b4651c','ວຽງຈັນ');
INSERT INTO `app_zipcode_lao` VALUES('104','11000','ປາກຊັນ','47657a989ee173118155b328b8b30de7','ປາກຊັນ','dbca658d5da6f4251234dcc24382016b','ບໍລິຄຳໄຊ');
INSERT INTO `app_zipcode_lao` VALUES('105','11010','ບໍລິຄັນ','60c5da675e3aec35efcb595296798582','ບໍລິຄັນ','dbca658d5da6f4251234dcc24382016b','ບໍລິຄຳໄຊ');
INSERT INTO `app_zipcode_lao` VALUES('106','11020','ປາກກະດິງ','b9ebe9306214715857013edceea41145','ປາກກະດິງ','dbca658d5da6f4251234dcc24382016b','ບໍລິຄຳໄຊ');
INSERT INTO `app_zipcode_lao` VALUES('107','11030','ທ່າບົກ','8f0e6b14e98e63ebea0711e8a9d95179','ທ່າພະບາດ','dbca658d5da6f4251234dcc24382016b','ບໍລິຄຳໄຊ');
INSERT INTO `app_zipcode_lao` VALUES('108','11040','ຫຼັກ20','644fa54b428c4b7d39a9f6c923a4a65f','ຄຳເກີດ','dbca658d5da6f4251234dcc24382016b','ບໍລິຄຳໄຊ');
INSERT INTO `app_zipcode_lao` VALUES('109','11050','ວຽງທອງ','9bcc8d5b8dcef863b63494cdafdacc48','ວຽງທອງ','dbca658d5da6f4251234dcc24382016b','ບໍລິຄຳໄຊ');
INSERT INTO `app_zipcode_lao` VALUES('110','11060','ທົ່ງນາມີ','b9ebe9306214715857013edceea41145','ປາກກະດິງ','dbca658d5da6f4251234dcc24382016b','ບໍລິຄຳໄຊ');
INSERT INTO `app_zipcode_lao` VALUES('111','11070','ຜາເມືອງ','60c5da675e3aec35efcb595296798582','ບໍລິຄັນ','dbca658d5da6f4251234dcc24382016b','ບໍລິຄຳໄຊ');
INSERT INTO `app_zipcode_lao` VALUES('112','12000','ຄຳມ່ວນ','2a55aa4464cd5dfcdfc5b3394b863bfb','ທ່າແຂກ','0d0f6d7af210ce5ef0e4e8e8b8fab2dc','ຄຳມ່ວນ');
INSERT INTO `app_zipcode_lao` VALUES('113','12010','ມະຫາໄຊ','51ffa27ce838e021048cddd6e75c2619','ມະຫາໄຊ','0d0f6d7af210ce5ef0e4e8e8b8fab2dc','ຄຳມ່ວນ');
INSERT INTO `app_zipcode_lao` VALUES('114','12020','ໜອງບົກ','a5e153f0297fd444f28eb737da2b96ef','ໜອງບົກ','0d0f6d7af210ce5ef0e4e8e8b8fab2dc','ຄຳມ່ວນ');
INSERT INTO `app_zipcode_lao` VALUES('115','12030','ຫີນບູນ','4937c451335ab66845c0c21ff159d1c2','ຫີນບູນ','0d0f6d7af210ce5ef0e4e8e8b8fab2dc','ຄຳມ່ວນ');
INSERT INTO `app_zipcode_lao` VALUES('116','12050','ຍົມມະລາດ','be8be7748b6fc6493a8ffa8c78165faa','ຍົມມະລາດ','0d0f6d7af210ce5ef0e4e8e8b8fab2dc','ຄຳມ່ວນ');
INSERT INTO `app_zipcode_lao` VALUES('117','12060','ບົວລະພາ','03fcc14f2c6dc1e7ae0b84d9c6364dee','ບົວລະພາ','0d0f6d7af210ce5ef0e4e8e8b8fab2dc','ຄຳມ່ວນ');
INSERT INTO `app_zipcode_lao` VALUES('118','12070','ເຊບັ້ງໄຟ','b87e9e65370d7cd00470707f30a52f62','ເຊບັ້ງໄຟ','0d0f6d7af210ce5ef0e4e8e8b8fab2dc','ຄຳມ່ວນ');
INSERT INTO `app_zipcode_lao` VALUES('119','12080','ນາກາຍ','992fc97c608b4e04349fa569c24b2528','ນາກາຍ','0d0f6d7af210ce5ef0e4e8e8b8fab2dc','ຄຳມ່ວນ');
INSERT INTO `app_zipcode_lao` VALUES('120','12090','ໄຊບົວທອງ','ad07b0f3a144c652e525cfcb5aba9bc2','ໄຊບົວທອງ','0d0f6d7af210ce5ef0e4e8e8b8fab2dc','ຄຳມ່ວນ');
INSERT INTO `app_zipcode_lao` VALUES('121','13000','ສະຫວັນນະເຂດ','858e669a05ff25ea6b0e3013bc341ce1','ໄກສອນ ພົມວິຫານ','2815ef4253638f997030af6fecfd7340','ສະຫວັນນະເຂດ');
INSERT INTO `app_zipcode_lao` VALUES('122','13020','ອຸທຸມພອນ','82ea3f0006bc0af31c3358d9524b0226','ອຸທຸມພອນ','2815ef4253638f997030af6fecfd7340','ສະຫວັນນະເຂດ');
INSERT INTO `app_zipcode_lao` VALUES('123','13030','ອາດສະພັງທອງ','58f1e137b4da97dc597b38374c48c7c2','ອດາສະພັງທອງ','2815ef4253638f997030af6fecfd7340','ສະຫວັນນະເຂດ');
INSERT INTO `app_zipcode_lao` VALUES('124','13040','ເມືອງພີນ','2e93eddc2858002c16e2c3d8758cfa68','ພີນ','2815ef4253638f997030af6fecfd7340','ສະຫວັນນະເຂດ');
INSERT INTO `app_zipcode_lao` VALUES('125','13050','ເຊໂປນ','cd36403954b2730e9c3b19b4e94de084','ເຊໂປນ','2815ef4253638f997030af6fecfd7340','ສະຫວັນນະເຂດ');
INSERT INTO `app_zipcode_lao` VALUES('126','13060','ຈຳພອນ','5d7cc595ec7d7c03fb72b1536215715f','ຈຳພອນ','2815ef4253638f997030af6fecfd7340','ສະຫວັນນະເຂດ');
INSERT INTO `app_zipcode_lao` VALUES('127','13070','ສອງຄອນ','b7cc87cf7120ee760af54b9c0c18b4fb','ສອງຄອນ','2815ef4253638f997030af6fecfd7340','ສະຫວັນນະເຂດ');
INSERT INTO `app_zipcode_lao` VALUES('128','13080','ອຸດົມວິໄລ','858e669a05ff25ea6b0e3013bc341ce1','ໄກສອນ ພົມວິຫານ','2815ef4253638f997030af6fecfd7340','ສະຫວັນນະເຂດ');
INSERT INTO `app_zipcode_lao` VALUES('129','13090','ວິລະບູລີ','413d6ea4fe10930eba31e002d46611ec','ວິລະບູລີ','2815ef4253638f997030af6fecfd7340','ສະຫວັນນະເຂດ');
INSERT INTO `app_zipcode_lao` VALUES('130','13100','ທ່າປາງທອງ','ad99d5e7bfd436ec8efb86b154eb174e','ທ່າປາງທອງ','2815ef4253638f997030af6fecfd7340','ສະຫວັນນະເຂດ');
INSERT INTO `app_zipcode_lao` VALUES('131','13110','ຊົນນະບູລີ','70275001dc66336fb95ce2b96f934abf','ຊົນນະບູລີ','2815ef4253638f997030af6fecfd7340','ສະຫວັນນະເຂດ');
INSERT INTO `app_zipcode_lao` VALUES('132','13120','ໄຊບູລີ','1cad6a7b3649133254fe05adedce1f2c','ໄຊບູລີ','2815ef4253638f997030af6fecfd7340','ສະຫວັນນະເຂດ');
INSERT INTO `app_zipcode_lao` VALUES('133','13140','ເມືອງນອງ','693a5dc48bb91cf1357a24d6b2b63653','ນອງ','2815ef4253638f997030af6fecfd7340','ສະຫວັນນະເຂດ');
INSERT INTO `app_zipcode_lao` VALUES('134','13150','ອາດສະພອນ','5cb5c553ff6068705eff3fba8c174117','ອາດສະພອນ','2815ef4253638f997030af6fecfd7340','ສະຫວັນນະເຂດ');
INSERT INTO `app_zipcode_lao` VALUES('135','13160','ໄຊພູທອງ','93c4a3c557a996f2afd068c41af3c72b','ໄຊພູທອງ','2815ef4253638f997030af6fecfd7340','ສະຫວັນນະເຂດ');
INSERT INTO `app_zipcode_lao` VALUES('136','13170','ພະລານໄຊ','794c9f12de0531aa71d27e6b2cc12cde','ພະລານໄຊ','2815ef4253638f997030af6fecfd7340','ສະຫວັນນະເຂດ');
INSERT INTO `app_zipcode_lao` VALUES('137','14000','ສາລະວັນ','752fc5b4faf2e7fc7b14fe5cbd1fbd57','ສາລະວັນ','752fc5b4faf2e7fc7b14fe5cbd1fbd57','ສາລະວັນ');
INSERT INTO `app_zipcode_lao` VALUES('138','14010','ຕະໂອ້ຍ','d5fbb69c3ba7f041a45725e216e6febc','ຕະໂອ້ຍ','752fc5b4faf2e7fc7b14fe5cbd1fbd57','ສາລະວັນ');
INSERT INTO `app_zipcode_lao` VALUES('139','14020','ຕຸມລານ','e104cdac85169feb40793faf5e5c0a3f','ຕຸມລານ','752fc5b4faf2e7fc7b14fe5cbd1fbd57','ສາລະວັນ');
INSERT INTO `app_zipcode_lao` VALUES('140','14040','ວາປີ','692455047f0852c4a540b5843923adec','ວາປີ','752fc5b4faf2e7fc7b14fe5cbd1fbd57','ສາລະວັນ');
INSERT INTO `app_zipcode_lao` VALUES('141','14050','ຄົງເຊໂດນ','4be50520f1f75f702b69380cb9341274','ຄົງເຊໂດນ','752fc5b4faf2e7fc7b14fe5cbd1fbd57','ສາລະວັນ');
INSERT INTO `app_zipcode_lao` VALUES('142','14060','ເລົ່າງາມ','f8a65ce75d4be4acad621732ecdd872a','ເລົ່າງາມ','752fc5b4faf2e7fc7b14fe5cbd1fbd57','ສາລະວັນ');
INSERT INTO `app_zipcode_lao` VALUES('143','14070','ລະຄອນເພັງ','942786d15ed9786de501605d00e2ea85','ລະຄອນເພັງ','752fc5b4faf2e7fc7b14fe5cbd1fbd57','ສາລະວັນ');
INSERT INTO `app_zipcode_lao` VALUES('144','15000','ເຊກອງ','cbfc9c7e8ab4884e319582d365520391','ລະມາມ','e75d699b6a31b07e4baec5bc856344ee','ເຊກອງ');
INSERT INTO `app_zipcode_lao` VALUES('145','15010','ທ່າແຕ໋ງ','5f4660e636a53fb3aa59ad886ebe3bdd','ທ່າແຕ໋ງ','e75d699b6a31b07e4baec5bc856344ee','ເຊກອງ');
INSERT INTO `app_zipcode_lao` VALUES('146','15020','ກະລຶມ','309d39b7c73f7ae92e418572c2d62abf','ກະລຶມ','e75d699b6a31b07e4baec5bc856344ee','ເຊກອງ');
INSERT INTO `app_zipcode_lao` VALUES('147','15030','ດັກຈຶງ','35cc625e0c9f042d24580fab79e0b2bb','ດັກຈຶງ','e75d699b6a31b07e4baec5bc856344ee','ເຊກອງ');
INSERT INTO `app_zipcode_lao` VALUES('148','16000','ປາກເຊ','7ba903840c45b96d4af60eb0ee349a64','ປາກເຊ','a4d2dc30331186d36b1f34c02cb193fe','ຈຳປາສັກ');
INSERT INTO `app_zipcode_lao` VALUES('149','16010','ຈຳປາສັກ','a4d2dc30331186d36b1f34c02cb193fe','ຈຳປາສັກ','a4d2dc30331186d36b1f34c02cb193fe','ຈຳປາສັກ');
INSERT INTO `app_zipcode_lao` VALUES('150','16020','ເມືອງໂຂງ','3b02da4ec732335a6367ba4aad977856','ໂຂງ','a4d2dc30331186d36b1f34c02cb193fe','ຈຳປາສັກ');
INSERT INTO `app_zipcode_lao` VALUES('151','16030','ມູນລະປະໂມກ','98629f72ea3c7670a54dd2387b3c6744','ມູນລະປະໂມກ','a4d2dc30331186d36b1f34c02cb193fe','ຈຳປາສັກ');
INSERT INTO `app_zipcode_lao` VALUES('152','16040','ສຸຂຸມາ','5c3ed821fa4a4b560e103663ad232f69','ສຸຂຸມາ','a4d2dc30331186d36b1f34c02cb193fe','ຈຳປາສັກ');
INSERT INTO `app_zipcode_lao` VALUES('153','16050','ປະທຸມພອນ','52eb6c23044d7822db679bc7ecdcb36b','ປະທຸມພອນ','a4d2dc30331186d36b1f34c02cb193fe','ຈຳປາສັກ');
INSERT INTO `app_zipcode_lao` VALUES('154','16060','ໂພນທອງ','fdbb1a64acbbe174f1e084ecb8ba6e18','ໂພນທອງ','a4d2dc30331186d36b1f34c02cb193fe','ຈຳປາສັກ');
INSERT INTO `app_zipcode_lao` VALUES('155','16070','ຊະນະສົມບູນ','0f50b401cb6cc17f06ec079530137e5f','ຊະນະສົມບູນ','a4d2dc30331186d36b1f34c02cb193fe','ຈຳປາສັກ');
INSERT INTO `app_zipcode_lao` VALUES('156','16080','ປາກຊ່ອງ','acb4baa3252f10bebf2db86cb3483dc8','ປາກຊ່ອງ','a4d2dc30331186d36b1f34c02cb193fe','ຈຳປາສັກ');
INSERT INTO `app_zipcode_lao` VALUES('157','16090','ບາຈຽງຈະເລີນສຸກ','1f99ab064f8fc53a538056bd01101f94','ບາຈຽງຈະເລີນສຸກ','a4d2dc30331186d36b1f34c02cb193fe','ຈຳປາສັກ');
INSERT INTO `app_zipcode_lao` VALUES('158','16100','ຂີ້ນາກ','3b02da4ec732335a6367ba4aad977856','ໂຂງ','a4d2dc30331186d36b1f34c02cb193fe','ຈຳປາສັກ');
INSERT INTO `app_zipcode_lao` VALUES('159','16120','ເດີ່ນບິນ','7ba903840c45b96d4af60eb0ee349a64','ປາກເຊ','a4d2dc30331186d36b1f34c02cb193fe','ຈຳປາສັກ');
INSERT INTO `app_zipcode_lao` VALUES('160','17000','ອັດຕະປື','ec923062d97dc0a255b87d8f18d606d0','ສາມັກຄີໄຊ','398eb34a68ead658454c8b11d6b4e154','ອັດຕະປື');
INSERT INTO `app_zipcode_lao` VALUES('161','17010','ໄຊເສດຖາ','50e9e73fe33cf75e1ce01810b8da0a9f','ໄຊເສດຖາ','398eb34a68ead658454c8b11d6b4e154','ອັດຕະປື');
INSERT INTO `app_zipcode_lao` VALUES('162','17020','ສະໜາມໄຊ','117628a3743d052a69454c157fff479e','ສະໜາມໄຊ','398eb34a68ead658454c8b11d6b4e154','ອັດຕະປື');
INSERT INTO `app_zipcode_lao` VALUES('163','17030','ພູວົງ','2deecf66d6550da32213051bb9e07a57','ພູວົງ','398eb34a68ead658454c8b11d6b4e154','ອັດຕະປື');
INSERT INTO `app_zipcode_lao` VALUES('164','17040','ສານໄຊ','66deb82ae6daec2d513a2af77a270338','ສານໄຊ','398eb34a68ead658454c8b11d6b4e154','ອັດຕະປື');



