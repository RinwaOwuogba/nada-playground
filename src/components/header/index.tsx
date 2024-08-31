import { Box, Text, Button, useToast } from "@chakra-ui/react";
import { VscShare } from "react-icons/vsc";
import { INadaInput } from "@/hooks/useNadaInput";
import { encodeProgramParamsForURI } from "@/lib/code-sharing";

const Header = ({ code, inputs }: IHeader) => {
  const toast = useToast();

  const handleShare = () => {
    const encoded = encodeProgramParamsForURI(code, inputs);
    navigator.clipboard.writeText(`${window.location.origin}?share=${encoded}`);
    toast({
      title: "Playground link copied to clipboard!",
      status: "success",
      variant: "subtle",
      position: "bottom-right",
    });
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      bg="blue.500"
      padding={5}
    >
      <Text color={"white"} fontSize={"xxx-large"} fontWeight={"bold"}>
        Nada Playground
      </Text>

      <Button
        color={"white"}
        _hover={{
          bg: "white",
          color: "blue.500",
        }}
        variant="outline"
        size="lg"
        leftIcon={<VscShare />}
        onClick={handleShare}
      >
        Share
      </Button>
    </Box>
  );
};

export default Header;

interface IHeader {
  code: string;
  inputs: INadaInput[];
}
