import { render, screen, within, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import EditorInput from "./index";

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

const generateTestCode = (inputType: string, variableName: string) => `
from nada_audit import *

def nada_main():
  party1 = Party(name="Party1")
  ${variableName} = ${inputType}(Input("${variableName}", party1))
  return [Output(${variableName}, "my_output", party1)]
`;

describe("EditorInput", () => {
  const defaultProps = {
    code: generateTestCode("SecretInteger", "test_variable"),
    isProgramExecuting: false,
    executeProgram: () => {},
  };

  test.each(inputTypes)("shows input name and type for %s", (inputType) => {
    const variableName = `test_${inputType.toLowerCase()}`;
    const code = generateTestCode(inputType, variableName);

    render(<EditorInput {...defaultProps} code={code} />);

    const inputRows = screen.getAllByRole("row").slice(1); // account for header row
    expect(inputRows.length).toBe(1);

    const row = inputRows[0];
    const nameCell = within(row).getByText(variableName);
    const typeCell = within(row).getByText(inputType);

    expect(nameCell).toBeInTheDocument();
    expect(typeCell).toBeInTheDocument();
  });

  test("handles multiple inputs", () => {
    const code = inputTypes
      .map((type, index) => generateTestCode(type, `var${index + 1}`))
      .join("\n");

    render(<EditorInput {...defaultProps} code={code} />);

    const inputRows = screen.getAllByRole("row").slice(1); // account for header row
    expect(inputRows.length).toBe(inputTypes.length);

    inputTypes.forEach((type, index) => {
      const row = inputRows[index];
      const nameCell = within(row).getByText(`var${index + 1}`);
      const typeCell = within(row).getByText(type);

      expect(nameCell).toBeInTheDocument();
      expect(typeCell).toBeInTheDocument();
    });
  });

  describe("Run button", () => {
    const mockExecuteProgram = jest.fn();
    const defaultProps = {
      code: generateTestCode("SecretInteger", "test_variable"),
      isProgramExecuting: false,
      executeProgram: mockExecuteProgram,
    };

    test("should be enabled when isProgramExecuting is false", () => {
      render(<EditorInput {...defaultProps} />);
      const runButton = screen.getByRole("button", { name: /run/i });
      expect(runButton).toBeEnabled();
    });

    test("should be disabled when isProgramExecuting is true", () => {
      render(<EditorInput {...defaultProps} isProgramExecuting={true} />);
      const runButton = screen.getByRole("button", { name: /run/i });
      expect(runButton).toBeDisabled();
    });

    test("should trigger executeProgram function when clicked", () => {
      render(<EditorInput {...defaultProps} />);
      const runButton = screen.getByRole("button", { name: /run/i });
      fireEvent.click(runButton);
      expect(mockExecuteProgram).toHaveBeenCalledTimes(1);
    });
  });
});
