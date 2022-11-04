import { isAddress } from "./ar";
import { run } from "ar-gql";

export interface ForkTree {
  id: string;
  forks?: ForkTree[];
}

/**
 * Load the fork tree backwars for a transaction.
 * This only returns the fork history for the given
 * tx id.
 * 
 * @param id ID of the tx to return thr tree for
 */
export async function loadDirectForkTree(id: string) {
  let tree: ForkTree = { id };

  const loadParentFork = async (txID: string) => {
    const { data } = await run(
      `query ($id: ID!) {
        transaction (id: $id) {
          tags {
            name
            value
          }
        }
      }`,
      { id: txID }
    );
    const forkedTag = data.transaction.tags.find(({ name }) => name === "Forked");

    if (forkedTag && isAddress(forkedTag.value)) {
      tree = {
        id: forkedTag.value,
        forks: [tree]
      };
      await loadParentFork(forkedTag.value);
    }
  }

  await loadParentFork(id);

  return tree;
}

/**
 * Load the children fork txs for a transaction
 * 
 * @param id ID of the transaction to load the forks for
 */
export async function loadChildrenForks(id: string, cursor?: string): Promise<string[]> {
  const { data } = await run(
    `query($id: [String!]!, $cursor: String) {
      transactions(
        tags: [
          { name: "App-Name", values: "Permapaste" }
          { name: "Forked", values: $id }
        ]
        after: $cursor
        first: 100
      ) {
        pageInfo {
          hasNextPage
        }
        edges {
          cursor
          node {
            id
          }
        }
      }
    }`,
    { id, cursor }
  );

  let res = data.transactions.edges.map(({ node }) => node.id);

  if (data.transactions.pageInfo.hasNextPage) {
    const next = await loadChildrenForks(
      id,
      data.transactions.edges[data.transactions.edges.length - 1].cursor
    );

    res.push(...next);
  }

  return res;
}
