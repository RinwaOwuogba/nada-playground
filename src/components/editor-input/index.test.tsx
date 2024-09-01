import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import EditorInput from "./index";

describe("Run button", () => {
  const mockExecuteProgram = jest.fn();
  const mockToggleMode = jest.fn();
  const mockAddInput = jest.fn();
  const defaultProps = {
    code: "",
    inputs: [],
    isProgramExecuting: false,
    getInputPropertySetter: jest.fn(),
    executeProgram: mockExecuteProgram,
    isAutoMode: false,
    toggleMode: mockToggleMode,
    addInput: mockAddInput,
  };

  test("should be enabled when isProgramExecuting is false", () => {
    render(<EditorInput {...defaultProps} />);
    const runButton = screen.getByRole("button", { name: /Run Program/i });
    expect(runButton).toBeEnabled();
  });

  test("should be disabled when isProgramExecuting is true", () => {
    render(<EditorInput {...defaultProps} isProgramExecuting={true} />);
    const runButton = screen.getByRole("button", { name: /Run Program/i });
    expect(runButton).toBeDisabled();
  });

  test("should trigger executeProgram function when clicked", () => {
    render(<EditorInput {...defaultProps} />);
    const runButton = screen.getByRole("button", { name: /Run Program/i });
    fireEvent.click(runButton);
    expect(mockExecuteProgram).toHaveBeenCalledTimes(1);
  });

  describe("Add input button", () => {
    test('should call addInput when "Add Input" button is clicked', () => {
      render(<EditorInput {...defaultProps} />);
      const addButton = screen.getByRole("button", { name: /add input/i });
      fireEvent.click(addButton);
      expect(mockAddInput).toHaveBeenCalledTimes(1);
    });
  });
});
