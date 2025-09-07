import mongoose from 'mongoose';
import Course from './models/Course.js';
import User from './models/User.js';
import Test from './models/Test.js';
import Enrollment from './models/Enrollment.js';

const MONGO_URI = 'mongodb+srv://Himanshu:Himanshu123@himanshu.pe7xrly.mongodb.net/LMS?retryWrites=true&w=majority&appName=himanshu';

export const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB for seeding');

    // Check if data already exists
    const existingCourses = await Course.countDocuments();
    const existingUsers = await User.countDocuments();
    
    console.log(`Existing courses: ${existingCourses}, existing users: ${existingUsers}`);
    
    if (existingCourses > 0 && existingUsers > 5) {
      console.log('Database already has data, skipping seeding');
      return;
    }

    // Create sample courses
    const courses = await Course.insertMany([
      {
        title: 'React Fundamentals',
        description: 'Learn the basics of React development',
        category: 'Programming',
        instructor: 'John Doe',
        price: 99.99,
        duration: 8,
        level: 'Beginner',
        isActive: true,
        thumbnail: 'https://via.placeholder.com/300x200',
        lectures: [
          {
            title: 'Introduction to React',
            type: 'video',
            url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: 15
          },
          {
            title: 'React Components',
            type: 'video', 
            url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: 20
          }
        ]
      },
      {
        title: 'Node.js Backend Development',
        description: 'Build robust backend applications with Node.js',
        category: 'Programming',
        instructor: 'Jane Smith',
        price: 129.99,
        duration: 12,
        level: 'Intermediate',
        isActive: true,
        thumbnail: 'https://via.placeholder.com/300x200',
        lectures: [
          {
            title: 'Setting up Node.js',
            type: 'video',
            url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: 18
          }
        ]
      },
      {
        title: 'Database Design Principles',
        description: 'Learn how to design efficient databases',
        category: 'Database',
        instructor: 'Bob Wilson',
        price: 79.99,
        duration: 6,
        level: 'Intermediate',
        isActive: true,
        thumbnail: 'https://via.placeholder.com/300x200',
        lectures: [
          {
            title: 'Database Fundamentals',
            type: 'video',
            url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: 25
          }
        ]
      }
    ]);
    console.log(`Created ${courses.length} courses`);

    // Create sample users
    const users = await User.insertMany([
      {
        username: 'student1',
        email: 'student1@example.com',
        password: 'password123',
        firstName: 'Alice',
        lastName: 'Johnson',
        role: 'student',
        isApproved: true,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9a6c6e5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      {
        username: 'student2',
        email: 'student2@example.com',
        password: 'password123',
        firstName: 'Bob',
        lastName: 'Smith',
        role: 'student',
        isApproved: true,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      {
        username: 'student3',
        email: 'student3@example.com',
        password: 'password123',
        firstName: 'Carol',
        lastName: 'Davis',
        role: 'student',
        isApproved: true,
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      }
    ]);
    console.log(`Created ${users.length} students`);

    // Create sample enrollments
    const enrollments = [];
    for (let i = 0; i < users.length; i++) {
      for (let j = 0; j < Math.min(2, courses.length); j++) {
        enrollments.push({
          student: users[i]._id,
          course: courses[j]._id,
          progress: Math.floor(Math.random() * 100),
          enrolledAt: new Date()
        });
      }
    }
    
    await Enrollment.insertMany(enrollments);
    console.log(`Created ${enrollments.length} enrollments`);

    // Create sample tests
    const tests = await Test.insertMany([
      {
        title: 'React Basics Quiz',
        course: courses[0]._id,
        maxScore: 100,
        timeLimit: 60,
        isActive: true,
        questions: [
          {
            question: 'What is React?',
            type: 'multiple-choice',
            options: ['Library', 'Framework', 'Language', 'Database'],
            correctAnswer: 'Library'
          },
          {
            question: 'What is JSX?',
            type: 'multiple-choice', 
            options: ['JavaScript XML', 'Java Syntax Extension', 'JSON XML', 'JavaScript Extension'],
            correctAnswer: 'JavaScript XML'
          }
        ],
        results: [
          {
            student: users[0]._id,
            score: 85,
            maxScore: 100,
            answers: ['Library', 'JavaScript XML'],
            completedAt: new Date()
          },
          {
            student: users[1]._id,
            score: 92,
            maxScore: 100,
            answers: ['Library', 'JavaScript XML'],
            completedAt: new Date()
          }
        ]
      },
      {
        title: 'Node.js Fundamentals Test',
        course: courses[1]._id,
        maxScore: 100,
        timeLimit: 45,
        isActive: true,
        questions: [
          {
            question: 'What is Node.js?',
            type: 'multiple-choice',
            options: ['Runtime Environment', 'Database', 'Framework', 'Library'],
            correctAnswer: 'Runtime Environment'
          }
        ],
        results: [
          {
            student: users[1]._id,
            score: 78,
            maxScore: 100,
            answers: ['Runtime Environment'],
            completedAt: new Date()
          }
        ]
      }
    ]);
    console.log(`Created ${tests.length} tests with results`);

    console.log('Database seeding completed successfully!');
    
    // Log final counts
    const finalCourses = await Course.countDocuments();
    const finalUsers = await User.countDocuments();
    const finalTests = await Test.countDocuments();
    const finalEnrollments = await Enrollment.countDocuments();
    
    console.log('Final database counts:');
    console.log(`- Courses: ${finalCourses}`);
    console.log(`- Users: ${finalUsers}`);
    console.log(`- Tests: ${finalTests}`);
    console.log(`- Enrollments: ${finalEnrollments}`);
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run seeding if this file is executed directly
if (process.argv[1].endsWith('seedDatabase.js')) {
  seedDatabase();
}