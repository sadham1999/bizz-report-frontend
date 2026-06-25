DROP DATABASE IF EXISTS job_tracker_prod;
CREATE DATABASE job_tracker_prod;

USE job_tracker_prod;

-- Creating roles table
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT NOT NULL,
    modified_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    modified_by BIGINT NOT NULL,
    is_active TINYINT(1) NOT NULL,
    role_name VARCHAR(50) NOT NULL,
    INDEX (created_by),
    INDEX (modified_by)
);

-- Creating users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT NOT NULL,
    modified_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    modified_by BIGINT NOT NULL,
    is_active TINYINT(1) NOT NULL,
    user_code VARCHAR(50) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    uen VARCHAR(50) NOT NULL,
    contact_person VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    last_access DATETIME,
    role_id INT NOT NULL,
    pco_id INT NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (pco_id) REFERENCES users(id),
    INDEX (created_by),
    INDEX (modified_by),
    INDEX (role_id),
    INDEX (pco_id)
);

-- Creating teams table
CREATE TABLE teams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT NOT NULL,
    modified_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    modified_by BIGINT NOT NULL,
    is_active TINYINT(1) NOT NULL,
    team_name VARCHAR(100) NOT NULL,
    supervisor_id INT,
    FOREIGN KEY (supervisor_id) REFERENCES users(id),
    INDEX (created_by),
    INDEX (modified_by),
    INDEX (supervisor_id)
);

-- Creating clients table
CREATE TABLE clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT NOT NULL,
    modified_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    modified_by BIGINT NOT NULL,
    is_active TINYINT(1) NOT NULL,
    client_name VARCHAR(100) NOT NULL,
    client_code VARCHAR(50) NOT NULL,
    contact_person VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    INDEX (created_by),
    INDEX (modified_by),
    INDEX (client_code)
);

-- Creating client_teams table
CREATE TABLE client_teams(
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT,
    team_id INT,
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (team_id) REFERENCES teams(id),
    INDEX (client_id),
    INDEX (team_id)
);

-- Creating job_master table
CREATE TABLE job_master (
    id INT AUTO_INCREMENT PRIMARY KEY,
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT NOT NULL,
    modified_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    modified_by BIGINT NOT NULL,
    is_active TINYINT(1) NOT NULL,
    client_id INT NOT NULL,
    client_code VARCHAR(50) NOT NULL,
    urgent_shipment TINYINT(1) DEFAULT '0',
    source VARCHAR(255) DEFAULT NULL,
    forwarder_ref VARCHAR(255) DEFAULT NULL,
    mawb_obl VARCHAR(255) DEFAULT NULL,
    hawb_hbl VARCHAR(255) DEFAULT NULL,
    document_path VARCHAR(255) DEFAULT NULL,
    status VARCHAR(50) DEFAULT NULL,
    live_status VARCHAR(50) DEFAULT NULL,
    job_status VARCHAR(50) DEFAULT NULL,
    team_id INT NOT NULL,
    delay_status TINYINT(1) DEFAULT '0',
    travel_time TIME DEFAULT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (team_id) REFERENCES teams(id),
    INDEX (created_by),
    INDEX (modified_by),
    INDEX (client_id),
    INDEX (team_id),
    INDEX (client_code)
);


ALTER TABLE job_master
ADD COLUMN new_to_takeInHand_date DATETIME DEFAULT NULL,
ADD COLUMN takeInHand_to_send_date DATETIME DEFAULT NULL;


ALTER TABLE users
ADD COLUMN password VARCHAR(15) NOT NULL AFTER user_name,
ADD COLUMN confirm_password VARCHAR(15) NOT NULL AFTER password;