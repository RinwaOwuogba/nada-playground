import {
  encodeProgramParamsForURI,
  decodeProgramParamsFromURI,
} from "./code-sharing";
import { INadaInput } from "@/hooks/useNadaInput";

describe("Code sharing functions", () => {
  it("should encode and decode program params correctly", () => {
    const code = `
      party_alice = Party(name="Alice")
      party_bob = Party(name="Bob")
      num = SecretInteger(Input(name="num", party=party_alice))
      result = num * 2
      return [Output(result, "result", party_bob)]
    `;

    const inputs: INadaInput[] = [
      { id: "1", name: "num", type: "SecretInteger", value: "10" },
    ];

    // Encode the program params
    const encodedParams = encodeProgramParamsForURI(code, inputs);
    console.log(encodedParams);

    // Check that the encoded params is a non-empty string
    expect(encodedParams).toBeTruthy();
    expect(typeof encodedParams).toBe("string");

    // Check that the encoded params is a valid base64 string
    expect(() => atob(encodedParams)).not.toThrow();

    // Decode the program params
    const decodedParams = decodeProgramParamsFromURI(encodedParams);

    // Check that the decoded params match the original input
    expect(decodedParams.code).toBe(code);
    expect(decodedParams.inputs).toEqual(inputs);
  });
});
