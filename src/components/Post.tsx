import styled from "styled-components"
import useHashLocation from "../utils/hash"

export default function Post({ id, tags, owner }: Props) {
  const [, setLocation] = useHashLocation();
  
  return (
    <PostWrapper onClick={() => setLocation("/" + id)}>
      <PostTitle>{id}</PostTitle>
      <Tags>
        {tags.map((tag, j) => (
          <TagWrapper key={j}>
            <Tag>{tag.name}</Tag>
            <Tag value>{tag.value}</Tag>
          </TagWrapper>
        ))}
      </Tags>
    </PostWrapper>
  );
}

interface Props {
  id: string;
  tags: { name: string; value: string; }[];
  owner?: string;
}

const PostWrapper = styled.div`
  cursor: pointer;
  margin-bottom: 2rem;

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