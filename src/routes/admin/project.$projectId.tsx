import { createFileRoute } from "@tanstack/react-router";
import { Box, Button, Form, FormField, Grid, Text, TextArea } from "grommet";
import { useState } from "react";
import { ProjectFormSchema } from "../../dto/projects/project-form-struct";
import {
  createProject,
  getProject,
  updateProject,
} from "../../functions/projects";
import type { ProjectFormType } from "../../dto/projects/project-form-struct";

export const Route = createFileRoute("/admin/project/$projectId")({
  loader: ({ params: { projectId } }) => getProject({ data: projectId }),
  component: ProjectFormComponent,
});

function ProjectFormComponent() {
  const [error, setError] = useState("");
  const project = Route.useLoaderData();
  const [formData, setFormData] = useState<ProjectFormType>(project);

  function handleSubmit(next) {
    const result = ProjectFormSchema.safeParse(next.value);
    if (!result.success) {
      setError(result.error.message);
      return;
    }
    setError("");

    if (project._id === "0") {
      createProject({
        data: {
          formData: next.value,
          adminPwd: localStorage.getItem("dmoiadminPassword") || "",
        },
      });
    } else {
      updateProject({
        data: {
          formData: next.value,
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
              />
              <FormField
                name={"carbonPrice"}
                label={"carbonPrice"}
                type={"number"}
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
              {JSON.parse(error).map((error, index) => (
                <Text key={index} color="status-critical">
                  {`${error.path.join(".")}: ${error.message}`}
                </Text>
              ))}
            </Box>
          )}
          <Button
            label={project._id === "0" ? "Create" : "Modify"}
            type={"submit"}
          />
        </Box>
      </Form>
    </Box>
  );
}
