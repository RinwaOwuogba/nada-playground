import { Box, Button, Flex, Icon, Switch, Tooltip } from "@chakra-ui/react";
import { INadaInput } from "@/hooks/useNadaInput";
import AutoEditorInput from "./auto-editor-input";
import ManualEditorInput from "./manual-editor-input";
import { InfoIcon } from "@chakra-ui/icons";
import { VscPlay } from "react-icons/vsc";

const EditorInput = ({
  code,
  inputs,
  isProgramExecuting,
  executeProgram,
  getInputPropertySetter,
  isAutoMode,
  toggleMode,
  addInput,
  removeInput,
}: IEditorInputProps) => {
  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center">
          <Switch
            isChecked={isAutoMode}
            onChange={toggleMode}
            mr={2}
            size={"sm"}
            fontSize={"sm"}
            display={"flex"}
            alignItems={"center"}
          >
            {isAutoMode ? "Auto Input" : "Manual Input"}
          </Switch>
          <Tooltip
            label="Toggle between automatic input extraction and manual input management"
            placement="right-end"
            hasArrow
          >
            <Box as="span" cursor="help">
              <InfoIcon fontSize={"sm"} color="blue.500" />
            </Box>
          </Tooltip>
        </Box>

        <Button
          size="sm"
          aria-label="Run Program"
          onClick={() => executeProgram(inputs, code)}
          isLoading={isProgramExecuting}
          loadingText="Executing..."
          mt={4}
          leftIcon={<Icon as={VscPlay} />}
          colorScheme="blue"
          variant="outline"
        >
          Run
        </Button>
      </Flex>

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
          removeInput={removeInput as (id: string) => void}
        />
      )}
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
  removeInput?: (id: string) => void;
}

export default EditorInput;
