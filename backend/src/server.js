import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

// CORS Configuration
app.use('/*', cors({
  origin: (origin) => {
    // Allow localhost for development
    if (!origin || origin.includes('localhost')) return origin;

    // Allow Cloudflare Pages (including preview deployments)
    if (origin && origin.includes('.pages.dev')) return origin;

    // Allow other production domains
    const allowedDomains = [
      'https://apichaisorayan.github.io',
      'https://learning-platform-api.apichailove-student.workers.dev'
    ];

    if (allowedDomains.some(domain => origin && origin.startsWith(domain))) {
      return origin;
    }

    return origin || '*';
  },
  credentials: true,
}));

// Helper: Hash password (simple for demo - use bcrypt in production)
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Helper: Verify password
async function verifyPassword(password, hash) {
  const hashedInput = await hashPassword(password);
  return hashedInput === hash;
}

// Helper: Generate JWT
function generateToken(userId, email, role, secret) {
  const payload = {
    userId,
    email,
    role,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7), // 7 days
  };
  return sign(payload, secret);
}

// Simple JWT sign function
async function sign(payload, secret) {
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const header = btoa(String.fromCharCode(...data)).replace(/=/g, '');

  const payloadData = encoder.encode(JSON.stringify(payload));
  const payloadEncoded = btoa(String.fromCharCode(...payloadData)).replace(/=/g, '');

  const signatureData = encoder.encode(`${header}.${payloadEncoded}`);
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, signatureData);
  const signatureEncoded = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/=/g, '');

  return `${header}.${payloadEncoded}.${signatureEncoded}`;
}

// Middleware: Auth
const authMiddleware = async (c, next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Auth failed: No token provided');
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.substring(7);
  try {
    const decoded = await verifyToken(token, c.env.JWT_SECRET);
    console.log('User authenticated:', decoded.email, 'Role:', decoded.role); // Debug Log
    c.set('user', decoded);
    await next();
  } catch (error) {
    console.log('Auth failed: Invalid token', error.message);
    return c.json({ error: 'Invalid token' }, 401);
  }
};

// Simple JWT verify function
async function verifyToken(token, secret) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid token');

  const payload = JSON.parse(atob(parts[1]));
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Token expired');
  }

  return payload;
}

// Middleware: Role check
const requireRole = (...roles) => {
  return async (c, next) => {
    const user = c.get('user');
    console.log('Checking role for user:', user?.email, 'Required:', roles, 'Actual:', user?.role); // Debug Log
    if (!user || !roles.includes(user.role)) {
      console.log('Role check failed');
      return c.json({ error: 'Forbidden' }, 403);
    }
    await next();
  };
};

// ==================== AUTH ROUTES ====================

// Register
app.post('/api/auth/register', async (c) => {
  try {
    const { email, password, name, role = 'STUDENT' } = await c.req.json();

    if (!email || !password || !name) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Check if user exists
    const existing = await c.env.DB.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(email).first();

    if (existing) {
      return c.json({ error: 'Email already registered' }, 400);
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const result = await c.env.DB.prepare(
      'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)'
    ).bind(email, hashedPassword, name, role).run();

    const userId = result.meta.last_row_id;
    const token = await generateToken(userId, email, role, c.env.JWT_SECRET);

    return c.json({
      token,
      user: { id: userId, email, name, role }
    }, 201);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Login
app.post('/api/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Missing email or password' }, 400);
    }

    const user = await c.env.DB.prepare(
      'SELECT id, email, password, name, role FROM users WHERE email = ?'
    ).bind(email).first();

    if (!user || !(await verifyPassword(password, user.password))) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    const token = await generateToken(user.id, user.email, user.role, c.env.JWT_SECRET);

    return c.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// ==================== COURSES ROUTES ====================

// Get all courses
app.get('/api/courses', async (c) => {
  try {
    const published = c.req.query('published');
    let query = `
      SELECT 
        c.*, 
        u.name as instructor_name,
        (SELECT COUNT(*) FROM lessons WHERE course_id = c.id) as lessons_count,
        (SELECT COUNT(*) FROM enrollments WHERE course_id = c.id) as students_count
      FROM courses c 
      JOIN users u ON c.instructor_id = u.id
    `;

    if (published === 'true') {
      query += ' WHERE c.published = 1';
    }

    query += ' ORDER BY c.created_at DESC';

    const { results } = await c.env.DB.prepare(query).all();
    return c.json(results);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Get single course with lessons
app.get('/api/courses/:id', async (c) => {
  try {
    const courseId = c.req.param('id');

    const course = await c.env.DB.prepare(
      'SELECT c.*, u.name as instructor_name FROM courses c JOIN users u ON c.instructor_id = u.id WHERE c.id = ?'
    ).bind(courseId).first();

    if (!course) {
      return c.json({ error: 'Course not found' }, 404);
    }

    const { results: lessons } = await c.env.DB.prepare(
      'SELECT * FROM lessons WHERE course_id = ? ORDER BY order_index'
    ).bind(courseId).all();

    return c.json({ ...course, lessons });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Create course (INSTRUCTOR only)
app.post('/api/courses', authMiddleware, requireRole('INSTRUCTOR', 'ADMIN'), async (c) => {
  try {
    const { title, description, thumbnail, price = 0, published = false } = await c.req.json();
    const user = c.get('user');

    if (!title) {
      return c.json({ error: 'Title is required' }, 400);
    }

    const result = await c.env.DB.prepare(
      'INSERT INTO courses (title, description, thumbnail, price, published, instructor_id) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(title, description, thumbnail, price, published ? 1 : 0, user.userId).run();

    const courseId = result.meta.last_row_id;
    const course = await c.env.DB.prepare('SELECT * FROM courses WHERE id = ?').bind(courseId).first();

    return c.json(course, 201);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Update course
app.put('/api/courses/:id', authMiddleware, requireRole('INSTRUCTOR', 'ADMIN'), async (c) => {
  try {
    const courseId = c.req.param('id');
    const user = c.get('user');
    const updates = await c.req.json();

    // Check ownership
    const course = await c.env.DB.prepare('SELECT instructor_id FROM courses WHERE id = ?').bind(courseId).first();
    if (!course || (course.instructor_id !== user.userId && user.role !== 'ADMIN')) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    const fields = [];
    const values = [];

    if (updates.title !== undefined) { fields.push('title = ?'); values.push(updates.title); }
    if (updates.description !== undefined) { fields.push('description = ?'); values.push(updates.description); }
    if (updates.thumbnail !== undefined) { fields.push('thumbnail = ?'); values.push(updates.thumbnail); }
    if (updates.price !== undefined) { fields.push('price = ?'); values.push(updates.price); }
    if (updates.published !== undefined) { fields.push('published = ?'); values.push(updates.published ? 1 : 0); }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(courseId);

    await c.env.DB.prepare(
      `UPDATE courses SET ${fields.join(', ')} WHERE id = ?`
    ).bind(...values).run();

    const updated = await c.env.DB.prepare('SELECT * FROM courses WHERE id = ?').bind(courseId).first();
    return c.json(updated);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Delete course
app.delete('/api/courses/:id', authMiddleware, requireRole('INSTRUCTOR', 'ADMIN'), async (c) => {
  try {
    const courseId = c.req.param('id');
    const user = c.get('user');

    const course = await c.env.DB.prepare('SELECT instructor_id FROM courses WHERE id = ?').bind(courseId).first();
    if (!course || (course.instructor_id !== user.userId && user.role !== 'ADMIN')) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    await c.env.DB.prepare('DELETE FROM courses WHERE id = ?').bind(courseId).run();
    return c.json({ message: 'Course deleted' });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// ==================== LESSONS ROUTES ====================

// Get lessons in course
// Get lessons in course
app.get('/api/courses/:courseId/lessons', async (c) => {
  try {
    const courseId = c.req.param('courseId');
    const { results } = await c.env.DB.prepare(
      'SELECT * FROM lessons WHERE course_id = ? ORDER BY order_index'
    ).bind(courseId).all();

    return c.json(results);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Create lesson
app.post('/api/courses/:courseId/lessons', authMiddleware, requireRole('INSTRUCTOR', 'ADMIN'), async (c) => {
  try {
    const courseId = c.req.param('courseId');
    const user = c.get('user');
    const body = await c.req.json();
    const { title, content, duration = 0 } = body;
    // Map frontend camelCase to backend snake_case
    const video_url = body.video_url || body.videoUrl;
    const order_index = body.order_index || body.order || 0;

    // Check ownership
    const course = await c.env.DB.prepare('SELECT instructor_id FROM courses WHERE id = ?').bind(courseId).first();

    console.log(`Debug Ownership: Course Owner ID: ${course?.instructor_id}, Current User ID: ${user.userId}, Role: ${user.role}`);

    if (!course || (course.instructor_id !== user.userId && user.role !== 'ADMIN')) {
      console.log('Ownership check failed: Not owner and not admin');
      return c.json({ error: 'Forbidden' }, 403);
    }

    const result = await c.env.DB.prepare(
      'INSERT INTO lessons (course_id, title, content, video_url, order_index, duration) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(courseId, title, content, video_url, order_index, duration).run();

    const lessonId = result.meta.last_row_id;
    const lesson = await c.env.DB.prepare('SELECT * FROM lessons WHERE id = ?').bind(lessonId).first();

    return c.json(lesson, 201);
  } catch (error) {
    console.error('Create lesson error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Update lesson
app.put('/api/lessons/:id', authMiddleware, requireRole('INSTRUCTOR', 'ADMIN'), async (c) => {
  try {
    const lessonId = c.req.param('id');
    const user = c.get('user');
    const updates = await c.req.json();

    // Check ownership
    const lesson = await c.env.DB.prepare(
      'SELECT l.*, c.instructor_id FROM lessons l JOIN courses c ON l.course_id = c.id WHERE l.id = ?'
    ).bind(lessonId).first();

    if (!lesson || (lesson.instructor_id !== user.userId && user.role !== 'ADMIN')) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    const fields = [];
    const values = [];

    if (updates.title !== undefined) { fields.push('title = ?'); values.push(updates.title); }
    if (updates.content !== undefined) { fields.push('content = ?'); values.push(updates.content); }
    if (updates.video_url !== undefined) { fields.push('video_url = ?'); values.push(updates.video_url); }
    if (updates.order_index !== undefined) { fields.push('order_index = ?'); values.push(updates.order_index); }
    if (updates.duration !== undefined) { fields.push('duration = ?'); values.push(updates.duration); }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(lessonId);

    await c.env.DB.prepare(
      `UPDATE lessons SET ${fields.join(', ')} WHERE id = ?`
    ).bind(...values).run();

    const updated = await c.env.DB.prepare('SELECT * FROM lessons WHERE id = ?').bind(lessonId).first();
    return c.json(updated);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Delete lesson
app.delete('/api/lessons/:id', authMiddleware, requireRole('INSTRUCTOR', 'ADMIN'), async (c) => {
  try {
    const lessonId = c.req.param('id');
    const user = c.get('user');

    const lesson = await c.env.DB.prepare(
      'SELECT l.*, c.instructor_id FROM lessons l JOIN courses c ON l.course_id = c.id WHERE l.id = ?'
    ).bind(lessonId).first();

    if (!lesson || (lesson.instructor_id !== user.userId && user.role !== 'ADMIN')) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    await c.env.DB.prepare('DELETE FROM lessons WHERE id = ?').bind(lessonId).run();
    return c.json({ message: 'Lesson deleted' });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});


// ==================== RESOURCES ROUTES ====================

// Get resources in lesson
app.get('/api/lessons/:lessonId/resources', async (c) => {
  try {
    const lessonId = c.req.param('lessonId');
    const { results } = await c.env.DB.prepare(
      'SELECT * FROM resources WHERE lesson_id = ? ORDER BY created_at'
    ).bind(lessonId).all();

    return c.json(results);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Add resource
app.post('/api/lessons/:lessonId/resources', authMiddleware, requireRole('INSTRUCTOR', 'ADMIN'), async (c) => {
  try {
    const lessonId = c.req.param('lessonId');
    const user = c.get('user');
    const { name, file_url, file_type, file_size } = await c.req.json();

    // Check ownership
    const lesson = await c.env.DB.prepare(
      'SELECT l.*, c.instructor_id FROM lessons l JOIN courses c ON l.course_id = c.id WHERE l.id = ?'
    ).bind(lessonId).first();

    if (!lesson || (lesson.instructor_id !== user.userId && user.role !== 'ADMIN')) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    const result = await c.env.DB.prepare(
      'INSERT INTO resources (lesson_id, name, file_url, file_type, file_size) VALUES (?, ?, ?, ?, ?)'
    ).bind(lessonId, name, file_url, file_type, file_size).run();

    const resourceId = result.meta.last_row_id;
    const resource = await c.env.DB.prepare('SELECT * FROM resources WHERE id = ?').bind(resourceId).first();

    return c.json(resource, 201);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Delete resource
app.delete('/api/resources/:id', authMiddleware, requireRole('INSTRUCTOR', 'ADMIN'), async (c) => {
  try {
    const resourceId = c.req.param('id');
    const user = c.get('user');

    const resource = await c.env.DB.prepare(
      'SELECT r.*, l.course_id, c.instructor_id FROM resources r JOIN lessons l ON r.lesson_id = l.id JOIN courses c ON l.course_id = c.id WHERE r.id = ?'
    ).bind(resourceId).first();

    if (!resource || (resource.instructor_id !== user.userId && user.role !== 'ADMIN')) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    await c.env.DB.prepare('DELETE FROM resources WHERE id = ?').bind(resourceId).run();
    return c.json({ message: 'Resource deleted' });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// ==================== QUIZZES ROUTES ====================

// Get quizzes in lesson
app.get('/api/lessons/:lessonId/quizzes', async (c) => {
  try {
    const lessonId = c.req.param('lessonId');
    const { results: quizzes } = await c.env.DB.prepare(
      'SELECT * FROM quizzes WHERE lesson_id = ? ORDER BY created_at'
    ).bind(lessonId).all();

    // Get questions and choices for each quiz
    for (const quiz of quizzes) {
      const { results: questions } = await c.env.DB.prepare(
        'SELECT * FROM questions WHERE quiz_id = ? ORDER BY order_index'
      ).bind(quiz.id).all();

      for (const question of questions) {
        const { results: choices } = await c.env.DB.prepare(
          'SELECT * FROM choices WHERE question_id = ? ORDER BY order_index'
        ).bind(question.id).all();
        question.choices = choices;
      }

      quiz.questions = questions;
    }

    return c.json(quizzes);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Create quiz with questions and choices
app.post('/api/lessons/:lessonId/quizzes', authMiddleware, requireRole('INSTRUCTOR', 'ADMIN'), async (c) => {
  try {
    const lessonId = c.req.param('lessonId');
    const user = c.get('user');
    const { title, description, passing_score = 70, time_limit, questions = [] } = await c.req.json();

    // Check ownership
    const lesson = await c.env.DB.prepare(
      'SELECT l.*, c.instructor_id FROM lessons l JOIN courses c ON l.course_id = c.id WHERE l.id = ?'
    ).bind(lessonId).first();

    if (!lesson || (lesson.instructor_id !== user.userId && user.role !== 'ADMIN')) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    // Create quiz
    // Try to insert with quiz_type, fallback if column doesn't exist
    let quizResult;
    try {
      const quiz_type = body.quiz_type || 'post';
      quizResult = await c.env.DB.prepare(
        'INSERT INTO quizzes (lesson_id, title, description, passing_score, time_limit, quiz_type) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(lessonId, title, description, passing_score, time_limit, quiz_type).run();
    } catch (error) {
      // Fallback if quiz_type column doesn't exist yet
      console.log('Fallback: Creating quiz without quiz_type column');
      quizResult = await c.env.DB.prepare(
        'INSERT INTO quizzes (lesson_id, title, description, passing_score, time_limit) VALUES (?, ?, ?, ?, ?)'
      ).bind(lessonId, title, description, passing_score, time_limit).run();
    }

    const quizId = quizResult.meta.last_row_id;

    // Create questions and choices
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const questionResult = await c.env.DB.prepare(
        'INSERT INTO questions (quiz_id, question, type, points, order_index) VALUES (?, ?, ?, ?, ?)'
      ).bind(quizId, q.question, q.type || 'multiple_choice', q.points || 1, i).run();

      const questionId = questionResult.meta.last_row_id;

      if (q.choices && q.choices.length > 0) {
        for (let j = 0; j < q.choices.length; j++) {
          const choice = q.choices[j];
          await c.env.DB.prepare(
            'INSERT INTO choices (question_id, text, is_correct, order_index) VALUES (?, ?, ?, ?)'
          ).bind(questionId, choice.text, choice.is_correct ? 1 : 0, j).run();
        }
      }
    }

    // Fetch complete quiz
    const quiz = await c.env.DB.prepare('SELECT * FROM quizzes WHERE id = ?').bind(quizId).first();
    const { results: quizQuestions } = await c.env.DB.prepare(
      'SELECT * FROM questions WHERE quiz_id = ? ORDER BY order_index'
    ).bind(quizId).all();

    for (const question of quizQuestions) {
      const { results: choices } = await c.env.DB.prepare(
        'SELECT * FROM choices WHERE question_id = ? ORDER BY order_index'
      ).bind(question.id).all();
      question.choices = choices;
    }

    quiz.questions = quizQuestions;

    return c.json(quiz, 201);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Get single quiz with questions and choices
app.get('/api/quizzes/:id', authMiddleware, async (c) => {
  try {
    const quizId = c.req.param('id');

    const quiz = await c.env.DB.prepare('SELECT * FROM quizzes WHERE id = ?').bind(quizId).first();

    if (!quiz) {
      return c.json({ error: 'Quiz not found' }, 404);
    }

    // Get questions with choices
    const { results: questions } = await c.env.DB.prepare(
      'SELECT * FROM questions WHERE quiz_id = ? ORDER BY order_index'
    ).bind(quizId).all();

    for (const question of questions) {
      const { results: choices } = await c.env.DB.prepare(
        'SELECT * FROM choices WHERE question_id = ? ORDER BY order_index'
      ).bind(question.id).all();
      question.choices = choices;
    }

    quiz.questions = questions;

    return c.json(quiz);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Delete quiz
app.delete('/api/quizzes/:id', authMiddleware, requireRole('INSTRUCTOR', 'ADMIN'), async (c) => {
  try {
    const quizId = c.req.param('id');
    const user = c.get('user');

    const quiz = await c.env.DB.prepare(
      'SELECT q.*, l.course_id, c.instructor_id FROM quizzes q JOIN lessons l ON q.lesson_id = l.id JOIN courses c ON l.course_id = c.id WHERE q.id = ?'
    ).bind(quizId).first();

    if (!quiz || (quiz.instructor_id !== user.userId && user.role !== 'ADMIN')) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    await c.env.DB.prepare('DELETE FROM quizzes WHERE id = ?').bind(quizId).run();
    return c.json({ message: 'Quiz deleted' });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// ==================== QUIZ ATTEMPTS ROUTES ====================

// Get quiz attempts
app.get('/api/quizzes/:quizId/attempts', authMiddleware, async (c) => {
  try {
    const quizId = c.req.param('quizId');
    const user = c.get('user');

    const { results } = await c.env.DB.prepare(
      'SELECT * FROM quiz_attempts WHERE quiz_id = ? AND user_id = ? ORDER BY started_at DESC'
    ).bind(quizId, user.userId).all();

    return c.json(results);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Start quiz attempt
app.post('/api/quizzes/:quizId/start', authMiddleware, async (c) => {
  try {
    const quizId = c.req.param('quizId');
    const user = c.get('user');

    const result = await c.env.DB.prepare(
      'INSERT INTO quiz_attempts (user_id, quiz_id) VALUES (?, ?)'
    ).bind(user.userId, quizId).run();

    const attemptId = result.meta.last_row_id;
    const attempt = await c.env.DB.prepare('SELECT * FROM quiz_attempts WHERE id = ?').bind(attemptId).first();

    return c.json(attempt, 201);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Submit quiz answers
app.post('/api/attempts/:attemptId/submit', authMiddleware, async (c) => {
  try {
    const attemptId = c.req.param('attemptId');
    const user = c.get('user');
    const { answers } = await c.req.json();

    // Verify ownership
    const attempt = await c.env.DB.prepare(
      'SELECT * FROM quiz_attempts WHERE id = ? AND user_id = ?'
    ).bind(attemptId, user.userId).first();

    if (!attempt) {
      return c.json({ error: 'Attempt not found' }, 404);
    }

    // Get quiz info
    const quiz = await c.env.DB.prepare('SELECT * FROM quizzes WHERE id = ?').bind(attempt.quiz_id).first();

    // Process answers
    let totalPoints = 0;
    let earnedPoints = 0;

    for (const answer of answers) {
      const question = await c.env.DB.prepare(
        'SELECT * FROM questions WHERE id = ?'
      ).bind(answer.question_id).first();

      if (!question) continue;

      totalPoints += question.points;

      // Check if answer is correct
      let isCorrect = false;
      if (question.type === 'multiple_choice') {
        const choice = await c.env.DB.prepare(
          'SELECT is_correct FROM choices WHERE id = ?'
        ).bind(answer.answer).first();
        isCorrect = choice && choice.is_correct === 1;
      }

      if (isCorrect) {
        earnedPoints += question.points;
      }

      // Save answer
      await c.env.DB.prepare(
        'INSERT INTO answers (attempt_id, question_id, answer, is_correct) VALUES (?, ?, ?, ?)'
      ).bind(attemptId, answer.question_id, answer.answer, isCorrect ? 1 : 0).run();
    }

    // Calculate score
    const score = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
    const passed = score >= quiz.passing_score ? 1 : 0;

    // Update attempt
    await c.env.DB.prepare(
      'UPDATE quiz_attempts SET submitted_at = CURRENT_TIMESTAMP, score = ?, passed = ? WHERE id = ?'
    ).bind(score, passed, attemptId).run();

    const updated = await c.env.DB.prepare('SELECT * FROM quiz_attempts WHERE id = ?').bind(attemptId).first();

    return c.json(updated);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// ==================== ENROLLMENTS ROUTES ====================

// Get my enrollments
app.get('/api/enrollments', authMiddleware, async (c) => {
  try {
    const user = c.get('user');

    const { results } = await c.env.DB.prepare(
      'SELECT e.*, c.title, c.description, c.thumbnail, u.name as instructor_name FROM enrollments e JOIN courses c ON e.course_id = c.id JOIN users u ON c.instructor_id = u.id WHERE e.user_id = ? ORDER BY e.enrolled_at DESC'
    ).bind(user.userId).all();

    return c.json(results);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Enroll in course
app.post('/api/courses/:courseId/enroll', authMiddleware, async (c) => {
  try {
    const courseId = c.req.param('courseId');
    const user = c.get('user');

    // Check if already enrolled
    const existing = await c.env.DB.prepare(
      'SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?'
    ).bind(user.userId, courseId).first();

    if (existing) {
      return c.json({ error: 'Already enrolled' }, 400);
    }

    const result = await c.env.DB.prepare(
      'INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)'
    ).bind(user.userId, courseId).run();

    const enrollmentId = result.meta.last_row_id;
    const enrollment = await c.env.DB.prepare('SELECT * FROM enrollments WHERE id = ?').bind(enrollmentId).first();

    return c.json(enrollment, 201);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Get my courses (as instructor)
app.get('/api/my-courses', authMiddleware, requireRole('INSTRUCTOR', 'ADMIN'), async (c) => {
  try {
    const user = c.get('user');

    const { results } = await c.env.DB.prepare(
      'SELECT * FROM courses WHERE instructor_id = ? ORDER BY created_at DESC'
    ).bind(user.userId).all();

    return c.json(results);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// ==================== PROGRESS ROUTES ====================

// Get course progress
app.get('/api/courses/:courseId/progress', authMiddleware, async (c) => {
  try {
    const courseId = c.req.param('courseId');
    const user = c.get('user');

    const { results } = await c.env.DB.prepare(
      'SELECT p.*, l.title FROM progress p JOIN lessons l ON p.lesson_id = l.id WHERE l.course_id = ? AND p.user_id = ?'
    ).bind(courseId, user.userId).all();

    return c.json(results);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Mark lesson as complete
app.post('/api/lessons/:lessonId/complete', authMiddleware, async (c) => {
  try {
    const lessonId = c.req.param('lessonId');
    const user = c.get('user');

    // Check if already exists
    const existing = await c.env.DB.prepare(
      'SELECT id, completed FROM progress WHERE user_id = ? AND lesson_id = ?'
    ).bind(user.userId, lessonId).first();

    if (existing) {
      // Update
      await c.env.DB.prepare(
        'UPDATE progress SET completed = 1, completed_at = CURRENT_TIMESTAMP WHERE id = ?'
      ).bind(existing.id).run();
    } else {
      // Insert
      await c.env.DB.prepare(
        'INSERT INTO progress (user_id, lesson_id, completed) VALUES (?, ?, 1)'
      ).bind(user.userId, lessonId).run();
    }

    const progress = await c.env.DB.prepare(
      'SELECT * FROM progress WHERE user_id = ? AND lesson_id = ?'
    ).bind(user.userId, lessonId).first();

    return c.json(progress);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// ==================== COMMENTS ROUTES ====================

// Get comments in lesson
app.get('/api/lessons/:lessonId/comments', async (c) => {
  try {
    const lessonId = c.req.param('lessonId');

    const { results } = await c.env.DB.prepare(
      'SELECT c.*, u.name as user_name FROM comments c JOIN users u ON c.user_id = u.id WHERE c.lesson_id = ? ORDER BY c.created_at DESC'
    ).bind(lessonId).all();

    return c.json(results);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Add comment
app.post('/api/lessons/:lessonId/comments', authMiddleware, async (c) => {
  try {
    const lessonId = c.req.param('lessonId');
    const user = c.get('user');
    const { content } = await c.req.json();

    if (!content) {
      return c.json({ error: 'Content is required' }, 400);
    }

    const result = await c.env.DB.prepare(
      'INSERT INTO comments (user_id, lesson_id, content) VALUES (?, ?, ?)'
    ).bind(user.userId, lessonId, content).run();

    const commentId = result.meta.last_row_id;
    const comment = await c.env.DB.prepare(
      'SELECT c.*, u.name as user_name FROM comments c JOIN users u ON c.user_id = u.id WHERE c.id = ?'
    ).bind(commentId).first();

    return c.json(comment, 201);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Delete comment
app.delete('/api/comments/:id', authMiddleware, async (c) => {
  try {
    const commentId = c.req.param('id');
    const user = c.get('user');

    const comment = await c.env.DB.prepare(
      'SELECT user_id FROM comments WHERE id = ?'
    ).bind(commentId).first();

    if (!comment || comment.user_id !== user.userId) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    await c.env.DB.prepare('DELETE FROM comments WHERE id = ?').bind(commentId).run();
    return c.json({ message: 'Comment deleted' });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// ==================== INSTRUCTOR PROFILES ROUTES ====================

// Get instructor profile
app.get('/api/instructors/:userId/profile', async (c) => {
  try {
    const userId = c.req.param('userId');

    const profile = await c.env.DB.prepare(
      'SELECT ip.*, u.name, u.email FROM instructor_profiles ip JOIN users u ON ip.user_id = u.id WHERE ip.user_id = ?'
    ).bind(userId).first();

    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    // Get instructor's courses
    const { results: courses } = await c.env.DB.prepare(
      'SELECT id, title, description, thumbnail, published FROM courses WHERE instructor_id = ? ORDER BY created_at DESC'
    ).bind(userId).all();

    // Get total students count
    const { total_students } = await c.env.DB.prepare(
      'SELECT COUNT(DISTINCT e.user_id) as total_students FROM enrollments e JOIN courses c ON e.course_id = c.id WHERE c.instructor_id = ?'
    ).bind(userId).first() || { total_students: 0 };

    return c.json({
      ...profile,
      courses,
      total_students,
      total_courses: courses.length
    });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Get my instructor profile
app.get('/api/instructor/profile', authMiddleware, requireRole('INSTRUCTOR'), async (c) => {
  try {
    const user = c.get('user');

    const profile = await c.env.DB.prepare(
      'SELECT * FROM instructor_profiles WHERE user_id = ?'
    ).bind(user.userId).first();

    if (!profile) {
      // Return empty profile if not exists
      return c.json({
        user_id: user.userId,
        bio: null,
        expertise: null,
        experience_years: 0,
        education: null,
        avatar_url: null,
        website: null,
        linkedin: null,
        facebook: null,
        twitter: null
      });
    }

    return c.json(profile);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Create or update instructor profile
app.post('/api/instructor/profile', authMiddleware, requireRole('INSTRUCTOR'), async (c) => {
  try {
    const user = c.get('user');
    const {
      bio,
      expertise,
      experience_years,
      education,
      avatar_url,
      website,
      linkedin,
      facebook,
      twitter
    } = await c.req.json();

    // Check if profile exists
    const existing = await c.env.DB.prepare(
      'SELECT id FROM instructor_profiles WHERE user_id = ?'
    ).bind(user.userId).first();

    if (existing) {
      // Update existing profile
      const fields = [];
      const values = [];

      if (bio !== undefined) { fields.push('bio = ?'); values.push(bio); }
      if (expertise !== undefined) { fields.push('expertise = ?'); values.push(expertise); }
      if (experience_years !== undefined) { fields.push('experience_years = ?'); values.push(experience_years); }
      if (education !== undefined) { fields.push('education = ?'); values.push(education); }
      if (avatar_url !== undefined) { fields.push('avatar_url = ?'); values.push(avatar_url); }
      if (website !== undefined) { fields.push('website = ?'); values.push(website); }
      if (linkedin !== undefined) { fields.push('linkedin = ?'); values.push(linkedin); }
      if (facebook !== undefined) { fields.push('facebook = ?'); values.push(facebook); }
      if (twitter !== undefined) { fields.push('twitter = ?'); values.push(twitter); }

      fields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(existing.id);

      await c.env.DB.prepare(
        `UPDATE instructor_profiles SET ${fields.join(', ')} WHERE id = ?`
      ).bind(...values).run();
    } else {
      // Create new profile
      await c.env.DB.prepare(
        'INSERT INTO instructor_profiles (user_id, bio, expertise, experience_years, education, avatar_url, website, linkedin, facebook, twitter) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(
        user.userId,
        bio || null,
        expertise || null,
        experience_years || 0,
        education || null,
        avatar_url || null,
        website || null,
        linkedin || null,
        facebook || null,
        twitter || null
      ).run();
    }

    const profile = await c.env.DB.prepare(
      'SELECT * FROM instructor_profiles WHERE user_id = ?'
    ).bind(user.userId).first();

    return c.json(profile);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Get all instructors (public)
app.get('/api/instructors', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      'SELECT ip.*, u.name, u.email FROM instructor_profiles ip JOIN users u ON ip.user_id = u.id ORDER BY ip.created_at DESC'
    ).all();

    // Get course count for each instructor
    for (const instructor of results) {
      const { course_count } = await c.env.DB.prepare(
        'SELECT COUNT(*) as course_count FROM courses WHERE instructor_id = ? AND published = 1'
      ).bind(instructor.user_id).first() || { course_count: 0 };

      const { student_count } = await c.env.DB.prepare(
        'SELECT COUNT(DISTINCT e.user_id) as student_count FROM enrollments e JOIN courses c ON e.course_id = c.id WHERE c.instructor_id = ?'
      ).bind(instructor.user_id).first() || { student_count: 0 };

      instructor.course_count = course_count;
      instructor.student_count = student_count;
    }

    return c.json(results);
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// ==================== UPLOAD ROUTES ====================

// Helper function to convert File/Blob to Base64
async function fileToBase64(file) {
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Upload image (supports ImgBB, Cloudinary, or Base64 fallback)
app.post('/api/upload', authMiddleware, async (c) => {
  try {
    const formData = await c.req.formData();
    const image = formData.get('image');

    if (!image) {
      return c.json({ error: 'No image provided' }, 400);
    }

    // Validate file size (5MB limit)
    if (image.size > 5 * 1024 * 1024) {
      return c.json({ error: 'File size must not exceed 5MB' }, 400);
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(image.type)) {
      return c.json({ error: 'Invalid file type. Only JPG, PNG, GIF, and WebP are allowed' }, 400);
    }

    // Try ImgBB first if API key is available and valid
    if (c.env.IMGBB_API_KEY && c.env.IMGBB_API_KEY.length > 20) {
      try {
        const base64 = await fileToBase64(image);

        const imgbbFormData = new FormData();
        imgbbFormData.append('image', base64);

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${c.env.IMGBB_API_KEY}`, {
          method: 'POST',
          body: imgbbFormData,
        });

        const data = await response.json();

        if (data.success) {
          return c.json({
            url: data.data.url,
            provider: 'imgbb'
          });
        }
      } catch (imgbbError) {
        console.error('ImgBB upload failed, falling back to Base64:', imgbbError);
      }
    }

    // Fallback to Base64 Data URL
    const base64 = await fileToBase64(image);
    const dataUrl = `data:${image.type};base64,${base64}`;

    return c.json({
      url: dataUrl,
      provider: 'base64',
      warning: 'Using Base64 encoding. For better performance, configure ImgBB or Cloudinary API key.'
    });

  } catch (error) {
    console.error('Upload error:', error);
    return c.json({ error: error.message || 'Upload failed' }, 500);
  }
});

// Upload video (Base64 for small videos, or return URL input instruction)
app.post('/api/upload/video', authMiddleware, async (c) => {
  try {
    const formData = await c.req.formData();
    const video = formData.get('video');

    if (!video) {
      return c.json({ error: 'No video provided' }, 400);
    }

    // For Cloudflare Workers, we recommend using YouTube URLs instead
    // But we'll support small videos via Base64 (max 10MB)
    if (video.size > 10 * 1024 * 1024) {
      return c.json({
        error: 'Video file too large. Please use YouTube URL instead.',
        suggestion: 'Upload your video to YouTube and paste the URL in the video field.'
      }, 400);
    }

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    if (!allowedTypes.includes(video.type)) {
      return c.json({ error: 'Invalid video type. Only MP4, WebM, and MOV are allowed' }, 400);
    }

    // Convert to Base64
    const base64 = await fileToBase64(video);
    const dataUrl = `data:${video.type};base64,${base64}`;

    return c.json({
      url: dataUrl,
      provider: 'base64',
      warning: 'For better performance, use YouTube URLs instead of uploading large video files.'
    });

  } catch (error) {
    console.error('Video upload error:', error);
    return c.json({ error: error.message || 'Video upload failed' }, 500);
  }
});

// Upload document (Base64 for documents)
app.post('/api/upload/document', authMiddleware, async (c) => {
  try {
    const formData = await c.req.formData();
    const document = formData.get('document');

    if (!document) {
      return c.json({ error: 'No document provided' }, 400);
    }

    // Validate file size (10MB limit for documents)
    if (document.size > 10 * 1024 * 1024) {
      return c.json({ error: 'Document size must not exceed 10MB' }, 400);
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/zip',
      'application/x-rar-compressed'
    ];

    if (!allowedTypes.includes(document.type)) {
      return c.json({ error: 'Invalid document type' }, 400);
    }

    // Convert to Base64
    const base64 = await fileToBase64(document);
    const dataUrl = `data:${document.type};base64,${base64}`;

    // Get file extension
    const extension = document.name.split('.').pop();

    return c.json({
      url: dataUrl,
      name: document.name,
      type: extension.toUpperCase(),
      size: `${(document.size / 1024).toFixed(2)} KB`,
      provider: 'base64'
    });

  } catch (error) {
    console.error('Document upload error:', error);
    return c.json({ error: error.message || 'Document upload failed' }, 500);
  }
});

// ==================== EXPORT ====================

export default app;
