import { createFileRoute } from "@tanstack/react-router";
import { Box, Form, FormField } from "grommet";
import {
  ProjectFormStruct,
  ProjectFormType,
} from "../../dto/projects/project-form-struct";
import { assert } from "superstruct";
import { useState } from "react";

export const Route = createFileRoute("/admin/projects/$projectId")({
  component: ProjectFormComponent,
});

function ProjectFormComponent() {
  const [error, setError] = useState("");

  function handleSubmit(nextValue) {
    try {
      assert(nextValue, ProjectFormStruct);
    } catch (structError) {
      setError(structError);
      return;
    }
  }
  return (
    <Box>
      <Form<ProjectFormType> onSubmit={handleSubmit}>
        <FormField name={"name"} />
        <FormField name={"country"} />
        <FormField name={"description"} />
        <FormField name={"carbonStandard"} />
        <FormField name={"carbonQuantity"} />
        <FormField name={"carbonPrice"} />
        <FormField name={"image1Url"} />
        <FormField name={"image2Url"} />
        <FormField name={"image3Url"} />
        <FormField name={"videoUrl"} />
        <FormField name={"proofOfRetirementUrl"} />
      </Form>
    </Box>
  );
}
