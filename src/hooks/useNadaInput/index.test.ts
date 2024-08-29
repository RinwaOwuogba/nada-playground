import { renderHook } from "@testing-library/react";
import { useNadaInput } from "./index";

describe("useNadaInput", () => {
  it("should extract inputs correctly", () => {
    const testCode = `
      from nada_dsl import *

      def nada_main():
          num_1 = SecretInteger(Input(name="num_1"))
          num_2 = PublicInteger(Input(name="num_2"))
          bool_1 = SecretBoolean(Input("bool_1"))
          return [num_1, num_2, bool_1]
    `;

    const { result } = renderHook(() => useNadaInput(testCode));

    expect(result.current).toEqual([
      { name: "num_1", type: "SecretInteger" },
      { name: "num_2", type: "PublicInteger" },
      { name: "bool_1", type: "SecretBoolean" },
    ]);
  });

  it("should handle empty code", () => {
    const { result } = renderHook(() => useNadaInput(""));

    expect(result.current).toEqual([]);
  });

  it("should handle code without inputs", () => {
    const testCode = `
      from nada_dsl import *

      def nada_main():
          return []
    `;

    const { result } = renderHook(() => useNadaInput(testCode));

    expect(result.current).toEqual([]);
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

    expect(result.current).toEqual(
      inputTypes.map((type, index) => ({
        name: `var${index + 1}`,
        type: type,
      }))
    );
  });
});
