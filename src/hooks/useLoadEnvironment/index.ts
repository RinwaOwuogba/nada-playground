import { loadPythonEnvironment } from "@/lib/nada-executor";
import { useState, useEffect } from "react";
import { IInitialInputs } from "../useNadaInput";
import { decodeProgramParamsFromURI } from "@/lib/code-sharing";
import { useToast } from "@chakra-ui/react";

const useLoadEnvironment = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [intermediateMessage, setIntermediateMessage] = useState<string>("");
  const [initialCode, setInitialCode] = useState<string | null>(null);
  const [initialInputs, setInitialInputs] = useState<IInitialInputs>({});
  const toast = useToast();

  useEffect(() => {
    const loadEnvironment = async () => {
      setIntermediateMessage("Preparing Python Environment...");
      try {
        await loadPythonEnvironment();

        const urlParams = new URLSearchParams(window.location.search);
        const shareParam = urlParams.get("share");
        if (shareParam) {
          setIntermediateMessage("Loading shared program...");
          const decoded = decodeProgramParamsFromURI(shareParam);
          setInitialCode(decoded.code);
          setInitialInputs(decoded.inputs);

          // Remove the 'share' parameter from the URL without reloading the page
          urlParams.delete("share");
          window.history.replaceState(
            {},
            "",
            `${window.location.pathname}${
              urlParams.toString() ? `?${urlParams.toString()}` : ""
            }`
          );

          setTimeout(() => {
            toast({
              title: "Shared program loaded",
              status: "success",
              variant: "subtle",
              position: "top",
            });
          }, 1000);
        }
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to load Python environment")
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadEnvironment();
  }, [toast]);

  return { isLoading, error, intermediateMessage, initialCode, initialInputs };
};

export default useLoadEnvironment;
