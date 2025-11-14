import { useEffect, useState } from "react";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Grid,
  Heading,
  Image,
  Text,
} from "grommet";
import { votingProjectsQueryOptions } from "@client/utils/queries/projects";
import { voteForProjectController } from "@controller/functions/projects";
import {
  canVote,
  formatCooldownTime,
  getRemainingCooldown,
  setVoteCooldown,
} from "@client/utils/helpers/vote";

export function VotingProjects() {
  const { data: projects, refetch } = useSuspenseQuery(
    votingProjectsQueryOptions(),
  );
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});

  useEffect(() => {
    // Mettre à jour les cooldowns toutes les secondes
    const interval = setInterval(() => {
      const updatedCooldowns: Record<string, number> = {};
      for (const project of projects) {
        if (project._id) {
          updatedCooldowns[project._id] = getRemainingCooldown(project._id);
        }
      }
      setCooldowns(updatedCooldowns);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [projects]);

  const voteMutation = useMutation({
    mutationFn: (projectId: string) =>
      voteForProjectController({
        data: { projectId },
      }),
    onSuccess: (_, projectId) => {
      setVoteCooldown(projectId);
      setCooldowns((previous) => ({
        ...previous,
        [projectId]: getRemainingCooldown(projectId),
      }));
      void refetch();
    },
  });

  const handleVote = (projectId: string, projectName: string) => {
    if (!canVote(projectId)) {
      const remaining = getRemainingCooldown(projectId);
      alert(
        `Vous devez attendre ${formatCooldownTime(remaining)} avant de pouvoir voter à nouveau pour ce projet.`,
      );
      return;
    }

    voteMutation.mutate(projectId, {
      onSuccess: () => {
        alert(`Vote enregistré pour le projet: ${projectName}`);
      },
      onError: (error: Error) => {
        alert(`Erreur lors du vote: ${error.message}`);
      },
    });
  };

  return (
    <Box pad="medium" gap="medium">
      <Heading level={2}>Projets en Cours de Vote</Heading>

      {projects.length === 0 ? (
        <Box pad="large" align="center">
          <Text>Aucun projet en cours de vote.</Text>
        </Box>
      ) : (
        <Grid columns={{ count: "fit", size: "medium" }} gap="medium">
          {projects.map((project) => (
            <Card key={project._id} height={{ min: "auto" }}>
              <CardHeader>
                <Heading level={4} margin="none">
                  {project.name}
                </Heading>
              </CardHeader>
              <CardBody gap="small">
                {project.image1Url && (
                  <Image
                    src={project.image1Url}
                    alt={project.name}
                    fit="cover"
                    height="200px"
                  />
                )}

                <Box gap="small">
                  <Text size="small" color="text-weak">
                    {project.description}
                  </Text>

                  <Box direction="row" justify="between">
                    <Text size="small" weight="bold">
                      Pays: {project.country}
                    </Text>
                    <Text size="small" weight="bold">
                      {project.carbonQuantity.toLocaleString()} tonnes CO₂
                    </Text>
                  </Box>

                  <Box direction="row" justify="between">
                    <Text size="small">Standard: {project.carbonStandard}</Text>
                    <Text size="small">Prix: {project.carbonPrice}€</Text>
                  </Box>

                  <Box margin={{ top: "small" }}>
                    <Text size="small" weight="bold" color="status-warning">
                      🗳️ En attente de financement communautaire
                    </Text>
                  </Box>

                  <Box margin={{ top: "small" }} gap="xsmall">
                    <Box direction="row" justify="between" align="center">
                      <Text size="small" weight="bold">
                        🗳️ {project.voteCount || 0} vote
                        {(project.voteCount || 0) > 1 ? "s" : ""}
                      </Text>
                    </Box>

                    {project._id && cooldowns[project._id] > 0 ? (
                      <Box>
                        <Button
                          label={`Attendre ${formatCooldownTime(cooldowns[project._id])}`}
                          size="small"
                          disabled
                        />
                        <Text
                          size="xsmall"
                          color="text-weak"
                          margin={{ top: "xsmall" }}
                        >
                          Vous avez déjà voté pour ce projet
                        </Text>
                      </Box>
                    ) : (
                      <Button
                        label="Voter pour ce projet"
                        size="small"
                        primary
                        disabled={voteMutation.isPending}
                        onClick={() => {
                          if (project._id) {
                            handleVote(project._id, project.name);
                          }
                        }}
                      />
                    )}
                  </Box>
                </Box>
              </CardBody>
            </Card>
          ))}
        </Grid>
      )}
    </Box>
  );
}
