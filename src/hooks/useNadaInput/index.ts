import { useMemo, useState, useCallback } from "react";

export function useNadaInput(code: string): {
  inputs: INadaInput[];
  setInputValue: (name: string, value: string) => void;
} {
  const [inputs, setInputs] = useState<INadaInput[]>([]);

  useMemo(() => {
    setInputs((prevInputs) => extractNadaInputs(code, prevInputs));
  }, [code, setInputs]);

  const setInputValue = useCallback(
    (name: string, value: string) => {
      setInputs((prevInputs) =>
        prevInputs.map((input) =>
          input.name === name ? { ...input, value } : input
        )
      );
    },
    [setInputs]
  );

  return { inputs, setInputValue };
}

function extractNadaInputs(
  code: string,
  existingInputs: INadaInput[]
): INadaInput[] {
  const pattern =
    /(\w+)\s*=\s*(SecretInteger|PublicInteger|Integer|SecretUnsignedInteger|PublicUnsignedInteger|UnsignedInteger|SecretBoolean|PublicBoolean)\(Input\(\s*(?:name\s*=\s*)?["']([^"']+)["'][\s\S]*?\)\)/g;
  const matches = Array.from(code.matchAll(pattern));
  const newInputs: INadaInput[] = [];
  const seenNames = new Set<string>();

  for (const match of matches) {
    const name = match[3];
    const type = match[2];

    if (!seenNames.has(name)) {
      seenNames.add(name);
      const existingInput = existingInputs.find((input) => input.name === name);
      if (existingInput) {
        newInputs.push({
          ...existingInput,
          type: type, // Update the type in case it has changed
        });
      } else {
        newInputs.push({
          name,
          type,
          value: "",
        });
      }
    }
  }

  return newInputs;
}

export interface INadaInput {
  name: string;
  type: string;
  value: string;
}
