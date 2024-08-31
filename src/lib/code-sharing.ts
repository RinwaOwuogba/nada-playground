import { strToU8, strFromU8, zlibSync, unzlibSync } from "fflate";
import { IInitialInputs } from "@/hooks/useNadaInput";
import { Buffer } from "buffer";

export function encodeProgramParamsForURI(
  code: string,
  inputs: IInitialInputs
): string {
  const data = JSON.stringify({ code, inputs });
  const compressed = zlibSync(strToU8(data));
  return encodeURIComponent(Buffer.from(compressed).toString("base64"));
}

export function decodeProgramParamsFromURI(encodedParams: string): {
  code: string;
  inputs: IInitialInputs;
} {
  const compressed = Buffer.from(decodeURIComponent(encodedParams), "base64");
  const decompressed = strFromU8(unzlibSync(compressed));
  return JSON.parse(decompressed);
}
