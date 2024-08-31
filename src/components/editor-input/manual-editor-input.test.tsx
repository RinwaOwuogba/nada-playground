import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { INadaInput } from "../../hooks/useNadaInput/utils";
import ManualEditorInput from "./manual-editor-input";

describe("ManualEditorInput", () => {
  const mockAddInput = jest.fn();
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

  it('adds a new input to the table when "Add Input" button is clicked', () => {
    inputs = [{ id: "1", name: "input1", type: "SecretInteger", value: "42" }];
    const { rerender } = render(
      <ManualEditorInput
        {...defaultProps}
        inputs={inputs}
        getInputPropertySetter={getInputPropertySetter}
      />
    );

    const addButton = screen.getByRole("button", { name: /add input/i });
    fireEvent.click(addButton);

    expect(mockAddInput).toHaveBeenCalledTimes(1);

    // Simulate the addition of a new input
    inputs = [
      ...inputs,
      { id: "2", name: "", type: "SecretInteger", value: "" },
    ];
    rerender(
      <ManualEditorInput
        {...defaultProps}
        inputs={inputs}
        getInputPropertySetter={getInputPropertySetter}
      />
    );

    // Check if a new row is added to the table
    const tableRows = screen.getAllByRole("row");
    expect(tableRows.length).toBe(3); // 1 header row + 2 input rows

    // Check if the new input fields are rendered
    expect(screen.getAllByPlaceholderText("Input name")).toHaveLength(2);
    expect(screen.getAllByRole("combobox")).toHaveLength(2);
    expect(screen.getAllByPlaceholderText("Input value")).toHaveLength(2);
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
