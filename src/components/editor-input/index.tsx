import { Box, Button, Switch, Tooltip } from "@chakra-ui/react";
import { INadaInput } from "@/hooks/useNadaInput";
import AutoEditorInput from "./auto-editor-input";
import ManualEditorInput from "./manual-editor-input";
import { InfoIcon } from "@chakra-ui/icons";

const EditorInput = ({
  code,
  inputs,
  isProgramExecuting,
  executeProgram,
  getInputPropertySetter,
  isAutoMode,
  toggleMode,
  addInput,
}: IEditorInputProps) => {
  return (
    <Box>
      <Box display="flex" alignItems="center" mb={4}>
        <Switch isChecked={isAutoMode} onChange={toggleMode} mr={2}>
          {isAutoMode ? "Auto Input" : "Manual Input"}
        </Switch>
        <Tooltip
          label="Toggle between automatic input extraction and manual input management"
          placement="right-end"
          hasArrow
        >
          <Box as="span" cursor="help">
            <InfoIcon color="blue.500" />
          </Box>
        </Tooltip>
      </Box>

      {isAutoMode ? (
        <AutoEditorInput
          inputs={inputs}
          getInputPropertySetter={getInputPropertySetter}
        />
      ) : (
        <ManualEditorInput
          inputs={inputs}
          getInputPropertySetter={getInputPropertySetter}
          addInput={addInput as () => void}
        />
      )}

      <Button
        aria-label="Run Program"
        onClick={() => executeProgram(inputs, code)}
        isLoading={isProgramExecuting}
        loadingText="Executing..."
        mt={4}
      >
        Run
      </Button>
    </Box>
  );
};

interface IEditorInputProps {
  code: string;
  inputs: INadaInput[];
  isProgramExecuting: boolean;
  executeProgram: (inputs: INadaInput[], code: string) => void;
  getInputPropertySetter: (
    key: string
  ) => (name: string, value: string) => void;
  isAutoMode: boolean;
  toggleMode: () => void;
  addInput?: () => void;
}

export default EditorInput;
