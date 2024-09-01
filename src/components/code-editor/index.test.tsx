import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import constants from "@/constants";

import CodeEditor from "./index";
import nadaHighlightExtension, {
  defaultPatterns,
} from "@/lib/nada-highlight-extension";
import { Decoration } from "@codemirror/view";

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
      label="Code Editor"
    />
  );

  const codeInput = screen.getByRole("textbox");

  fireEvent.change(codeInput, { target: { textContent: "hello world" } });
  expect(screen.getByText("hello world")).toBeTruthy();
});

describe("highlights nada DSL syntax", () => {
  let code;
  const setCode = (newCode: string) => {
    code = newCode;
  };

  const datatypeColor = "#3498db";
  const datatypeAttributes = { style: `color: ${datatypeColor};` };

  const functionColor = "#9b59b6";
  const functionAttributes = { style: `color: ${functionColor};` };

  const testMarks = {
    SecretInteger: Decoration.mark({ attributes: datatypeAttributes }),
    PublicInteger: Decoration.mark({ attributes: datatypeAttributes }),
    Integer: Decoration.mark({ attributes: datatypeAttributes }),
    SecretUnsignedInteger: Decoration.mark({ attributes: datatypeAttributes }),
    PublicUnsignedInteger: Decoration.mark({ attributes: datatypeAttributes }),
    UnsignedInteger: Decoration.mark({ attributes: datatypeAttributes }),
    SecretBoolean: Decoration.mark({ attributes: datatypeAttributes }),
    PublicBoolean: Decoration.mark({ attributes: datatypeAttributes }),
    Boolean: Decoration.mark({ attributes: datatypeAttributes }),
    Party: Decoration.mark({ attributes: datatypeAttributes }),
    Output: Decoration.mark({ attributes: datatypeAttributes }),
    function: Decoration.mark({ attributes: functionAttributes }),
  };

  const higherOrderNadaHighlight = () => {
    return nadaHighlightExtension(testMarks, defaultPatterns);
  };

  const renderEditorWithCode = (code: string) => {
    render(
      <CodeEditor
        code={code}
        setCode={setCode}
        placeholder={constants.EDITOR_PLACEHOLDER_TEXT}
        label="Code Editor"
        extensions={[higherOrderNadaHighlight()]}
      />
    );
  };

  const testSnippet = `\
from nada_dsl import *

def nada_main():
    party_bob = Party(name="Bob")
    num_1 = SecretInteger(Input(name="num_1", party=party_bob))
    num_2 = PublicInteger(Input(name="num_2", party=party_bob))
    num_3 = Integer(10)
    unsigned_num_1 = SecretUnsignedInteger(Input(name="unsigned_num_1", party=party_bob))
    unsigned_num_2 = PublicUnsignedInteger(Input(name="unsigned_num_2", party=party_bob))
    unsigned_num_3 = UnsignedInteger(100)
    bool_val_1 = SecretBoolean(True)
    bool_val_2 = PublicBoolean(False)
    bool_val_3 = Boolean(True)
    product = num_1 * num_2
    output_value = Output(product, "product", party_bob)
    return [output_value]
  `;

  test("highlights Nada data types", () => {
    renderEditorWithCode(testSnippet);

    expect(screen.getByText("SecretInteger")).toHaveStyle({
      color: datatypeColor,
    });
    expect(screen.getByText("PublicInteger")).toHaveStyle({
      color: datatypeColor,
    });
    expect(screen.getByText("Integer")).toHaveStyle({ color: datatypeColor });
    expect(screen.getByText("SecretUnsignedInteger")).toHaveStyle({
      color: datatypeColor,
    });
    expect(screen.getByText("PublicUnsignedInteger")).toHaveStyle({
      color: datatypeColor,
    });
    expect(screen.getByText("UnsignedInteger")).toHaveStyle({
      color: datatypeColor,
    });
    expect(screen.getByText("SecretBoolean")).toHaveStyle({
      color: datatypeColor,
    });
    expect(screen.getByText("PublicBoolean")).toHaveStyle({
      color: datatypeColor,
    });
    expect(screen.getByText("Boolean")).toHaveStyle({ color: datatypeColor });
    expect(screen.getByText("Party")).toHaveStyle({ color: datatypeColor });
    expect(screen.getByText("Output")).toHaveStyle({ color: datatypeColor });
  });

  test("highlights Nada functions", () => {
    const functionSnippet = `\
from nada_dsl import *

def nada_main():
    num_1 = SecretInteger(Input(name="num_1"))
    num_2 = PublicInteger(Input(name="num_2"))
    truncated = num_1.trunc_pr(num_2)
    result = truncated.if_else(num_1, num_2)
    revealed = result.reveal()
    equality_check = num_1.public_equals(num_2)
    return [result, revealed, equality_check]
    `;

    renderEditorWithCode(functionSnippet);

    // Test each function and check that the appropriate color is applied
    expect(screen.getByText("trunc_pr")).toHaveStyle({ color: functionColor });
    expect(screen.getByText("if_else")).toHaveStyle({ color: functionColor });
    expect(screen.getByText("reveal")).toHaveStyle({ color: functionColor });
    expect(screen.getByText("public_equals")).toHaveStyle({
      color: functionColor,
    });
  });
});
