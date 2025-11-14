import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Grid,
  Heading,
  Paragraph,
} from "grommet";
import { useSuspenseQuery } from "@tanstack/react-query";
import { communityStatsQueryOptions } from "@client/utils/queries/community";

export function Community() {
  const stats = useSuspenseQuery(communityStatsQueryOptions());

  return (
    <Box pad="medium">
      <Heading level={1}>Community Wallet</Heading>
      <Paragraph>
        Le Community Wallet est un pool partagé de crédits carbone générés par
        les abonnements des utilisateurs. Ces crédits sont utilisés pour
        financer des projets de compensation carbone vérifiés, permettant à la
        communauté de contribuer collectivement à la réduction des émissions de
        CO2 issues des pipelines CI/CD.
      </Paragraph>
      <Paragraph>
        Fonctionnement : Chaque abonnement alloue une partie des crédits au
        wallet communautaire. Ces crédits sont ensuite utilisés pour voter et
        financer des projets carbone, créant un impact collectif durable.
      </Paragraph>

      <Heading level={2} margin={{ top: "large" }}>
        Statistiques Communautaires
      </Heading>
      <Grid columns="medium" gap="small">
        <Card>
          <CardHeader>
            <Heading level={3}>Solde Wallet</Heading>
          </CardHeader>
          <CardBody>
            <Paragraph>{stats.data.communityBalance} crédits</Paragraph>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <Heading level={3}>Projets Financés</Heading>
          </CardHeader>
          <CardBody>
            <Paragraph>{stats.data.fundedProjectsCount} projets</Paragraph>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <Heading level={3}>Runs Offsettés</Heading>
          </CardHeader>
          <CardBody>
            <Paragraph>{stats.data.offsetRunsCount} runs</Paragraph>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <Heading level={3}>Carbone Offsetté</Heading>
          </CardHeader>
          <CardBody>
            <Paragraph>{stats.data.carbonOffset.toFixed(1)} kg CO2</Paragraph>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <Heading level={3}>Temps Total de Run</Heading>
          </CardHeader>
          <CardBody>
            <Paragraph>
              {stats.data.totalRunTimeHours.toFixed(1)} heures
            </Paragraph>
          </CardBody>
        </Card>
      </Grid>
    </Box>
  );
}
