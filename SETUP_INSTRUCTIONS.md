# Inventory Management System Setup Instructions

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- A Supabase account and project

## Step 1: Database Setup

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization and enter project details
4. Wait for the project to be created

### 1.2 Run Database Script
1. In your Supabase dashboard, go to "SQL Editor"
2. Copy the contents of `database_setup.sql` file
3. Paste it in the SQL editor and click "Run"
4. This will create all necessary tables with proper relationships

### 1.3 Get API Credentials
1. In your Supabase dashboard, go to "Settings" → "API"
2. Copy the "Project URL" and "anon/public" key
3. You'll need these for the next step

## Step 2: Environment Configuration

### 2.1 Create Environment File
1. Copy `env.example` to `.env` in your project root
2. Fill in your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_actual_supabase_url
   VITE_SUPABASE_ANON_KEY=your_actual_anon_key
   ```

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Start Development Server

```bash
npm run dev
```

## Step 5: Test the Application

1. Open your browser to the URL shown in the terminal (usually http://localhost:5173)
2. Navigate to different pages:
   - Dashboard: Overview of your inventory
   - Products: Manage products and categories
   - Stock: Add and manage stock entries
   - Sales: Record sales transactions
   - Categories: Manage product categories

## Database Schema Overview

### Categories Table
- `id`: Primary key (auto-increment)
- `name`: Category name (unique)
- `description`: Optional description
- `created_at`: Timestamp

### Products Table
- `id`: Primary key (auto-increment)
- `name`: Product name
- `category_id`: Foreign key to categories
- `unit`: Unit of measurement
- `selling_price`: Selling price per unit
- `stock`: Current stock quantity
- `purchase_price`: Average purchase price
- `created_at`: Timestamp

### Stock Entries Table
- `id`: Primary key (auto-increment)
- `product_id`: Foreign key to products
- `quantity`: Quantity added
- `purchase_price`: Purchase price per unit
- `total_cost`: Total cost of the entry
- `created_at`: Timestamp

### Sales Table
- `id`: Primary key (auto-increment)
- `product_id`: Foreign key to products
- `quantity`: Quantity sold
- `selling_price`: Selling price per unit
- `total_revenue`: Total revenue from sale
- `profit`: Profit from sale
- `created_at`: Timestamp

## Features

### ✅ Working Features
- **Products Management**: Add, edit, delete products with categories
- **Stock Management**: Add stock entries, track inventory levels
- **Sales Tracking**: Record sales and calculate profits
- **Category Management**: Organize products by categories
- **Real-time Updates**: All changes are immediately reflected
- **Responsive Design**: Works on desktop and mobile devices

### 🔧 Technical Features
- **Supabase Integration**: Real database with real-time capabilities
- **TypeScript**: Full type safety throughout the application
- **React Context**: Centralized state management
- **Error Handling**: Graceful error handling with user feedback
- **Loading States**: Loading indicators for better UX

## Troubleshooting

### Common Issues

#### 1. White Screen on Stock Page
- **Cause**: Database connection issues or missing data
- **Solution**: Check your Supabase credentials and ensure tables are created

#### 2. "Supabase environment variables are not set" Error
- **Cause**: Missing or incorrect `.env` file
- **Solution**: Create `.env` file with correct Supabase credentials

#### 3. Database Connection Errors
- **Cause**: Incorrect API keys or network issues
- **Solution**: Verify your Supabase URL and anon key

#### 4. Tables Not Found
- **Cause**: Database script not run
- **Solution**: Run the `database_setup.sql` script in Supabase SQL Editor

### Getting Help

1. Check the browser console for error messages
2. Verify your Supabase project is active
3. Ensure all environment variables are set correctly
4. Check that the database tables were created successfully

## Next Steps

After successful setup, you can:

1. **Add Sample Data**: Use the sample categories provided in the SQL script
2. **Customize Categories**: Add your own product categories
3. **Import Products**: Add your existing products to the system
4. **Configure Permissions**: Adjust Row Level Security policies if needed
5. **Deploy**: Build and deploy to your preferred hosting platform

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify your Supabase project settings
3. Ensure all dependencies are installed correctly
4. Check that your Node.js version is compatible

The system is now fully integrated with Supabase and should work seamlessly for all inventory management operations!
