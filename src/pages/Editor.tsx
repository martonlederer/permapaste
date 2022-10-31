import { Action, Actions, Controls, Name } from "../components/Controls";
import { EditIcon, EyeIcon, FilePlusIcon } from "@iconicicons/react";
import { useState } from "react"
import styled from "styled-components";
import Arweave from "arweave";

const arweave = new Arweave({
  host: "arweave.net",
  port: 443,
  protocol: "https"
});

export default function Editor() {
  const [content, setContent] = useState("");

  async function save() {
    if (content === "") return;

    const tx = await arweave.createTransaction({ data: content });
    
    tx.addTag("Content-Type", "text/plain");
    tx.addTag("App-Name", "Permapaste");
    tx.addTag("App-Version", "0.0.1");
    // TODO fork tag

    await arweave.transactions.sign(tx);

    const uploader = await arweave.transactions.getUploader(tx);

    while (!uploader.isComplete) {
      await uploader.uploadChunk();
    }

    // TODO: redirect to txid
  }

  return (
    <Wrapper>
      <Controls>
        <Name>
          Permapaste
        </Name>
        <Actions>
          <Action onClick={save} />
          <Action disabled as={FilePlusIcon} />
          <Action disabled as={EditIcon} />
          <Action disabled as={EyeIcon} />
        </Actions>
      </Controls>
      <Side>{">"}</Side>
      <Text onInput={(e) => setContent(e.currentTarget.innerText)}></Text>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  height: calc(100vh - 3rem);
  padding: 1.5rem;
  overflow: auto;
`;

const Side = styled.p`
  margin: 0;
  color: #c6c6c6;
`;

const Text = styled.div.attrs({
  contentEditable: true
})`
  min-height: 100%;
  line-height: 1.25em;
  outline: none;
  border: none;
  color: #c6c6c6;
  width: 100%;
`;