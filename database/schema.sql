-- ENUM TYPES
CREATE TYPE order_status_enum AS ENUM (
    'CREATED',
    'IN_TRANSIT',
    'DELIVERED',
    'COMPLETED',
    'CANCELLED'
);

CREATE TYPE escrow_status_enum AS ENUM (
    'LOCKED',
    'RELEASED',
    'REFUNDED'
);

-- USERS TABLE
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    role VARCHAR(20) CHECK (role IN ('customer','driver','admin')),
    wallet_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ORDERS TABLE
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES users(id),
    driver_id INT REFERENCES users(id),
    pickup_location TEXT,
    drop_location TEXT,
    amount NUMERIC(10,2),
    status order_status_enum,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ESCROW TRANSACTIONS
CREATE TABLE escrow_transactions (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id),
    contract_address TEXT,
    tx_hash TEXT,
    amount NUMERIC(10,2),
    status escrow_status_enum,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DELIVERY PROOFS
CREATE TABLE delivery_proofs (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id),
    driver_id INT REFERENCES users(id),
    image_url TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DELIVERY CONFIRMATIONS
CREATE TABLE delivery_confirmations (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id),
    driver_id INT REFERENCES users(id),
    confirmation_method VARCHAR(20),
    confirmation_code VARCHAR(50),
    verified BOOLEAN DEFAULT FALSE,
    confirmed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TRANSACTION LOGS
CREATE TABLE transaction_logs (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id),
    escrow_id INT REFERENCES escrow_transactions(id),
    event_type VARCHAR(50),
    tx_hash TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);