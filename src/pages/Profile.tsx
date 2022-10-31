import { CopyIcon, EditIcon, EyeIcon, FilePlusIcon } from "@iconicicons/react";
import { Action, Actions, Controls, Name } from "../components/Controls";
import { useEffect, useMemo, useState } from "react";
import { run } from "ar-gql";
import { GQLEdgeInterface } from "ar-gql/dist/faces";
import InfiniteScroll from "react-infinite-scroll-component";
import useHashLocation from "../utils/hash";
import Tooltip from "../components/Tooltip";
import styled from "styled-components";
import Post from "../components/Post";
import copy from "copy-to-clipboard";

export default function Profile() {
  const [location, setLocation] = useHashLocation();

  const address = useMemo(() => {
    const params = location.split("/");

    return params[2];
  }, [location]);

  const [posts, setPosts] = useState<GQLEdgeInterface[]>([]);
  const [cursor, setCursor] = useState("");
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchMore();
  }, []);

  async function fetchMore() {
    const { data } = await run(
      `query($owner: String!, $cursor: String!) {
        transactions(
          owners: [$owner]
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
      { owner: address, cursor }
    );

    setHasMore(data.transactions.pageInfo.hasNextPage || data.transactions.edges.length >= 20);
    setCursor(data.transactions.edges[data.transactions.edges.length - 1].cursor);
    setPosts((val) => [...val, ...data.transactions.edges]);
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
      <Address>
        {address}
        <Copy onClick={() => copy(address)} />
      </Address>
      <Title underline>
        Files:
      </Title>
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchMore}
        hasMore={hasMore}
        loader={<Title>Loading...</Title>}
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
`;

const Address = styled.p`
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  text-decoration: underline;
  color: #fff;
  margin: 0 0 1.5rem;
  gap: .3rem;
`;

const Copy = styled(CopyIcon)`
  font-size: 1.4rem;
  width: 1em;
  height: 1em;
  cursor: pointer;

  &:hover {
    opacity: .8;
  }
`;

const Title = styled.p<{ underline?: boolean; }>`
  font-size: 1rem;
  color: #c6c6c6;
  margin-bottom: 1.3rem;
  text-decoration: ${props => props.underline ? "underline" : "none"};
`;
