<script lang="ts">
	import { enhance } from '$app/forms';
	import capitalize from 'just-capitalize';
	import { Button } from '$lib/components/ui/button';
	// import AddRolesForm from './add-roles-form.svelte';

	const { data } = $props();

	const { user, availableRoles } = data;
	const { user_roles }: { user_roles: { role: { name: string, cuid: string } }[] } = user;
</script>

<h1>User Details</h1>
<p>Username {user?.username}</p>
<p>Email Address: {user?.email || 'N/A'}</p>
<p>First Name: {user?.first_name || 'N/A'}</p>
<p>Last Name: {user?.last_name || 'N/A'}</p>

<h2>User Roles</h2>
{#each user_roles as user_role}
	{#if user_role?.role?.name !== 'user'}
	<form action="?/removeRole" method="POST" use:enhance data-sveltekit-replacestate>
		<div class="flex flex-row space-x-3 place-items-center mt-2">
			<input id="role" type="hidden" name="role" value={user_role?.role?.cuid} />
			<Button type="submit">Remove</Button>
			<p>{capitalize(user_role?.role?.name)}</p>
		</div>
	</form>
	{:else}
		<p>{capitalize(user_role?.role?.name)}</p>
	{/if}
{/each}

<h2>Roles Available to Assign</h2>
<!--<AddRolesForm {availableRoles} />-->
{#each availableRoles as role}
	<form action="?/addRole" method="POST" use:enhance data-sveltekit-replacestate>
		<div class="flex flex-row space-x-3 place-items-center mt-2">
			<input id="role" type="hidden" name="role" value={role?.cuid} />
			<Button type="submit">Add</Button>
			<p>{capitalize(role?.name)}</p>
		</div>
	</form>
{/each}