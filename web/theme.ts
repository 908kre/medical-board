"use client";
import { createSystem, defaultConfig, defineRecipe } from "@chakra-ui/react";
import { font } from "./font";

export const system = createSystem(defaultConfig, {
  globalCss: {
    html: {
      colorPalette: "brand",
    },
  },
  theme: {
    tokens: {
      fonts: {
        heading: { value: font.style.fontFamily },
        body: { value: font.style.fontFamily },
      },
      colors: {
        blue: {
          800: { value: "#00416f" },
        },
        brand: {
          branch: { value: "#0073ba" },
          core: { value: "#358a00" },
        },
      },
    },
    semanticTokens: {
      colors: {
        brand: {
          solid: { value: "{colors.blue.800}" },
          contrast: { value: "{colors.gray.100}" },
          fg: { value: "{colors.gray.700}" },
          muted: { value: "{colors.gray.100}" },
          subtle: { value: "{colors.gray.100}" },
          emphasized: { value: "{colors.gray.300}" },
          focusRing: { value: "{colors.blue.800}" },
        },
      },
    },
    recipes: {
      button: defineRecipe({
        defaultVariants: {
          variant: "subtle",
          size: "sm",
        },
      }),
    },
  },
});
export const { token } = system;
