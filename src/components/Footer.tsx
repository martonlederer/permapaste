import { FileIcon, LogInIcon, UserIcon, InformationIcon } from "@iconicicons/react";
import { RepoForkedIcon } from "@primer/octicons-react";
import { useEffect, useState } from "react";
import { formatAddress } from "../utils/ar";
import useHashLocation from "../utils/hash";
import styled from "styled-components";

export default function Footer() {
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
    await window.arweaveWallet.connect(["ACCESS_ADDRESS", "ACCESS_ALL_ADDRESSES", "SIGN_TRANSACTION"]);
    setActiveAddress(await window.arweaveWallet.getActiveAddress());
  }

  return (
    <FooterWrapper>
      <Section>
        <Element>
          <RepoForkedIcon />
          main
        </Element>
        <Element>
          <FileIcon />
          Size: 100 Kb (FREE)
        </Element>
      </Section>
      <Section>
        <Element>
          <InformationIcon />
          About
        </Element>
        {(activeAddress && (
          <Element onClick={() => setLocation("/p/" + activeAddress)}>
            <UserIcon />
            {formatAddress(activeAddress, 7)}
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
  padding: .2rem .35rem;
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
