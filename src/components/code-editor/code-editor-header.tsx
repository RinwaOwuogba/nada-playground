import { Button, Flex, Text, useDisclosure } from "@chakra-ui/react";
import ExamplePrograms from "../example-programs";
import examplePrograms from "@/lib/example-programs";
import { INadaInput } from "@/hooks/useNadaInput";

const CodeEditorHeader = ({
  resetPlayground,
  loadProgram,
}: ICodeEditorHeaderProps) => {
  const {
    isOpen: isExampleProgramsOpen,
    onOpen: openExamplePrograms,
    onClose: closeExamplePrograms,
  } = useDisclosure();

  return (
    <>
      <Flex alignItems="center" justifyContent="space-between">
        <Text fontWeight="bold" color="gray.400">
          Editor
        </Text>

        <Flex gap={2} alignItems="center">
          <Button
            size="sm"
            variant="ghost"
            colorScheme="blue"
            alignSelf="flex-end"
            onClick={openExamplePrograms}
          >
            View Examples
          </Button>
          <Button
            size="sm"
            variant="ghost"
            colorScheme="blue"
            alignSelf="flex-end"
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
    </>
  );
};

interface ICodeEditorHeaderProps {
  resetPlayground: () => void;
  loadProgram: (code: string, inputs: INadaInput[]) => void;
}

export default CodeEditorHeader;
