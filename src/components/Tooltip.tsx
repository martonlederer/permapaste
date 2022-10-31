import { PropsWithChildren, ReactNode } from "react";
import styled from "styled-components";

export default function Tooltip({ children, content }: PropsWithChildren<Props>) {
  return (
    <Wrapper>
      {children}
      <TooltipBody>
        {content}
      </TooltipBody>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  display: inline-flex;

  &:hover div {
    display: block;
  }
`;

const TooltipBody = styled.div`
  position: absolute;
  z-index: 10;
  top: 110%;
  left: 50%;
  background-color: #000;
  color: #fff;
  border-radius: 4px;
  padding: .3rem .5rem .35rem;
  display: none;
  transform: translateX(-50%);

  &::after {
    content: "";
    position: absolute;
    bottom: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent #000 transparent;
  }
`;

interface Props {
  content: ReactNode;
}
