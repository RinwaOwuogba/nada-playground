import { useState, useCallback } from "react";
import { Box, Text, Grid, GridItem, useToast } from "@chakra-ui/react";
import "./App.css";
import CodeEditor from "./components/code-editor";
import EditorInput from "./components/editor-input";
import ExecutionOutput, {
  IExecutionResult,
} from "./components/execution-output";
import constants from "./constants";
import executeNadaCode from "./lib/nada-executor";
import { INadaInput, useNadaInput } from "./hooks/useNadaInput";
import EnvironmentLoader from "./components/environment-loader";

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
  const toast = useToast();

  const { inputs, getInputPropertySetter, isAutoMode, toggleMode, addInput } =
    useNadaInput(code);

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
    <Box height="100vh" display="flex" flexDirection="column">
      <Box bg="blue.500" padding={5}>
        <Text color={"white"} fontSize={"xxx-large"} fontWeight={"bold"}>
          Nada Playground
        </Text>
      </Box>

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
          rowGap={10}
        >
          <GridItem area="editor" overflowX={"scroll"}>
            <CodeEditor
              code={code}
              setCode={setCode}
              placeholder={constants.EDITOR_PLACEHOLDER_TEXT}
            />
          </GridItem>

          <GridItem area="output">
            <ExecutionOutput
              isProgramExecuting={isProgramExecuting}
              executionResult={executionResult}
              loadingMessage="Executing program..."
              defaultMessage="No execution results yet."
            />
          </GridItem>

          <GridItem area="input">
            <EditorInput
              code={code}
              addInput={addInput}
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
