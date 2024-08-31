import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import ExecutionOutput from "./index";

describe("ExecutionOutput", () => {
  const defaultProps = {
    isProgramExecuting: false,
    executionResult: [],
    loadingMessage: "Custom loading message...",
    defaultMessage: "No execution results yet.",
  };

  test("shows loading message when isProgramExecuting is true", () => {
    render(<ExecutionOutput {...defaultProps} isProgramExecuting={true} />);

    expect(screen.getByText("Custom loading message...")).toBeInTheDocument();
  });

  test("does not show loading message when isProgramExecuting is false", () => {
    render(<ExecutionOutput {...defaultProps} isProgramExecuting={false} />);

    expect(
      screen.queryByText("Custom loading message...")
    ).not.toBeInTheDocument();
  });

  test("shows default message when not executing and no execution result", () => {
    render(<ExecutionOutput {...defaultProps} />);

    expect(screen.getByText("No execution results yet.")).toBeInTheDocument();
  });

  test("displays execution result when execution is completed", () => {
    const executionResult = [
      { name: "output_1", value: "SecretInteger(NadaInt(1))" },
      { name: "output_2", value: "SecretInteger(NadaInt(2))" },
    ];
    render(
      <ExecutionOutput
        {...defaultProps}
        isProgramExecuting={false}
        executionResult={executionResult}
      />
    );

    executionResult.forEach(({ name, value }) => {
      const outputElement = screen.getByText((content) => {
        return content === `${name}: ${value}`;
      });
      expect(outputElement).toBeInTheDocument();
    });

    expect(
      screen.queryByText("No execution results yet.")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Custom loading message...")
    ).not.toBeInTheDocument();
  });

  test("renders ExecutionOutput component", () => {
    render(<ExecutionOutput {...defaultProps} isProgramExecuting={false} />);
  });
});
