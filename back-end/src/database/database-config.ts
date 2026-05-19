import sql, { ConnectionPool } from 'mssql';

export const config = {
  user: 'sa',
  password: 'YourStrong!Passw0rd',
  server: 'localhost',
  port: 1433,
  database: 'InfoWorld',
  options: {
    trustServerCertificate: true,
    encrypt: true,
  }
};

export let pool : ConnectionPool;

try {
    pool = await sql.connect(config);
    console.log("Connected to database");
} catch (error) {
    console.log("Error connecting to database " + error);
}


