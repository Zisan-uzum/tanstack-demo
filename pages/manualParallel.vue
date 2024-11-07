<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';


const peopleQuery = useQuery({
    queryKey: ['people'],
    queryFn: () => $fetch('/api/people')
})

await peopleQuery.suspense()

const projectsQuery = useQuery({
    queryKey: ['projects'],
    queryFn: () => $fetch('/api/projects')
})

// await projectsQuery.suspense()

const todosQuery = useQuery({
    queryKey: ['todos'],
    queryFn: () => $fetch('/api/todos')
})

const promiseData = await Promise.all([peopleQuery, projectsQuery, todosQuery])

</script>


<template>  
    <div>

        <p>isFetchingPeople: {{ peopleQuery.isFetching }}  isPending: {{ peopleQuery.isPending }} isLoading: {{ peopleQuery.isLoading }}</p>
        <p>isFetchingProjects: {{ projectsQuery.isFetching }}</p>
        <p>isFetchingTodos: {{ todosQuery.isFetching }}</p>

        <h1>Manual Parallel</h1>

        <p>people</p>
        <pre>{{ peopleQuery.data }}</pre>

        <p>projects</p>
        <pre>{{ projectsQuery.data }}</pre>
        
        <p>todos</p>
        <pre>{{ todosQuery.data }}</pre>
    </div>
</template>