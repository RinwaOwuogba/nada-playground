import { useMemo, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import CodeEditor from "./components/code-editor";
import createTheme from "@uiw/codemirror-themes";
import { tags as t } from "@lezer/highlight";
import constants from "./constants";
import { secretIntegerTag } from "./lib/nada-python";

function App() {
  const [count, setCount] = useState(0);
  const [code, setCode] = useState(`from nada_dsl import *

def nada_main():
    num_1 = SecretInteger(5)
    num_2 = PublicInteger(10)
    num_3 = Integer(15)
    bool_1 = SecretBoolean(True)
    bool_2 = PublicBoolean(False)
    bool_3 = Boolean(True)
    y = num_3.reveal()
    return [num_1, num_2, num_3, bool_1, bool_2, bool_3]
`);

  // let code;
  // const setCode = (newCode: string) => {
  //   code = newCode;
  // };

  const operatorColor = "#cfcfcf";
  const functionColor = "#00bb00"; // example color for functions
  const classColor = "#ff221e"; // example color for classes

  const theme = useMemo(
    () =>
      createTheme({
        theme: "light",
        settings: {},
        styles: [
          {
            tag: t.definitionKeyword,
            color: classColor,
          },
          // {
          //   tag: t.operator,
          //   color: operatorColor,
          // },
          // {
          //   tag: t.function(t.variableName),
          //   color: functionColor,
          // },
          // {
          //   tag: secretIntegerTag,
          //   color: classColor,
          // },
        ],
      }),
    [operatorColor, functionColor, classColor]
  );

  console.log("🚀 ~ App ~ theme:", theme);
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <CodeEditor
        code={code}
        setCode={setCode}
        placeholder={constants.EDITOR_PLACEHOLDER_TEXT}
        theme={theme}
      />
    </>
  );
}

export default App;
