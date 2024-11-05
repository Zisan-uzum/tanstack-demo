<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';

const newTodo = ref('')

const { data: todos } = useQuery({
  queryKey: ['todos'],
  queryFn: () => $fetch('/api/todos')
})

const queryClient = useQueryClient()

async function addTodo(newTodo: string) {
  return $fetch("/api/todos", {
    method: "POST",
    body: {
      todo: newTodo,
    },
  });
}

const { mutate} = useMutation({
  mutationFn: addTodo,
  // When mutate is called:
  onMutate: async (newTodo) => {
    // Cancel any outgoing refetches
    // (so they don't overwrite our optimistic update)
    await queryClient.cancelQueries({ queryKey: ['todos'] })

    // Snapshot the previous value
    const previousTodos = queryClient.getQueryData(['todos'])

    // Optimistically update to the new value
    queryClient.setQueryData(['todos'], (old: any) => [...old, {text: newTodo, id: old.length + 1, completed: false}])

    // Return a context object with the snapshotted value
    return { previousTodos }
  },
  // If the mutation fails,
  // use the context returned from onMutate to roll back
  onError: (err, newTodo, context) => {
    queryClient.setQueryData(['todos'], context?.previousTodos)
    console.log(err)
  },
  // Always refetch after error or success:
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] })
  },
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
