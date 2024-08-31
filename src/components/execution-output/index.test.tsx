import { render, screen } from "@testing-library/react";
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

    const outputContainer = screen.getByRole("logs");
    const outputText = outputContainer.textContent;

    executionResult.forEach(({ name, value }) => {
      const escapeRegExp = (string: string) =>
        string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      expect(
        new RegExp(`${escapeRegExp(name)}.*${escapeRegExp(value)}`).test(
          outputText ?? ""
        )
      ).toBeTruthy();
    });
  });
});
