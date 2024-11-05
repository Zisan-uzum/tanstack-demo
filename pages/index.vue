<script setup lang="ts">
const { data: todos, refresh } = await useFetch('/api/todos')
const newTodo = ref('')

async function addTodo() {
  if (!newTodo.value) return
  
  await $fetch('/api/todos', {
    method: 'POST',
    body: { todo: newTodo.value }
  })
  
  newTodo.value = ''
  refresh()
}
</script>

<template>
  <div>
    <div>
      <input 
        v-model="newTodo"
        placeholder="Add new todo"
        @keyup.enter="addTodo"
      >
      <button @click="addTodo">Add</button>
    </div>

    <h2>Todos</h2>
    <pre>{{ todos }}</pre>
  </div>
</template>
