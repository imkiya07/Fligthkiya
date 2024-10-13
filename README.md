# FLIGHT KIYA SERVER

## Create MySQL Database

Run the following commands to create the `flight_booking` database and import the `airports` and `airlines` tables:

```sql
CREATE DATABASE flight_booking;
-- Import the airports and airlines tables into the flight_booking database
-- Example: mysql -u your_db_user -p flight_booking < airports.sql
-- Example: mysql -u your_db_user -p flight_booking < airlines.sql

```

## Creating the .env File

To create a `.env` file in the `dist` root directory:

```bash
touch dist/.env
PORT=4001
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=flight_booking
MYSTIFLY_API_URL=https://restapidemo.myfarebox.com/api
BEARER_TOKEN="52AE7086-9529-488F-8BC4-BB57CF7B3802-6386"
API_TARGET=Test
```

```
npx tsc -w
npm run dev
```

[localhost:4001](http://localhost:4001)
