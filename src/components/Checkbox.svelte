<script lang="ts">
  export let labelText: string;
  export let showLabel: boolean;
</script>

<label htmlFor={`${guest.id}`} className="checkbox">
  <span class="checkbox__input">
    <input
      id={`${guest.id}`}
      name={`${guest.id}`}
      checked={inputs[`${guest.id}`].plusOne}
      onChange={onChangePlusOne}
      type="checkbox"
    />
    <span class="checkbox__control">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          d="M1.73 12.91l6.37 6.37L22.79 4.59"
        />
      </svg>
    </span>
  </span>
  <span class="checkbox__label">Plus one? </span>
</label>

<style lang="scss">
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
