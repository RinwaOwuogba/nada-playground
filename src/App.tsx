import { useState } from "react";
import { Box, Text, Grid, GridItem } from "@chakra-ui/react";
import "./App.css";
import CodeEditor from "./components/code-editor";
import EditorInput from "./components/editor-input";
import ExecutionOutput, {
  IExecutionResult,
} from "./components/execution-output";
import constants from "./constants";
import { useNadaInput } from "./hooks/useNadaInput";
import EnvironmentLoader from "./components/environment-loader";
import useExecuteNadaProgram from "./hooks/useExecuteNadaProgram";
import Header from "./components/header";

const sampleCode = `\
from nada_dsl import *

def nada_main():
    party_alice = Party(name="Alice")
    party_bob = Party(name="Bob")
    party_charlie = Party(name="Charlie")
    num_1 = SecretInteger(Input(name="num_1", party=party_alice))
    num_2 = SecretInteger(Input(name="num_2", party=party_bob))
    product = num_1 * num_2
    return [Output(product, "product", party_charlie)]
`;

function App() {
  const [code, setCode] = useState(sampleCode);
  const [isProgramExecuting, setIsProgramExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<IExecutionResult[]>(
    []
  );

  const {
    inputs,
    getInputPropertySetter,
    isAutoMode,
    toggleMode,
    addInput,
    removeInput,
  } = useNadaInput(code);

  const { executeProgram } = useExecuteNadaProgram({
    setIsProgramExecuting,
    setExecutionResult,
  });

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <Header code={code} inputs={inputs} />

      <EnvironmentLoader>
        <Grid
          padding={5}
          templateAreas={`
          "editor output"
          "input ."
        `}
          overflowX={"hidden"}
          gridTemplateColumns="1fr 1fr"
          columnGap={4}
          rowGap={4}
        >
          <GridItem area="editor" overflowX={"scroll"}>
            <Text fontWeight={"bold"} color={"gray.400"}>
              Editor
            </Text>
            <CodeEditor
              code={code}
              setCode={setCode}
              placeholder={constants.EDITOR_PLACEHOLDER_TEXT}
            />
          </GridItem>

          <GridItem area="output">
            <Text fontWeight={"bold"} color={"gray.400"}>
              Output
            </Text>
            <ExecutionOutput
              isProgramExecuting={isProgramExecuting}
              executionResult={executionResult}
              loadingMessage="Executing program..."
              defaultMessage="No execution results yet."
            />
          </GridItem>

          <GridItem area="input">
            <Text fontWeight={"bold"} color={"gray.400"}>
              Input
            </Text>

            <EditorInput
              code={code}
              addInput={addInput}
              removeInput={removeInput}
              toggleMode={toggleMode}
              isAutoMode={isAutoMode}
              inputs={inputs}
              isProgramExecuting={isProgramExecuting}
              executeProgram={executeProgram}
              getInputPropertySetter={getInputPropertySetter}
            />
          </GridItem>
        </Grid>
      </EnvironmentLoader>
    </Box>
  );
}

export default App;
