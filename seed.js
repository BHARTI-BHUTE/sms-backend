require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./config/db');

async function seed() {
  try {
    const adminPass   = await bcrypt.hash('Admin@123', 10);
    const facultyPass = await bcrypt.hash('Faculty@123', 10);
    const studentPass = await bcrypt.hash('Student@123', 10);

    await db.query('SET FOREIGN_KEY_CHECKS=0');
    for (const t of ['notices','fees','marks','attendance','enrollments','faculty','students','courses','departments','users']) {
      await db.query(`TRUNCATE TABLE ${t}`);
    }
    await db.query('SET FOREIGN_KEY_CHECKS=1');

    await db.query(`INSERT INTO departments (name,code,hod_name) VALUES ('Computer Science','CS','Dr. A. Sharma'),('Information Technology','IT','Dr. B. Verma'),('Electronics','EC','Dr. C. Patel')`);
    await db.query(`INSERT INTO users (name,email,password,role) VALUES (?,?,?,?),(?,?,?,?),(?,?,?,?)`,
      ['Admin User','admin@sms.com',adminPass,'admin','John Faculty','faculty@sms.com',facultyPass,'faculty','Alice Student','student@sms.com',studentPass,'student']);
    await db.query(`INSERT INTO courses (course_name,course_code,department_id,credits,semester) VALUES ('Data Structures','CS101',1,4,1),('Database Management','CS201',1,4,2),('Web Technologies','CS301',1,3,3),('Operating Systems','CS401',1,4,4),('Software Engineering','CS501',1,3,5),('Machine Learning','CS601',1,4,6)`);
    await db.query(`INSERT INTO students (user_id,student_code,first_name,last_name,gender,department_id,current_semester,enrollment_year) VALUES (3,'STU001','Alice','Student','Female',1,3,2024)`);
    await db.query(`INSERT INTO faculty (user_id,faculty_code,first_name,last_name,department_id,designation) VALUES (2,'FAC001','John','Faculty',1,'Assistant Professor')`);
    await db.query(`INSERT INTO notices (title,content,posted_by,target_role) VALUES ('Welcome to SMS','Student Management System is live!',1,'all'),('Fee Deadline','Last date for fee submission: 30 June 2026.',1,'student')`);

    console.log('\n✅ Database seeded!\n');
    console.log('  Admin:   admin@sms.com   / Admin@123');
    console.log('  Faculty: faculty@sms.com / Faculty@123');
    console.log('  Student: student@sms.com / Student@123\n');
    process.exit(0);
  } catch(e) { console.error('Seed error:', e.message); process.exit(1); }
}
seed();
