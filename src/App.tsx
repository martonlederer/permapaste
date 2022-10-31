import { createGlobalStyle } from "styled-components";
import { isAddress } from "./utils/ar";
import { useMemo } from "react";
import CodeView from "./components/CodeView";
import useHashLocation from "./utils/hash";
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

  return (
    <>
      <Styles />
      {(editor && <Editor />) || <CodeView />}
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
`;
