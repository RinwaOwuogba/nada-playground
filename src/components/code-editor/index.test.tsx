import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CodeEditor from "./index";
import constants from "@/constants";

test("allows users type code", async () => {
  let code = "";
  const setCode = (newCode: string) => {
    code = newCode;
  };

  render(
    <CodeEditor
      code={code}
      setCode={setCode}
      placeholder={constants.EDITOR_PLACEHOLDER_TEXT}
    />
  );

  const codeInput = screen.getByRole("textbox");

  fireEvent.change(codeInput, { target: { textContent: "hello world" } });
  expect(screen.getByText("hello world")).toBeTruthy();
});
