import { useState } from "react";
import { Box, Button, Form, FormField, Grid, Text, TextArea } from "grommet";
import { useParams } from "@tanstack/react-router";
import { ProjectFormSchema } from "@controller/dto/projects";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getProjectByIdQueryOptions } from "@client/utils/queries/projects";
import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
} from "@client/utils/mutations/admin";
import type { ProjectFormType } from "@controller/dto/projects";

export function AdminProjectFormComponent() {
  const routeParameters = useParams({
    from: "/(client)/admin/project/$projectId",
  });
  const [error, setError] = useState("");
  const project = useSuspenseQuery(
    getProjectByIdQueryOptions(routeParameters.projectId),
  );
  const [formData, setFormData] = useState<ProjectFormType>(project.data);
  const create = useCreateProjectMutation();
  const update = useUpdateProjectMutation();

  function handleSubmit(next) {
    console.log(next.value);
    const result = ProjectFormSchema.safeParse(next.value);
    console.log(result.data);
    if (!result.success) {
      setError(result.error.message);
      return;
    }
    setError("");

    if (formData._id === "0") {
      create.mutate({
        data: {
          formData: result.data,
          adminPwd: localStorage.getItem("dmoiadminPassword") || "",
        },
      });
    } else {
      update.mutate({
        data: {
          formData: result.data,
          adminPwd: localStorage.getItem("dmoiadminPassword") || "",
        },
      });
    }
  }
  return (
    <Box>
      <Form<ProjectFormType>
        onSubmit={handleSubmit}
        value={formData}
        onChange={(next) => setFormData(next)}
      >
        <Box>
          <Grid columns={["1/3", "2/3"]} gap="medium" pad={{ right: "medium" }}>
            <Box>
              <FormField name={"name"} label={"name"} />
              <FormField name={"country"} label={"country"} />
              <FormField name={"carbonStandard"} label={"carbonStandard"} />
              <FormField
                name={"carbonQuantity"}
                label={"carbonQuantity"}
                type={"number"}
                onChange={(next) =>
                  setFormData({
                    ...formData,
                    carbonQuantity: Number(next.target.value),
                  })
                }
              />
              <FormField
                name={"carbonPrice"}
                label={"carbonPrice"}
                type={"number"}
                onChange={(next) =>
                  setFormData({
                    ...formData,
                    carbonPrice: Number(next.target.value),
                  })
                }
              />
            </Box>
            <Box pad={{ top: "xsmall" }} gap={"xxsmall"}>
              <Text size={"xsmall"}>description</Text>
              <TextArea name="description" fill />
            </Box>
          </Grid>
          <Box>
            <FormField name={"image1Url"} label={"image1Url"} />
            <FormField name={"image2Url"} label={"image2Url"} />
            <FormField name={"image3Url"} label={"image3Url"} />
            <FormField name={"videoUrl"} label={"videoUrl"} />
            <FormField
              name={"proofOfRetirementUrl"}
              label={"proofOfRetirementUrl"}
            />
          </Box>
          {error !== "" && (
            <Box gap="small">
              {JSON.parse(error).map((errorContent, index) => (
                <Text key={index} color="status-critical">
                  {`${errorContent.path.join(".")}: ${errorContent.message}`}
                </Text>
              ))}
              {update.isError ? (
                <Text color="status-critical">
                  Update error: {update.error.message}
                </Text>
              ) : (
                <></>
              )}
              {create.isError ? (
                <Text color="status-critical">
                  Create error: {create.error.message}
                </Text>
              ) : (
                <></>
              )}
            </Box>
          )}
          <Box align={"end"} gap="small" fill={"horizontal"}>
            <Box width={"small"}>
              <Button
                primary
                label={formData._id === "0" ? "Create" : "Modify"}
                type={"submit"}
                busy={create.isPending || update.isPending}
              />
            </Box>
          </Box>
        </Box>
      </Form>
    </Box>
  );
}
