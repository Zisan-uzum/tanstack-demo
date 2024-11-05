<script setup lang="ts">
import { useQueries, useQuery } from '@tanstack/vue-query';

const {data: people, suspense} = useQuery({
  queryKey: ['people'],
  queryFn: () => $fetch('/api/people')
})

await suspense()

const queries = computed(() => people.value.map((person: {id: string, name: string}) => {
    return {
        queryKey: ['projects', person.id],
        queryFn: () => $fetch(`/api/projectsByOwnerId`, {
            method: 'POST',
            body: {
                ownerId: person.id
            }
        })
    }
}))

const projects = useQueries({queries: queries})

const projectsWithOwners = computed(() => projects.value.map((project: any) => {
    return {
        project: project?.data,
    }
}))

</script>

<template>
    <div>
        <pre>{{ projectsWithOwners }}</pre>
    </div>
</template>