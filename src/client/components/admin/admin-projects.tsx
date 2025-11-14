import { Box, Button, Image, Text } from "grommet";
import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { adminProjectsQueryOptions } from "@client/utils/queries/projects";

export function AdminProjects() {
  const projects = useSuspenseQuery(adminProjectsQueryOptions());

  return (
    <Box pad="medium" gap="small">
      <Box direction="row" align="center" justify="between">
        <Text size="large">Liste des projets</Text>
        <Link to={`/admin/project/$projectId`} params={{ projectId: "0" }}>
          <Button primary label="Créer nouveau projet" />
        </Link>
      </Box>

      <Box gap="small">
        {projects.data.length === 0 && (
          <Box pad="small">
            <Text>Aucun projet trouvé.</Text>
          </Box>
        )}

        {projects.data.map((p) => (
          <Link
            key={p._id}
            to={`/admin/project/$projectId`}
            params={{ projectId: p._id }}
          >
            <Box
              direction="row"
              align="center"
              gap="small"
              pad="small"
              background="#F7F7F7"
              round="xsmall"
              style={{ cursor: "pointer" }}
            >
              {p.image1Url ? (
                <Image
                  src={p.image1Url}
                  width="120px"
                  height="80px"
                  fit="cover"
                />
              ) : (
                <Box
                  width="120px"
                  height="80px"
                  align="center"
                  justify="center"
                  background="#EDEDED"
                >
                  <Text size="small">No image</Text>
                </Box>
              )}

              <Box flex>
                <Text weight="bold">{p.name}</Text>
                <Text size="small" truncate>
                  {p.description}
                </Text>
                <Box direction="row" gap="small" margin={{ top: "xsmall" }}>
                  <Text size="xsmall">Pays: {p.country}</Text>
                  <Text size="xsmall">Quantité: {p.carbonQuantity}</Text>
                </Box>
              </Box>
            </Box>
          </Link>
        ))}
      </Box>
    </Box>
  );
}
