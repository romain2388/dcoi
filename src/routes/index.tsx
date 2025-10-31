import { createFileRoute } from "@tanstack/react-router";
import { Box, Heading } from "grommet";
import InstallGithubAppButton from "../components/install-github-button";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <Box align="center" justify="center" pad="large" gap="medium">
      <Heading level={1}>DevOps Carbon Offset Initiative</Heading>
      <InstallGithubAppButton />
    </Box>
  );
}
