import React, { useCallback } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Select,
  Th,
  Td,
  Input,
  IconButton,
  Text,
  Flex,
} from "@chakra-ui/react";
import { INadaInput } from "@/hooks/useNadaInput";
import { MinusIcon } from "@chakra-ui/icons";

const ManualEditorInput: React.FC<IManualEditorInputProps> = ({
  inputs,
  getInputPropertySetter,
  removeInput,
}) => {
  const setInputValue = useCallback(
    (key: string, name: string, value: string) => {
      getInputPropertySetter(key)(name, value);
    },
    [getInputPropertySetter]
  );

  return (
    <>
      <Table variant="simple" size="sm" overflowY={"auto"}>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Type</Th>
            <Th>Value</Th>
          </Tr>
        </Thead>
        <Tbody>
          {inputs.length === 0 ? (
            <NoInputsRow />
          ) : (
            inputs.map((input) => (
              <InputRow
                key={input.id}
                input={input}
                setInputValue={setInputValue}
                removeInput={removeInput}
              />
            ))
          )}
        </Tbody>
      </Table>
    </>
  );
};

const inputTypes = [
  "SecretInteger",
  "PublicInteger",
  "Integer",
  "SecretUnsignedInteger",
  "PublicUnsignedInteger",
  "UnsignedInteger",
  "SecretBoolean",
  "PublicBoolean",
];

const NoInputsRow: React.FC = () => (
  <Tr>
    <Td colSpan={4}>
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
          Click the "Add Input" button to create a new input.
        </Text>
      </Flex>
    </Td>
  </Tr>
);

const InputRow: React.FC<IInputRowProps> = ({
  input,
  setInputValue,
  removeInput,
}) => (
  <Tr>
    <Td>
      <Input
        size="sm"
        value={input.name}
        onChange={(e) => setInputValue("name", input.id ?? "", e.target.value)}
        placeholder="Input name"
      />
    </Td>
    <Td>
      <Select
        size="sm"
        value={input.type}
        onChange={(e) => setInputValue("type", input.id ?? "", e.target.value)}
      >
        <option hidden disabled value="">
          Select type
        </option>
        {inputTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </Select>
    </Td>
    <Td>
      <Input
        size="sm"
        value={input.value}
        onChange={(e) => setInputValue("value", input.id ?? "", e.target.value)}
        placeholder="Input value"
      />
    </Td>
    <Td>
      <IconButton
        colorScheme="red"
        size="sm"
        aria-label="Remove input"
        icon={<MinusIcon />}
        onClick={() => removeInput(input.id ?? "")}
      />
    </Td>
  </Tr>
);

interface IManualEditorInputProps {
  inputs: INadaInput[];
  getInputPropertySetter: (
    key: string
  ) => (name: string, value: string) => void;
  removeInput: (id: string) => void;
}

interface IInputRowProps {
  input: INadaInput;
  setInputValue: (key: string, name: string, value: string) => void;
  removeInput: (id: string) => void;
}

export default ManualEditorInput;
