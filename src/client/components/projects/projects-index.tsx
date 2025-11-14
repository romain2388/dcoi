import { Link } from "@tanstack/react-router";
import { Box, Button, Card, CardBody, Heading, Text } from "grommet";

export function ProjectsIndex() {
  return (
    <Box pad="medium" gap="large" align="center">
      <Heading level={1}>Projets Carbon Offsetting</Heading>

      <Box direction="row" gap="medium" wrap>
        <Card width="medium">
          <CardBody pad="medium" gap="medium" align="center">
            <Heading level={3} margin="none">
              Projets Financés
            </Heading>
            <Text textAlign="center">
              Découvrez les projets de compensation carbone qui ont été financés
              et validés par la communauté.
            </Text>
            <Link to="/projects/funded">
              <Button label="Voir les projets financés" primary />
            </Link>
          </CardBody>
        </Card>

        <Card width="medium">
          <CardBody pad="medium" gap="medium" align="center">
            <Heading level={3} margin="none">
              Projets en Vote
            </Heading>
            <Text textAlign="center">
              Participez à la sélection des prochains projets de compensation
              carbone en votant pour ceux qui vous tiennent à cœur.
            </Text>
            <Link to="/projects/voting">
              <Button label="Voir les projets en vote" primary />
            </Link>
          </CardBody>
        </Card>
      </Box>
    </Box>
  );
}
