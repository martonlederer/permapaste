import { Action, Actions, Controls, Name, Profile } from "../components/Controls";
import { EditIcon, EyeIcon, FilePlusIcon } from "@iconicicons/react";
import { Side, Wrapper, Text } from "../components/Code";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatAddress } from "../utils/ar";
import Tooltip from "../components/Tooltip";
import useHashLocation from "../utils/hash";
import Arweave from "arweave";
import axios from "axios";

const arweave = new Arweave({
  host: "arweave.net",
  port: 443,
  protocol: "https"
});

export default function Editor() {
  const editorRef = useRef<HTMLDivElement>();

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

  const [activeAddress, setActiveAddress] = useState<string>();

  useEffect(() => {
    const listener = async () => {
      try {
        setActiveAddress(await window.arweaveWallet.getActiveAddress());
      } catch {}
    }

    window.addEventListener("arweaveWalletLoaded", listener);
    listener();

    return () => window.removeEventListener("arweaveWalletLoaded", listener);
  }, []);

  useEffect(() => {
    if (!activeAddress) return;
    const listener = (e: CustomEvent<{ address: string }>) => setActiveAddress(e.detail.address);

    window.addEventListener("walletSwitch", listener);

    return () => window.removeEventListener("walletSwitch", listener);
  }, [activeAddress]);

  async function connect() {
    await window.arweaveWallet.connect(["ACCESS_ADDRESS", "ACCESS_ALL_ADDRESSES", "SIGN_TRANSACTION"]);
    setActiveAddress(await window.arweaveWallet.getActiveAddress());
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
        {(activeAddress && (
          <Tooltip content="Your profile">
            <Profile onClick={() => setLocation("/p/" + activeAddress)}>
              {formatAddress(activeAddress, 7)}
            </Profile>
          </Tooltip>
        )) || <Profile onClick={connect}>Connect</Profile>}
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
    </Wrapper>
  );
}
