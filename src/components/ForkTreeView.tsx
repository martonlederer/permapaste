import { ChevronRightIcon, ChevronDownIcon, ShareIcon } from "@iconicicons/react";
import { ForkTree, loadChildrenForks } from "../utils/fork";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useRoute } from "wouter";
import styled from "styled-components";
import Tooltip from "./Tooltip";

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

  const [matches, params] = useRoute("/:txid([a-z0-9_-]{43})");
  const current = useMemo(() => matches && params.txid === tree.id, [matches, params]);

  return (
    <>
      <ForkElementWrapper indent={indent} onClick={toggle} selected={current} title="Click to load all child forks">
        {(open && <ChevronDownIcon />) || <ChevronRightIcon />}
        {tree.id}
        {(!current && (
          <Tooltip content="Checkout" top>
            <ShareIcon onClick={() => setLocation("/" + tree.id)} />
          </Tooltip>
        )) || " (active)"}
      </ForkElementWrapper>
      {tree.forks && tree.forks.map((fork, i) => <ForkTreeView baseTree={fork} key={i} indent={indent + 1} />)}
    </>
  );
}

const ForkElementWrapper = styled.div<{ indent: number; selected: boolean; }>`
  display: flex;
  align-items: center;
  gap: .4rem;
  font-size: .8rem;
  color: ${props => props.selected ? "#fff" : "#dbdbdb"};
  font-weight: 500;
  cursor: pointer;
  padding: .24rem .43rem;
  padding-left: calc(.43rem * ${props => props.indent});
  background-color: ${props => props.selected ? "#131920" : "transparent"};

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
