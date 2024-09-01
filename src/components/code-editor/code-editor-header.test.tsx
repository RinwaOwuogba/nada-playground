import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CodeEditorHeader from "./code-editor-header";
import examplePrograms from "@/lib/example-programs";

describe("CodeEditorHeader", () => {
  const mockResetPlayground = jest.fn();
  const mockLoadProgram = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component correctly", () => {
    render(
      <CodeEditorHeader
        resetPlayground={mockResetPlayground}
        loadProgram={mockLoadProgram}
      />
    );

    expect(screen.getByText("Editor")).toBeInTheDocument();
    expect(screen.getByText("View Examples")).toBeInTheDocument();
    expect(screen.getByText("Reset")).toBeInTheDocument();
  });

  it('opens the example programs modal when "View Examples" button is clicked', async () => {
    render(
      <CodeEditorHeader
        resetPlayground={mockResetPlayground}
        loadProgram={mockLoadProgram}
      />
    );

    fireEvent.click(screen.getByText("View Examples"));

    await waitFor(() => {
      expect(screen.getByText("Example Programs")).toBeInTheDocument();
      examplePrograms.forEach((example) => {
        expect(screen.getByText(example.name)).toBeInTheDocument();
      });
    });
  });

  it("loads an example program and closes the modal when an example is clicked", async () => {
    render(
      <CodeEditorHeader
        resetPlayground={mockResetPlayground}
        loadProgram={mockLoadProgram}
      />
    );

    fireEvent.click(screen.getByText("View Examples"));

    await waitFor(() => {
      expect(screen.getByText("Example Programs")).toBeInTheDocument();
    });

    const firstExampleButton = screen.getByText(examplePrograms[0].name);
    fireEvent.click(firstExampleButton);

    expect(mockLoadProgram).toHaveBeenCalledWith(
      examplePrograms[0].code,
      examplePrograms[0].inputs
    );

    await waitFor(() => {
      expect(screen.queryByText("Example Programs")).not.toBeInTheDocument();
    });
  });

  it("calls the reset function when the Reset button is clicked", () => {
    render(
      <CodeEditorHeader
        resetPlayground={mockResetPlayground}
        loadProgram={mockLoadProgram}
      />
    );

    fireEvent.click(screen.getByText("Reset"));

    expect(mockResetPlayground).toHaveBeenCalledTimes(1);
  });

  it("closes the modal when the Close button is clicked", async () => {
    render(
      <CodeEditorHeader
        resetPlayground={mockResetPlayground}
        loadProgram={mockLoadProgram}
      />
    );

    fireEvent.click(screen.getByText("View Examples"));

    await waitFor(() => {
      expect(screen.getByText("Example Programs")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Close"));

    await waitFor(() => {
      expect(screen.queryByText("Example Programs")).not.toBeInTheDocument();
    });
  });
});
