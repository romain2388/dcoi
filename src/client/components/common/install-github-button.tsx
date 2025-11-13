import React from "react";
import { Button } from "grommet";
import { Github } from "grommet-icons";

export default function InstallGithubAppButton() {
  const url = `https://github.com/apps/${(import.meta as any).env.VITE_GITHUB_APP_SLUG}/installations/new`;
  return (
    <Button
      label="Install on GitHub"
      primary
      onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
      icon={<Github />}
    />
  );
}
