import { Button, Flex, Text, useDisclosure } from "@chakra-ui/react";
import ExamplePrograms from "../example-programs";
import examplePrograms from "@/lib/example-programs";
import { INadaInput } from "@/hooks/useNadaInput";
// import StoreProgram from "../store-program";

const CodeEditorHeader = ({
  // inputs,
  // code,
  resetPlayground,
  loadProgram,
}: ICodeEditorHeaderProps) => {
  const {
    isOpen: isExampleProgramsOpen,
    onOpen: openExamplePrograms,
    onClose: closeExamplePrograms,
  } = useDisclosure();
  // const {
  //   isOpen: isStoreProgramOpen,
  //   onOpen: openStoreProgram,
  //   onClose: closeStoreProgram,
  // } = useDisclosure();

  return (
    <>
      <Flex alignItems="center" justifyContent="space-between">
        <Text fontWeight="bold" color="gray.400">
          Editor
        </Text>

        <Flex gap={2} alignItems="center">
          {/* <Button
            size="sm"
            variant="ghost"
            colorScheme="blue"
            onClick={openStoreProgram}
          >
            Store Program
          </Button> */}
          <Button
            size="sm"
            variant="ghost"
            colorScheme="blue"
            onClick={openExamplePrograms}
          >
            View Examples
          </Button>
          <Button
            size="sm"
            variant="ghost"
            colorScheme="blue"
            onClick={resetPlayground}
          >
            Reset
          </Button>
        </Flex>
      </Flex>

      <ExamplePrograms
        isOpen={isExampleProgramsOpen}
        onClose={closeExamplePrograms}
        examples={examplePrograms}
        loadProgram={loadProgram}
      />
      {/* <StoreProgram
        isOpen={isStoreProgramOpen}
        onClose={closeStoreProgram}
        inputs={inputs}
        code={code}
      /> */}
    </>
  );
};

interface ICodeEditorHeaderProps {
  resetPlayground: () => void;
  loadProgram: (code: string, inputs: INadaInput[]) => void;
  inputs: INadaInput[];
  code: string;
}

export default CodeEditorHeader;
