import { Box, Heading } from "grommet";
import InstallGithubAppButton from "./common/install-github-button";

export function Home() {
  return (
    <Box align="center" justify="center" pad="large" gap="medium">
      <Heading level={1}>DevOps Carbon Offset Initiative</Heading>
      <InstallGithubAppButton />
    </Box>
  );
}
