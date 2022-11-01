import { PropsWithChildren, ReactNode } from "react";
import styled from "styled-components";

export default function Tooltip({ children, content, top = false }: PropsWithChildren<Props>) {
  return (
    <Wrapper>
      {children}
      <TooltipBody top={top}>
        {content}
      </TooltipBody>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  display: inline-flex;

  &:hover div {
    display: flex;
  }
`;

const TooltipBody = styled.div<{ top?: boolean; }>`
  position: absolute;
  z-index: 10;
  ${props => props.top ? "bottom" : "top"}: 110%;
  left: 50%;
  background-color: #000;
  color: #fff;
  border-radius: 4px;
  padding: .3rem .5rem .35rem;
  max-width: 250px;
  width: max-content;
  display: none;
  transform: translateX(-50%);

  &::after {
    content: "";
    position: absolute;
    ${props => props.top ? "top" : "bottom"}: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: ${props => props.top ? "#000" : "transparent"} transparent ${props => props.top ? "transparent" : "#000"} transparent;
  }
`;

interface Props {
  content: ReactNode;
  top?: boolean;
}
