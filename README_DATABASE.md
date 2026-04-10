# Local SQL Database Setup

This project uses **SQLite** - a local SQL database that stores data in a file on your computer. No external services needed!

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

That's it! The database will be automatically created in `data/shelter.db` when you first run the app.

## Database Location

- **Database file**: `data/shelter.db`
- Created automatically on first run
- Contains all your stands, projects, and bookings

## Managing Your Data

### Option 1: Admin Panel (Easiest)
1. Visit `http://localhost:3000/admin` on your website
2. View, delete, and manage all data through the web interface
3. Update booking statuses

### Option 2: SQLite Browser (Recommended)
1. Download DB Browser for SQLite: https://sqlitebrowser.org/
2. Open `data/shelter.db` file
3. Browse tables, edit data, run SQL queries
4. All changes are saved immediately

### Option 3: SQL Queries (Advanced)
You can run SQL queries directly. Here are some examples:

```sql
-- View all stands
SELECT * FROM stands;

-- Add a new stand
INSERT INTO stands (name, category, price, image, description, features, available, location, size)
VALUES ('New Stand', 'Premium', '$50,000', 'https://...', 'Description', '["Feature 1"]', 1, 'Location', '300 sqm');

-- Update a stand
UPDATE stands SET price = '$60,000' WHERE id = 1;

-- Delete a stand
DELETE FROM stands WHERE id = 1;

-- View all bookings
SELECT * FROM bookings ORDER BY created_at DESC;

-- Update booking status
UPDATE bookings SET status = 'confirmed' WHERE id = 1;
```

## Database Schema

### Stands Table
- `id` - Primary key (auto-increment)
- `name` - Stand name
- `category` - Category (Housing, Premium, etc.)
- `price` - Price string
- `image` - Image URL
- `description` - Description text
- `features` - JSON array stored as TEXT
- `available` - Boolean (1 = true, 0 = false)
- `location` - Location string
- `size` - Size string
- `created_at` - Timestamp
- `updated_at` - Timestamp

### Projects Table
- `id` - Primary key (auto-increment)
- `name` - Project name
- `amount` - Amount string
- `status` - Status (Completed, In Progress)
- `date` - Date string
- `description` - Description text
- `category` - Category
- `client` - Client name
- `location` - Location
- `stand_id` - Foreign key to stands (nullable)
- `created_at` - Timestamp
- `updated_at` - Timestamp

### Bookings Table
- `id` - Primary key (auto-increment)
- `name` - Customer name
- `email` - Email address
- `phone` - Phone number
- `preferred_date` - Preferred date (DATE)
- `preferred_time` - Preferred time (TEXT)
- `location` - Location
- `message` - Optional message (nullable)
- `stand_id` - Foreign key to stands (nullable)
- `stand_name` - Stand name (nullable)
- `status` - Status (pending, confirmed, cancelled)
- `created_at` - Timestamp

## Backup Your Database

Simply copy the `data/shelter.db` file to backup your data:
```bash
# Windows
copy data\shelter.db data\shelter-backup.db

# Mac/Linux
cp data/shelter.db data/shelter-backup.db
```

## Reset Database

To start fresh, delete the database file:
```bash
# Windows
del data\shelter.db

# Mac/Linux
rm data/shelter.db
```

Then restart your dev server - it will recreate the database with sample data.

## Troubleshooting

**Database file not found:**
- Make sure `data/` directory exists
- Restart your dev server
- The database is created automatically on first run

**Permission errors:**
- Make sure the `data/` directory is writable
- On Windows, run as administrator if needed

**Data not showing:**
- Check browser console for errors
- Verify the database file exists: `data/shelter.db`
- Try restarting the dev server

## Advantages of SQLite

✅ No server setup required
✅ Database stored locally in a single file
✅ Easy to backup (just copy the .db file)
✅ Works offline
✅ Fast and reliable
✅ Standard SQL syntax
✅ Can be opened with any SQLite browser tool
