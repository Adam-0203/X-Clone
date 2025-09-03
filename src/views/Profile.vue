<script setup>
  import Spinner from '@/components/Spinner.vue';
  import { onAuthStateChanged, signOut } from 'firebase/auth';
  import { ref, onMounted, computed } from 'vue'
  import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore'
  import { db, auth } from '@/firebase'
  import { useRouter } from 'vue-router';

  const router = useRouter()
  const isRedonly = ref(true)
  const user = ref(null)
  const first_name = ref('')
  const last_name = ref('')
  const bio = ref('')

  const logOut = async ()=>{
    await signOut(auth)
    router.push('/')
  }

  onAuthStateChanged(auth, (currentUser) => {
  if (!currentUser) return;

  const docRef = doc(db, 'users', currentUser.uid);
  
  // Listen to real-time updates
  onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      user.value = docSnap.data();
      first_name.value = docSnap.data().firstName;
      last_name.value = docSnap.data().lastName;
      bio.value = docSnap.data().bio;
    }
  });
});

  const handleCommit = async ()=>{
    const newObj = {
      id: user.value.id,
      bio : bio.value,
      profilePic : user.value.profilePic,
      createdAt: user.value.createdAt,
      email: user.value.email,
      firstName : first_name.value,
      lastName : last_name.value,
      replies: user.value.replies
    } 
    await setDoc(doc(db, 'users', user.value.id), newObj)
    isRedonly.value = true;
  }

  const formattedDate = computed(() => {
  if (!user.value?.createdAt?.toDate) return ''
  return user.value.createdAt.toDate().toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})
</script>

<template>
    <div class="container">
      <aside class="sidebar">
        <router-link class="Routerlink" to="/home">Home</router-link>
        <router-link class="Routerlink" to="/profile">Profile</router-link>
        <a class="logOut-button Routerlink" @click="logOut">Logout</a>
      </aside>

        
        <main class="profile" v-if="user">
            <div class="profile-header">
              <img v-if="user.profilePic" :src="user.profilePic" class="profile-pic" />
              <div v-else class="default-pic">{{ user.firstName[0] }}</div>
              <div>
                <h2>{{ user.firstName }} {{ user.lastName }}</h2>
                <p class="email">{{ user.email }}</p>
                <p class="role">{{ user.role }}</p>
              </div>
            </div>
            <div class="profile-info">
              <p><strong>first Name:</strong> <input type="text" v-model="first_name" :readonly="isRedonly"></p>
              <p><strong>last Name:</strong><input type="text" v-model="last_name" :readonly="isRedonly"></p>
              <p><strong>Bio:</strong><input type="text" v-model="bio" :readonly="isRedonly"></p>
              <p><strong>Joined:</strong> {{ formattedDate }}</p>
              <p><strong>Total Replies:</strong> {{ user.replies?.length || 0 }}</p>
            </div>
            <button class="edit"  v-if="isRedonly" @click="isRedonly=false">Edit 🖉</button>
            <button class="commit" v-else @click="handleCommit">Commit</button>
        </main>
        <div class="spinnerDiv" v-else> <Spinner/> </div>
    </div>
</template>



<style scoped>
  .container {
  display: flex;
  height: 100vh;
  background: #000;
  color: #fff;
  font-family: "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
}

/* SIDEBAR */
.sidebar {
  width: 15%;
  background-color: #10171f;
  border-right: 1px solid #2f3336;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
  top: 0;
  height: 100vh;
  position: fixed
}

.sidebar .Routerlink{
  width: 100%;
}

.sidebar a {
  color: #e7e9ea;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.1rem;
  padding: 10px 16px;
  border-radius: 9999px;
  transition: background 0.2s ease;
}

.logOut-button{
  margin-top: auto;
}

.sidebar a:hover {
  background-color: #272c36;
  color: #1d9bf0;
  cursor: pointer;
}

.sidebar .logOut-button:hover {
  background-color: #272c36;
  color: #f0b81d;
  cursor: pointer;
}
/* DISCUSSIONS AREA */
.profile {
  flex: 1;
  padding: 20px 40px;
  overflow-y: auto;
  background: #000;
  width: 85%;
  margin-left: 15%;
}

.spinnerDiv{
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-left: 15%;
}



.profile {
  background-color: #15202b;
  color: white;
  padding: 30px;
  box-shadow: 0 0 10px rgba(29, 155, 240, 0.2);
  font-family: "Segoe UI", Roboto, sans-serif;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.profile-pic, .default-pic {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: #1d9bf0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: white;
}

.email, .role {
  color: #8899a6;
  font-size: 0.9rem;
}

.profile-info p {
  margin: 10px 0;
  line-height: 1.6;
}

input[type="text"] {
  margin-left: 10px;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid transparent;
  background-color: #1c2733;
  color: #fff;
  /* transition: all 0.3s ease; */
  font-size: 1rem;
}

input[type="text"][readonly] {
  background-color: #15202b00;
  color: #999;
  border: 1px dashed #444;
  cursor: not-allowed;
}

.edit, .commit {
  margin-top: 20px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.edit {
  background-color: #1d9bf0;
  color: white;
}

.edit:hover {
  background-color: #0d8ee9;
}

.commit {
  background-color: #22c55e;
  color: white;
}

.commit:hover {
  background-color: #16a34a;
}
</style>