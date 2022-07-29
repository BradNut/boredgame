<script lang="ts">
  import { Popover, PopoverButton, PopoverPanel } from '@rgossiaux/svelte-headlessui';
</script>

<Popover style="position: relative;">
  <PopoverButton>Solutions</PopoverButton>

  <PopoverPanel style="position: absolute; z-index: 10;">
    <div class="panel-contents">
      <a href="/analytics">Analytics</a>
      <a href="/engagement">Engagement</a>
      <a href="/security">Security</a>
      <a href="/integrations">Integrations</a>
    </div>

    <img src="/solutions.jpg" alt="" />
  </PopoverPanel>
</Popover>

<style lang="scss">
  .panel-contents {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
</style>
