<script lang="ts">
	import DataTable from './user-table.svelte';
	const { data } = $props();
</script>

<h1>Users</h1>

<div class="container mx-auto py-10">
	<DataTable users={data?.users ?? []}/>
</div>
