<script setup>
  import { defineProps,ref } from 'vue';
  import { auth, db } from '@/firebase';
  import router from '@/router';

import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
  
  
  const {discussion,userId} = defineProps({
    discussion: {
      type: Object
    },
    userId:{
      type: String
    }
  })

  let currUser = ref({});
  const formattedDate = new Date(discussion.createdAt).toLocaleDateString()

  async function getUser(){
    const DocSnap = await getDoc(doc(db, 'users', userId))
    currUser.value = DocSnap.data()

  }

  const isAllowed =async ()=>{
    await getUser()
    return (userId == discussion.authorId) || (currUser.value.role == 'admin')
  }

  </script>

<template>
    <div class="card">
      <div class="card-header">
        <h3 class="title">{{ discussion.title }}</h3>
        <small class="meta">
          {{ formattedDate }} | <span class="category">{{ discussion.category }}/{{ discussion.subCategory }}</span>
        </small>
      </div>
      <p class="content">{{ discussion.content }}</p>
      <div class="actions">
        <button class="btn upvote" @click.stop="$emit('upvote')">
          👍 {{ discussion.upvoters.length }}
        </button>
        <button class="btn reply" @click.stop="$emit('reply')">
          💬 Reply
        </button>
        <button :class="['btn', 'delete', isAllowed() ? '' : 'hidden']" @click.stop="$emit('delete')">
          🗑️ Delete
        </button>
        <button :class="['btn', 'edit', isAllowed() ? '' : 'hidden']" @click.stop="$emit('edit')">
          🖉 Edit
        </button>
      </div>
    </div>
  </template>
  
  
  <style scoped> 
  .hidden{
    display: none !important; 
  }

  .card {
  background: #ffffff;
  border: 1px solid #dce3e8;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 16px;
  transition: background 0.2s ease;
  color: #0f1419;
}

.card:hover {
  background: #f0f8ff;
  cursor: pointer;
}
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
  }
  
  .title {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
    color: #0f1419;
  }
  
  .meta {
    font-size: 0.75rem;
    color: #536471;
  }
  
  .category {
    color: #1d9bf0;
    font-weight: 500;
  }
  
  .content {
    font-size: 0.95rem;
    color: #0f1419;
    margin: 10px 0;
    white-space: pre-wrap;
  }
  
  .actions {
    display: flex;
    gap: 16px;
    padding-top: 8px;
    border-top: 1px solid #eff3f4;
    margin-top: 12px;
  }
  
  .btn {
    display: flex;
    align-items: center;
    gap: 4px;
    background: none;
    border: none;
    color: #536471;
    font-size: 0.9rem;
    cursor: pointer;
    padding: 4px 6px;
    border-radius: 8px;
    transition: background 0.2s;
  }
  
  .btn:hover {
    background: #e8f5fe;
    color: #1d9bf0;
  }
  
  .upvote:hover {
    background: #d2f8d2;
    color: #2b7a2b;
  }
  
  .reply:hover {
    background: #e0e7ff;
    color: #4b63c3;
  }
  
  .delete:hover {
    background: #ffe0e0;
    color: #c93c3c;
  }

  .edit:hover {
    background: #baf5e7;
    color: blue;
  }
  
</style>