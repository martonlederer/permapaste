import { ChevronRightIcon, ChevronDownIcon, ShareIcon } from "@iconicicons/react";
import { ForkTree, loadChildrenForks } from "../utils/fork";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Tooltip from "./Tooltip"

export default function ForkTreeView({ baseTree, indent = 1 }: Props) {
  const [tree, setTree] = useState<ForkTree>(baseTree);

  useEffect(() => setTree(baseTree), [baseTree]);

  const [open, setOpen] = useState(false);

  async function toggle() {
    if (tree.forks && tree.forks.length > 1) {
      return;
    }

    const childrenForks = await loadChildrenForks(tree.id);

    setTree((val) => {
      if (!val.forks) {
        val.forks = childrenForks.map((id) => ({ id }));
      } else {
        for (const forkID of childrenForks) {
          if (val.forks.find((fork) => fork.id === forkID)) {
            continue;
          }

          val.forks.push({ id: forkID });
        }
      }

      return val;
    });
    setOpen(true);
  }

  const [, setLocation] = useLocation();

  return (
    <>
      <ForkElementWrapper indent={indent} onClick={toggle}>
        {(open && <ChevronDownIcon />) || <ChevronRightIcon />}
        {tree.id}
        <Tooltip content="Checkout" top>
          <ShareIcon onClick={() => setLocation("/" + tree.id)} />
        </Tooltip>
      </ForkElementWrapper>
      {tree.forks && tree.forks.map((fork, i) => <ForkTreeView baseTree={fork} key={i} indent={indent + 1} />)}
    </>
  );
}

const ForkElementWrapper = styled.div<{ indent: number }>`
  display: flex;
  align-items: center;
  gap: .4rem;
  font-size: .8rem;
  color: #dbdbdb;
  font-weight: 500;
  cursor: pointer;
  padding: .24rem .43rem;
  padding-left: calc(.43rem * ${props => props.indent});

  &:hover {
    background-color: #131920;
  }

  svg {
    font-size: 1.2em;
    width: 1em;
    height: 1em;
  }
`;

interface Props {
  baseTree: ForkTree;
  indent?: number;
}
