import mysql from 'mysql2/promise';

let pool;

export const connectToDatabase = async () => {
  try {
    if (!pool) {
      // ตรวจสอบ environment variables
      const dbConfig = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'prismadb',
        port: process.env.DB_PORT || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        // เพิ่มการตั้งค่าเพื่อความเสถียร
        acquireTimeout: 60000,
        timeout: 60000,
        reconnect: true,
        // การจัดการ SSL สำหรับ cloud database
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      };

      console.log('Connecting to database with config:', {
        host: dbConfig.host,
        user: dbConfig.user,
        database: dbConfig.database,
        port: dbConfig.port
      });

      pool = mysql.createPool(dbConfig);

      // ทดสอบการเชื่อมต่อ
      const connection = await pool.getConnection();
      console.log('Database connected successfully');
      connection.release();
    }
    return pool;
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error(`Unable to connect to database: ${error.message}`);
  }
};

export const closeConnection = async () => {
  if (pool) {
    try {
      await pool.end();
      pool = null;
      console.log('Database connection closed');
    } catch (error) {
      console.error('Error closing database connection:', error);
    }
  }
};

//  สำหรับการ execute query พร้อม error handling 
export const executeQuery = async (query, params = []) => {
  let connection;
  try {
    const poolConnection = await connectToDatabase();
    connection = await poolConnection.getConnection();
    
    console.log('Executing query:', query);
    console.log('With parameters:', params);
    
    const [rows] = await connection.query(query, params);
    
    console.log('Query executed successfully, returned rows:', rows.length || rows.affectedRows);
    return rows;
  } catch (error) {
    console.error('Query execution error:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sql: error.sql,
      sqlMessage: error.sqlMessage
    });
    
    // ส่งข้อผิดพลาด
    if (error.code === 'ER_NO_SUCH_TABLE') {
      throw new Error('Table does not exist. Please check your database schema.');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      throw new Error('Database access denied. Please check your credentials.');
    } else if (error.code === 'ECONNREFUSED') {
      throw new Error('Cannot connect to database server. Please check if MySQL is running.');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      throw new Error('Database does not exist. Please create the database first.');
    } else {
      throw new Error(`Database query failed: ${error.message}`);
    }
  } finally {
    if (connection) {
      connection.release();
    }
  }
};