import { Action, Actions, Controls, Name } from "../components/Controls";
import { EditIcon, EyeIcon, FilePlusIcon } from "@iconicicons/react";
import { Side, Wrapper, Text } from "../components/Code";
import { useEffect, useMemo, useState } from "react";
import Tooltip from "../components/Tooltip";
import useHashLocation from "../utils/hash";
import axios from "axios";

export default function CodeView() {
  const [content, setContent] = useState("");

  const [location, setLocation] = useHashLocation();
  const id = useMemo(() => {
    const params = location.split("/");

    return params?.[1];
  }, [location]);

  useEffect(() => {
    if (!id) return;

    axios.get<string>(`https://arweave.net/${id}`)
      .then(({ data }) => setContent(data))
      .catch();
  }, [id]);

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
      <Side>{">"}</Side>
      <Text>
        {content}
      </Text>
    </Wrapper>
  );
}
