import { Action, Actions, Controls, Name } from "../components/Controls";
import { EditIcon, EyeIcon, FilePlusIcon } from "@iconicicons/react";
import { Side, Wrapper, Text } from "../components/Code";
import { useState } from "react";
import Tooltip from "../components/Tooltip";
import useHashLocation from "../utils/hash";
import Arweave from "arweave";

const arweave = new Arweave({
  host: "arweave.net",
  port: 443,
  protocol: "https"
});

export default function Editor() {
  const [content, setContent] = useState("");
  const [location, setLocation] = useHashLocation();

  async function save() {
    if (content === "") return;

    const tx = await arweave.createTransaction({ data: content });
    
    tx.addTag("Content-Type", "text/plain");
    tx.addTag("App-Name", "Permapaste");
    tx.addTag("App-Version", "0.0.1");

    const params = location.split("/");

    // forks
    if (params[1] === "fork" && params[2]) {
      tx.addTag("Forked", params[2]);
    }

    await arweave.transactions.sign(tx);

    const uploader = await arweave.transactions.getUploader(tx);

    while (!uploader.isComplete) {
      await uploader.uploadChunk();
    }

    // redirect to txid
    setLocation("/" + tx.id);
  }

  return (
    <Wrapper>
      <Controls>
        <Name>
          Permapaste
        </Name>
        <Actions>
          <Tooltip content="Save">
            <Action onClick={save} />
          </Tooltip>
          <Action disabled as={FilePlusIcon} />
          <Action disabled as={EditIcon} />
          <Action disabled as={EyeIcon} />
        </Actions>
      </Controls>
      <Side>{">"}</Side>
      <Text contentEditable onInput={(e) => setContent(e.currentTarget.innerText)}></Text>
    </Wrapper>
  );
}
