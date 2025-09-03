<script setup>
    const emit = defineEmits(['cancelDeleteReply','confirmDeleteReply'])
</script>


<template>
    <div class="modal-backdrop" @click.self="$emit('cancelDeleteReply')">
        <div class="modal-content">
            <h2>Delete this reply.</h2>
            <p>This can’t be undone. Are you sure you want to delete it?</p>
            <div class="buttons">
                <button class="cancel" @click="$emit('cancelDeleteReply')">Cancel</button>
                <button class="confirm" @click="$emit('confirmDeleteReply')">Delete</button>
            </div>
        </div>
    </div>
</template>


<style scoped>
    .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(91, 112, 131, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 50;
    }

    .modal-content {
    background-color: #15202b;
    padding: 24px;
    border-radius: 16px;
    max-width: 400px;
    width: 90%;
    color: white;
    text-align: center;
    }

    .buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    }

    .cancel, .confirm {
    padding: 10px 20px;
    border-radius: 9999px;
    border: none;
    font-weight: bold;
    cursor: pointer;
    }

    .cancel {
    background-color: #273340;
    color: white;
    }

    .confirm {
    background-color: #f4212e;
    color: white;
    }
</style>