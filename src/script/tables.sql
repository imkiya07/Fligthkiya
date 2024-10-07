CREATE TABLE countries (
  c_id int NOT NULL AUTO_INCREMENT,
  c_iso text,
  c_name text,
  c_nice_name text,
  c_iso3 text,
  c_num_code int DEFAULT NULL,
  c_phone_code int DEFAULT NULL
) ;


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
  al_code varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  al_name varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  al_logo varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (al_id)
);
