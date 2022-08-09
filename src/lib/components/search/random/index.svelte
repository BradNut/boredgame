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
</script>

<form on:submit|preventDefault={handleSubmit} method="post">
  <fieldset aria-busy={submitting} disabled={submitting}>
    <input type="checkbox" id="random" name="random" hidden checked />
    <button class="btn" type="submit" disabled={submitting}>Random Game 🎲</button>
  </fieldset>
</form>

<style lang="scss">
  fieldset {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
</style>
