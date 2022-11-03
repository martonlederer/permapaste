import { Action, Actions, Controls, Name } from "../components/Controls";
import { EditIcon, EyeIcon, FilePlusIcon } from "@iconicicons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Side, Wrapper, Text } from "../components/Code";
// @ts-expect-error
import { createData, signers } from "../../public/bundle.js";
import { uploadDataToBundlr } from "../utils/bundlr";
import { FREE_DATA_SIZE } from "../utils/ar";
import Tooltip from "../components/Tooltip";
import useHashLocation from "../utils/hash";
import Arweave from "arweave";
import axios from "axios";
import Footer from "../components/Footer"

const arweave = new Arweave({
  host: "arweave.net",
  port: 443,
  protocol: "https"
});

export default function Editor() {
  const editorRef = useRef<HTMLDivElement>();

  const [content, setContent] = useState("");
  const [location, setLocation] = useHashLocation();

  const [contentType, setContentType] = useState("text/plain");

  const size = useMemo(() => {
    if (!content) return 0;

    return new TextEncoder().encode(content).byteLength;
  }, [content]);

  async function save() {
    if (content === "") return;

    const tx = await arweave.createTransaction({ data: content });
    const tags = [
      { name: "Content-Type", value: contentType },
      { name: "App-Name", value: "Permapaste" },
      { name: "App-Version", value: "0.0.1" }
    ];

    const params = location.split("/");

    // forks
    if (params[1] === "fork" && params[2]) {
      tags.push({
        name: "Forked",
        value: params[2]
      });
    }

    // add tags
    for (const tag of tags) {
      tx.addTag(tag.name, tag.value);
    }

    if (size > FREE_DATA_SIZE) {
      await arweave.transactions.sign(tx);

      const uploader = await arweave.transactions.getUploader(tx);

      while (!uploader.isComplete) {
        await uploader.uploadChunk();
      }

      // redirect to txid
      setLocation("/" + tx.id);
    } else {
      const connected = window.arweaveWallet && (await window.arweaveWallet.getPermissions()).includes("DISPATCH");

      // if ArConnect is connected, dispatch
      if (connected) {
        const res = await window.arweaveWallet.dispatch(tx);

        setLocation("/" + res.id);
      } else {
        // if ArConnect is not connected we
        // generate a wallet and submit it as
        // ab arweave subsidised tx
        const jwk = await arweave.wallets.generate();
        const dataSigner = new signers.ArweaveSigner(jwk);
        const dataEntry = createData(
          tx.get("data", { decode: true, string: false }),
          dataSigner,
          { tags }
        );

        // sign and upload bundler tx
        await dataEntry.sign(dataSigner);
        await uploadDataToBundlr(dataEntry);

        setLocation("/" + dataEntry.id);
      }
    }
  }

  const forkId = useMemo(() => {
    const params = location.split("/");

    if (params?.[1] !== "fork") return undefined;

    return params?.[2];
  }, [location]);

  useEffect(() => {
    (async () => {
      if (!forkId || !editorRef.current) return;
      const { data } = await axios.get<string>(`https://arweave.net/${forkId}`);

      editorRef.current.innerText = data;
      setContent(data);
    })();
  }, [forkId]);

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
      <Text
        contentEditable
        onInput={(e) => setContent(e.currentTarget.innerText)}
        ref={editorRef as any}
        onKeyDown={(e) => {
          if(e.key.toLowerCase() !== "tab") return;
          e.preventDefault();
          document.execCommand("insertText", false, "  ");
        }}
      ></Text>
      <Footer bytes={size} contentType={contentType} setContentType={setContentType} />
    </Wrapper>
  );
}
