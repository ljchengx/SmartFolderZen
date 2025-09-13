import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { FluentProvider } from "@fluentui/react-components";
import { smartFolderTheme } from "./themes";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <FluentProvider theme={smartFolderTheme}>
      <App />
    </FluentProvider>
  </React.StrictMode>,
);
