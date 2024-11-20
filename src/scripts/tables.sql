CREATE TABLE flight_booking.countries (
   c_id int NOT NULL AUTO_INCREMENT,
   c_iso text,
   c_name text,
   c_nice_name text,
   c_iso3 text,
   c_num_code int DEFAULT NULL,
   c_phone_code int DEFAULT NULL,
   PRIMARY KEY (c_id)
);



CREATE TABLE airports (
  ap_id int NOT NULL AUTO_INCREMENT,
  ap_country_id int DEFAULT NULL,
  ap_name varchar(185) NOT NULL,
  ap_iata_code varchar(10) NOT NULL,
  ap_is_deleted tinyint DEFAULT '0',
  ap_created_by int DEFAULT NULL,
  ap_created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  ap_city int DEFAULT NULL,
  PRIMARY KEY (ap_id)
);


CREATE TABLE airlines (
  al_id int NOT NULL AUTO_INCREMENT,
  al_code varchar(250),
  al_name varchar(250),
  al_logo varchar(255),
  PRIMARY KEY (al_id)
);


CREATE TABLE users (
  user_id int NOT NULL AUTO_INCREMENT,
  user_type enum('ADMIN','B2C','B2B') DEFAULT 'B2C',
  full_name varchar(100) NOT NULL,
  username varchar(45) NOT NULL,
  email varchar(100) NOT NULL,
  gender enum('MALE','FEMALE','OTHERS') DEFAULT NULL,
  phone_number varchar(15) DEFAULT NULL,
  password_hash varchar(255) NOT NULL,
  address varchar(255) DEFAULT NULL,
  city varchar(50) DEFAULT NULL,
  country varchar(50) DEFAULT NULL,
  postal_code varchar(20) DEFAULT NULL,
  date_of_birth date DEFAULT NULL,
  passport_number varchar(50) DEFAULT NULL,
  nationality varchar(50) DEFAULT NULL,
  login_method enum('social','form') DEFAULT NULL,
  social_id varchar(191) DEFAULT NULL,
  social_provider varchar(191) DEFAULT NULL,
  social_token text,
  account_verified tinyint DEFAULT '0',
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id)
);



     
  
  CREATE TABLE booking_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orderNumber VARCHAR(15),
    user_id INT NOT NULL,
    CountryCode VARCHAR(5),
    AreaCode VARCHAR(10),
    PhoneNumber VARCHAR(20),
    Email VARCHAR(255),
    PostCode VARCHAR(20),
    bookingStatus enum("PENDING", "CONFIRMED", "FAILED") DEFAULT "PENDING",
    IsPriceChange TINYINT,
    IsScheduleChange TINYINT,
    pnrId varchar(15),
    TktTimeLimit timestamp,
    baseFare decimal(10,1),
    taxAndCharge decimal(10,1),
    discount decimal(10,1),
    appliedCoupon VARCHAR(15),
    netTotal decimal(10,1),
    paymentStatus enum("PENDING", "SUCCESS", "FAILED", "CANCEL") DEFAULT "PENDING",
    ticketStatus enum("PENDING", "ISSUED", "PAYMENT", "CANCEL_PENDING", "CANCELED") DEFAULT "PENDING",
    revalidation_req_body JSON,
    paymentAt timestamp,
    cancelReqAt timestamp,
    canceledAt timestamp,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP
);



  CREATE TABLE air_travelers (
    PassengerID INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    booking_id INT NOT NULL,
    PassengerType VARCHAR(10),
    Gender CHAR(1),
    PassengerTitle VARCHAR(10),
    PassengerFirstName VARCHAR(50),
    PassengerLastName VARCHAR(50),
    DateOfBirth DATE,
    PassengerNationality VARCHAR(10),
    NationalID VARCHAR(50),
    PassportNumber VARCHAR(20),
    ExpiryDate DATE,
    Country VARCHAR(10)
);