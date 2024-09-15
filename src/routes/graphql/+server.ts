import { json } from '@sveltejs/kit';
import { executeGraphQL } from '$lib/postgraphile';

export const POST = async ({ request }) => {
  const { query, variables } = await request.json();
  const result = await executeGraphQL(query, variables);
  return json(result);
};
