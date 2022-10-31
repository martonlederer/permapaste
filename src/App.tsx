import { createGlobalStyle } from "styled-components";
import Editor from "./pages/Editor";

export default function App() {
  return (
    <>
      <Styles />
      <Editor />
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
