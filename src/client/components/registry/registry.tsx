import { useState } from "react";
import { useParams } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  DataTable,
  Heading,
  Pagination,
  Text,
} from "grommet";
import {
  repoOverviewQueryOptions,
  repoRunsQueryOptions,
} from "@client/utils/queries/repos";
import { getConclusionColor } from "@client/utils/helpers/colors";

const formatWorkflowDate = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};

export function RegistryComponent() {
  const { projectname } = useParams({
    from: "/(client)/(registry)/registry/$projectname",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: repoOverview } = useSuspenseQuery(
    repoOverviewQueryOptions(projectname),
  );

  const { data: runsData } = useSuspenseQuery(
    repoRunsQueryOptions(projectname, currentPage, itemsPerPage),
  );

  const columns = [
    {
      property: "name",
      header: "Workflow Name",
      render: (run: any) => (
        <Text weight="bold">{run.name || "Unnamed Workflow"}</Text>
      ),
    },
    {
      property: "headBranch",
      header: "Branch",
      render: (run: any) => <Text>{run.headBranch || "N/A"}</Text>,
    },
    {
      property: "conclusion",
      header: "Status",
      render: (run: any) => (
        <Box
          pad={{ horizontal: "small", vertical: "xsmall" }}
          background={getConclusionColor(run.conclusion)}
          round="xsmall"
          align="center"
        >
          <Text size="small" weight="bold">
            {run.conclusion || "Unknown"}
          </Text>
        </Box>
      ),
    },
    {
      property: "totalCarbon",
      header: "Carbon Impact (g CO2)",
      render: (run: any) => (
        <Text>
          {run.totalCarbon ? run.totalCarbon.toLocaleString() : "N/A"}
        </Text>
      ),
    },
    {
      property: "isOffsetOK",
      header: "Offset Status",
      render: (run: any) => (
        <Box
          pad={{ horizontal: "small", vertical: "xsmall" }}
          background={run.isOffsetOK ? "status-ok" : "status-error"}
          round="xsmall"
          align="center"
        >
          <Text size="small" weight="bold">
            {run.isOffsetOK ? "Offset" : "Not Offset"}
          </Text>
        </Box>
      ),
    },
    {
      property: "createdAt",
      header: "Created",
      render: (run: any) => (
        <Text size="small">{formatWorkflowDate(run.createdAt)}</Text>
      ),
    },
  ];

  return (
    <Box pad="medium" gap="medium">
      {/* Repository Overview */}
      <Card>
        <CardHeader>
          <Heading level={3}>Repository Overview</Heading>
        </CardHeader>
        <CardBody>
          <Box gap="small">
            <Box direction="row" gap="small">
              <Text weight="bold">Repository:</Text>
              <Text>{repoOverview.repo.fullName}</Text>
            </Box>
            <Box direction="row" gap="small">
              <Text weight="bold">Owner:</Text>
              <Text>{repoOverview.owner.accountLogin}</Text>
            </Box>
            <Box direction="row" gap="small">
              <Text weight="bold">Type:</Text>
              <Text>{repoOverview.owner.accountType}</Text>
            </Box>
            <Box direction="row" gap="small">
              <Text weight="bold">Owner:</Text>
              <Text>{repoOverview.owner.accountLogin}</Text>
            </Box>
            <Box direction="row" gap="small">
              <Text weight="bold">Type:</Text>
              <Text>{repoOverview.owner.accountType}</Text>
            </Box>
            <Box direction="row" gap="small">
              <Text weight="bold">Visibility:</Text>
              <Text>{repoOverview.repo.private ? "Private" : "Public"}</Text>
            </Box>
            <Box direction="row" gap="small">
              <Text weight="bold">Owner:</Text>
              <Text>
                {repoOverview.owner && repoOverview.owner.accountLogin}
              </Text>
            </Box>
            <Box direction="row" gap="small">
              <Text weight="bold">Type:</Text>
              <Text>
                {repoOverview.owner && repoOverview.owner.accountType}
              </Text>
            </Box>
            <Box direction="row" gap="small">
              <Text weight="bold">Visibility:</Text>
              <Text>
                {repoOverview.repo &&
                  (repoOverview.repo.private ? "Private" : "Public")}
              </Text>
            </Box>
            {repoOverview.wallet && (
              <Box direction="row" gap="small">
                <Text weight="bold">Carbon Credits:</Text>
                <Text>
                  {repoOverview.wallet.balanceCredits?.toLocaleString() || 0}
                </Text>
              </Box>
            )}
            <Box direction="row" gap="small">
              <Text weight="bold">Community Credits:</Text>
              <Text>
                {repoOverview.communityCredits?.toLocaleString() || 0}
              </Text>
            </Box>
          </Box>
        </CardBody>
      </Card>

      {/* Workflow Runs */}
      <Card>
        <CardHeader>
          <Heading level={3}>Workflow Runs</Heading>
        </CardHeader>
        <CardBody>
          {runsData.runs.length === 0 ? (
            <Box pad="medium" align="center">
              <Text>No workflow runs found for this repository.</Text>
            </Box>
          ) : (
            <>
              <DataTable
                columns={columns}
                data={runsData.runs}
                step={itemsPerPage}
              />
              <Box align="center" pad={{ top: "medium" }}>
                <Pagination
                  numberItems={runsData.pagination.total}
                  page={currentPage}
                  step={itemsPerPage}
                  onChange={({ page }) => setCurrentPage(page)}
                />
              </Box>
            </>
          )}
        </CardBody>
      </Card>
    </Box>
  );
}
