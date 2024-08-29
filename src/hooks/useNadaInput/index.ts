import { useMemo } from "react";

export function useNadaInput(code: string): INadaInput[] {
  return useMemo(() => extractNadaInputs(code), [code]);
}

function extractNadaInputs(code: string): INadaInput[] {
  const pattern =
    /(\w+)\s*=\s*(SecretInteger|PublicInteger|Integer|SecretUnsignedInteger|PublicUnsignedInteger|UnsignedInteger|SecretBoolean|PublicBoolean)\(Input\(\s*(?:name\s*=\s*)?["']([^"']+)["'][\s\S]*?\)\)/g;
  const matches = code.matchAll(pattern);
  const result = [];
  for (const match of matches) {
    result.push({ name: match[3], type: match[2] });
  }

  return result;
}

export interface INadaInput {
  name: string;
  type: string;
  value?: string;
}
