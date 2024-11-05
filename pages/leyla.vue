<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';


const personName = ref('') // Reactive variable for the person's name

const selectedPersonName = ref('')
const newProjectName = ref('')


const { data: people, suspense, isLoading } = useQuery({
  queryKey: ['people'],
  queryFn: () => $fetch('/api/people'),
})

await suspense()

async function addPerson(name: string) {
  return $fetch("/api/people", {
    method: "POST",
    body: {
      name: name,
    },
  });
}

async function getPersonId(name: string) {
  return $fetch("/api/peopleByName", {
    method: "POST",
    body: {
      name: name,
    },
  });
}
async function addProject(name: string, ownerId: string) {
  return $fetch("/api/projects", {
    method: "POST",
    body: {
      projectName: name,
      ownerId
    },
  });
}

const {data: allProjects} = useQuery<Array<{ownerId: string, name: string}>>({
  queryKey: ['projects'],
  queryFn: () => $fetch('/api/projects')
})


//get person id and then use it to get projects dependent on person id (serial query)
const { data: personId} = useQuery<{id: string, name: string}>({
  queryKey: ['person', selectedPersonName],
  queryFn: () => getPersonId(selectedPersonName.value)
})

const enabledProjectsOfSpesificPerson = computed(() => !!personId.value)


const { data: projectsOfSpesificPerson , refetch} = useQuery<Array<{ownerId: string, name: string}>>({
  queryKey: ['projects', personId.value],
  queryFn: () => $fetch('/api/projectsByOwnerId', {
    method: 'POST',
    body: {
      ownerId: personId.value
    }
  }),
  enabled: enabledProjectsOfSpesificPerson, // The query will not execute until `enabled == true`
})

watch(personId, async () => {
  console.log("person id changed", personId.value)
  await refetch()
})

//add person
const { mutate: mutateAddPerson } = useOptimisticMutation({
  queryKey: ['people'],
  mutationFn: async(name: string) => {
    await addPerson(name)
  },
  updateQueryFn: (name, old: any[] = []) => [...old, { id: Date.now(), name: name }]
})

//add project dependent on person id
const { mutate: mutateAddProject } = useOptimisticMutation({
  queryKey: ['projects'],
  mutationFn: async({selectedPersonName, newProjectName}) => {
    const personId = await getPersonId(selectedPersonName);
    await addProject(newProjectName, personId);
    return { ownerId: personId, name: newProjectName }; // Return the ownerId and project name
  },
  updateQueryFn: (newProject, old: any[] = []) => {
    return [...old, { ownerId: newProject.ownerId, name: newProject.name }];
  }
});


</script>

<template>
    <div>
      <div>
          <h2>Add a Person</h2>
          <input v-model="personName" placeholder="Enter a name"/>
          <button @click="mutateAddPerson(personName)">Add Person</button>
          </div>
          <div>
            <h2>All People</h2>

            <p v-if="isLoading">Loading...</p>
            <ul>
              <li v-for="person in people" :key="person.id">{{ person.name }}</li>
            </ul>
          </div>

          <h1>Add Project</h1>
          <select v-model="selectedPersonName">
            <option disabled value="">Select a person</option>
            <option v-for="person in people" :key="person.id" :value="person.name">
              {{ person.name }}
            </option>
          </select>
          <input v-model="newProjectName" placeholder="Enter project name" />
          <button @click.prevent="mutateAddProject({selectedPersonName: selectedPersonName, newProjectName: newProjectName})">Add Project</button>

          <h2> Projects of  {{ selectedPersonName }}</h2>

          <ul>
            <li v-for="project in projectsOfSpesificPerson" :key="project.ownerId">{{ project.name }}</li>
          </ul>
          
          <h2>All Projects</h2>
          <ul>
            <li v-for="project in allProjects" :key="project.ownerId">{{ project.name }}</li>
          </ul>



          <button @click="navigateTo('/parallel')">Go to Parallel example</button>
    </div>
</template>
