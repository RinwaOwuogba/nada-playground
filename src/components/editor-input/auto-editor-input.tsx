import React, { useCallback } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Text,
  Flex,
} from "@chakra-ui/react";
import { INadaInput } from "@/hooks/useNadaInput";

const AutoEditorInput: React.FC<IAutoEditorInputProps> = ({
  inputs,
  getInputPropertySetter,
}) => {
  const setInputValue = useCallback(
    (name: string, value: string) => {
      getInputPropertySetter("name")(name, value);
    },
    [getInputPropertySetter]
  );

  return (
    <Table variant="simple" size="sm">
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Type</Th>
          <Th>Value</Th>
        </Tr>
      </Thead>
      <Tbody>
        {inputs.length === 0 ? (
          <NoInputsRow colSpan={3} />
        ) : (
          inputs.map((input) => (
            <InputRow
              key={input.name}
              input={input}
              setInputValue={setInputValue}
            />
          ))
        )}
      </Tbody>
    </Table>
  );
};

const NoInputsRow: React.FC<INoInputsRowProps> = ({ colSpan }) => (
  <Tr>
    <Td colSpan={colSpan}>
      <Flex
        direction="column"
        textAlign="center"
        gap={2}
        py={4}
        color="gray.500"
      >
        <Text fontSize="md" fontWeight="semibold">
          No inputs available
        </Text>
        <Text fontSize="smaller">
          Add inputs to the editor to see them here.
        </Text>
      </Flex>
    </Td>
  </Tr>
);

const InputRow: React.FC<IInputRowProps> = ({ input, setInputValue }) => (
  <Tr key={input.name}>
    <Td>{input.name}</Td>
    <Td>{input.type}</Td>
    <Td>
      <Input
        value={input.value}
        onChange={(e) => setInputValue(input.name, e.target.value)}
      />
    </Td>
  </Tr>
);

interface IAutoEditorInputProps {
  inputs: INadaInput[];
  getInputPropertySetter: (
    key: string
  ) => (name: string, value: string) => void;
}

interface INoInputsRowProps {
  colSpan: number;
}

interface IInputRowProps {
  input: INadaInput;
  setInputValue: (name: string, value: string) => void;
}

export default AutoEditorInput;
