<script setup>
import { ref } from 'vue'
import { useRouter,RouterLink } from 'vue-router'
import { auth, db } from '@/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

const email = ref('')
const password = ref('')
const firstName = ref('')
const lastName = ref('')
const bio = ref('')
const role = ref('user') // default role

const router = useRouter()

const register = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    const uid = userCredential.user.uid

    await setDoc(doc(db, 'users', uid), {
      id: uid,
      firstName: firstName.value,
      lastName: lastName.value, 
      email: email.value,
      bio: bio.value,
      createdAt: serverTimestamp(),
      profilePic: '', // to be filled later
      role: role.value,
      replies: []
    })
    
    router.push('/home')
  } catch (error) {
    alert(error.message)
  }
}
</script>

<template>
  <section class="form">
    <h2 class="title">Create your account</h2>
    <input type="text" v-model="firstName" placeholder="First name" />
    <input type="text" v-model="lastName" placeholder="Last name" />
    <input type="email" v-model="email" placeholder="Email" />
    <input type="password" v-model="password" placeholder="Password" />
    <textarea v-model="bio" placeholder="Bio (optional)"></textarea>
    <button @click="register">Register</button>
    <p class="already">
      Already have an account?
      <RouterLink class="RouterLink" to="/">Login here</RouterLink>
    </p>
  </section>
</template>

<style scoped>
.form {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background: #000;
  color: #fff;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
}

.title{
  margin-bottom: 10px;
}
input, textarea {
  margin: 0.5rem 0;
  padding: 0.8rem;
  border: none;
  border-radius: 5px;
}
button {
  background: #1DA1F2;
  border: none;
  color: white;
  padding: 0.8rem;
  border-radius: 5px;
  margin-top: 1rem;
  cursor: pointer;
}
router-link {
  color: #1DA1F2;
}

.RouterLink {
    color: #1d9bf0;
    text-decoration: none;
  }

.already{
    text-align: center;
    margin-top: 10px;
}
</style>
