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
        }),
        // select: (data: {name: string, ownerId: string}[]) => data.map((project) => {
        //     return {
        //         name: project.name,
        //     }
        // })
    }
}))

const projects = useQueries({queries: queries, combine: (results) => {
    return results.map((result, index) => {
        return {
            // projects: result.data,
            projects: (result.data as {name: string, ownerId: string}[])?.map(project => project.name),

            owner: people.value[index].name,
        }
    })
}})

const denemeProjects = useQueries({queries: queries})

const projectsWithOwners = computed(() => denemeProjects.value.map((project: any) => {
    return {
        project: project?.data,
        owner: people.value.find((person: {id: string}) => person.id === project?.data?.[0]?.ownerId)?.name || "Unknown"
    }
}))

</script>

<template>
    <div>
       
       <pre>{{ projects }}</pre>

       <p>deneme projects</p>

       <pre>{{ projectsWithOwners }}</pre>
    </div>
</template>