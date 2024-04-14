import { defineTheme } from "pinceau";
import theme from "@nuxt-themes/tokens/config";

export default defineTheme({
  color: {
    primary: theme.color.lightblue,
  },
  docus: {
    $schema: {
      title: "All the configurable tokens from Docus.",
      tags: ["@studioIcon material-symbols:docs"],
    },
    header: { height: "64px" },
    footer: { padding: "{space.4} 0" },
    readableLine: "78ch",
    loadingBar: {
      height: "3px",
      gradientColorStop1: "#00dc82",
      gradientColorStop2: "#34cdfe",
      gradientColorStop3: "#0047e1",
    },
  },
  typography: {
    color: {
      primary: {
        50: "{color.primary.50}",
        100: "{color.primary.100}",
        200: "{color.primary.200}",
        300: "{color.primary.300}",
        400: "{color.primary.400}",
        500: "{color.primary.500}",
        600: "{color.primary.600}",
        700: "{color.primary.700}",
        800: "{color.primary.800}",
        900: "{color.primary.900}",
      },
      secondary: {
        50: "{color.gray.50}",
        100: "{color.gray.100}",
        200: "{color.gray.200}",
        300: "{color.gray.300}",
        400: "{color.gray.400}",
        500: "{color.gray.500}",
        600: "{color.gray.600}",
        700: "{color.gray.700}",
        800: "{color.gray.800}",
        900: "{color.gray.900}",
      },
    },
  },
});
