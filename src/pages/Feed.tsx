import { Controls, Name, Actions, Action } from "../components/Controls";
import { EditIcon, EyeIcon, FilePlusIcon } from "@iconicicons/react";
import { GQLEdgeInterface } from "ar-gql/dist/faces";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { run } from "ar-gql";
import InfiniteScroll from "react-infinite-scroll-component";
import Tooltip from "../components/Tooltip";
import styled from "styled-components";
import Post from "../components/Post";

export default function Feed() {
  const [, setLocation] = useLocation();

  const [posts, setPosts] = useState<GQLEdgeInterface[]>([]);
  const [cursor, setCursor] = useState<string>();
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchMore(true);
  }, []);

  async function fetchMore(first?: boolean) {
    if (!first && !cursor) {
      return;
    }

    const { data } = await run(
      `query($cursor: String) {
        transactions(
          tags: [{ name: "App-Name", values: "Permapaste" }]
          after: $cursor
          first: 20
        ) {
          pageInfo {
            hasNextPage
          }
          edges {
            cursor
            node {
              id
              tags {
                name
                value
              }
            }
          }
        }
      }
      `,
      { cursor }
    );

    setHasMore(data.transactions.pageInfo.hasNextPage || data.transactions.edges.length >= 20);
    setCursor(data.transactions.edges[data.transactions.edges.length - 1].cursor);
    setPosts((val) => [...(first ? [] : val), ...data.transactions.edges]);
  }

  return (
    <Wrapper>
      <Controls>
        <Name>
          Permapaste
        </Name>
        <Actions>
          <Action disabled />
          <Tooltip content="New">
            <Action as={FilePlusIcon} onClick={() => setLocation("/")} />
          </Tooltip>
          <Action disabled as={EditIcon} />
          <Action disabled as={EyeIcon} />
        </Actions>
      </Controls>
      <Title>
        Feed
      </Title>
      <Paragraph>
        Latest:
      </Paragraph>
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchMore}
        hasMore={hasMore}
        loader={<Paragraph>Loading...</Paragraph>}
      >
        {posts.map((post, i) => (
          <Post id={post.node.id} tags={post.node.tags} key={i} />
        ))}
      </InfiniteScroll>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 2.6rem 3rem;
  min-height: calc(100vh - 2.6rem * 2);
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #fff;
  margin: 0 0 1.5rem;
`;

const Paragraph = styled.p`
  color: #c6c6c6;
  margin: 0 0 1rem;
`;
