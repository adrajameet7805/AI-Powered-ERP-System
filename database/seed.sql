INSERT INTO users (email, password_hash, role) VALUES 
('admin@synergybeam.com', 'scrypt:32768:8:1$uGZ8OLlhFhIOWxkF$c2c45baaedb78428c891941e85a16c23591efd9390f1022ae6a778053f6cff20538ad16fd9a0cd70acabea2aeb2a7723f9d0bfa1a5252b6079ed00e3ca639abd', 'Admin'),
('manager@synergybeam.com', 'scrypt:32768:8:1$uGZ8OLlhFhIOWxkF$c2c45baaedb78428c891941e85a16c23591efd9390f1022ae6a778053f6cff20538ad16fd9a0cd70acabea2aeb2a7723f9d0bfa1a5252b6079ed00e3ca639abd', 'Manager'),
('employee@synergybeam.com', 'scrypt:32768:8:1$uGZ8OLlhFhIOWxkF$c2c45baaedb78428c891941e85a16c23591efd9390f1022ae6a778053f6cff20538ad16fd9a0cd70acabea2aeb2a7723f9d0bfa1a5252b6079ed00e3ca639abd', 'Employee');

INSERT INTO warehouses (name, location) VALUES 
('Main Distribution Center', 'New York, NY'),
('West Coast Hub', 'Los Angeles, CA');

INSERT INTO products (name, price, sku) VALUES 
('Enterprise Server Gen 10', 5000.00, 'SKU-100'),
('Office Workstation', 1200.00, 'SKU-200');

INSERT INTO inventory (sku, quantity, warehouse_id) VALUES 
('SKU-100', 150, 1),
('SKU-200', 30, 2);

