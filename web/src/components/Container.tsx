import { Box } from "@chakra-ui/react";
import React from "react";

interface ContainerProps {
  variant?: "small" | "regular";
}

export const Container: React.FC<ContainerProps> = ({
  children,
  variant = "regular",
}) => {
  return (
    <Box
      w="100%"
      mx="auto"
      maxW={variant === "regular" ? "800px" : "400px"}
      mt={4}
    >
      {children}
    </Box>
  );
};
