import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Home from '@/views/Home.vue'
import Profile from '@/views/Profile.vue'
import Post from '@/views/Post.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login,
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      // meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      // meta: { requiresAuth: true }
    },
    {
      path: '/post/:id',
      name: 'post',
      component: Post,
      // meta: { requiresAuth: true }
    }
  ],
})

router.beforeEach( async (to, from, next) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (to.meta.requiresAuth && !user) 
  {
    next('/'); // redirect to login if not logged in
  } 
  // else if (to.path == '/admin')
  // {
  //   if (!user) {next('/log')}
  //   else
  //   {
  //     const userDoc = await getDoc(doc(db, 'users', user.uid));
  //     const userData = userDoc.data();

  //     if (userData?.role !== 'admin') {
  //       next('/'); // allow access
  //     }
  //     else{
  //       next()
  //     }
  //   }
  // } 
  else {
    next(); // proceed as usual
  }
});

export default router
