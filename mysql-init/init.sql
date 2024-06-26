DROP DATABASE IF EXISTS API_REST_Tyba;
CREATE DATABASE IF NOT EXISTS API_REST_Tyba;

USE API_REST_Tyba;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS movements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  date DATETIME NOT NULL,
  action VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS token_blacklist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  token VARCHAR(500) NOT NULL,
  expiry DATETIME NOT NULL
);

