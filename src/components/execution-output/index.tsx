import { Box } from "@chakra-ui/react";

const ExecutionOutput = ({
  isProgramExecuting,
  executionResult,
  loadingMessage,
  defaultMessage,
}: IExecutionOutputProps) => {
  const renderContent = () => {
    if (isProgramExecuting) {
      return <Box color="blue.200">{loadingMessage}</Box>;
    }

    if (executionResult.length === 0) {
      return <Box color="blue.200">{defaultMessage}</Box>;
    }

    return (
      <>
        {executionResult.map((result, index) => (
          <Box key={index} color="blue.200">
            <Box as="span" color="blue.300" fontWeight="semibold">
              {result.name}:
            </Box>{" "}
            {result.value}
          </Box>
        ))}
      </>
    );
  };

  return (
    <Box
      border="1px solid"
      borderColor="blue.600"
      color="blue.200"
      fontWeight="600"
      backgroundColor="blue.700"
      h="100%"
      padding={4}
      borderRadius="md"
      fontFamily="mono"
      fontSize="sm"
      overflow="auto"
      height="300px"
    >
      <Box
        as="pre"
        whiteSpace="pre-wrap"
        wordBreak="break-word"
        role="logs"
        aria-label="Execution Output"
      >
        {renderContent()}
      </Box>
    </Box>
  );
};

export interface IExecutionResult {
  name: string;
  value: string;
}

interface IExecutionOutputProps {
  isProgramExecuting: boolean;
  executionResult: IExecutionResult[];
  loadingMessage: string;
  defaultMessage: string;
}

export default ExecutionOutput;
