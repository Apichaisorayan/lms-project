import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Courses from '../views/Courses.vue'
import CourseLearn from '../views/CourseLearn.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/courses',
    name: 'Courses',
    component: Courses,
    meta: { requiresAuth: true }
  },
  {
    path: '/courses/:id/learn',
    name: 'CourseLearn',
    component: CourseLearn,
    meta: { requiresAuth: true }
  },
  {
    path: '/courses/:id/lessons',
    name: 'CourseLessons',
    component: () => import('../views/CourseLessons.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/browse',
    name: 'BrowseCourses',
    component: () => import('../views/BrowseCourses.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/courses/:id',
    name: 'CourseDetail',
    component: () => import('../views/CourseDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/auth/callback',
    name: 'AuthCallback',
    component: () => import('../views/AuthCallback.vue')
  },
  {
    path: '/lessons/:lessonId/quizzes',
    name: 'LessonQuizzes',
    component: () => import('../views/LessonQuizzes.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/lessons/:lessonId/quizzes/manage',
    name: 'QuizManage',
    component: () => import('../views/QuizManage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/quizzes/:quizId/take',
    name: 'QuizTake',
    component: () => import('../views/QuizTake.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/instructor/profile',
    name: 'InstructorProfile',
    component: () => import('../views/InstructorProfile.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory('/'),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if ((to.path === '/login' || to.path === '/register') && token) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
