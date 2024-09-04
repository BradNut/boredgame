<script lang="ts">
  import { fade } from 'svelte/transition';

  interface Transition {
    type: 'fade' | 'stagger' | 'page';
    duration?: number;
    delay?: number;
  }

  export let url: string = "";
  export let transition: Transition;
</script>

{#if transition.type === 'page' && url}
  <div class="transition" style="display: grid;">
    {#key url}
        <div style="grid-row: 1 / -1; grid-column: 1 / -1;" in:fade|global={{ duration: 400, delay: 400 }} out:fade|global={{ duration: 400}}>
          <slot />
        </div>
    {/key}
  </div>
{/if}

{#if transition.type === 'fade'}
  <div
    class="fade transition"
    style:animation-duration="{transition.duration}ms"
    style:animation-delay="{transition.delay}ms"
  >
    <slot />
  </div>
{/if}

{#if transition.type === 'stagger'}
  <div
    class="stagger transition"
    style:animation-duration="{transition.duration || 300}ms"
    style:animation-delay="{transition.delay}ms"
  >
    <slot />
  </div>
{/if}

<style>
  .transition {
    height: 100%;
  }

  .fade {
    animation-name: fadeIn;
  }

  .stagger {
    opacity: 0;
    animation-name: stagger;
    animation-fill-mode: forwards;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes stagger {
    from {
      opacity: 0;
      transform: translateY(50px);
    }
    to {
      opacity: 1;
      transform: translateY(0px);
    }
  }
</style>
