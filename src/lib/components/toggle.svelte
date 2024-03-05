<script>
  // import { Switch } from '@rgossiaux/svelte-headlessui';
  let enabled = false;
</script>

<!-- <Switch
  checked={enabled}
  on:change={(e) => (enabled = e.detail)}
  class={enabled ? 'switch switch-enabled' : 'switch switch-disabled'}
>
  <span class="sr-only">Dark Mode</span>
  <span class="toggle" class:toggle-on={enabled} class:toggle-off={!enabled} />
</Switch> -->

<style>
  :global(.switch) {
    position: relative;
    display: inline-flex;
    align-items: center;
    border-radius: 1rem;
    border: 0;
    height: 1.25rem;
    width: 2.5rem;
  }

  :global(.switch-enabled) {
    /* Blue */
    background-color: hsla(0, 0%, 0%, 1);
  }

  :global(.switch-disabled) {
    /* Gray */
    background-color: hsla(0, 0%, 100%, 0.5);
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .toggle {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    background-color: hsla(0, 0%, 100%, 1);
    border-radius: 1rem;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
    transition-property: transform;
  }

  .toggle-on {
    transform: translateX(1.4rem);
  }

  .toggle-off {
    transform: translateX(0.1rem);
  }
</style>
