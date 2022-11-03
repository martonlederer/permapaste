import { FileIcon } from "@iconicicons/react";
import styled from "styled-components";

export const Controls = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  padding: 1rem;
  background-color: #262f35;
`;

export const Name = styled.h1`
  margin: 0;
  margin-bottom: .8rem;
  color: #c6c6c6;
  font-weight: 500;
  font-size: 1.5rem;

  &:hover {
    color: #fff;
  }
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

export const Action = styled(FileIcon)<{ disabled?: boolean; }>`
  font-size: 1.5rem;
  width: 1em;
  height: 1em;
  color: #c6c6c6;
  cursor: ${props => props.disabled ? "normal" : "pointer"};
  opacity: ${props => props.disabled ? ".74" : "1"};

  &:hover {
    color: ${props => props.disabled ? "#c6c6c6" : "#fff"};;
  }
`;

export const Profile = styled.p`
  text-decoration: underline;
  text-align: center;
  margin: 0.85rem 0 0;
  cursor: pointer;
  color: #c6c6c6;
  font-size: .9rem;

  &:hover {
    color: #fff;
  }
`;
