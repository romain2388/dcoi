import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Grid,
  Heading,
  Image,
  Text,
} from "grommet";
import { fundedProjectsQueryOptions } from "@client/utils/queries/projects";

export function FundedProjects() {
  const { data: projects } = useSuspenseQuery(fundedProjectsQueryOptions());

  return (
    <Box pad="medium" gap="medium">
      <Heading level={2}>Projets Financés</Heading>

      {projects.length === 0 ? (
        <Box pad="large" align="center">
          <Text>Aucun projet financé pour le moment.</Text>
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

                  <Box direction="row" justify="between" align="center">
                    <Text size="small" weight="bold">
                      Pays: {project.country}
                    </Text>
                    <Text size="small" weight="bold">
                      {project.carbonQuantity.toLocaleString()} tonnes CO₂
                    </Text>
                  </Box>

                  {project.voteCount ? (
                    <Box direction="row" gap="xsmall">
                      <Text size="small" color="status-ok">
                        ✅ {project.voteCount} vote
                        {project.voteCount > 1 ? "s" : ""} de la communauté
                      </Text>
                    </Box>
                  ) : undefined}

                  <Box direction="row" justify="between">
                    <Text size="small">Standard: {project.carbonStandard}</Text>
                    <Text size="small">Prix: {project.carbonPrice}€</Text>
                  </Box>

                  {project.proofOfRetirementUrl && (
                    <Box>
                      <Text size="small" weight="bold" color="status-ok">
                        ✅ Certificat de retraite disponible
                      </Text>
                      <Link
                        to={project.proofOfRetirementUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Text size="small" color="brand">
                          Voir le certificat
                        </Text>
                      </Link>
                    </Box>
                  )}
                </Box>
              </CardBody>
            </Card>
          ))}
        </Grid>
      )}
    </Box>
  );
}
