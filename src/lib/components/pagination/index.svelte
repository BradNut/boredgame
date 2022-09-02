<script lang="ts">
  import { boredState } from '$root/lib/stores/boredState';

  const totalCount = $boredState.search.totalCount; // TODO: Check default value
  console.log('totalCount', totalCount);
  const pageSize = $boredState.search.pageSize;
  console.log('pageSize', pageSize);
  const currentPage = $boredState.search.currentPage;
  console.log('currentPage', currentPage);
  let skip = $boredState.search.skip;
  console.log('skip', skip);

  const totalPages: number = Math.ceil(totalCount / pageSize);
  console.log('totalPages', totalPages);
  const prevPage: number = currentPage - 1;
  const nextPage: number = currentPage + 1;
  const hasNextPage: boolean = nextPage <= totalPages;
  const hasPrevPage: boolean = prevPage >= 1;
  const itemsLeft: number =
    totalCount - currentPage * pageSize >= 0 ? totalCount - currentPage * pageSize : 0;

  const maxPaginationButtons = 10;
  let addition = maxPaginationButtons;
  if (addition <= maxPaginationButtons) {
    addition = skip;
  }
  const pageArray = Array.from({ length: maxPaginationButtons }, (_, i) => i + 1 + addition);
  // console.log('pageArray', pageArray);
</script>

<div class="container">
  <button type="button" class="btn" disabled={!hasPrevPage}>Prev</button>
  {#each pageArray as page (page)}
    <button
      type="button"
      class="btn"
      class:current={page === currentPage}
      value={page}
      on:click={() => {
        boredState.update((n) => ({
          ...n,
          search: { skip: page * pageSize, currentPage: currentPage + 1, pageSize, totalCount }
        }));
      }}>{page}</button
    >
  {/each}
  <button type="button" class="btn" disabled={!hasNextPage}>Next</button>
</div>

<style lang="scss">
  .container {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin: 3rem 0;
  }

  button {
    /* min-width: 50px; */
    &[aria-current],
    &.current {
      color: black; // TODO: Fix these colors
      background: white;
    }
    &[disabled] {
      pointer-events: none;
      color: var(--lightGrey);
      text-decoration: line-through;
    }
  }
</style>
