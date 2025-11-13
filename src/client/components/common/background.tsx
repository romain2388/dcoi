import React from "react";
import { Box, Page } from "grommet";
import bg from "../../../assets/background.jpg";
import TopMenu from "./top-menu";
import type { ReactNode } from "react";

type Properties = {
  children?: ReactNode;
};

export default function Background({ children }: Readonly<Properties>) {
  return (
    <Page
      fill
      background={{ image: `url(${bg})`, position: "center", size: "cover" }}
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
        }}
      >
        <TopMenu />
        {children}
      </Box>
    </Page>
  );
}
