import React from "react";
import { Box, Spinner, Text, VStack } from "@chakra-ui/react";
import useLoadPythonEnvironment from "@/hooks/useLoadPythonEnvironment";

const EnvironmentLoader: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isLoading, error } = useLoadPythonEnvironment();

  if (isLoading) {
    return (
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        backgroundColor="rgba(0, 0, 0, 0.7)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        zIndex={9999}
      >
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text color="white" fontSize="xl" fontWeight="bold">
            Preparing Python Environment...
          </Text>
        </VStack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        backgroundColor="rgba(255, 0, 0, 0.1)"
        padding={10}
        display="flex"
        alignItems="center"
        justifyContent="center"
        zIndex={9999}
      >
        <Text color="red.500" fontSize="xl" fontWeight="bold">
          Error: {error.message}
        </Text>
      </Box>
    );
  }

  return <>{children}</>;
};

export default EnvironmentLoader;
