 CREATE TABLE users (
     user_id SERIAL PRIMARY KEY,
     name VARCHAR(100) NOT NULL,
     email VARCHAR(150) UNIQUE NOT NULL,
     password TEXT NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 );
 CREATE TABLE products (
     product_id SERIAL PRIMARY KEY,
     name VARCHAR(150) NOT NULL,
     category VARCHAR(100),
     price NUMERIC(10,2) CHECK (price > 0),
     stock INT DEFAULT 0,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 );
 CREATE TABLE orders (
     order_id SERIAL PRIMARY KEY,
     user_id INT NOT NULL,
     order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     total_price NUMERIC(10,2),

     FOREIGN KEY (user_id) REFERENCES users(user_id)
 );
 CREATE TABLE order_items (
     order_item_id SERIAL PRIMARY KEY,
     order_id INT,
     product_id INT,
     quantity INT NOT NULL,
     price NUMERIC(10,2),

     FOREIGN KEY (order_id) REFERENCES orders(order_id),
     FOREIGN KEY (product_id) REFERENCES products(product_id)
 );
 CREATE TABLE interactions (
     interaction_id SERIAL PRIMARY KEY,
     user_id INT,
     product_id INT,
     interaction_type VARCHAR(50),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

     FOREIGN KEY (user_id) REFERENCES users(user_id),
     FOREIGN KEY (product_id) REFERENCES products(product_id)
 );
 CREATE INDEX idx_users_email ON users(email);
 CREATE INDEX idx_products_category ON products(category);
 CREATE INDEX idx_orders_user_id ON orders(user_id);
 CREATE INDEX idx_interactions_user_product
 ON interactions(user_id, product_id);