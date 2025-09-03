<script setup>
import { ref } from 'vue'

const emit = defineEmits(['submit', 'close'])
const {discussion} = defineProps({
    discussion: {
      type: Object
    }
  })

const title = ref(discussion.title)
const content = ref(discussion.content)
const category = ref(discussion.category)
const subCategory = ref(discussion.subCategory)

const handleSubmit = () => {
  if (title.value && content.value && category.value && subCategory.value) {
    const newData = {
      title: title.value,
      content: content.value,
      category: category.value,
      subCategory: subCategory.value,
      createdAt: new Date().toISOString(),
      replies: discussion.replies,
      upvoters: discussion.upvoters,
    }
    emit('submit', newData)
  }
}
</script>

<template>
  <div class="backdrop" @click.self="$emit('close')">
    <div class="form-container">
      <h2 class="heading">Edit post</h2>
      <input class="input" v-model="title" placeholder="Title" />
      <textarea class="textarea" v-model="content" placeholder="What's happening?" />
      <input class="input" v-model="category" placeholder="Category" />
      <input class="input" v-model="subCategory" placeholder="Sub-category" />
      <div class="actions">
        <button class="cancel" @click="$emit('close')">Cancel</button>
        <button class="submit" @click="handleSubmit">Post</button>
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
