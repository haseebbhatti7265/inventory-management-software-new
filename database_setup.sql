-- Database Setup Script for Inventory Management System
-- Run this in your Supabase SQL Editor

-- Step 1: Drop existing tables (if they exist)
DROP TABLE IF EXISTS sales CASCADE;
DROP TABLE IF EXISTS stock_entries CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Step 2: Create categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Create products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    unit TEXT NOT NULL,
    selling_price DECIMAL(10,2) NOT NULL,
    stock INTEGER DEFAULT 0,
    purchase_price DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Create stock_entries table
CREATE TABLE stock_entries (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    purchase_price DECIMAL(10,2) NOT NULL,
    total_cost DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 5: Create sales table
CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    selling_price DECIMAL(10,2) NOT NULL,
    total_revenue DECIMAL(10,2) NOT NULL,
    profit DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 6: Create indexes for better performance
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_stock_entries_product_id ON stock_entries(product_id);
CREATE INDEX idx_sales_product_id ON sales(product_id);
CREATE INDEX idx_products_stock ON products(stock);

-- Step 7: Insert sample data (optional)
INSERT INTO categories (name, description) VALUES 
('Electronics', 'Electronic devices and accessories'),
('Clothing', 'Apparel and fashion items'),
('Books', 'Books and publications'),
('Home & Garden', 'Home improvement and garden supplies');

-- Step 8: Enable Row Level Security (RLS) - Optional but recommended
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- Step 9: Create policies for public access (adjust based on your security needs)
CREATE POLICY "Allow public read access" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON stock_entries FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON sales FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access" ON stock_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert access" ON sales FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access" ON categories FOR UPDATE USING (true);
CREATE POLICY "Allow public update access" ON products FOR UPDATE USING (true);
CREATE POLICY "Allow public update access" ON stock_entries FOR UPDATE USING (true);
CREATE POLICY "Allow public update access" ON sales FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access" ON categories FOR DELETE USING (true);
CREATE POLICY "Allow public delete access" ON products FOR DELETE USING (true);
CREATE POLICY "Allow public delete access" ON stock_entries FOR DELETE USING (true);
CREATE POLICY "Allow public delete access" ON sales FOR DELETE USING (true);
