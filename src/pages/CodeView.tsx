import { Action, Actions, Controls, Name, Profile } from "../components/Controls";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { EditIcon, EyeIcon, FilePlusIcon } from "@iconicicons/react";
import { Side, Wrapper, Text } from "../components/Code";
import { useEffect, useMemo, useState } from "react";
import { formatAddress } from "../utils/ar";
import { run } from "ar-gql";
import SyntaxHighlighter from "react-syntax-highlighter";
import useHashLocation from "../utils/hash";
import Tooltip from "../components/Tooltip";
import Footer from "../components/Footer";
import styled from "styled-components";
import axios from "axios";

export default function CodeView() {
  const [content, setContent] = useState("");

  const [location, setLocation] = useHashLocation();
  const id = useMemo(() => {
    const params = location.split("/");

    return params?.[1];
  }, [location]);

  const [contentType, setContentType] = useState("text/plain");

  useEffect(() => {
    (async () => {
      if (!id) return;

      const { data, headers } = await axios.get<string>(`https://arweave.net/${id}`);

      setContent(data);
      setContentType(headers["content-type"]?.split(";")?.[0] ||  "text/plain");
    })();
  }, [id]);

  const [owner, setOwner] = useState<string>();

  useEffect(() => {
    if (!id) return;

    run(
      `query {
        transaction(id: "${id}") {
          owner {
            address
          }
        }
      }`
    ).then(({ data }) => setOwner(data.transaction.owner.address))
      .catch();
  }, [id]);

  const size = useMemo(() => {
    if (!content) return 0;

    return new TextEncoder().encode(content).byteLength;
  }, [content]);

  return (
    <Wrapper>
      <Controls>
        <Name>
          Permapaste
        </Name>
        <Actions>
          <Action disabled />
          <Tooltip content="New">
            <Action as={FilePlusIcon} onClick={() => setLocation("/")} />
          </Tooltip>
          <Tooltip content="Fork">
            <Action as={EditIcon} onClick={() => setLocation("/fork/" + id)} />
          </Tooltip>
          <Tooltip content="See raw">
            <Action as={EyeIcon} onClick={() => window.location.href = `https://arweave.net/${id}`} />
          </Tooltip>
        </Actions>
      </Controls>
      <Side>
        {content.split("\n").map((_, i) => (
          <CodeLine key={i}>{i + 1}</CodeLine>
        ))}
      </Side>
      <Text>
        <SyntaxHighlighter style={atomOneDark}>
          {content}
        </SyntaxHighlighter>
      </Text>
      <Footer owner={owner} bytes={size} contentType={contentType} />
    </Wrapper>
  );
}

const CodeLine = styled.span`
  display: block;
  line-height: 1.25em;
`;
