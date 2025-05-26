import mysql from 'mysql2/promise';

let pool;

export const connectToDatabase = async () => {
  try {
    if (!pool) {
      pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });
    }
    return pool;
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Unable to connect to database');
  }
};

export const closeConnection = async () => {
  if (pool) {
    await pool.end();
    pool = null;
  }
};

// Helper function สำหรับการ execute query
export const executeQuery = async (query, params = []) => {
  const conn = await connectToDatabase();
  try {
    const [rows] = await conn.query(query, params);
    return rows;
  } catch (error) {
    console.error('Query execution error:', error);
    throw new Error('Database query failed');
  }
};