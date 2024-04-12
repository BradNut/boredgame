<script lang="ts">
	import DataTable from './user-table.svelte';
	export let data;
</script>

<h1>Users</h1>

<div class="container mx-auto py-10">
	<DataTable users={data?.users ?? []}/>
</div>
