-- USERS
INSERT INTO users (name,email,role,wallet_address)
VALUES
('Alice','alice@example.com','customer','0x123abc'),
('Bob','bob@example.com','driver','0x456def');

-- ORDER
INSERT INTO orders
(customer_id, driver_id, pickup_location, drop_location, amount, status)
VALUES
(1,2,'Warehouse A','Site B',5000,'CREATED');

-- ESCROW
INSERT INTO escrow_transactions
(order_id, contract_address, tx_hash, amount, status)
VALUES
(1,'0xcontract123','0xtx123',5000,'LOCKED');

-- DELIVERY CONFIRMATION
INSERT INTO delivery_confirmations
(order_id, driver_id, confirmation_method, confirmation_code, verified)
VALUES
(1,2,'OTP','834921',TRUE);

-- TRANSACTION LOG
INSERT INTO transaction_logs
(order_id, escrow_id, event_type, tx_hash, description)
VALUES
(1,1,'PAYMENT_LOCKED','0xtx123','Escrow payment locked');