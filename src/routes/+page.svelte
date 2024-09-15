<!-- <script lang="ts">
import { onMount } from 'svelte';

const query = `
  query {
    allUsers {
      nodes {
        id
        name
      }
    }
  }
`;

let users: { id: string; name: string }[] = [];
let loading = true;

async function fetchUsers() {
  const response = await fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  const result = await response.json();
  users = result.data.allUsers.nodes;
}

onMount(() => {
  fetchUsers().then(() => {
    loading = false;
  });
});
</script>

{#if loading}
  <p>Loading users...</p>
{:else}
  <ul>
    {#each users as user}
      <li>{user.name} (ID: {user.id})</li>
    {/each}
  </ul>
{/if} -->

<p>Hi</p>