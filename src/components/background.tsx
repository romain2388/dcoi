import React from "react";
import { Box } from "grommet";
import bg from "../assets/background.jpg";
import TopMenu from "./top-menu";
import type { ReactNode } from "react";

type Properties = {
  children?: ReactNode;
};

export default function Background({ children }: Properties) {
  return (
    <Box
      fill
      background={{ image: `url(${bg})`, position: "center", size: "cover" }}
      align="center"
      justify="center"
      pad="xlarge"
    >
      <Box
        fill
        pad={{ horizontal: "large", vertical: "small" }}
        round="xlarge"
        border={true}
        style={{
          backgroundColor: "rgba(0,15,0,0.8)",
          backdropFilter: "blur(15px)",
          overflowY: "auto",
          maxHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TopMenu />
        {children}
      </Box>
    </Box>
  );
}
