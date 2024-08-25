import { loadPyodide, PyodideInterface } from "pyodide";

let pyodide: PyodideInterface;
let pyodideReadyPromise: Promise<PyodideInterface>;

const executeNadaCode = async (code: string) => {
  if (!pyodide) {
    pyodideReadyPromise = loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full",
    });
    pyodide = await pyodideReadyPromise;
    pyodide.F;
  }

  return pyodide.runPython("1+1");
};

type InputType = "PublicInteger" | "SecretInteger";
interface Input {
  [key: string]: [number, InputType];
}

interface PublicInput {
  type: "PublicInteger";
  value: string;
}

interface SecretInput {
  type: "SecretInteger";
  value: string;
}

export const evaluatePython = async (
  inputs: Input,
  code: string
): Promise<string> => {
  const inputEntries = Object.entries(inputs);

  if (!pyodide) {
    pyodideReadyPromise = loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full",
    });
    pyodide = await pyodideReadyPromise;
  }

  // const pyodide = await pyodideReadyPromise;
  await pyodide.loadPackage("micropip");
  const micropip = pyodide.pyimport("micropip");
  await micropip.install("nada_dsl-0.1.0-py3-none-any.whl");
  console.log("micropipped");

  try {
    const publicInputs: { [key: string]: PublicInput } = {};
    const secretInputs: { [key: string]: SecretInput } = {};

    for (let [inputName, [inputValue, inputType]] of inputEntries) {
      // Check if inputName is a single word
      if (/\s/.test(inputName)) {
        throw new Error("Input name must be a single word.");
      }

      if (!isNaN(inputValue)) {
        inputValue = parseFloat(inputValue as unknown as string);
      } else {
        throw new Error("Input value must be a number.");
      }

      if (inputType === "PublicInteger") {
        publicInputs[inputName] = {
          type: "PublicInteger",
          value: `${inputValue}`,
        };
      } else if (inputType === "SecretInteger") {
        secretInputs[inputName] = {
          type: "SecretInteger",
          value: `${inputValue}`,
        };
      }
    }

    const public_vars = JSON.stringify(publicInputs);
    const secrets = JSON.stringify(secretInputs);

    // Run the provided Python code
    const program_json = pyodide.runPython(
      code + "\n" + "nada_compile(nada_main())"
    );
    console.log("PROGRAM:\n " + program_json + "\n=========================\n");
    console.log(
      "INPUTS:\n" +
        public_vars +
        "\n\n" +
        secrets +
        "\n=========================\n"
    );

    // Run the program using the simulator
    const program_output = await runProgramSimulator(
      program_json,
      secrets,
      public_vars
    );

    // Return the result
    return `RESULT: ${JSON.stringify(Array.from(program_output.entries()))}`;
  } catch (err: any) {
    return `ERROR: ${err.message}`;
  }
};
export default executeNadaCode;
