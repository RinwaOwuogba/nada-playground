import { Table, Thead, Tbody, Tr, Th, Td, Box, Button } from "@chakra-ui/react";
import { INadaInput } from "../../hooks/useNadaInput";
import { Input } from "@chakra-ui/react";

const EditorInput = ({
  code,
  inputs,
  isProgramExecuting,
  executeProgram,
  setInputValue,
}: IEditorInputProps) => {
  return (
    <Box>
      <Table colorScheme="blue" size="sm" marginBottom={4}>
        <Thead>
          <Tr>
            <Th>Input Name</Th>
            <Th>Data Type</Th>
            <Th>Value</Th>
          </Tr>
        </Thead>
        <Tbody>
          {inputs.map((input) => (
            <Tr key={input.name}>
              <Td>{input.name}</Td>
              <Td>{input.type}</Td>
              <Td>
                <Input
                  value={input.value}
                  onChange={(e) => setInputValue(input.name, e.target.value)}
                  size="sm"
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Button
        size={"lg"}
        colorScheme="blue"
        isLoading={isProgramExecuting}
        onClick={() => executeProgram(inputs, code)}
        disabled={isProgramExecuting}
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
  setInputValue: (id: string, value: string) => void;
}

export default EditorInput;
