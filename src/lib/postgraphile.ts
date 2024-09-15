import pg from 'pg';
import { createPostGraphileSchema } from 'postgraphile';
import { graphql } from 'graphql';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL, // Your database URL here
});

const schema = await createPostGraphileSchema(pool, 'public'); // Adjust schema if necessary

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function executeGraphQL(query: string, variables: Record<string, any> = {}) {
  return await graphql({
    schema,
    source: query,
    variableValues: variables,
    contextValue: { pgClient: await pool.connect() },
  });
}
