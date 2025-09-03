<script setup>
    import DiscussionCard from '@/components/DiscussionCard.vue';
    import { ref, onMounted } from 'vue'
    import { useRoute } from 'vue-router'
    import { db,auth } from '@/firebase'
    import { collection, doc, getDoc,onSnapshot,updateDoc, deleteDoc, setDoc, addDoc,arrayRemove,arrayUnion } from 'firebase/firestore'
    import Spinner from '@/components/Spinner.vue';
    import { useRouter } from 'vue-router';
    import ReplyCard from '@/components/ReplyCard.vue';
    import DeleteReplyConfirm from '@/components/DeleteReplyConfirm.vue';
    import EditReply from '@/components/EditReply.vue';
    import PostCard_ from '@/components/PostCard_.vue';
    import ReplyPost from '@/components/ReplyPost.vue'
    import { onAuthStateChanged } from 'firebase/auth';
    

    const replyToDelete = ref('');
    const replyToEdit = ref({})
    const router = useRouter()
    const route = useRoute()
    const post = ref({})
    const replies = ref([])
    const showEditReply = ref(false)
    const showConfirmDeleteReply = ref(false)
    const showReplyPost = ref(false);
    const discussionToReply = ref('')
    const userId = ref('')


    // onMounted(async () => {
    //   const docRef = doc(db, 'discussions', route.params.id)
    //   const docSnap = await getDoc(docRef)
    //   if (docSnap.exists()){
    //     post.value = {id: docSnap.id, ...docSnap.data()}
    //   }
    // })

    function getPost(){
      const docRef = doc(db, 'discussions', route.params.id)
      onSnapshot(docRef, (SnapShot)=>{
        if (SnapShot.data()){
          post.value = {id:SnapShot.id , ...SnapShot.data()}
        }
      })
    }
    getPost()

    onAuthStateChanged(auth, (user)=>{
    if (user){
      userId.value = user.uid
    }
    else{
      router.push('/')
    }
  })

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

    function getReplies(){
      const repliesRef = collection(db,'discussions', route.params.id, "replies")
      onSnapshot(repliesRef, (SnapShot)=>{
        if (SnapShot && SnapShot.docs){
          replies.value = SnapShot.docs.map((doc)=>({id: doc.id, ...doc.data()}))
          console.log(replies.value)
        }
      })
    } 
    getReplies()
    
    
    const handleDelete = (id) => {
      console.log('Delete clicked for', id)
    }


    const logOut = async ()=>{
      await signOut(auth)
      router.push('/')
    }

    const handleDeleteReply = (id)=>{
      showConfirmDeleteReply.value = true;
      replyToDelete.value = id;
    }

    const cancelDeleteReplyfunc = () =>{showConfirmDeleteReply.value = false;}
    const confirmDeleteReplyfunc = async ()=>{
      showConfirmDeleteReply.value = false;
      await deleteDoc(doc(db, "discussions",route.params.id, "replies", replyToDelete.value));
    }


    const handleEditReply = (reply)=>{
      replyToEdit.value = reply;
      showEditReply.value = true;
    }

    const editReply = async (newReply)=>{
      showEditReply.value = false
      await setDoc(doc(db, "discussions",route.params.id, "replies", replyToEdit.value.id ),newReply)
    }
    const cancelEditReply = ()=>{
      showEditReply.value = false; 
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
    <div class="container">
      <aside class="sidebar">
        <router-link class="Routerlink" to="/home">Home</router-link>
        <router-link class="Routerlink" to="/profile">Profile</router-link>
        <a class="logOut-button Routerlink" @click="logOut">Logout</a>
      </aside>

      <main class="discussion">

        <EditReply v-if="showEditReply" :reply="replyToEdit" @editReply="editReply" @cancelEditReply="cancelEditReply"/>
        <DeleteReplyConfirm v-if="showConfirmDeleteReply" @cancelDeleteReply="cancelDeleteReplyfunc" @confirmDeleteReply="confirmDeleteReplyfunc"/>
        <ReplyPost v-if="showReplyPost" @submit="addNewReply" @close="CloseReply" :discussion="discussionToReply"/>


          <PostCard_
            :discussion="post"
            v-if="post"
          />
          <div v-else> <Spinner/> </div>
          
          <ReplyCard
            v-for="reply in replies"
            :key="reply.id"
            :reply="reply"
            @delete="handleDeleteReply(reply.id)"
            @edit="handleEditReply(reply)"
            v-if="replies"
          />
          <div v-else> <Spinner/> </div>
      </main>
    </div>
</template>



<style scoped>
  .container {
  display: flex;
  height: 100vh;
  background: #000; /* X dark mode style */
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
.discussion {
  flex: 1;
  padding: 20px 40px;
  overflow-y: auto;
  background: #000;
  width: 85%;
  margin-left: 15%;
}

</style>