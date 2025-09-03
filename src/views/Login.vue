<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { signInWithEmailAndPassword } from 'firebase/auth'
  import { auth } from '@/firebase'
  import { sendPasswordResetEmail } from 'firebase/auth'
  
  
  const email = ref('')
  const password = ref('')
  const router = useRouter()
  
  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email.value, password.value)
      router.push('/home')
    } catch (err) {
      alert('Login failed: ' + err.message)
    }
  }

  const sendReset = async ()=>{
    try{ 
    await sendPasswordResetEmail(auth, email.value);
    alert("email sent to your adress")
  } catch (error){
    alert("enter the correct email")
  }
  }
</script>

<template>
    <div class="login-container">
      <h1 class="logo">𝕏</h1>
  
      <form class="login-form" @submit.prevent="login">
        <input type="email" v-model="email" placeholder="Email" required />
        <input type="password" v-model="password" placeholder="Password" required />
  
        <button type="submit">Log in</button>
  
        <div class="links">
          <a class="RouterLink" @click.prevent="sendReset">Forgot password?</a>
          <span>·</span>
          <RouterLink class="RouterLink" to="/register">Sign up</RouterLink>
        </div>
      </form>
    </div>
  </template>
  
  
  
  <style scoped>
  .login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3rem 1rem;
    font-family: system-ui, sans-serif;
  }
  
  .logo {
    font-size: 3rem;
    margin-bottom: 2rem;
  }
  
  .login-form {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 320px;
  }
  
  .login-form input {
    margin-bottom: 1rem;
    padding: 0.8rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 9999px;
    outline: none;
  }
  
  .login-form button {
    background-color: black;
    color: white;
    border: 1px solid #ccc;
    border-radius: 9999px;
    padding: 0.8rem;
    font-size: 1rem;
    cursor: pointer;
  }
  
  .login-form button:hover {
    opacity: 0.9;
    background-color: rgb(20, 26, 29);
  }

  .login-form button:focus {
    opacity: 0.9;
    background-color:  rgb(20, 26, 29);
  }
  
  .links {
    margin-top: 1rem;
    text-align: center;
    font-size: 0.9rem;
    color: #555;
  }
  
  .links .RouterLink {
    color: #1d9bf0;
    text-decoration: none;
  }

  .links .RouterLink:hover {
    cursor: pointer;
  }
  
  .links span {
    margin: 0 0.5rem;
  }
  </style>
  