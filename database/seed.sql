INSERT INTO users (email, password_hash, role) VALUES 
('admin@synergybeam.com', 'scrypt:32768:8:1$uGZ8OLlhFhIOWxkF$c2c45baaedb78428c891941e85a16c23591efd9390f1022ae6a778053f6cff20538ad16fd9a0cd70acabea2aeb2a7723f9d0bfa1a5252b6079ed00e3ca639abd', 'Admin'),
('manager@synergybeam.com', 'scrypt:32768:8:1$uGZ8OLlhFhIOWxkF$c2c45baaedb78428c891941e85a16c23591efd9390f1022ae6a778053f6cff20538ad16fd9a0cd70acabea2aeb2a7723f9d0bfa1a5252b6079ed00e3ca639abd', 'Manager'),
('employee@synergybeam.com', 'scrypt:32768:8:1$uGZ8OLlhFhIOWxkF$c2c45baaedb78428c891941e85a16c23591efd9390f1022ae6a778053f6cff20538ad16fd9a0cd70acabea2aeb2a7723f9d0bfa1a5252b6079ed00e3ca639abd', 'Employee');

INSERT INTO warehouses (name, location) VALUES 
('Main Distribution Center', 'New York, NY'),
('West Coast Hub', 'Los Angeles, CA');

INSERT INTO products (name, sku, unit_price) VALUES 
('Enterprise Server Gen 10', 'SKU-100', 5000.00),
('Office Workstation', 'SKU-200', 1200.00);

INSERT INTO inventory (sku, quantity, warehouse_id) VALUES 
('SKU-100', 150, 1),
('SKU-200', 30, 2);

INSERT INTO customers (name, company, email, phone) VALUES 
('Alice Smith', 'Acme Corp', 'alice@acme.com', '555-0100'),
('Bob Johnson', 'TechFlow', 'bob@techflow.io', '555-0200');

INSERT INTO leads (name, email, source, stage, value) VALUES 
('Charlie Davis', 'charlie@startup.io', 'Website', 'new', 15000.00);

INSERT INTO sales_orders (customer_id, order_date, status, total_amount) VALUES 
(1, '2026-06-20', 'confirmed', 5000.00);

INSERT INTO invoices (customer_id, amount, paid_amount, due_date, status) VALUES 
(1, 5000.00, 2500.00, '2026-07-20', 'partial');

INSERT INTO suppliers (name, email, rating) VALUES 
('Global Components', 'sales@globalcomp.com', 4.5);

INSERT INTO projects (name, description, status, budget) VALUES 
('ERP Implementation', 'Deploy synergybeam for client X', 'in_progress', 50000.00);

INSERT INTO tasks (project_id, title, status, priority) VALUES 
(1, 'Database Migration', 'todo', 'high');

INSERT INTO employees (employee_code, full_name, department, position, salary) VALUES 
('EMP-001', 'Jane Doe', 'Engineering', 'Senior Developer', 120000.00);

INSERT INTO assets (name, category, cost, status) VALUES 
('MacBook Pro M3', 'IT', 2500.00, 'in_use');

INSERT INTO accounts (name, account_type, balance) VALUES 
('Cash', 'asset', 150000.00),
('Accounts Receivable', 'asset', 25000.00);

INSERT INTO expenses (category, amount, description, status) VALUES 
('Software', 150.00, 'Github Copilot Subscription', 'approved');
