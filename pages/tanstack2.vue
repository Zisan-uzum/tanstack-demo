<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';

const newTodo = ref('')

const { data: todos, suspense } = useQuery({
  queryKey: ['todos'],
  queryFn: () => $fetch('/api/todos'),
  staleTime: 5000, // 5 seconds
})

await suspense()

async function addTodo(newTodo: string) {
  return $fetch("/api/todos", {
    method: "POST",
    body: {
      todo: newTodo,
    },
  });

  todos.value.push({text: newTodo, id: todos.value.length + 1, completed: false})
}

const { mutate } = useOptimisticMutation({
  queryKey: ['todos'],
  mutationFn: addTodo,
  updateQueryFn: (newTodo, old: any[]) => [...old, {text: newTodo, id: old.length + 1, completed: false}]
})
</script>

<template>
  <div>
    <div>
      <input 
        v-model="newTodo"
      >
      <button @click="mutate(newTodo)">Add</button>
    </div>

    <h2>Todos</h2>
    <pre>{{ todos }}</pre>
  </div>
</template>
