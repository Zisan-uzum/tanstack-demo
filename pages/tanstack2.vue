<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';

const newTodo = ref('')
const searchTodoName = ref("")
const isEnabledSearchTodoName = computed(() => !!searchTodoName.value)

const { data: todos, suspense } = useQuery({
  queryKey: ['todos'],
  queryFn: () => $fetch('/api/todos'),
  staleTime: 5000, // 5 seconds
})

await suspense()

//isLoading means isPending && isFetching
const { data: filteredTodosByName, isLoading: isLoadingFilteredTodosByName } = useQuery({
  queryKey: ['todos', searchTodoName],
  queryFn: () => $fetch('/api/searchTodosByName', {
    method: 'POST',
    body: {
      name: searchTodoName.value
    }
  }),
  // disabled as long as the filter is empty
  enabled: isEnabledSearchTodoName,
})

async function addTodo(newTodo: string) {
  return $fetch("/api/todos", {
    method: "POST",
    body: {
      todo: newTodo,
    },
  });
}

const { mutate } = useOptimisticMutation({
  queryKey: ['todos'],
  mutationFn: async(newTodo: string) => {
    await addTodo(newTodo)
  },
  updateQueryFn: (newTodo, old: any[] = []) => [...old, {text: newTodo, id: old.length + 1, completed: false}]
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


    <div>
      <input v-model="searchTodoName" type="text" placeholder="Search by name">
    </div>

    <div>
      <h2>Todos</h2>
      <pre>{{ todos }}</pre>
    </div>

    <div v-if="isLoadingFilteredTodosByName">
      Loading...
    </div>
    <div v-else>
      <h2>Filtered Todos By Name</h2>
      <pre>{{ filteredTodosByName }}</pre>
    </div>

  </div>
</template>
