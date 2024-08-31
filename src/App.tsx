import { useEffect, useState } from "react";
import { Box, Text, Grid, GridItem } from "@chakra-ui/react";
import "./App.css";
import CodeEditor from "./components/code-editor";
import EditorInput from "./components/editor-input";
import constants from "./constants";
import { useNadaInput } from "./hooks/useNadaInput";
import EnvironmentLoader from "./components/environment-loader";
import useExecuteNadaProgram from "./hooks/useExecuteNadaProgram";
import Header from "./components/header";
import useLoadEnvironment from "./hooks/useLoadEnvironment";
import ExecutionOutput from "./components/execution-output";

function App() {
  const [code, setCode] = useState(constants.SAMPLE_CODE);

  const { isLoading, error, intermediateMessage, initialCode, initialInputs } =
    useLoadEnvironment();
  const {
    inputs,
    getInputPropertySetter,
    isAutoMode,
    toggleMode,
    addInput,
    removeInput,
    manualInputs,
    autoInputs,
  } = useNadaInput({ code, initialInputs });
  const { executeProgram, executionResult, isProgramExecuting } =
    useExecuteNadaProgram();

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
    }
  }, [initialCode]);

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <Header code={code} manualInputs={manualInputs} autoInputs={autoInputs} />

      <EnvironmentLoader
        isLoading={isLoading}
        error={error as Error}
        intermediateMessage={intermediateMessage}
      >
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
