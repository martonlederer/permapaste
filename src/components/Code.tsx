import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  height: calc(100vh - 3rem);
  padding: 1.5rem;
  overflow: auto;
`;

export const Side = styled.p`
  margin: 0;
  color: #aaaaaa;
  text-align: right;
  user-select: none;
`;

export const Text = styled.div`
  min-height: 100%;
  line-height: 1.25em;
  outline: none;
  border: none;
  color: #c6c6c6;
  min-width: 100%;
  width: max-content;
`;
