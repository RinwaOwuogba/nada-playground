import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import { useMemo } from "react";

const EditorInput = ({ code }: IEditorInputProps) => {
  const inputs = useMemo(() => {
    const pattern =
      /(\w+)\s*=\s*(SecretInteger|PublicInteger|Integer|SecretUnsignedInteger|PublicUnsignedInteger|UnsignedInteger|SecretBoolean|PublicBoolean)\(Input\(\s*(?:name\s*=\s*)?["']([^"']+)["'][\s\S]*?\)\)/g;
    const matches = code.matchAll(pattern);
    const result = [];
    for (const match of matches) {
      result.push({ name: match[3], type: match[2] });
    }
    return result;
  }, [code]);

  return (
    <TableContainer>
      <Table variant="simple">
        {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
        <Thead>
          <Tr>
            <Th>Input Name</Th>
            <Th>Data Type</Th>
            <Th>Value</Th>
          </Tr>
        </Thead>
        <Tbody>
          {inputs.map((input, index) => (
            <Tr key={index}>
              <Td>{input.name}</Td>
              <Td>{input.type}</Td>
              {/* <Td>{input.value}</Td> */}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

interface IEditorInputProps {
  code: string;
}

export default EditorInput;
