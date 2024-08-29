import { act, renderHook } from "@testing-library/react";
import { useNadaInput } from "./index";

describe("useNadaInput", () => {
  it("extracts inputs correctly", () => {
    const code = `
      from nada_dsl import *
      
      def nada_main():
          num_1 = SecretInteger(Input(name="num_1"))
          num_2 = PublicInteger(Input(name="num_2"))
          bool_1 = SecretBoolean(Input("bool_1"))
          return [num_1, num_2, bool_1]
    `;

    const { result } = renderHook(() => useNadaInput(code));

    expect(result.current.inputs).toHaveLength(3);

    expect(
      result.current.inputs.map(({ name, type }) => ({ name, type }))
    ).toEqual([
      { name: "num_1", type: "SecretInteger" },
      { name: "num_2", type: "PublicInteger" },
      { name: "bool_1", type: "SecretBoolean" },
    ]);
  });

  it("should handle empty code", () => {
    const { result } = renderHook(() => useNadaInput(""));

    expect(result.current.inputs).toEqual([]);
  });

  it("should handle code without inputs", () => {
    const testCode = `
      from nada_dsl import *

      def nada_main():
          return []
    `;

    const { result } = renderHook(() => useNadaInput(testCode));

    expect(result.current.inputs).toEqual([]);
  });

  it("ignores non-Input declarations", () => {
    const code = `
      from nada_dsl import *
      
      def nada_main():
          num_1 = SecretInteger(5)
          num_2 = PublicInteger(Input(name="num_2"))
          return [num_1, num_2]
    `;

    const { result } = renderHook(() => useNadaInput(code));

    expect(result.current.inputs).toHaveLength(1);
    expect(result.current.inputs[0].name).toBe("num_2");
    expect(result.current.inputs[0].type).toBe("PublicInteger");
  });

  it("exposes a function to set the value of an input", () => {
    const code = `
      from nada_dsl import *
      
      def nada_main():
          num_1 = SecretInteger(Input(name="num_1"))
          return [num_1]
    `;

    const { result } = renderHook(() => useNadaInput(code));

    expect(result.current.inputs).toHaveLength(1);
    const inputName = result.current.inputs[0].name;

    act(() => {
      result.current.setInputValue(inputName, "42");
    });

    expect(result.current.inputs[0].value).toBe("42");
  });

  it("should handle all supported input types", () => {
    const inputTypes = [
      "SecretInteger",
      "PublicInteger",
      "Integer",
      "SecretUnsignedInteger",
      "PublicUnsignedInteger",
      "UnsignedInteger",
      "SecretBoolean",
      "PublicBoolean",
    ];

    const generateTestCode = (inputType: string, variableName: string) => `
      from nada_audit import *

      def nada_main():
        party1 = Party(name="Party1")
        ${variableName} = ${inputType}(Input("${variableName}", party1))
        return [Output(${variableName}, "my_output", party1)]
    `;

    const code = inputTypes
      .map((type, index) => generateTestCode(type, `var${index + 1}`))
      .join("\n");

    const { result } = renderHook(() => useNadaInput(code));

    expect(
      result.current.inputs.map(({ name, type }) => ({ name, type }))
    ).toEqual(
      inputTypes.map((type, index) => ({
        name: `var${index + 1}`,
        type: type,
      }))
    );
  });

  it("preserves input values when new inputs are added", () => {
    const initialCode = `
      from nada_dsl import *
      
      def nada_main():
          num_1 = SecretInteger(Input(name="num_1"))
          return [num_1]
    `;

    const { result, rerender } = renderHook(({ code }) => useNadaInput(code), {
      initialProps: { code: initialCode },
    });

    // Set initial value
    act(() => {
      result.current.setInputValue(result.current.inputs[0].name, "42");
    });

    expect(result.current.inputs[0].value).toBe("42");

    // Add a new input
    const updatedCode = `
      from nada_dsl import *
      
      def nada_main():
          num_1 = SecretInteger(Input(name="num_1"))
          num_2 = PublicInteger(Input(name="num_2"))
          return [num_1, num_2]
    `;

    rerender({ code: updatedCode });

    // Check that the original input value is preserved and the new input is added
    expect(result.current.inputs).toHaveLength(2);
    expect(result.current.inputs[0].name).toBe("num_1");
    expect(result.current.inputs[0].value).toBe("42");
    expect(result.current.inputs[1].name).toBe("num_2");
    expect(result.current.inputs[1].value).toBe("");
  });

  it("should not create duplicate inputs for the same name", () => {
    const code = `
      from nada_dsl import *
      
      def nada_main():
          num_1 = SecretInteger(Input(name="num_1"))
          num_1_duplicate = SecretInteger(Input(name="num_1"))
          return [num_1, num_1_duplicate]
    `;

    const { result } = renderHook(() => useNadaInput(code));

    expect(result.current.inputs).toHaveLength(1);
    expect(result.current.inputs[0].name).toBe("num_1");
    expect(result.current.inputs[0].type).toBe("SecretInteger");
  });

  it("should update input type when it changes in the code", () => {
    const initialCode = `
      from nada_dsl import *
      
      def nada_main():
          num_1 = SecretInteger(Input(name="num_1"))
          return [num_1]
    `;

    const { result, rerender } = renderHook(({ code }) => useNadaInput(code), {
      initialProps: { code: initialCode },
    });

    expect(result.current.inputs).toHaveLength(1);
    expect(result.current.inputs[0].name).toBe("num_1");
    expect(result.current.inputs[0].type).toBe("SecretInteger");

    // Change the type of num_1
    const updatedCode = `
      from nada_dsl import *
      
      def nada_main():
          num_1 = PublicInteger(Input(name="num_1"))
          return [num_1]
    `;

    rerender({ code: updatedCode });

    expect(result.current.inputs).toHaveLength(1);
    expect(result.current.inputs[0].name).toBe("num_1");
    expect(result.current.inputs[0].type).toBe("PublicInteger");
  });
});
