import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { INadaInput } from "../../hooks/useNadaInput/utils";
import ManualEditorInput from "./manual-editor-input";

describe("ManualEditorInput", () => {
  const mockAddInput = jest.fn();
  const mockRemoveInput = jest.fn();
  let inputs: INadaInput[];

  const getInputPropertySetter =
    (key: string) => (id: string, value: string) => {
      inputs = inputs.map((input) =>
        input.id === id ? { ...input, [key]: value } : input
      );
    };

  const defaultProps = {
    inputs: [],
    addInput: mockAddInput,
    removeInput: mockRemoveInput,
    getInputPropertySetter,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    inputs = [];
  });

  it("renders empty table when no inputs are provided", () => {
    render(<ManualEditorInput {...defaultProps} />);
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(
      screen.queryByRole("row", { name: /input/i })
    ).not.toBeInTheDocument();
  });

  it("renders inputs correctly", () => {
    inputs = [
      { id: "1", name: "input1", type: "SecretInteger", value: "42" },
      { id: "2", name: "input2", type: "PublicBoolean", value: "true" },
    ];
    render(
      <ManualEditorInput
        {...defaultProps}
        inputs={inputs}
        getInputPropertySetter={getInputPropertySetter}
      />
    );

    inputs.forEach((input) => {
      expect(screen.getByDisplayValue(input.name)).toBeInTheDocument();
      expect(screen.getByDisplayValue(input.type)).toBeInTheDocument();
      expect(screen.getByDisplayValue(input.value)).toBeInTheDocument();
    });
  });

  it("updates input name when changed", () => {
    inputs = [{ id: "1", name: "input1", type: "SecretInteger", value: "42" }];
    const { rerender } = render(
      <ManualEditorInput
        {...defaultProps}
        inputs={inputs}
        getInputPropertySetter={getInputPropertySetter}
      />
    );

    const nameInput = screen.getByDisplayValue("input1");
    fireEvent.change(nameInput, { target: { value: "newName" } });

    // Re-render the component with updated inputs
    rerender(
      <ManualEditorInput
        {...defaultProps}
        inputs={inputs}
        getInputPropertySetter={getInputPropertySetter}
      />
    );

    expect(screen.getByDisplayValue("newName")).toBeInTheDocument();
  });

  it("updates input type when changed", () => {
    inputs = [{ id: "1", name: "input1", type: "SecretInteger", value: "42" }];
    const { rerender } = render(
      <ManualEditorInput
        {...defaultProps}
        inputs={inputs}
        getInputPropertySetter={getInputPropertySetter}
      />
    );

    const typeSelect = screen.getByDisplayValue("SecretInteger");
    fireEvent.change(typeSelect, { target: { value: "PublicInteger" } });

    // Re-render the component with updated inputs
    rerender(
      <ManualEditorInput
        {...defaultProps}
        inputs={inputs}
        getInputPropertySetter={getInputPropertySetter}
      />
    );

    expect(screen.getByDisplayValue("PublicInteger")).toBeInTheDocument();
  });

  it("updates input value when changed", async () => {
    inputs = [{ id: "1", name: "input1", type: "SecretInteger", value: "42" }];
    const { rerender } = render(
      <ManualEditorInput
        {...defaultProps}
        inputs={inputs}
        getInputPropertySetter={getInputPropertySetter}
      />
    );

    const valueInput = screen.getByDisplayValue("42");
    fireEvent.change(valueInput, { target: { value: "100" } });

    // Re-render the component with updated inputs
    rerender(
      <ManualEditorInput
        {...defaultProps}
        inputs={inputs}
        getInputPropertySetter={getInputPropertySetter}
      />
    );

    expect(screen.getByDisplayValue("100")).toBeInTheDocument();
  });

  it('removes an input from the table when the "Remove" button is clicked', () => {
    inputs = [
      { id: "1", name: "input1", type: "SecretInteger", value: "42" },
      { id: "2", name: "input2", type: "PublicBoolean", value: "true" },
    ];
    const { rerender } = render(
      <ManualEditorInput
        {...defaultProps}
        inputs={inputs}
        getInputPropertySetter={getInputPropertySetter}
      />
    );

    const removeButtons = screen.getAllByRole("button", {
      name: /remove input/i,
    });
    expect(removeButtons).toHaveLength(2);

    fireEvent.click(removeButtons[0]);

    expect(mockRemoveInput).toHaveBeenCalledTimes(1);
    expect(mockRemoveInput).toHaveBeenCalledWith("1");

    // Simulate the removal of the input
    inputs = inputs.slice(1);
    rerender(
      <ManualEditorInput
        {...defaultProps}
        inputs={inputs}
        getInputPropertySetter={getInputPropertySetter}
      />
    );

    // Check if a row is removed from the table
    const tableRows = screen.getAllByRole("row");
    expect(tableRows.length).toBe(2); // 1 header row + 1 input row

    // Check that the correct input remains and the removed input is gone
    expect(screen.getByDisplayValue("input2")).toBeInTheDocument();
    expect(screen.queryByDisplayValue("input1")).not.toBeInTheDocument();
  });

  it("renders all input type options in the select", () => {
    inputs = [{ id: "1", name: "input1", type: "SecretInteger", value: "42" }];
    render(
      <ManualEditorInput
        {...defaultProps}
        inputs={inputs}
        getInputPropertySetter={getInputPropertySetter}
      />
    );

    const typeSelect = screen.getByDisplayValue("SecretInteger");
    const options = Array.from(typeSelect.getElementsByTagName("option"));

    const expectedTypes = [
      "", // placeholder option
      "SecretInteger",
      "PublicInteger",
      "Integer",
      "SecretUnsignedInteger",
      "PublicUnsignedInteger",
      "UnsignedInteger",
      "SecretBoolean",
      "PublicBoolean",
    ];

    expect(options.map((option) => option.value)).toEqual(expectedTypes);
  });

  it("handles multiple inputs correctly", () => {
    inputs = [
      { id: "1", name: "input1", type: "SecretInteger", value: "42" },
      { id: "2", name: "input2", type: "PublicBoolean", value: "true" },
      { id: "3", name: "input3", type: "UnsignedInteger", value: "100" },
    ];
    render(
      <ManualEditorInput
        {...defaultProps}
        inputs={inputs}
        getInputPropertySetter={getInputPropertySetter}
      />
    );

    inputs.forEach((input) => {
      expect(screen.getByDisplayValue(input.name)).toBeInTheDocument();
      expect(screen.getByDisplayValue(input.type)).toBeInTheDocument();
      expect(screen.getByDisplayValue(input.value)).toBeInTheDocument();
    });
  });
});
