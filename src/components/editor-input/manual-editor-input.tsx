import React, { useCallback } from "react";
import {
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Select,
  Th,
  Td,
  Input,
} from "@chakra-ui/react";
import { INadaInput } from "@/hooks/useNadaInput";

const ManualEditorInput: React.FC<IManualEditorInputProps> = ({
  inputs,
  getInputPropertySetter,
  addInput,
}) => {
  const setInputValue = useCallback(
    (key: string, name: string, value: string) => {
      getInputPropertySetter(key)(name, value);
    },
    [getInputPropertySetter]
  );

  return (
    <>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Type</Th>
            <Th>Value</Th>
          </Tr>
        </Thead>
        <Tbody>
          {inputs.map((input) => (
            <Tr key={input.id}>
              <Td>
                <Input
                  value={input.name}
                  onChange={(e) =>
                    setInputValue("name", input.id ?? "", e.target.value)
                  }
                  placeholder="Input name"
                />
              </Td>
              <Td>
                <Select
                  value={input.type}
                  onChange={(e) =>
                    setInputValue("type", input.id ?? "", e.target.value)
                  }
                >
                  {inputTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Select>
              </Td>
              <Td>
                <Input
                  value={input.value}
                  onChange={(e) =>
                    setInputValue("value", input.id ?? "", e.target.value)
                  }
                  placeholder="Input value"
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Button name="add-input" onClick={addInput} mt={4}>
        Add Input
      </Button>
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

interface IManualEditorInputProps {
  inputs: INadaInput[];
  getInputPropertySetter: (
    key: string
  ) => (name: string, value: string) => void;
  addInput: () => void;
}

export default ManualEditorInput;
