<script lang="ts">
  import { boredState } from '$lib/stores/boredState';
  import { gameStore } from '$lib/stores/gameSearchStore';

  async function handleSubmit(event: SubmitEvent) {
    // submitting = true;
    boredState.set({ loading: true });
    const form = event.target as HTMLFormElement;
    console.log('form', form);
    const response = await fetch('/api/games', {
      method: 'POST',
      headers: { accept: 'application/json' },
      body: new FormData(form)
    });
    const responseData = await response.json();
    // submitting = false;
    boredState.set({ loading: false });
    gameStore.removeAll();
    gameStore.addAll(responseData?.games);
    // games = responseData?.games;
  }

  let submitting = $boredState?.loading;
  let minAge = 1;
  let minPlayers = 1;
  let maxPlayers = 1;
  let exactMinPlayers = false;
  let exactMaxPlayers = false;
</script>

<form on:submit|preventDefault={handleSubmit} method="post">
  <fieldset aria-busy={submitting} disabled={submitting}>
    <div>
      <label for="minAge">
        Min Age
        <input id="minAge" name="minAge" bind:value={minAge} type="number" min={1} max={120} />
      </label>
    </div>
    <div>
      <label for="minPlayers">
        Min Players
        <input
          id="minPlayers"
          name="minPlayers"
          bind:value={minPlayers}
          type="number"
          min={0}
          max={50}
        />
      </label>
      <label for="exactMinPlayers" style="display: flex; gap: 1rem; place-items: center;">
        <span>Exact?</span>
        <input
          id="exactMinPlayers"
          type="checkbox"
          name="exactMinPlayers"
          bind:checked={exactMinPlayers}
        />
      </label>
    </div>
    <div>
      <label for="maxPlayers">
        Max Players
        <input
          id="maxPlayers"
          name="maxPlayers"
          bind:value={maxPlayers}
          type="number"
          min={0}
          max={50}
        />
      </label>
      <label for="exactMaxPlayers" style="display: flex; gap: 1rem; place-items: center;">
        <span>Exact?</span>
        <input
          id="exactMaxPlayers"
          type="checkbox"
          name="exactMaxPlayers"
          bind:checked={exactMaxPlayers}
        />
      </label>
    </div>
  </fieldset>
  <button type="submit" disabled={submitting}>Submit</button>
</form>

<style lang="scss">
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

    @media (max-width: 800px) {
      grid-template-columns: 1fr;
    }
  }

  label {
    display: grid;
    margin: 1rem;
  }
</style>
