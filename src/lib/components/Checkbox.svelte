<script lang="ts">
export let labelText: string
export let showLabel: boolean
export let name: string
export let value: boolean
export let onChange: FormDataEvent<HTMLInputElement>
</script>

<label for={name} class="checkbox">
  <span class="checkbox__input">
    <input id={name} {name} checked={value} on:change={onChange} type="checkbox" />
    <span class="checkbox__control">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        view-box="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          d="M1.73 12.91l6.37 6.37L22.79 4.59"
        />
      </svg>
    </span>
  </span>
  {#if showLabel}
    <span class="checkbox__label">{labelText}</span>
  {/if}
</label>

<style lang="postcss">
  .checkbox {
    display: grid;
    grid-template-columns: min-content auto;
    align-items: center;
    align-content: center;
    gap: 0.5rem;
    font-size: 2rem;

    .checkbox__input {
      display: grid;
      grid-template-areas: 'checkbox';

      > * {
        grid-area: checkbox;
      }
    }

    .checkbox__input input:checked + .checkbox__control svg {
      transform: scale(1);
    }

    .checkbox__input input:focus + .checkbox__control {
      box-shadow: var(--level-2-primary);
    }

    .checkbox__control {
      display: inline-grid;
      width: 1em;
      height: 1em;
      border-radius: 0.1em;
      border: 0.1em solid var(--lightViolet);

      svg {
        transition: transform 0.1s ease-in 25ms;
        transform: scale(0);
        transform-origin: bottom left;
      }
    }

    input[type='checkbox'] {
      opacity: 0;
      width: 1em;
      height: 1em;
    }
  }
</style>
