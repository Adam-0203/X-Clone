<script setup>
  import { ref, onMounted, computed } from 'vue'
  import { onAuthStateChanged , signOut} from 'firebase/auth'
  import { db, auth } from '@/firebase'
  import { setDoc, onSnapshot,addDoc, collection, getDocs, doc, deleteDoc, updateDoc, getDoc, arrayUnion, arrayRemove  } from 'firebase/firestore'
  import DiscussionCard from '@/components/DiscussionCard.vue'
  import Spinner from '@/components/Spinner.vue'
  import AddPostForm from '@/components/AddPostForm.vue'
  import EditPostForm from '@/components/EditPostForm.vue'
  import DeleteConfirm from '@/components/DeleteConfirm.vue'
  import ReplyPost from '@/components/ReplyPost.vue'
  import { useRouter } from 'vue-router'

  

  const router = useRouter()
  const discussions = ref([])
  let isLoading = ref(true)
  const showAddPost = ref(false)
  const showReplyPost = ref(false)
  const discussionToReply = ref('')
  const showConfirm = ref(false)
  const showEditPost = ref(false)
  const discussionToEdit = ref('')
  const userId = ref('')
  const searchQuery = ref('')
  const sortedBy = ref('')
  const currentDeletionId = ref('')


  onAuthStateChanged(auth, (user)=>{
    if (user){
      userId.value = user.uid
    }
    else{
      router.push('/')
    }
  })
  
//   async function getUser1(id){
//     const docRef = doc(db, "users", id);
//     const docSnap = await getDoc(docRef);
//     return docSnap.data()
//   }

//   async function loadUser() {
//   try {
//     const userObj = await getUser1(userId.value);
//     // console.log("l'objet de l'utilisateur actuel : ", userObj);
//   } catch (err) {
//     console.error("getUser1 failed:", err);
//   }
// }


  // function getData(async () => {
  //   onSnapshot(collection(db, 'discussions'), (querySnapshot) => {
  //   if (querySnapshot && querySnapshot.docs) {
  //     discussions.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  //     isLoading.value = false
  //   }
  // })})
  // getData();
  

  const getData = async () =>{
    onSnapshot(collection(db,"discussions"), (SnapShot) =>{
      if (SnapShot && SnapShot.docs){
        discussions.value = SnapShot.docs.map(doc => ({id: doc.id, ...doc.data()}));
        isLoading.value = false;
      }
    })
  }
  getData();


  const flteredDiscussions = computed(() => {
  let res = discussions.value;
  if (searchQuery.value) {
    res = discussions.value.filter((x) =>
      x.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      x.content.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      x.category.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      x.subCategory.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  if (sortedBy.value == 'Date'){
    res.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
  if (sortedBy.value == 'Popularity'){
    res.sort((a,b) => b.upvoters.length - a.upvoters.length)
  }
  return res;
});

const goesToPost = (id)=>{ router.push(`/post/${id}`) }

const hideConfirm = ()=> {showConfirm.value = false}

const DeleteDiscussion = async ()=> { 
  showConfirm.value = false;
  await deleteDoc(doc(db, 'discussions', currentDeletionId.value)) 
}

const handleDelete = async (id) => { 
  showConfirm.value = true;
  currentDeletionId.value = id;
 }

  const handleUpvote = async (id) => {
    const docRef = doc(db, 'discussions', id)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists){
      const data = docSnap.data()
      const alreadyUpvoted = data.upvoters.includes(userId.value)

      await updateDoc(docRef, {
        upvoters : alreadyUpvoted ? arrayRemove(userId.value) : arrayUnion(userId.value)
      }) 
    }
  }

  const handleClose = () =>{ showAddPost.value = false; }
  const handleCloseEdit = () =>{ showEditPost.value = false; }

  const addNewPost = async (formData) =>{
    showAddPost.value = false;
    await addDoc(collection(db,'discussions'),{...formData, authorId: userId.value})
    console.log(formData)
  }

  const handleEdit = (discussion) => {
    showEditPost.value = true;
    discussionToEdit.value = discussion 
    console.log('editing', discussion)
  }

  const EditPost = async (newData)=>{
    showEditPost.value = false
    await setDoc(doc(db, 'discussions',discussionToEdit.value.id),newData)
  }

  const logOut = async ()=>{
    await signOut(auth)
    router.push('/')
  }

  const handleReply = (id) => { 
    showReplyPost.value = true;
    discussionToReply.value = id;
    console.log('Reply clicked for', id)
   }

  const CloseReply = ()=>{
    showReplyPost.value = false;
  }

  const addNewReply = async (newReply)=>{
    showReplyPost.value = false;
    const Reply = {...newReply, authorId: userId.value};
    await addDoc(collection(db, "replies"), Reply);
    await addDoc(collection(db, "discussions", discussionToReply.value, "replies"), Reply)
    console.log("Reply added")
  }
</script>
  
  <template>
    <div class="home-container">
      <aside class="sidebar">
        <router-link class="Routerlink" to="/home">Home</router-link>
        <router-link class="Routerlink" to="/profile">Profile</router-link>
        <a class="Routerlink Post-button" @click="showAddPost=true">Post</a>
        <a class="logOut-button Routerlink" @click="logOut">Logout</a>
      </aside>

      <ReplyPost v-if="showReplyPost" @submit="addNewReply" @close="CloseReply" :discussion="discussionToReply"/>
      <AddPostForm v-if="showAddPost" @submit="addNewPost" @close="handleClose" />
      <EditPostForm v-if="showEditPost" @submit="EditPost" @close="handleCloseEdit" :discussion="discussionToEdit"/>
      <DeleteConfirm v-if="showConfirm" @confirm="DeleteDiscussion" @cancel="hideConfirm"/>

      <div class="spinnerDiv" v-if="isLoading"> <Spinner/> </div>

      <main v-else class="discussions">
        <div class="search-bar-container">
            <input
            type="text"
            v-model="searchQuery"
            placeholder="Search"
            class="search-input"
            />
        </div>
        <div class="select-container">
          <select v-model="sortedBy" class="selecter">
              <option value="Date">By Date</option>
              <option value="Popularity">By Popularity</option>
          </select>
        </div>


        <DiscussionCard
          v-for="discussion in flteredDiscussions"
          :key="discussion.id"
          :discussion="discussion"
          :userId="userId"
          @upvote="handleUpvote(discussion.id)"
          @delete="handleDelete(discussion.id)"
          @reply="handleReply(discussion.id)"
          @edit="handleEdit(discussion)"
          @click="goesToPost(discussion.id)"
        />
      </main>
      
      
    </div>
  </template>
  
<style scoped>
.search-bar-container {
  background-color: #000000;
  padding: 8px 16px;
  border-radius: 9999px;
  display: flex;
  display: inline-block;
  align-items: center;
  width: 65%;
  margin-bottom: 30px;
}

.search-input {
  background: transparent;
  border: none;
  outline: none;
  color: white;
  font-size: 1rem;
  width: 100%;
  display: inline-block;
}

.search-input::placeholder {
  color: #8899a6;
}

.select-container{
  width: 25%;
  margin-left: 1%;
  background-color: #000000;
  padding: 8px 16px;
  border-radius: 9px;
  display: flex;
  display: inline-block;
  align-items: center;
  margin-bottom: 30px;
}

.selecter{
  background: transparent;
  border: none;
  outline: none;
  color: white;
  font-size: 1rem;
  width: 100%;
  display: inline-block;
}

option {
  background-color: #10171f;
  color: white;
  font-size: 1rem;
}

.home-container {
  display: flex;
  height: 100vh;
  background: #15202b;
  color: #fff;
  font-family: "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
}

/* SIDEBAR */
.sidebar {
  width: 15%;
  background-color: #090f16;
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

.sidebar .Post-button{
  background-color: #e7e9ea;
  color: #10171f;
  text-align: center;
}

.sidebar .Post-button:hover{
  background-color: #23548d;
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
.discussions {
  flex: 1;
  padding: 20px 40px;
  overflow-y: auto;
  background: #15202b;
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

  </style>
  