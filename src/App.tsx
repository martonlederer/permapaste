import { createGlobalStyle } from "styled-components";
import { isAddress } from "./utils/ar";
import { useMemo } from "react";
import CodeView from "./pages/CodeView";
import useHashLocation from "./utils/hash";
import Profile from "./pages/Profile";
import Editor from "./pages/Editor";

export default function App() {
  const [location] = useHashLocation();
  const editor = useMemo(() => {
    const params = location.split("/");

    if (params[1] && isAddress(params[1])) {
      return false;
    }

    return true;
  }, [location]);

  const profile = useMemo(() => {
    const params = location.split("/");

    if (params[1] === "p" && params[2] && isAddress(params[2])) {
      return true;
    }

    return false;
  }, [location]);

  return (
    <>
      <Styles />
      {((profile && <Profile />) || (editor && <Editor />)) || <CodeView />}
    </>
  );
}

const Styles = createGlobalStyle`
  @import url("https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600&display=swap");

  body {
    font-family: 'Fira Code', monospace;
    background-color: #1c2226;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }

  code, pre {
    font-family: 'Fira Code', monospace;
  }

  pre {
    margin: 0;
    padding: 0 !important;
    overflow: visible;
    width: max-content;
    background: transparent !important;
  }
`;
