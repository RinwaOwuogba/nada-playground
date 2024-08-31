import {
  encodeProgramParamsForURI,
  decodeProgramParamsFromURI,
} from "./code-sharing";
import { IInitialInputs } from "@/hooks/useNadaInput";

describe("Code sharing functions", () => {
  it("should encode and decode program params correctly", () => {
    const code = `\
from nada_dsl import *

def nada_main():
    party_alice = Party(name="Alice")
    party_bob = Party(name="Bob")
    party_charlie = Party(name="Charlie")
    num_1 = SecretInteger(Input(name="num_1", party=party_alice))
    num_2 = SecretInteger(Input(name="num_2", party=party_bob))
    product = num_1 * num_2
    return [Output(product, "product", party_charlie)]
    `;

    const inputs: IInitialInputs = {
      auto: [{ name: "num", type: "SecretInteger", value: "10" }],
      manual: [{ id: "2", name: "num", type: "SecretInteger", value: "10" }],
    };

    // Encode the program params
    const encodedParams = encodeProgramParamsForURI(code, inputs);

    // Check that the encoded params is a non-empty string
    expect(encodedParams).toBeTruthy();
    expect(typeof encodedParams).toBe("string");

    // Check that the encoded params is a valid base64 string
    expect(() => atob(decodeURIComponent(encodedParams))).not.toThrow();

    // Decode the program params

    const decodedParams = decodeProgramParamsFromURI(encodedParams);

    // Check that the decoded params match the original input
    expect(decodedParams.code).toBe(code);
    expect(decodedParams.inputs).toEqual(inputs);
  });
});
