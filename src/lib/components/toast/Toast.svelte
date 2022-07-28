<script lang="ts">
  import { fly, fade } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import Portal from '../../Portal.svelte';
  import ToastMessage from './ToastMessage.svelte';
  import { toast } from './toast';
</script>

<Portal>
  <div class="toast-wrapper">
    {#each $toast as toastData (toastData.id)}
      <div
        aria-label={toastData.dismissible ? 'Click to dismiss' : `${toastData.message}`}
        on:click={() => toastData.dismissible && toast.remove(toastData.id)}
        in:fly={{ opacity: 0, x: 100 }}
        out:fade
        animate:flip
        class={`toast ${toastData.type.toLowerCase()}`}
      >
        <ToastMessage {toastData} />
        {#if toastData.dismissible && toastData.showButton}
          <button
            type="button"
            aria-label="Click to dismiss"
            on:click={() => toastData.dismissible && toast.remove(toastData.id)}
            class="close"
          >
            <svg
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              ><path
                d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                fill="currentColor"
                fill-rule="evenodd"
                clip-rule="evenodd"
              /></svg
            >
          </button>
        {/if}
      </div>
    {/each}
  </div>
</Portal>

<style lang="scss">
  .toast-wrapper {
    position: fixed;
    bottom: 5px;
    right: 25px;
  }

  .toast {
    display: flex;
    gap: 1rem;
    place-items: center;

    overflow: hidden;
    position: relative;
    margin-bottom: 1rem;
    color: white;
    background: var(--toast-background, #625df5);
    padding: 20px;
    border-radius: 15px;
    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);

    .close {
      padding: 5px;
      border-radius: 5px;
      opacity: 1;
      transition: ease 0.3s;

      &:hover,
      &:focus {
        transition: ease 0.3s;
        background-color: #625df5;
      }
    }
  }

  .toast.error {
    background: var(--toast-error-background, #e54b4b);
    color: black;
  }
</style>
