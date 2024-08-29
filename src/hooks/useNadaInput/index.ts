import { useMemo, useState, useCallback } from "react";

export function useNadaInput(code: string): {
  inputs: INadaInput[];
  setInputValue: (id: string, value: string) => void;
} {
  const [inputs, setInputs] = useState<INadaInput[]>([]);

  useMemo(() => {
    const result = extractNadaInputs(code, inputs);
    setInputs(result);
  }, [code]);

  const setInputValue = useCallback((name: string, value: string) => {
    setInputs((prevInputs) =>
      prevInputs.map((input) =>
        input.name === name ? { ...input, value } : input
      )
    );
  }, []);

  return { inputs, setInputValue };
}

function extractNadaInputs(code: string, inputs: INadaInput[]): INadaInput[] {
  const pattern =
    /(\w+)\s*=\s*(SecretInteger|PublicInteger|Integer|SecretUnsignedInteger|PublicUnsignedInteger|UnsignedInteger|SecretBoolean|PublicBoolean)\(Input\(\s*(?:name\s*=\s*)?["']([^"']+)["'][\s\S]*?\)\)/g;
  const matches = code.matchAll(pattern);
  const newInputs: INadaInput[] = [];

  for (const match of matches) {
    const existingInput = inputs.find((input) => input.name === match[3]);
    if (existingInput) {
      newInputs.push(existingInput);
    } else {
      newInputs.push({
        name: match[3],
        type: match[2],
        value: "",
      });
    }
  }

  return newInputs;
}

export interface INadaInput {
  name: string;
  type: string;
  value?: string;
}
