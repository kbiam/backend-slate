# SLATE - Backend

## ✨ Key Features

### 1. User Management
- Multi-role authentication (School, Parent, Student)
- Secure user registration and login
- Profile management
- Role-based access control

### 2. Authentication System
- JWT-based token authentication
- Secure password reset mechanism
- OTP (One-Time Password) email verification
- Role-specific dashboard redirects

### 3. Student Achievements
- Record and track student accomplishments
- Link achievements to specific students
- School-level achievement management

## 🛠 Technology Stack

### Backend
- **Language**: Node.js
- **Framework**: Express.js
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcrypt.js
- **Email Service**: Nodemailer

### Database
- **System**: MySQL
- **ORM**: Native SQL queries
- **Connection Management**: MySQL connection pools

### Security
- Password encryption
- JWT token-based authentication
- Role-based access control
- Secure OTP-based password reset


## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server
- npm (Node Package Manager)

### Step-by-Step Installation

1. **Clone Repository**
   ```bash
   git clone https://github.com/kbiam/backend-slate
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file with the following variables:
   ```
   host = localhost
   user = your_username
   password = your_password
   database = SLATE
   JWT_SECRET=your_secret_key
   EMAIL_USER=your_email
   EMAIL_PASS=your_email_password
   ```

4. **Database Setup**
   ```bash
   CREATE TABLE users (
  ID INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(255) NOT NULL,
  Email VARCHAR(255) UNIQUE NOT NULL,
  Password VARCHAR(255) NOT NULL,
  Role ENUM('School', 'Parent', 'Student') NOT NULL,
  Linked_Student_ID INT NULL -- For parents linking to students
    );

    CREATE TABLE achievements (
  Achievement_ID INT AUTO_INCREMENT PRIMARY KEY,
  Student_id INT NOT NULL ,
  Name varchar(255) NOT NULL,
  SchoolName VARCHAR(255) NOT NULL,
  Achievements TEXT
    );

    CREATE TABLE password_resets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (email) REFERENCES users(Email) ON DELETE CASCADE
    );
   ```

5. **Start Application**
   ```bash
   npm start
   ```

## 🧪 Testing

### Running Tests
```bash
npm test
```

## 🔒 Security Considerations

1. **Password Management**
   - Passwords hashed using bcrypt
   - Secure password reset mechanism

2. **Authentication**
   - JWT tokens with short expiration
   - Role-based access control
   - Secure OTP generation and verification

 
