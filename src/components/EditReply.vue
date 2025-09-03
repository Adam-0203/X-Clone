<script setup>
import { ref } from 'vue'

const emit = defineEmits(['editReply','cancelEditReply'])
const {reply} = defineProps({
    reply: {
      type: Object
    }
  })

const content = ref(reply.content)


const handleReply = () => {
  if (content.value) {
    const newReply = {
      content: content.value,
      authorId: reply.authorId,
      createdAt: new Date().toISOString(),
      parentDiscussion: reply.parentDiscussion,
    }
    emit('editReply', newReply)
  }
}
</script>

<template>
    <div class="backdrop" @click.self="$emit('cancelEditReply')">
      <div class="form-container">
        <h2 class="heading">Edit Reply</h2>
        <textarea class="textarea" v-model="content" placeholder="Enter your reply" />
        <div class="actions">
          <button class="cancel" @click="$emit('cancelEditReply')">Cancel</button>
          <button class="submit" @click="handleReply">Post</button>
        </div>
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
