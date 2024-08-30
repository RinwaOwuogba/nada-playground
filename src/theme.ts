import { extendTheme } from "@chakra-ui/react";
// Supports weights 100-900
import "@fontsource-variable/raleway";

const theme = extendTheme({
  fonts: {
    body: `'Raleway Variable', sans-serif`,
    heading: `'Raleway Variable', sans-serif`,
  },
});

export default theme;
