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

  let submitting = $boredState?.loading;
  let name = '';
</script>

<form on:submit|preventDefault={handleSearch} method="post">
  <fieldset aria-busy={submitting} disabled={submitting}>
    <div>
      <label htmlfor="name">
        Search
        <input id="name" name="name" bind:value={name} type="text" placeholder="Enter name" />
      </label>
    </div>
  </fieldset>
  <button type="submit" disabled={submitting}>Search</button>
</form>

<style lang="scss">
  h1 {
    width: 100%;
  }
  button {
    border-radius: 10px;
    margin: 0.5rem;
    padding: 1rem;
    color: var(--clr-input-txt);
    background-color: var(--color-btn-primary-active);
  }

  fieldset {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }

  label {
    display: grid;
    margin: 1rem;
  }
</style>
