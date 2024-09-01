import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { INadaInput } from "../../hooks/useNadaInput";
import AutoEditorInput from "./auto-editor-input";

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

describe("AutoEditorInput", () => {
  const mockExecuteProgram = jest.fn();
  const defaultProps = {
    code: "",
    inputs: [{ name: "test_variable", type: "SecretInteger", value: "10" }],
    isProgramExecuting: false,
    getInputPropertySetter: jest.fn(),
    executeProgram: mockExecuteProgram,
  };

  test("renders input table correctly with value", () => {
    render(<AutoEditorInput {...defaultProps} />);
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

    render(<AutoEditorInput {...defaultProps} inputs={multipleInputs} />);

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

  it("renders empty table when no inputs are provided", () => {
    render(<AutoEditorInput {...defaultProps} inputs={[]} />);
    expect(screen.getByText("No inputs available")).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(2);
  });
});
