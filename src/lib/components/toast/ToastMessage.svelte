<script lang="ts">
  import type { ToastData } from '$lib/types';

  import { onMount } from 'svelte';

  import { tweened } from 'svelte/motion';
  import { toast } from './toast';
  export let toastData: ToastData;

  let progress = tweened(100, { duration: toastData.duration });

  onMount(async () => {
    await progress.set(0);
    toast.remove(toastData.id);
  });
</script>

<div class="progress" style={`width: ${$progress}%;`} />
<p>{toastData.message}</p>

<style>
  .progress {
    height: 8px;
    background: white;
    opacity: 0.3;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }

  p {
    margin: 0;
  }
</style>
