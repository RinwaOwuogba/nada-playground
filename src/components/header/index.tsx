import {
  Box,
  Text,
  Button,
  useToast,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";
import { VscGithub, VscShare } from "react-icons/vsc";
import { INadaInput } from "@/hooks/useNadaInput";
import { encodeProgramParamsForURI } from "@/lib/code-sharing";
import GitHubImporter from "../github-importer";

const Header = ({ code, manualInputs, autoInputs, loadProgram }: IHeader) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleShare = () => {
    const encoded = encodeProgramParamsForURI(code, {
      manual: manualInputs,
      auto: autoInputs,
    });
    navigator.clipboard.writeText(`${window.location.origin}?share=${encoded}`);
    toast({
      title: "Playground link copied to clipboard!",
      status: "success",
      variant: "subtle",
      position: "top",
    });
  };

  return (
    <>
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

        <Flex gap={2}>
          <Button
            color={"white"}
            _hover={{
              bg: "white",
              color: "blue.500",
            }}
            variant="outline"
            size="lg"
            leftIcon={<VscGithub />}
            onClick={onOpen}
          >
            GitHub Import
          </Button>
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
        </Flex>
      </Box>

      <GitHubImporter
        isOpen={isOpen}
        onClose={onClose}
        loadProgram={loadProgram}
      />
    </>
  );
};

export default Header;

interface IHeader {
  code: string;
  manualInputs: INadaInput[];
  autoInputs: INadaInput[];
  loadProgram: (program: string, inputs: INadaInput[]) => void;
}
