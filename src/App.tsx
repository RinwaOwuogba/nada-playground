import { useState, useCallback } from "react";
import { useToast } from "@chakra-ui/react";
import "./App.css";
import CodeEditor from "./components/code-editor";
import EditorInput from "./components/editor-input";
import ExecutionOutput, {
  IExecutionResult,
} from "./components/execution-output";
import constants from "./constants";
import executeNadaCode from "./lib/nada-executor";
import { INadaInput, useNadaInput } from "./hooks/useNadaInput";

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
  const [isProgramExecuting, setIsProgramExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<IExecutionResult[]>(
    []
  );
  const toast = useToast();

  const { inputs, setInputValue } = useNadaInput(code);
  console.log(inputs);

  const executeProgram = useCallback(
    async (inputs: INadaInput[], code: string) => {
      setIsProgramExecuting(true);
      try {
        const result = await executeNadaCode(inputs, code);
        setExecutionResult(result);
      } catch (error: unknown) {
        const err = error as Error;
        toast({
          title: "Error",
          description: err.message,
          status: "error",
          duration: 6000,
          isClosable: true,
          variant: "subtle",
        });
      } finally {
        setIsProgramExecuting(false);
      }
    },
    [setIsProgramExecuting, setIsProgramExecuting, toast]
  );

  return (
    <div className="App">
      <h1>Nada Playground</h1>

      <EditorInput
        code={code}
        inputs={inputs}
        isProgramExecuting={isProgramExecuting}
        executeProgram={executeProgram}
        setInputValue={setInputValue}
      />

      <CodeEditor
        code={code}
        setCode={setCode}
        placeholder={constants.EDITOR_PLACEHOLDER_TEXT}
      />

      <ExecutionOutput
        isProgramExecuting={isProgramExecuting}
        executionResult={executionResult}
        loadingMessage="Executing program..."
        defaultMessage="No execution results yet."
      />
    </div>
  );
}

export default App;
