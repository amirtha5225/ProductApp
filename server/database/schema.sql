CREATE DATABASE IF NOT EXISTS product_db;
USE product_db;

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL
);

-- Trigger to prevent restoring a product if it has been deleted for more than 30 days
DELIMITER //
CREATE TRIGGER prevent_old_restore
BEFORE UPDATE ON products
FOR EACH ROW
BEGIN
    IF OLD.deleted_at IS NOT NULL AND NEW.deleted_at IS NULL THEN
        IF OLD.deleted_at < DATE_SUB(NOW(), INTERVAL 30 DAY) THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Cannot restore a product that has been deleted for more than 30 days.';
        END IF;
    END IF;
END;
//
DELIMITER ;
