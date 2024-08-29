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
    <div>
      <table>
        <thead>
          <tr>
            <th>Input Name</th>
            <th>Data Type</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {inputs.map((input) => (
            <tr key={input.name}>
              <td>{input.name}</td>
              <td>{input.type}</td>
              <td>
                <Input
                  value={input.value}
                  onChange={(e) => setInputValue(input.name, e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={() => executeProgram(inputs, code)}
        disabled={isProgramExecuting}
      >
        Run
      </button>
    </div>
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
