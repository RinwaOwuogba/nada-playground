import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CodeEditor from "./index";
import constants from "../../constants";

test("allows users to type code", () => {
  let code = "";
  const setCode = (newCode: string) => {
    code = newCode;
  };

  render(<CodeEditor code={code} setCode={setCode} />);

  const codeInput = screen.getByPlaceholderText(
    constants.EDITOR_PLACEHOLDER_TEXT
  );

  fireEvent.change(codeInput, {
    target: { value: "hello world" },
  });

  expect(codeInput.textContent).toBe("hello world");
});
