import { render, screen, within, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import EditorInput from "./index";
import { INadaInput } from "../../hooks/useNadaInput";

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

describe("EditorInput", () => {
  const mockExecuteProgram = jest.fn();
  const defaultProps = {
    inputs: [{ name: "test_variable", type: "SecretInteger" }],
    isProgramExecuting: false,
    executeProgram: mockExecuteProgram,
  };

  test("renders input table correctly", () => {
    render(<EditorInput {...defaultProps} />);
    const inputRows = screen.getAllByRole("row").slice(1); // account for header row
    expect(inputRows.length).toBe(1);

    const row = inputRows[0];
    const nameCell = within(row).getByText("test_variable");
    const typeCell = within(row).getByText("SecretInteger");

    expect(nameCell).toBeInTheDocument();
    expect(typeCell).toBeInTheDocument();
  });

  test("handles multiple inputs", () => {
    const multipleInputs: INadaInput[] = inputTypes.map((type, index) => ({
      name: `var${index + 1}`,
      type,
    }));

    render(<EditorInput {...defaultProps} inputs={multipleInputs} />);

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
      code: "",
      inputs: [],
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
