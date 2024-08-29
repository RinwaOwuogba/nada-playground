import { loadPyodide, PyodideInterface } from "pyodide";
import init, { run } from "./nada-run.js";
import { INadaInput } from "@/hooks/useNadaInput/index.js";
import { IExecutionResult } from "@/components/execution-output/index.js";

let pyodide: PyodideInterface;
let pyodideReadyPromise: Promise<PyodideInterface>;

export const executeNadaCode = async (
  inputs: INadaInput[],
  code: string
): Promise<IExecutionResult[]> => {
  await loadPythonEnvironment();

  const publicInputs: { [key: string]: PublicInput } = {};
  const secretInputs: { [key: string]: SecretInput } = {};

  inputs.forEach((input) => {
    // Validate Input
    // Check if inputName is a single word
    if (/\s/.test(input.name)) {
      throw new Error("Input name must be a single word.");
    }

    if (input.value === undefined) {
      throw new Error("Input value is required.");
    }

    const numericValue = parseFloat(input.value);
    if (isNaN(numericValue)) {
      throw new Error("Input value must be a number.");
    }

    if (input.type === "PublicInteger") {
      publicInputs[input.name] = {
        type: "PublicInteger",
        value: numericValue.toString(),
      };
    } else if (input.type === "SecretInteger") {
      secretInputs[input.name] = {
        type: "SecretInteger",
        value: numericValue.toString(),
      };
    }
  });

  const public_vars = JSON.stringify(publicInputs);
  const secrets = JSON.stringify(secretInputs);

  // Run the provided Python code
  const program_json = pyodide.runPython(
    code + "\n" + "nada_compile(nada_main())"
  );

  // Run the program using the simulator
  const program_output = await runProgramSimulator(
    program_json,
    secrets,
    public_vars
  );

  return Array.from(program_output.entries()).map((entry: unknown) => {
    const [name, value] = entry as [string, unknown];
    return {
      name,
      value: value?.toString() ?? "",
    };
  });
};

export const loadPythonEnvironment = async () => {
  if (!pyodide) {
    pyodideReadyPromise = loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full",
    });
    pyodide = await pyodideReadyPromise;

    await pyodide.loadPackage("micropip");
    const micropip = pyodide.pyimport("micropip");
    await micropip.install("nada_dsl-0.5.0-py3-none-any.whl");
  }
};

const runProgramSimulator = async (
  program: string,
  secrets: string,
  public_vars: string
) => {
  // Instantiate our wasm module
  await init();
  console.log(
    `Running program simulator with arguments: ${program}, ${secrets}, ${public_vars}`
  );
  const result = run(program, 5, 1, 128, secrets, public_vars);

  return result;
};

interface PublicInput {
  type: "PublicInteger";
  value: string;
}

interface SecretInput {
  type: "SecretInteger";
  value: string;
}

export default executeNadaCode;
