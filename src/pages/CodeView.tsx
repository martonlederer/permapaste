import { Action, Actions, Controls, Name } from "../components/Controls";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { EditIcon, EyeIcon, FilePlusIcon } from "@iconicicons/react";
import { Side, Wrapper, Text } from "../components/Code";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { run } from "ar-gql";
import SyntaxHighlighter from "react-syntax-highlighter";
import ReactMarkdown from "react-markdown";
import Tooltip from "../components/Tooltip";
import Footer from "../components/Footer";
import styled from "styled-components";
import remarkGfm from "remark-gfm";
import axios from "axios";

export default function CodeView({ id }: Props) {
  const [content, setContent] = useState("");

  const [, setLocation] = useLocation();

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
      {(contentType !== "text/markdown" && (
        <>
          <Side>
            {content.split("\n").map((_, i) => (
              <CodeLine key={i}>{i + 1}</CodeLine>
            ))}
            <CodeLine>
              {content.split("\n").length + 1}
            </CodeLine>
          </Side>
          <Text>
            <SyntaxHighlighter style={atomOneDark}>
              {content}
            </SyntaxHighlighter>
          </Text>
        </>
      )) || (
        <MarkdownWrapper>
          <ReactMarkdown children={content} remarkPlugins={[remarkGfm]} />
        </MarkdownWrapper>
      )}
      <Footer id={id} owner={owner} bytes={size} contentType={contentType} />
    </Wrapper>
  );
}

const CodeLine = styled.span`
  display: block;
  line-height: 1.25em;
`;

interface Props {
  id: string;
}

const MarkdownWrapper = styled.div`
  color: #c6c6c6;

  a {
    color: #ff5aa7;
  }
`;
