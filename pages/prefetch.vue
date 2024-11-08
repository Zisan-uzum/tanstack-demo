<script setup lang="ts">
import { keepPreviousData, useQueries, useQuery, useQueryClient } from '@tanstack/vue-query';

const queryClient = useQueryClient()

const page = ref(1);

const previousPage = ref(page.value);


await Promise.all(
  Array.from({ length: 3 }, (_, i) => i + 1).map(i => 
    queryClient.prefetchInfiniteQuery({
      queryKey: ['todos', i], 
      queryFn: () => 
        $fetch(`https://jsonplaceholder.typicode.com/posts?_page=${i}&_limit=3`),
      initialPageParam: 1,
      getNextPageParam: (lastPage: any) => {
        return lastPage.length > 0 ? lastPage[lastPage.length - 1].id + 1 : undefined; 
      },
    })
  )
);


const { data, refetch, isFetching } = useQuery({
  queryKey: ['todos', page.value],
  queryFn: async () => {
    const cachedData = queryClient.getQueryData(['todos', page.value]);
    
    if (cachedData) {
      return cachedData;
    }

    console.log('fetching new data', page.value);

    const response = await $fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page.value}&_limit=3`);
    
    queryClient.setQueryData(['todos', page.value], response);
    
    return response; 
  },
  placeholderData: () => 
  queryClient.getQueryData(['todos', page.value]) ?? 
  queryClient.getQueryData(['todos', previousPage.value]),
});

// Pagination functions
const prevPage = () => {
  previousPage.value = page.value;
  page.value = Math.max(page.value - 1, 1);
};

const nextPage = () => {
  previousPage.value = page.value;
  page.value = page.value + 1;
};

watch(page, () => {
    refetch();
});
</script>


<template>
    <div>
        <h1>Prefetch</h1>

        <p>Is Fetching: {{ isFetching }}</p>

        <p>Current Page: {{ page }}</p>
        <button @click="prevPage">Prev Page</button>
        <button @click="nextPage" >Next Page</button>
    
        <pre>{{ data }}</pre>
    </div>

</template>