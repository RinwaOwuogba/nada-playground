import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import CodeEditor from "./components/code-editor";
import constants from "./constants";
import executeNadaCode, { evaluatePython } from "./lib/nada-executor";

const sampleCode = `\
 from nada_dsl import *
  
    def nada_main():
        num_1 = SecretInteger(Input(name="num_1"))
        num_2 = PublicInteger(Input(name="num_2"))
        truncated = num_1.trunc_pr(num_2)
        result = truncated.if_else(num_1, num_2)
        revealed = result.reveal()
        equality_check = num_1.public_equals(num_2)
        return [result, revealed, equality_check]
    
`;

function App() {
  const [code, setCode] = useState(sampleCode);
  //    `from nada_dsl import *

  // def nada_main():
  //     num_1 = SecretInteger(5)
  //     num_2 = PublicInteger(10)
  //     num_3 = Integer(15)
  //     bool_1 = SecretBoolean(True)
  //     bool_2 = PublicBoolean(False)
  //     bool_3 = Boolean(True)
  //     y = num_3.reveal()
  //     return [num_1, num_2, num_3, bool_1, bool_2, bool_3]
  // `);

  // let code;
  // const setCode = (newCode: string) => {
  //   code = newCode;
  // };

  useEffect(() => {
    evaluatePython({}, "").then(console.log).then(console.log);
    // executeNadaCode("").then(console.log).then(console.log);
  }, []);

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
      />
    </>
  );
}

export default App;
