use SLATE;

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
INSERT INTO users (Name, Email, Password, Role, Linked_Student_ID) 
VALUES 
  ('ABC School', 'school@slate.com', '123456', 'School', NULL),
  ('Rahul Gupta', 'parent@slate.com', '654321', 'Parent', 101),
  ('Riya Sharma', 'student@slate.com', '987654', 'Student', 101);
  
select * from achievements;
INSERT INTO achievements (Student_id, Name, SchoolName, Achievements) 
VALUES 
  (101, 'Riya Sharma', 'ABC School', 'Science Olympiad Winner');
  
CREATE TABLE password_resets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (email) REFERENCES users(Email) ON DELETE CASCADE
);
select * from password_resets;

