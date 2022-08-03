<script lang="ts">
  import { boredState } from '$lib/stores/boredState';
  import { gameStore } from '$lib/stores/gameSearchStore';

  async function handleSearch(event: SubmitEvent) {
    boredState.set({ loading: true });
    const form = event.target as HTMLFormElement;
    console.log('form', form);
    const response = await fetch('/api/game', {
      method: 'POST',
      headers: { accept: 'application/json' },
      body: new FormData(form)
    });
    const responseData = await response.json();
    boredState.set({ loading: false });
    gameStore.removeAll();
    gameStore.addAll(responseData?.games);
  }

  export let showButton: boolean = false;
  export let advancedSearch: boolean = false;
  console.log('showButton', showButton);

  let submitting = $boredState?.loading;
  let name = '';
</script>

<form on:submit|preventDefault={handleSearch} method="post">
  <fieldset aria-busy={submitting} disabled={submitting}>
    <label for="name">
      Search
      <input
        id="name"
        name="name"
        bind:value={name}
        type="text"
        aria-label="Search boardgame"
        placeholder="Search boardgame"
      />
      {#if showButton}
        <button class="btn" type="submit" disabled={submitting}>Search</button>
      {/if}
    </label>
  </fieldset>
</form>

<style lang="scss">
  form {
    display: grid;
    place-items: start;
  }
  h1 {
    width: 100%;
  }
  button {
    padding: 1rem;
  }

  label {
    display: grid;
    grid-template-columns: auto auto auto;
    gap: 1rem;
    place-items: center;
    margin: 1rem;
  }
</style>
