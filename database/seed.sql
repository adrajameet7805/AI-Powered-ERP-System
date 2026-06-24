-- SynergyBeam ERP Comprehensive Seed Data

INSERT INTO users (email, password_hash, role) VALUES 
('admin@synergybeam.com', 'scrypt:32768:8:1$uGZ8OLlhFhIOWxkF$c2c45baaedb78428c891941e85a16c23591efd9390f1022ae6a778053f6cff20538ad16fd9a0cd70acabea2aeb2a7723f9d0bfa1a5252b6079ed00e3ca639abd', 'Admin'),
('manager@synergybeam.com', 'scrypt:32768:8:1$uGZ8OLlhFhIOWxkF$c2c45baaedb78428c891941e85a16c23591efd9390f1022ae6a778053f6cff20538ad16fd9a0cd70acabea2aeb2a7723f9d0bfa1a5252b6079ed00e3ca639abd', 'Manager'),
('employee@synergybeam.com', 'scrypt:32768:8:1$uGZ8OLlhFhIOWxkF$c2c45baaedb78428c891941e85a16c23591efd9390f1022ae6a778053f6cff20538ad16fd9a0cd70acabea2aeb2a7723f9d0bfa1a5252b6079ed00e3ca639abd', 'Employee');

INSERT INTO warehouses (name, location) VALUES 
('Main Distribution Center', 'New York, NY'),
('West Coast Hub', 'Los Angeles, CA'),
('Asia Pacific Hub', 'Mumbai, MH');

-- 15 Realistic Products
INSERT INTO products (name, sku, category, unit_price, cost_price, reorder_level, current_stock, status) VALUES 
('ThinkPad X1 Carbon Gen 11', 'SKU-IT-001', 'Electronics', 1599.99, 1200.00, 20, 45, 'active'),
('MacBook Pro M3 Max', 'SKU-IT-002', 'Electronics', 2499.00, 1900.00, 15, 22, 'active'),
('Dell UltraSharp 27" 4K', 'SKU-IT-003', 'Electronics', 650.00, 450.00, 30, 85, 'active'),
('Logitech MX Master 3S', 'SKU-IT-004', 'Electronics', 99.99, 55.00, 50, 120, 'active'),
('Cisco Meraki MR46', 'SKU-NW-001', 'Networking', 895.00, 600.00, 10, 8, 'active'),
('Ubiquiti UniFi Dream Machine', 'SKU-NW-002', 'Networking', 379.00, 250.00, 15, 12, 'active'),
('Herman Miller Aeron Chair', 'SKU-FUR-001', 'Furniture', 1250.00, 800.00, 10, 18, 'active'),
('ErgoDesk Pro Standing Desk', 'SKU-FUR-002', 'Furniture', 650.00, 400.00, 20, 35, 'active'),
('Conference Table 10-Seater', 'SKU-FUR-003', 'Furniture', 1800.00, 1100.00, 5, 4, 'active'),
('Server Rack 42U', 'SKU-NW-003', 'Networking', 450.00, 280.00, 5, 6, 'active'),
('Samsung 990 PRO 2TB NVMe', 'SKU-IT-005', 'Electronics', 189.99, 120.00, 40, 60, 'active'),
('APC Smart-UPS 1500VA', 'SKU-PW-001', 'Power', 520.00, 380.00, 10, 14, 'active'),
('Epson EcoTank Pro ET-5850', 'SKU-OF-001', 'Office', 850.00, 600.00, 5, 9, 'active'),
('Poly Voyager Focus 2 Headset', 'SKU-IT-006', 'Electronics', 220.00, 140.00, 30, 48, 'active'),
('Whiteboard 6x4 ft', 'SKU-OF-002', 'Office', 150.00, 80.00, 15, 25, 'active');

-- Initialize Inventory table
INSERT INTO inventory (sku, quantity, warehouse_id)
SELECT sku, current_stock, 1 FROM products LIMIT 10;
INSERT INTO inventory (sku, quantity, warehouse_id)
SELECT sku, current_stock, 2 FROM products LIMIT -1 OFFSET 10;

-- 20 Stock Movements
INSERT INTO stock_movements (product_id, movement_type, quantity, reference, notes, created_at) VALUES 
(1, 'in', 50, 'PO-2026-001', 'Initial stock', '2026-05-01 10:00:00'),
(1, 'out', 5, 'SO-2026-001', 'Sale to Reliance', '2026-05-10 14:30:00'),
(2, 'in', 30, 'PO-2026-002', 'Initial stock', '2026-05-05 09:15:00'),
(2, 'out', 8, 'SO-2026-002', 'Sale to Tata Consultancy', '2026-05-12 11:20:00'),
(3, 'in', 100, 'PO-2026-003', 'Initial stock', '2026-05-08 16:45:00'),
(3, 'out', 15, 'SO-2026-003', 'Office setup project', '2026-05-18 10:10:00'),
(4, 'in', 150, 'PO-2026-004', 'Bulk purchase', '2026-05-15 13:00:00'),
(4, 'out', 30, 'SO-2026-004', 'Corporate order', '2026-05-22 09:30:00'),
(5, 'in', 20, 'PO-2026-005', 'Network upgrade stock', '2026-05-20 11:45:00'),
(5, 'out', 12, 'SO-2026-005', 'Deployment for client X', '2026-05-28 15:20:00'),
(6, 'in', 25, 'PO-2026-006', 'Restock', '2026-06-01 10:00:00'),
(6, 'out', 13, 'SO-2026-006', 'Retail distribution', '2026-06-05 14:10:00'),
(7, 'in', 20, 'PO-2026-007', 'Furniture lot', '2026-06-02 08:30:00'),
(7, 'out', 2, 'SO-2026-007', 'Executive office', '2026-06-08 11:00:00'),
(8, 'in', 40, 'PO-2026-008', 'Ergonomic update', '2026-06-10 13:15:00'),
(8, 'out', 5, 'SO-2026-008', 'Engineering team', '2026-06-12 16:40:00'),
(11, 'in', 80, 'PO-2026-009', 'Storage drives', '2026-06-15 09:50:00'),
(11, 'out', 20, 'SO-2026-009', 'Server upgrades', '2026-06-18 12:30:00'),
(1, 'out', 2, 'SO-2026-010', 'Ad-hoc sale', '2026-06-20 14:25:00'),
(4, 'out', 5, 'SO-2026-011', 'Replacements', '2026-06-21 10:05:00');

-- 10 Customers
INSERT INTO customers (name, company, email, phone) VALUES 
('Aarav Patel', 'Reliance Industries', 'aarav.p@reliance.in', '+91-9876543210'),
('Sarah Connor', 'Cyberdyne Systems', 's.connor@cyberdyne.com', '+1-555-0199'),
('Priya Sharma', 'Tata Consultancy Services', 'priya.s@tcs.com', '+91-9988776655'),
('Michael Chang', 'Vertex Dynamics', 'm.chang@vertex.io', '+1-555-0288'),
('Rajesh Kumar', 'Infosys', 'rajesh.k@infosys.com', '+91-9123456789'),
('Elena Rodriguez', 'Global Logistics', 'elena.r@globallogistics.com', '+34-912345678'),
('Vikram Singh', 'Wipro Technologies', 'vikram.s@wipro.com', '+91-9898989898'),
('James Smith', 'Acme Corp', 'james.s@acme.com', '+1-555-0377'),
('Anita Desai', 'Mahindra Group', 'anita.d@mahindra.com', '+91-9765432109'),
('David Chen', 'TechFlow Innovations', 'david.c@techflow.io', '+44-2071234567');

-- 8 Leads
INSERT INTO leads (name, email, source, stage, value) VALUES 
('Neha Gupta', 'neha.g@startup.in', 'LinkedIn', 'new', 25000.00),
('John Doe', 'john.d@unknown.com', 'Website', 'contacted', 12000.00),
('Kiran Rao', 'kiran.r@enterprise.in', 'Referral', 'qualified', 85000.00),
('Sophia Patel', 'sophia.p@agile.co', 'Trade Show', 'proposal', 45000.00),
('Amit Verma', 'amit.v@builder.in', 'Website', 'won', 120000.00),
('Linda Evans', 'linda.e@corp.com', 'Cold Call', 'lost', 8000.00),
('Rahul Bajaj', 'rahul.b@auto.in', 'LinkedIn', 'new', 60000.00),
('Emily White', 'emily.w@design.io', 'Referral', 'proposal', 32000.00);

-- 6 Sales Orders
INSERT INTO sales_orders (customer_id, order_date, status, total_amount, created_at) VALUES 
(1, '2026-05-10', 'delivered', 15000.00, '2026-05-10 10:00:00'),
(3, '2026-05-12', 'delivered', 22500.00, '2026-05-12 11:30:00'),
(5, '2026-06-05', 'shipped', 8900.00, '2026-06-05 09:15:00'),
(7, '2026-06-15', 'confirmed', 45000.00, '2026-06-15 14:45:00'),
(2, '2026-06-20', 'draft', 1200.00, '2026-06-20 16:20:00'),
(9, '2026-06-21', 'confirmed', 34000.00, '2026-06-21 10:10:00');

-- 6 Invoices
INSERT INTO invoices (customer_id, amount, paid_amount, due_date, status, created_at) VALUES 
(1, 15000.00, 15000.00, '2026-06-10', 'paid', '2026-05-11 10:00:00'),
(3, 22500.00, 10000.00, '2026-06-12', 'partial', '2026-05-13 11:30:00'),
(5, 8900.00, 0.00, '2026-07-05', 'unpaid', '2026-06-06 09:15:00'),
(7, 45000.00, 0.00, '2026-07-15', 'unpaid', '2026-06-16 14:45:00'),
(4, 5000.00, 5000.00, '2026-04-01', 'paid', '2026-03-01 10:00:00'),
(8, 7500.00, 0.00, '2026-05-15', 'unpaid', '2026-04-15 10:00:00'); -- Overdue invoice

-- 3 Suppliers
INSERT INTO suppliers (name, email, phone, rating) VALUES 
('Global Components Ltd', 'sales@globalcomp.com', '+1-800-555-0199', 4.8),
('AsiaTech Manufacturing', 'orders@asiatech.cn', '+86-10-12345678', 4.2),
('National Furniture Inc', 'b2b@natfurniture.in', '+91-1800-123-456', 4.5);

-- 8 Employees
INSERT INTO employees (employee_code, full_name, email, department, position, hire_date, salary, status) VALUES 
('EMP-001', 'Sanjay Dutt', 'sanjay.d@synergybeam.com', 'Engineering', 'VP Engineering', '2023-01-15', 180000.00, 'active'),
('EMP-002', 'Meera Rajput', 'meera.r@synergybeam.com', 'Sales', 'Sales Director', '2023-03-01', 150000.00, 'active'),
('EMP-003', 'John Smith', 'john.s@synergybeam.com', 'Engineering', 'Senior Developer', '2024-06-10', 120000.00, 'active'),
('EMP-004', 'Arjun Singh', 'arjun.s@synergybeam.com', 'HR', 'HR Manager', '2024-08-20', 95000.00, 'active'),
('EMP-005', 'Pooja Hegde', 'pooja.h@synergybeam.com', 'Finance', 'Financial Controller', '2025-01-05', 110000.00, 'active'),
('EMP-006', 'Chen Wei', 'chen.w@synergybeam.com', 'Engineering', 'Frontend Developer', '2025-05-15', 90000.00, 'active'),
('EMP-007', 'Anita Bose', 'anita.b@synergybeam.com', 'Sales', 'Account Executive', '2025-11-01', 75000.00, 'active'),
('EMP-008', 'Karthik Iyer', 'karthik.i@synergybeam.com', 'Operations', 'Warehouse Manager', '2026-02-10', 85000.00, 'active');

-- 5 Attendance Records
INSERT INTO attendance (employee_id, attendance_date, check_in, check_out, status) VALUES 
(1, '2026-06-21', '09:00', '18:00', 'present'),
(3, '2026-06-21', '09:15', '18:30', 'present'),
(6, '2026-06-21', '08:50', '17:45', 'present'),
(4, '2026-06-21', NULL, NULL, 'absent'),
(8, '2026-06-21', '08:00', '17:00', 'present');

-- 3 Leave Requests
INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, reason, status) VALUES 
(4, 'Sick Leave', '2026-06-21', '2026-06-22', 'Viral fever', 'approved'),
(7, 'Annual Leave', '2026-07-10', '2026-07-20', 'Family vacation', 'pending'),
(3, 'Personal Leave', '2026-05-05', '2026-05-06', 'Personal errands', 'rejected');

-- 3 Projects
INSERT INTO projects (name, description, status, start_date, end_date, budget) VALUES 
('ERP Implementation - TCS', 'Deploy SynergyBeam ERP for Tata Consultancy Services', 'in_progress', '2026-01-15', '2026-08-30', 150000.00),
('Network Upgrade - Reliance', 'Install Cisco and Ubiquiti hardware at HQ', 'planning', '2026-07-01', '2026-09-15', 85000.00),
('Office Fitout - Vertex', 'Furnish new 10,000 sq ft office space', 'completed', '2025-10-01', '2026-03-30', 200000.00);

-- 6 Tasks
INSERT INTO tasks (project_id, title, description, status, priority, due_date) VALUES 
(1, 'Requirements Gathering', 'Finalize SRS document', 'done', 'high', '2026-02-28'),
(1, 'Database Migration', 'Migrate legacy data to PostgreSQL', 'in_progress', 'high', '2026-06-30'),
(1, 'UAT Testing', 'Conduct User Acceptance Testing', 'todo', 'medium', '2026-08-15'),
(2, 'Site Survey', 'Map out access points', 'todo', 'medium', '2026-07-05'),
(2, 'Hardware Procurement', 'Order Meraki APs', 'in_progress', 'high', '2026-07-10'),
(3, 'Final Inspection', 'Walkthrough with client', 'done', 'high', '2026-03-25');

-- 4 Assets
INSERT INTO assets (name, category, location, purchase_date, cost, status) VALUES 
('Company Car - Innova', 'Vehicles', 'Mumbai HQ', '2024-05-10', 25000.00, 'in_use'),
('Main Server Cluster', 'IT Equipment', 'Data Center A', '2023-11-20', 150000.00, 'in_use'),
('CEO Office Furniture Set', 'Furniture', 'New York HQ', '2025-02-15', 12000.00, 'in_use'),
('Backup Generator', 'Facilities', 'Mumbai HQ', '2022-08-30', 35000.00, 'maintenance');

-- 3 Accounts
INSERT INTO accounts (name, account_type, balance) VALUES 
('HDFC Main Checking', 'asset', 450000.00),
('Accounts Receivable', 'asset', 125000.00),
('Accounts Payable', 'liability', 45000.00);

-- 5 Transactions
INSERT INTO transactions (account_id, txn_type, amount, reference, description, txn_date) VALUES 
(1, 'credit', 15000.00, 'INV-001', 'Payment received from Reliance', '2026-06-10'),
(1, 'credit', 10000.00, 'INV-002', 'Partial payment from TCS', '2026-06-12'),
(1, 'debit', 5000.00, 'PO-001', 'Payment to Global Components', '2026-06-15'),
(3, 'credit', 12000.00, 'PO-002', 'Invoice from AsiaTech', '2026-06-18'),
(1, 'debit', 2500.00, 'EXP-001', 'Office Rent', '2026-06-01');

-- 4 Expenses
INSERT INTO expenses (category, amount, description, expense_date, status) VALUES 
('Software Subscriptions', 1250.00, 'AWS Hosting', '2026-06-01', 'approved'),
('Travel', 450.00, 'Flight to Mumbai', '2026-06-10', 'pending'),
('Office Supplies', 120.00, 'Stationery', '2026-06-15', 'approved'),
('Marketing', 2000.00, 'LinkedIn Ads', '2026-06-05', 'approved');

-- Sample RFQs
INSERT INTO rfqs (title, description, deadline, status, created_by)
VALUES
  ('Office Laptop Procurement Q3 2026',
   'Procurement of 20 laptops for engineering team',
   '2026-07-30', 'published', 1),
  ('Annual Stationery Supply',
   'Annual stationery and office supplies',
   '2026-08-15', 'draft', 1),
  ('Server Infrastructure Upgrade',
   'Purchase of 4 rack servers',
   '2026-07-10', 'closed', 1);

-- RFQ Items for RFQ 1
INSERT INTO rfq_items (rfq_id, description, quantity, unit, estimated_price)
VALUES
  (1, 'Laptop 16GB RAM 512GB SSD', 20, 'units', 65000.00),
  (1, 'Laptop Bag', 20, 'units', 1500.00),
  (1, 'Wireless Mouse', 20, 'units', 800.00);

-- Assign vendors to RFQ 1
INSERT INTO rfq_vendors (rfq_id, vendor_id)
VALUES (1, 1), (1, 2), (1, 3);

-- Sample quotations
INSERT INTO vendor_quotations (rfq_id, vendor_id, total_price,
  delivery_days, notes, status, submitted_at)
VALUES
  (1, 1, 1340000.00, 7, 'Including 1 year warranty', 'submitted',
   CURRENT_TIMESTAMP),
  (1, 2, 1380000.00, 5, 'Express delivery available', 'submitted',
   CURRENT_TIMESTAMP),
  (1, 3, 1290000.00, 10, 'Bulk discount applied', 'submitted',
   CURRENT_TIMESTAMP);

-- Sample GST invoices
INSERT INTO gst_invoices (po_id, invoice_number, subtotal, cgst, sgst,
  igst, total_amount, status, due_date)
VALUES
  (1, 'INV-2026-10001', 1290000.00, 116100.00, 116100.00, 0.00,
   1522200.00, 'sent', '2026-07-31'),
  (2, 'INV-2026-10002', 450000.00, 0.00, 0.00, 81000.00,
   531000.00, 'paid', '2026-07-15');

-- Sample activity logs
INSERT INTO activity_logs (actor_id, actor_email, entity_type,
  entity_id, action)
VALUES
  (1, 'admin@synergybeam.com', 'RFQ', 1, 'Created RFQ'),
  (1, 'admin@synergybeam.com', 'RFQ', 1, 'Published RFQ'),
  (1, 'admin@synergybeam.com', 'VendorQuotation', 3, 'Selected winning quotation'),
  (1, 'admin@synergybeam.com', 'GSTInvoice', 1, 'Generated GST invoice'),
  (1, 'admin@synergybeam.com', 'GSTInvoice', 2, 'Marked invoice as paid');
