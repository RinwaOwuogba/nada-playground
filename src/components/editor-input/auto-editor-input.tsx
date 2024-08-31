import React, { useCallback } from "react";
import { Table, Thead, Tbody, Tr, Th, Td, Input } from "@chakra-ui/react";
import { INadaInput } from "@/hooks/useNadaInput";

interface IAutoEditorInputProps {
  inputs: INadaInput[];
  getInputPropertySetter: (
    key: string
  ) => (name: string, value: string) => void;
}

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
        {inputs.map((input) => (
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
        ))}
      </Tbody>
    </Table>
  );
};

export default AutoEditorInput;
