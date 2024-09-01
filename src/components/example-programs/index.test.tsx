import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ExamplePrograms, { IExampleProgram } from "./index";

const mockExamples: IExampleProgram[] = [
  {
    name: "Example 1",
    description: "This is example 1",
    code: 'def example1():\n    return "Hello, World!"',
    inputs: [{ id: "1", name: "input1", type: "String", value: "Test" }],
  },
  {
    name: "Example 2",
    description: "This is example 2",
    code: "def example2(x, y):\n    return x + y",
    inputs: [
      { id: "2", name: "x", type: "Integer", value: "5" },
      { id: "3", name: "y", type: "Integer", value: "3" },
    ],
  },
];

const mockLoadProgram = jest.fn();
const mockOnClose = jest.fn();

describe("ExamplePrograms", () => {
  beforeEach(() => {
    render(
      <ExamplePrograms
        isOpen={true}
        onClose={mockOnClose}
        examples={mockExamples}
        loadProgram={mockLoadProgram}
      />
    );
  });

  it("displays the list of examples", () => {
    mockExamples.forEach((example) => {
      expect(screen.getByText(example.name)).toBeInTheDocument();
    });
  });

  it("calls loadProgram when an example is clicked", async () => {
    const exampleItem = screen.getByText("Example 1");
    fireEvent.click(exampleItem);

    await waitFor(() => {
      expect(mockLoadProgram).toHaveBeenCalledWith(
        mockExamples[0].code,
        mockExamples[0].inputs
      );
    });
  });

  it("closes the modal when the Close button is clicked", () => {
    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });
});
