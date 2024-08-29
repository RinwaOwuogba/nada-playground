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
    code: "",
    inputs: [{ name: "test_variable", type: "SecretInteger", value: "10" }],
    isProgramExecuting: false,
    setInputValue: jest.fn(),
    executeProgram: mockExecuteProgram,
  };

  test("renders input table correctly with value", () => {
    render(<EditorInput {...defaultProps} />);
    const inputRows = screen.getAllByRole("row").slice(1); // account for header row
    expect(inputRows.length).toBe(1);

    const row = inputRows[0];
    const nameCell = within(row).getByText("test_variable");
    const typeCell = within(row).getByText("SecretInteger");
    const valueInput = within(row).getByRole("textbox");

    expect(nameCell).toBeInTheDocument();
    expect(typeCell).toBeInTheDocument();
    expect(valueInput).toHaveValue("10");
  });

  test("handles multiple inputs with values", () => {
    const multipleInputs: INadaInput[] = inputTypes.map((type, index) => ({
      name: `var${index + 1}`,
      type,
      value: `${index + 1}`,
    }));

    render(<EditorInput {...defaultProps} inputs={multipleInputs} />);

    const inputRows = screen.getAllByRole("row").slice(1); // account for header row
    expect(inputRows.length).toBe(inputTypes.length);

    inputTypes.forEach((type, index) => {
      const row = inputRows[index];
      const nameCell = within(row).getByText(`var${index + 1}`);
      const typeCell = within(row).getByText(type);
      const valueInput = within(row).getByRole("textbox");

      expect(nameCell).toBeInTheDocument();
      expect(typeCell).toBeInTheDocument();
      expect(valueInput).toHaveValue(`${index + 1}`);
    });
  });

  describe("Run button", () => {
    const mockExecuteProgram = jest.fn();
    const defaultProps = {
      code: "",
      inputs: [],
      isProgramExecuting: false,
      setInputValue: jest.fn(),
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
