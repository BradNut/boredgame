<script lang="ts">
  const { children } = $props();

  function portal(node: HTMLElement) {
    let target;

    function update() {
      target = document.querySelector('body');
      if (target) target.appendChild(node);
      node.hidden = false;
    }

    function destroy() {
      if (node.parentNode) {
        // Child will tell the parent to remove itself
        node.parentNode.removeChild(node);
      }
    }

    update();

    return {
      update,
      destroy
    };
  }
</script>

<div use:portal hidden>
  {@render children()}
</div>
