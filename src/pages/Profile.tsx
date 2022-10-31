import { CopyIcon } from "@iconicicons/react";
import { useMemo } from "react";
import useHashLocation from "../utils/hash";
import styled from "styled-components";
import copy from "copy-to-clipboard";

export default function Profile() {
  const [location, setLocation] = useHashLocation();

  const address = useMemo(() => {
    const params = location.split("/");

    return params[2];
  }, [location]);

  return (
    <Wrapper>
      <Address>
        {address}
        <Copy onClick={() => copy(address)} />
      </Address>
      <Title>
        Files
      </Title>
      <Post>
        <PostTitle>Post title</PostTitle>
        <Tags>
          <TagWrapper>
            <Tag>Name</Tag>
            <Tag value>Value</Tag>
          </TagWrapper>
        </Tags>
      </Post>
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

const Title = styled.p`
  font-size: 1rem;
  color: #c6c6c6;
  margin-bottom: 1.3rem;
`;

const Post = styled.div`
  cursor: pointer;

  &:hover {
    opacity: .8;
  }
`;

const PostTitle = styled.p`
  font-size: 1.2rem;
  color: #c6c6c6;
  margin: 0 0 .5rem;
`;

const Tags = styled.div`
  display: flex;
  align-items: center;
  gap: .9rem;
  max-width: 40vw;
  flex-wrap: wrap;
`;

const TagWrapper = styled.div`
  display: flex;
  align-items: stretch;
`;

const Tag = styled.div<{ value?: boolean; }>`
  background-color: rgba(255, 255, 255, ${props => props.value ? ".5" : "1"});
  font-size: 1rem;
  padding: .25rem .32rem;
`;
