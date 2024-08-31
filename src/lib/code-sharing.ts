import { strToU8, strFromU8, zlibSync, unzlibSync } from "fflate";
import { INadaInput } from "@/hooks/useNadaInput";

export function encodeProgramParamsForURI(
  code: string,
  inputs: INadaInput[]
): string {
  const data = JSON.stringify({ code, inputs });
  const compressed = zlibSync(strToU8(data));
  return btoa(String.fromCharCode(...new Uint8Array(compressed)));
}

export function decodeProgramParamsFromURI(encodedParams: string): {
  code: string;
  inputs: INadaInput[];
} {
  const compressed = new Uint8Array(
    atob(encodedParams)
      .split("")
      .map((char) => char.charCodeAt(0))
  );
  const decompressed = strFromU8(unzlibSync(compressed));
  return JSON.parse(decompressed);
}
