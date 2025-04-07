# assi
A secure authentication system with React, Node.js, and MySQL.

## Setup Instructions

Start mysql, and run this code:

```sql
CREATE DATABASE IF NOT EXISTS auth_system;
USE auth_system;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
install dependencies: ```npm install```

Edit .env file:
```dotenv
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=auth_system
JWT_SECRET=jwt_key
```
Start server & client:
```shell
cd .\server\
npm start

cd .\client\
npm start
```

