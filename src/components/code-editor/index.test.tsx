import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
// import { tags as t } from "@lezer/highlight";
// import createTheme from "@uiw/codemirror-themes";
import constants from "@/constants";

import CodeEditor from "./index";

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
