<script setup>
import { ref } from 'vue'
import { defineProps } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase'


const emit = defineEmits(['submit', 'close'])


const title = ref('')
const content = ref('')
const category = ref('')
const subCategory = ref('')
const showWarning = ref(false)

const handleSubmit = () => {
  if (title.value && content.value && category.value && subCategory.value) {
    showWarning.value = false;
    const formData = {
      title: title.value,
      content: content.value,
      category: category.value,
      subCategory: subCategory.value,
      createdAt: new Date().toISOString(),
      replies: [],
      upvoters: []
    }
    emit('submit', formData);
  }
  else{
    showWarning.value = true;
  }
}
</script>

<template>
  <div class="backdrop" @click.self="$emit('close')">
    <div class="form-container">
      <h2 class="heading">Create a new post</h2>
      <input class="input" v-model="title" placeholder="Title" required/>
      <textarea class="textarea" v-model="content" placeholder="What's happening?" />
      <input class="input" v-model="category" placeholder="Category" required/>
      <input class="input" v-model="subCategory" placeholder="Sub-category" required/>
      <div class="actions">
        <button class="cancel" @click="$emit('close')">Cancel</button>
        <button class="submit" @click="handleSubmit">Post</button>
      </div>
      <div v-if="showWarning" style="color: red; text-align: center;">Please fill in all the fields.</div>
    </div>
  </div>
</template>

<style scoped>
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.form-container {
  background: #15202b;
  color: white;
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 0 20px rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.heading {
  font-size: 1.3rem;
  margin-bottom: 10px;
  font-weight: 600;
}

.input, .textarea {
  background: #192734;
  border: 1px solid #2f3336;
  color: white;
  padding: 12px;
  border-radius: 8px;
  font-size: 1rem;
}

.textarea {
  min-height: 100px;
  resize: vertical;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.cancel {
  background: transparent;
  border: 1px solid #555;
  color: #ccc;
  padding: 8px 16px;
  border-radius: 9999px;
  cursor: pointer;
}

.submit {
  background: #1d9bf0;
  border: none;
  color: white;
  padding: 8px 20px;
  border-radius: 9999px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s ease;
}

.submit:hover {
  background: #1a8cd8;
}
</style>
