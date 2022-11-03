import { createGlobalStyle } from "styled-components";
import { pathToRegexp, Key } from "path-to-regexp";
import { Router, Route, Switch } from "wouter";
import makeCachedMatcher from "wouter/matcher";
import useHashLocation from "./utils/hash";
import CodeView from "./pages/CodeView";
import Profile from "./pages/Profile";
import Editor from "./pages/Editor";
import Feed from "./pages/Feed";

const convertPathToRegexp = (path: string) => {
  let keys: Key[] = [];

  const regexp = pathToRegexp(path, keys, { strict: true });
  return { keys, regexp };
};

const customMatcher = makeCachedMatcher(convertPathToRegexp);

export default function App() {
  return (
    <>
      <Styles />
      <Router hook={useHashLocation} matcher={customMatcher}>
        <Switch>
          <Route path="/feed" component={Feed} />
          <Route path="/p/:address([a-z0-9_-]{43})">
            {(params) => <Profile address={params.address} />}
          </Route>
          <Route path="/:txid([a-z0-9_-]{43})">
            {(params) => <CodeView id={params.txid} />}
          </Route>
          <Route>
            <Editor />
          </Route>
        </Switch>
      </Router>
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

  code, pre, input, button, textarea, select {
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
