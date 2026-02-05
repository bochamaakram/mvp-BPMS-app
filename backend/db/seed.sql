-- BPMS MVP Seed Data
-- Run this after schema.sql to populate with sample data

-- Insert sample organization
INSERT INTO organizations (id, name) VALUES 
(1, 'Acme Corporation')
ON CONFLICT (id) DO NOTHING;

-- Insert sample users (password is 'password123' hashed with bcrypt)
INSERT INTO users (id, email, password_hash, role, organization_id) VALUES 
(1, 'admin@acme.com', '$2b$10$FexPm6PbFzr1rmcvigZOY.ZB595b.JlqK13z0dYOwwM9fi24wNLcO', 'admin', 1),
(2, 'user@acme.com', '$2b$10$FexPm6PbFzr1rmcvigZOY.ZB595b.JlqK13z0dYOwwM9fi24wNLcO', 'user', 1)
ON CONFLICT (id) DO NOTHING;

-- Insert sample processes
INSERT INTO processes (id, name, description, conditional_rule, organization_id, created_by) VALUES 
(1, 'Expense Approval', 'Workflow for approving employee expense reports', 
 '{"field": "amount", "operator": ">", "threshold": 1000, "targetStep": 3}', 1, 1),
(2, 'Leave Request', 'Employee leave request and approval process', NULL, 1, 1),
(3, 'Invoice Processing', 'Vendor invoice verification and payment approval', 
 '{"field": "amount", "operator": ">", "threshold": 5000, "targetStep": 4}', 1, 1)
ON CONFLICT (id) DO NOTHING;

-- Insert steps for Expense Approval process
INSERT INTO steps (id, process_id, name, description, step_order) VALUES 
(1, 1, 'Submit Expense', 'Employee submits expense report with receipts', 1),
(2, 1, 'Manager Review', 'Direct manager reviews and approves/rejects', 2),
(3, 1, 'Finance Review', 'Finance team reviews expenses over $1000', 3),
(4, 1, 'Payment Processing', 'Accounts payable processes reimbursement', 4)
ON CONFLICT (id) DO NOTHING;

-- Insert steps for Leave Request process
INSERT INTO steps (id, process_id, name, description, step_order) VALUES 
(5, 2, 'Submit Request', 'Employee submits leave request with dates', 1),
(6, 2, 'Manager Approval', 'Manager reviews team availability and approves', 2),
(7, 2, 'HR Notification', 'HR is notified of approved leave', 3)
ON CONFLICT (id) DO NOTHING;

-- Insert steps for Invoice Processing
INSERT INTO steps (id, process_id, name, description, step_order) VALUES 
(8, 3, 'Invoice Receipt', 'Receive and log vendor invoice', 1),
(9, 3, 'Verification', 'Verify goods/services received match invoice', 2),
(10, 3, 'Department Approval', 'Department head approves payment', 3),
(11, 3, 'CFO Approval', 'CFO approves invoices over $5000', 4),
(12, 3, 'Payment', 'Process payment to vendor', 5)
ON CONFLICT (id) DO NOTHING;

-- Insert sample process instances
INSERT INTO process_instances (id, process_id, current_step_id, status, started_by, started_at) VALUES 
(1, 1, 2, 'pending', 2, NOW() - INTERVAL '2 days'),
(2, 1, 4, 'approved', 2, NOW() - INTERVAL '5 days'),
(3, 2, 6, 'pending', 2, NOW() - INTERVAL '1 day'),
(4, 3, 9, 'pending', 1, NOW() - INTERVAL '3 days'),
(5, 1, 1, 'rejected', 2, NOW() - INTERVAL '7 days')
ON CONFLICT (id) DO NOTHING;

-- Update completed instance
UPDATE process_instances SET completed_at = NOW() - INTERVAL '4 days' WHERE id = 2;
UPDATE process_instances SET completed_at = NOW() - INTERVAL '6 days' WHERE id = 5;

-- Insert execution history
INSERT INTO execution_history (instance_id, step_id, status, notes, performed_by, performed_at) VALUES 
-- Instance 1: Expense at Manager Review
(1, 1, 'pending', 'Expense report submitted: $850 for client dinner', 2, NOW() - INTERVAL '2 days'),
(1, 1, 'approved', 'Submitted with valid receipts', 2, NOW() - INTERVAL '2 days' + INTERVAL '1 hour'),
(1, 2, 'pending', 'Moved to manager review', 1, NOW() - INTERVAL '1 day'),

-- Instance 2: Completed expense
(2, 1, 'pending', 'Expense report submitted: $1500 for conference travel', 2, NOW() - INTERVAL '5 days'),
(2, 1, 'approved', 'All receipts attached', 2, NOW() - INTERVAL '5 days' + INTERVAL '2 hours'),
(2, 2, 'approved', 'Approved by manager', 1, NOW() - INTERVAL '4 days' - INTERVAL '12 hours'),
(2, 3, 'approved', 'Finance approved - within budget', 1, NOW() - INTERVAL '4 days' - INTERVAL '6 hours'),
(2, 4, 'approved', 'Payment processed via direct deposit', 1, NOW() - INTERVAL '4 days'),

-- Instance 3: Leave request
(3, 5, 'pending', 'Leave request: Dec 20-27 for vacation', 2, NOW() - INTERVAL '1 day'),
(3, 5, 'approved', 'Request submitted', 2, NOW() - INTERVAL '1 day' + INTERVAL '30 minutes'),
(3, 6, 'pending', 'Awaiting manager approval', 1, NOW() - INTERVAL '12 hours'),

-- Instance 4: Invoice processing
(4, 8, 'pending', 'Invoice #INV-2024-001 received from TechSupplier Inc.', 1, NOW() - INTERVAL '3 days'),
(4, 8, 'approved', 'Invoice logged', 1, NOW() - INTERVAL '3 days' + INTERVAL '1 hour'),
(4, 9, 'pending', 'Verifying against PO #PO-2024-0089', 1, NOW() - INTERVAL '2 days'),

-- Instance 5: Rejected expense
(5, 1, 'pending', 'Expense report submitted: $200 for office supplies', 2, NOW() - INTERVAL '7 days'),
(5, 1, 'rejected', 'Missing receipts - please resubmit with documentation', 1, NOW() - INTERVAL '6 days');

-- Reset sequences to avoid conflicts with future inserts
SELECT setval('organizations_id_seq', (SELECT MAX(id) FROM organizations));
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('processes_id_seq', (SELECT MAX(id) FROM processes));
SELECT setval('steps_id_seq', (SELECT MAX(id) FROM steps));
SELECT setval('process_instances_id_seq', (SELECT MAX(id) FROM process_instances));
SELECT setval('execution_history_id_seq', (SELECT MAX(id) FROM execution_history));
