import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import passport from './config/passport.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));
app.use(passport.initialize());

// Test database connection
async function connectDB() {
  try {
    await prisma.$connect();
    console.log('✅ Connect DB Success');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Role-based authorization middleware
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};

// ==================== BASIC ROUTES ====================

app.get('/', (req, res) => {
  res.json({ message: 'LMS API Server' });
});

// Upload image endpoint
app.post('/api/upload', authenticateToken, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload video endpoint
const videoUpload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /mp4|avi|mov|wmv|flv|mkv|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = file.mimetype.startsWith('video/');
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only video files are allowed!'));
    }
  }
});

app.post('/api/upload/video', authenticateToken, videoUpload.single('video'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload document endpoint
const documentUpload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|ppt|pptx|xls|xlsx|zip|rar/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    
    if (extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only document files are allowed!'));
    }
  }
});

app.post('/api/upload/document', authenticateToken, documentUpload.single('document'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    const fileSize = (req.file.size / (1024 * 1024)).toFixed(2) + ' MB';
    
    res.json({ 
      url: fileUrl,
      name: req.file.originalname,
      size: fileSize,
      type: path.extname(req.file.originalname).toUpperCase().replace('.', '')
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});

// ==================== AUTH ROUTES ====================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || 'STUDENT'
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        provider: true,
        createdAt: true
      }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== OAUTH ROUTES ====================

// Google OAuth
app.get('/api/auth/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false 
  })
);

app.get('/api/auth/google/callback',
  passport.authenticate('google', { 
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`
  }),
  (req, res) => {
    // Generate JWT token
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }
);

// Facebook OAuth
app.get('/api/auth/facebook',
  passport.authenticate('facebook', { 
    scope: ['email'],
    session: false 
  })
);

app.get('/api/auth/facebook/callback',
  passport.authenticate('facebook', { 
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=facebook_auth_failed`
  }),
  (req, res) => {
    // Generate JWT token
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }
);

// ==================== USER ROUTES ====================

// Get all users (Admin only)
app.get('/api/users', authenticateToken, authorizeRole('ADMIN'), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            enrollments: true,
            courses: true
          }
        }
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by ID
app.get('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        enrollments: {
          include: {
            course: true
          }
        },
        courses: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user
app.put('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const { name, email } = req.body;

    // Check if user can update (own profile or admin)
    if (req.user.id !== req.params.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { name, email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        updatedAt: true
      }
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user (Admin only)
app.delete('/api/users/:id', authenticateToken, authorizeRole('ADMIN'), async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== COURSE ROUTES ====================

// Get all courses
app.get('/api/courses', async (req, res) => {
  try {
    const { published } = req.query;
    
    const courses = await prisma.course.findMany({
      where: published !== undefined ? { published: published === 'true' } : {},
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            lessons: true,
            enrollments: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get course by ID
app.get('/api/courses/:id', async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        lessons: {
          orderBy: { order: 'asc' }
        },
        _count: {
          select: {
            enrollments: true
          }
        }
      }
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create course (Instructor/Admin only)
app.post('/api/courses', authenticateToken, authorizeRole('INSTRUCTOR', 'ADMIN'), async (req, res) => {
  try {
    const { title, description, thumbnail, price } = req.body;

    const course = await prisma.course.create({
      data: {
        title,
        description,
        thumbnail,
        price: price || 0,
        instructorId: req.user.id
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update course
app.put('/api/courses/:id', authenticateToken, async (req, res) => {
  try {
    const { title, description, thumbnail, price, published } = req.body;

    // Check if user is course instructor or admin
    const course = await prisma.course.findUnique({
      where: { id: req.params.id }
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.instructorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedCourse = await prisma.course.update({
      where: { id: req.params.id },
      data: {
        title,
        description,
        thumbnail,
        price,
        published
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete course
app.delete('/api/courses/:id', authenticateToken, async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id }
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.instructorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.course.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== LESSON ROUTES ====================

// Get lessons by course
app.get('/api/courses/:courseId/lessons', async (req, res) => {
  try {
    const lessons = await prisma.lesson.findMany({
      where: { courseId: req.params.courseId },
      orderBy: { order: 'asc' }
    });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get lesson by ID
app.get('/api/lessons/:id', async (req, res) => {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: req.params.id },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create lesson
app.post('/api/courses/:courseId/lessons', authenticateToken, async (req, res) => {
  try {
    const { title, content, videoUrl, order, duration } = req.body;

    // Check if user is course instructor or admin
    const course = await prisma.course.findUnique({
      where: { id: req.params.courseId }
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.instructorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const lesson = await prisma.lesson.create({
      data: {
        title,
        content,
        videoUrl,
        order,
        duration,
        courseId: req.params.courseId
      }
    });

    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update lesson
app.put('/api/lessons/:id', authenticateToken, async (req, res) => {
  try {
    const { title, content, videoUrl, order, duration } = req.body;

    const lesson = await prisma.lesson.findUnique({
      where: { id: req.params.id },
      include: { course: true }
    });

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    if (lesson.course.instructorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedLesson = await prisma.lesson.update({
      where: { id: req.params.id },
      data: {
        title,
        content,
        videoUrl,
        order,
        duration
      }
    });

    res.json(updatedLesson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete lesson
app.delete('/api/lessons/:id', authenticateToken, async (req, res) => {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: req.params.id },
      include: { course: true }
    });

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    if (lesson.course.instructorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.lesson.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ENROLLMENT ROUTES ====================

// Get user enrollments
app.get('/api/enrollments', authenticateToken, async (req, res) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: req.user.id },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                name: true
              }
            },
            _count: {
              select: {
                lessons: true
              }
            }
          }
        }
      },
      orderBy: { enrolledAt: 'desc' }
    });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get course enrollments (Instructor/Admin only)
app.get('/api/courses/:courseId/enrollments', authenticateToken, async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.courseId }
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.instructorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { courseId: req.params.courseId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { enrolledAt: 'desc' }
    });

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Enroll in course
app.post('/api/courses/:courseId/enroll', authenticateToken, async (req, res) => {
  try {
    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: req.user.id,
          courseId: req.params.courseId
        }
      }
    });

    if (existingEnrollment) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        userId: req.user.id,
        courseId: req.params.courseId
      },
      include: {
        course: true
      }
    });

    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Complete course
app.post('/api/enrollments/:id/complete', authenticateToken, async (req, res) => {
  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: req.params.id }
    });

    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    if (enrollment.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedEnrollment = await prisma.enrollment.update({
      where: { id: req.params.id },
      data: {
        completedAt: new Date()
      }
    });

    res.json(updatedEnrollment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== PROGRESS ROUTES ====================

// Get user progress for a course
app.get('/api/courses/:courseId/progress', authenticateToken, async (req, res) => {
  try {
    const progress = await prisma.progress.findMany({
      where: {
        userId: req.user.id,
        lesson: {
          courseId: req.params.courseId
        }
      },
      include: {
        lesson: true
      }
    });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark lesson as complete
app.post('/api/lessons/:lessonId/complete', authenticateToken, async (req, res) => {
  try {
    const progress = await prisma.progress.upsert({
      where: {
        userId_lessonId: {
          userId: req.user.id,
          lessonId: req.params.lessonId
        }
      },
      update: {
        completed: true,
        completedAt: new Date()
      },
      create: {
        userId: req.user.id,
        lessonId: req.params.lessonId,
        completed: true,
        completedAt: new Date()
      },
      include: {
        lesson: true
      }
    });

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reset lesson progress
app.delete('/api/lessons/:lessonId/progress', authenticateToken, async (req, res) => {
  try {
    await prisma.progress.delete({
      where: {
        userId_lessonId: {
          userId: req.user.id,
          lessonId: req.params.lessonId
        }
      }
    });

    res.json({ message: 'Progress reset successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== CERTIFICATE ROUTES ====================

// Get user certificates
app.get('/api/certificates', authenticateToken, async (req, res) => {
  try {
    const certificates = await prisma.certificate.findMany({
      where: { userId: req.user.id },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: { issuedAt: 'desc' }
    });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get certificate by ID
app.get('/api/certificates/:id', async (req, res) => {
  try {
    const certificate = await prisma.certificate.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    res.json(certificate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Issue certificate
app.post('/api/courses/:courseId/certificate', authenticateToken, async (req, res) => {
  try {
    // Check if user completed the course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: req.user.id,
          courseId: req.params.courseId
        }
      }
    });

    if (!enrollment || !enrollment.completedAt) {
      return res.status(400).json({ error: 'Course not completed yet' });
    }

    // Check if certificate already exists
    const existingCertificate = await prisma.certificate.findUnique({
      where: {
        userId_courseId: {
          userId: req.user.id,
          courseId: req.params.courseId
        }
      }
    });

    if (existingCertificate) {
      return res.status(400).json({ error: 'Certificate already issued' });
    }

    const certificate = await prisma.certificate.create({
      data: {
        userId: req.user.id,
        courseId: req.params.courseId
      },
      include: {
        course: true
      }
    });

    res.status(201).json(certificate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== QUIZ ROUTES ====================

// Get quizzes by lesson
app.get('/api/lessons/:lessonId/quizzes', async (req, res) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      where: { lessonId: req.params.lessonId },
      include: {
        questions: {
          include: {
            choices: true
          },
          orderBy: { order: 'asc' }
        },
        _count: {
          select: { questions: true }
        }
      }
    });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create quiz
app.post('/api/lessons/:lessonId/quizzes', authenticateToken, async (req, res) => {
  try {
    const { title, description, passingScore, timeLimit, questions } = req.body;

    const lesson = await prisma.lesson.findUnique({
      where: { id: req.params.lessonId },
      include: { course: true }
    });

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    if (lesson.course.instructorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        passingScore: passingScore || 70,
        timeLimit,
        lessonId: req.params.lessonId,
        questions: {
          create: questions?.map((q, index) => ({
            type: q.type,
            question: q.question,
            points: q.points || 1,
            order: index + 1,
            choices: q.choices ? {
              create: q.choices.map((c, i) => ({
                text: c.text,
                isCorrect: c.isCorrect || false,
                order: i + 1
              }))
            } : undefined
          }))
        }
      },
      include: {
        questions: {
          include: { choices: true }
        }
      }
    });

    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start quiz attempt
app.post('/api/quizzes/:quizId/start', authenticateToken, async (req, res) => {
  try {
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: req.user.id,
        quizId: req.params.quizId
      },
      include: {
        quiz: {
          include: {
            questions: {
              include: { choices: true },
              orderBy: { order: 'asc' }
            }
          }
        }
      }
    });

    res.status(201).json(attempt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit quiz answers
app.post('/api/attempts/:attemptId/submit', authenticateToken, async (req, res) => {
  try {
    const { answers } = req.body;

    const attempt = await prisma.quizAttempt.findUnique({
      where: { id: req.params.attemptId },
      include: {
        quiz: {
          include: {
            questions: {
              include: { choices: true }
            }
          }
        }
      }
    });

    if (!attempt || attempt.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    let totalScore = 0;
    let maxScore = 0;

    // Process answers
    for (const answer of answers) {
      const question = attempt.quiz.questions.find(q => q.id === answer.questionId);
      if (!question) continue;

      maxScore += question.points;
      let isCorrect = false;
      let points = 0;

      if (question.type === 'multiple_choice') {
        const correctChoice = question.choices.find(c => c.isCorrect);
        isCorrect = answer.answer === correctChoice?.id;
        points = isCorrect ? question.points : 0;
      }

      totalScore += points;

      await prisma.answer.create({
        data: {
          attemptId: req.params.attemptId,
          questionId: answer.questionId,
          answer: answer.answer,
          isCorrect: question.type === 'multiple_choice' ? isCorrect : null,
          points
        }
      });
    }

    const scorePercentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
    const passed = scorePercentage >= attempt.quiz.passingScore;

    const updatedAttempt = await prisma.quizAttempt.update({
      where: { id: req.params.attemptId },
      data: {
        score: scorePercentage,
        passed,
        completedAt: new Date()
      },
      include: {
        answers: {
          include: { question: true }
        }
      }
    });

    res.json(updatedAttempt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get quiz attempts
app.get('/api/quizzes/:quizId/attempts', authenticateToken, async (req, res) => {
  try {
    const attempts = await prisma.quizAttempt.findMany({
      where: {
        quizId: req.params.quizId,
        userId: req.user.id
      },
      include: {
        answers: {
          include: { question: true }
        }
      },
      orderBy: { startedAt: 'desc' }
    });
    res.json(attempts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete quiz
app.delete('/api/quizzes/:id', authenticateToken, async (req, res) => {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: req.params.id },
      include: { lesson: { include: { course: true } } }
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    if (quiz.lesson.course.instructorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.quiz.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== RESOURCE ROUTES ====================

// Get resources by lesson
app.get('/api/lessons/:lessonId/resources', async (req, res) => {
  try {
    const resources = await prisma.resource.findMany({
      where: { lessonId: req.params.lessonId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add resource to lesson
app.post('/api/lessons/:lessonId/resources', authenticateToken, async (req, res) => {
  try {
    const { name, fileUrl, fileType, fileSize } = req.body;

    // Check if user is course instructor or admin
    const lesson = await prisma.lesson.findUnique({
      where: { id: req.params.lessonId },
      include: { course: true }
    });

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    if (lesson.course.instructorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const resource = await prisma.resource.create({
      data: {
        name,
        fileUrl,
        fileType,
        fileSize,
        lessonId: req.params.lessonId
      }
    });

    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete resource
app.delete('/api/resources/:id', authenticateToken, async (req, res) => {
  try {
    const resource = await prisma.resource.findUnique({
      where: { id: req.params.id },
      include: { lesson: { include: { course: true } } }
    });

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    if (resource.lesson.course.instructorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.resource.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ROOM ROUTES ====================

// Get all rooms (public)
app.get('/api/rooms', async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single room
app.get('/api/rooms/:id', async (req, res) => {
  try {
    const room = await prisma.room.findUnique({
      where: { id: req.params.id },
      include: {
        bookings: {
          where: {
            status: 'confirmed',
            endTime: { gte: new Date() }
          },
          orderBy: { startTime: 'asc' }
        }
      }
    });
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create room (admin only)
app.post('/api/rooms', authenticateToken, authorizeRole('ADMIN'), async (req, res) => {
  try {
    const { name, capacity, location, description, facilities } = req.body;
    
    const room = await prisma.room.create({
      data: {
        name,
        capacity: parseInt(capacity),
        location,
        description,
        facilities
      }
    });
    
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update room (admin only)
app.put('/api/rooms/:id', authenticateToken, authorizeRole('ADMIN'), async (req, res) => {
  try {
    const { name, capacity, location, description, facilities, isActive } = req.body;
    
    const room = await prisma.room.update({
      where: { id: req.params.id },
      data: {
        name,
        capacity: capacity ? parseInt(capacity) : undefined,
        location,
        description,
        facilities,
        isActive
      }
    });
    
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete room (admin only)
app.delete('/api/rooms/:id', authenticateToken, authorizeRole('ADMIN'), async (req, res) => {
  try {
    await prisma.room.delete({
      where: { id: req.params.id }
    });
    
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== BOOKING ROUTES ====================

// Helper function to check room availability
async function checkRoomAvailability(roomId, startTime, endTime, excludeBookingId = null) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  const conflictingBookings = await prisma.booking.findMany({
    where: {
      roomId,
      status: 'confirmed',
      id: excludeBookingId ? { not: excludeBookingId } : undefined,
      OR: [
        {
          AND: [
            { startTime: { lte: start } },
            { endTime: { gt: start } }
          ]
        },
        {
          AND: [
            { startTime: { lt: end } },
            { endTime: { gte: end } }
          ]
        },
        {
          AND: [
            { startTime: { gte: start } },
            { endTime: { lte: end } }
          ]
        }
      ]
    }
  });
  
  return conflictingBookings.length === 0;
}

// Get all bookings (with filters)
app.get('/api/bookings', authenticateToken, async (req, res) => {
  try {
    const { roomId, startDate, endDate, userId } = req.query;
    
    const where = {
      status: 'confirmed'
    };
    
    if (roomId) where.roomId = roomId;
    if (userId) where.userId = userId;
    
    if (startDate && endDate) {
      where.AND = [
        { startTime: { gte: new Date(startDate) } },
        { endTime: { lte: new Date(endDate) } }
      ];
    }
    
    const bookings = await prisma.booking.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        room: true
      },
      orderBy: { startTime: 'asc' }
    });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's bookings
app.get('/api/bookings/my-bookings', authenticateToken, async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        userId: req.user.id,
        status: 'confirmed'
      },
      include: {
        room: true
      },
      orderBy: { startTime: 'desc' }
    });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create booking
app.post('/api/bookings', authenticateToken, async (req, res) => {
  try {
    const { roomId, title, description, startTime, endTime } = req.body;
    
    // Validate times
    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();
    
    if (start < now) {
      return res.status(400).json({ error: 'Cannot book in the past' });
    }
    
    if (end <= start) {
      return res.status(400).json({ error: 'End time must be after start time' });
    }
    
    // Check room exists
    const room = await prisma.room.findUnique({
      where: { id: roomId }
    });
    
    if (!room || !room.isActive) {
      return res.status(404).json({ error: 'Room not found or inactive' });
    }
    
    // Check availability
    const isAvailable = await checkRoomAvailability(roomId, start, end);
    
    if (!isAvailable) {
      return res.status(409).json({ error: 'Room is not available for the selected time' });
    }
    
    // Create booking
    const booking = await prisma.booking.create({
      data: {
        title,
        description,
        startTime: start,
        endTime: end,
        userId: req.user.id,
        roomId
      },
      include: {
        room: true,
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });
    
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update booking
app.put('/api/bookings/:id', authenticateToken, async (req, res) => {
  try {
    const { title, description, startTime, endTime } = req.body;
    
    // Check if booking exists and user owns it
    const existingBooking = await prisma.booking.findUnique({
      where: { id: req.params.id }
    });
    
    if (!existingBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    if (existingBooking.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to update this booking' });
    }
    
    // Validate times if provided
    if (startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);
      const now = new Date();
      
      if (start < now) {
        return res.status(400).json({ error: 'Cannot book in the past' });
      }
      
      if (end <= start) {
        return res.status(400).json({ error: 'End time must be after start time' });
      }
      
      // Check availability
      const isAvailable = await checkRoomAvailability(
        existingBooking.roomId,
        start,
        end,
        req.params.id
      );
      
      if (!isAvailable) {
        return res.status(409).json({ error: 'Room is not available for the selected time' });
      }
    }
    
    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data: {
        title,
        description,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined
      },
      include: {
        room: true,
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete/Cancel booking
app.delete('/api/bookings/:id', authenticateToken, async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id }
    });
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    if (booking.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to delete this booking' });
    }
    
    await prisma.booking.update({
      where: { id: req.params.id },
      data: { status: 'cancelled' }
    });
    
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ERROR HANDLING ====================

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// ==================== SERVER STARTUP ====================

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
});
