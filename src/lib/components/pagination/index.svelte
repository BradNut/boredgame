<script lang="ts">
  import { boredState } from '$root/lib/stores/boredState';

  const totalCount = $boredState.search.totalCount || 1; // TODO: Check default value
  $: pageSize = $boredState.search.pageSize;
  $: currentPage = $boredState.search.currentPage;
  $: skip = $boredState.search.skip;

  const totalPages: number = Math.ceil(totalCount / pageSize);
  const prevPage: number = currentPage - 1;
  const nextPage: number = currentPage + 1;
  const hasNextPage: boolean = nextPage <= totalPages;
  const hasPrevPage: boolean = prevPage >= 1;
  const itemsLeft: number =
    totalCount - currentPage * pageSize >= 0 ? totalCount - currentPage * pageSize : 0;

  const pageArray = Array.from({ length: 10 }, (_, i) => i + 1);
  console.log('pageArray', pageArray);
</script>

<div class="container">
  {#each pageArray as page}
    <p>{page}</p>
  {/each}
</div>

<style lang="scss">
  .container {
    display: grid;
  }
</style>
