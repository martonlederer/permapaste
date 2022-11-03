import { FileIcon, LogInIcon, UserIcon, InformationIcon, InboxIcon, TagIcon, CodeIcon } from "@iconicicons/react";
import { FREE_DATA_SIZE, formatAddress } from "../utils/ar";
import { RepoForkedIcon } from "@primer/octicons-react";
import { useEffect, useState } from "react";
import useHashLocation from "../utils/hash";
import styled from "styled-components";
import prettyBytes from "pretty-bytes";
import Tooltip from "./Tooltip";

const ABOUT_TX_ID = "JiLiIhCOMqjCXUabURZ5998D9m2Fm3PbShXEfmE-RaI";

export default function Footer({ owner, bytes, contentType, setContentType }: Props) {
  const [, setLocation] = useHashLocation();

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
    await window.arweaveWallet.connect(["ACCESS_ADDRESS", "ACCESS_ALL_ADDRESSES", "SIGN_TRANSACTION", "DISPATCH"]);
    setActiveAddress(await window.arweaveWallet.getActiveAddress());
  }

  return (
    <FooterWrapper>
      <Section>
        <Element>
          <RepoForkedIcon />
          main
        </Element>
        {owner && (
          <Element onClick={() => setLocation("/p/" + owner)}>
            <TagIcon />
            Owner: {formatAddress(owner, 6)}
          </Element>
        )}
        <Tooltip content="No need to pay or connect a wallet under 100 Kb" top>
          <Element>
            <CodeIcon />
            Size: {prettyBytes(bytes)}
            {" "}
            {bytes <= FREE_DATA_SIZE && "(FREE)"}
          </Element>
        </Tooltip>
        <Tooltip content="File Content-Type" top>
          <Element>
            <FileIcon />
            <CustomSelect 
              value={contentType}
              disabled={!setContentType}
              onChange={(e) => {
                if (!setContentType) return;
                setContentType(e.target.value)
              }}
            >
              <option value="text/plain">text/plain</option>
              <option value="text/javascript">text/javascript</option>
              <option value="text/typescript">text/typescript</option>
              <option value="text/markdown">text/markdown</option>
              <option value="text/html">text/html</option>
              <option value="text/csv">text/csv</option>
              <option value="text/css">text/css</option>
              <option value="application/json">application/json</option>
              <option value="image/svg+xml">image/svg+xml</option>
            </CustomSelect>
          </Element>
        </Tooltip>
      </Section>
      <Section>
        <Element onClick={() => setLocation("/" + ABOUT_TX_ID)}>
          <InformationIcon />
          About
        </Element>
        <Element onClick={() => setLocation("/feed")}>
          <InboxIcon />
          Feed
        </Element>
        {(activeAddress && (
          <Element onClick={() => setLocation("/p/" + activeAddress)}>
            <UserIcon />
            {formatAddress(activeAddress, 6)}
          </Element>
        )) || (
          <Element onClick={connect}>
            <LogInIcon />
            Connect
          </Element>
        )}
      </Section>
    </FooterWrapper>
  );
}

const FooterWrapper = styled.div`
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0 .3rem;
  background-color: #0D1116;
  color: #fff;
`;

const Section = styled.div`
  display: flex;
  align-items: center;
  gap: .5rem;
`;

const Element = styled(Section)`
  gap: .275rem;
  cursor: pointer;
  padding: .23rem .35rem;
  font-size: .7rem;
  font-weight: 500;

  &:hover {
    background-color: #131920;
  }

  svg {
    font-size: .8rem;
    width: 1em;
    height: 1em;
  }
`;

const CustomSelect = styled.select`
  border: none;
  outline: none;
  background-color: transparent;
  padding: 0;
  margin: 0;
  color: #fff;
  font-size: .7rem;
  cursor: pointer;
  appearance: none;

  &:disabled {
    opacity: 1;
  }
`;

interface Props {
  owner?: string;
  bytes: number;
  contentType: string;
  setContentType?: (v: string) => any;
}
