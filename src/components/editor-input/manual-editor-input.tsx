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
  IconButton,
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
          {inputs.map((input) => (
            <Tr key={input.id}>
              <Td>
                <Input
                  size="sm"
                  value={input.name}
                  onChange={(e) =>
                    setInputValue("name", input.id ?? "", e.target.value)
                  }
                  placeholder="Input name"
                />
              </Td>
              <Td>
                <Select
                  size="sm"
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
                  size="sm"
                  value={input.value}
                  onChange={(e) =>
                    setInputValue("value", input.id ?? "", e.target.value)
                  }
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
          ))}
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

interface IManualEditorInputProps {
  inputs: INadaInput[];
  getInputPropertySetter: (
    key: string
  ) => (name: string, value: string) => void;
  removeInput: (id: string) => void;
}

export default ManualEditorInput;
