import { loadPythonEnvironment } from "@/lib/nada-executor";
import { useState, useEffect } from "react";

const useLoadPythonEnvironment = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadEnvironment = async () => {
      try {
        await loadPythonEnvironment();
      } catch (err) {
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
  }, []);

  return { isLoading, error };
};

export default useLoadPythonEnvironment;
