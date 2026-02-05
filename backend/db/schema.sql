-- BPMS MVP Database Schema

-- Organizations (Multi-tenant)
CREATE TABLE organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users (belong to one organization)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    organization_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Processes (workflow definitions)
CREATE TABLE processes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    conditional_rule JSONB,
    organization_id INTEGER REFERENCES organizations(id) ON DELETE CASCADE,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Steps (belong to a process)
CREATE TABLE steps (
    id SERIAL PRIMARY KEY,
    process_id INTEGER REFERENCES processes(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    step_order INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Process Instances (execution of a process)
CREATE TABLE process_instances (
    id SERIAL PRIMARY KEY,
    process_id INTEGER REFERENCES processes(id) ON DELETE CASCADE,
    current_step_id INTEGER REFERENCES steps(id),
    status VARCHAR(50) DEFAULT 'pending',
    started_by INTEGER REFERENCES users(id),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Execution History (audit log)
CREATE TABLE execution_history (
    id SERIAL PRIMARY KEY,
    instance_id INTEGER REFERENCES process_instances(id) ON DELETE CASCADE,
    step_id INTEGER REFERENCES steps(id),
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    performed_by INTEGER REFERENCES users(id),
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_org ON users(organization_id);
CREATE INDEX idx_processes_org ON processes(organization_id);
CREATE INDEX idx_steps_process ON steps(process_id);
CREATE INDEX idx_instances_process ON process_instances(process_id);
CREATE INDEX idx_history_instance ON execution_history(instance_id);
