import { INadaInput } from "../../hooks/useNadaInput";

interface IEditorInputProps {
  inputs: INadaInput[];
  isProgramExecuting: boolean;
  executeProgram: () => void;
}

const EditorInput = ({
  inputs,
  isProgramExecuting,
  executeProgram,
}: IEditorInputProps) => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Input Name</th>
            <th>Data Type</th>
          </tr>
        </thead>
        <tbody>
          {inputs.map((input, index) => (
            <tr key={index}>
              <td>{input.name}</td>
              <td>{input.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={executeProgram} disabled={isProgramExecuting}>
        Run
      </button>
    </div>
  );
};

export default EditorInput;
