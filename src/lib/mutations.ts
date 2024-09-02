import { gql } from "~/__generated__";

export const CREATE_PROJECT = gql(`
  mutation projectCreate(
    $defaultEnvironmentName: String,
    $description: String,
    $isPublic: Boolean,
    $name: String!,
    $plugins: [String!],
    $prDeploys: Boolean,
    $repo: ProjectCreateRepo,
    $runtime: PublicRuntime,
    $teamId: String
  ) {
    projectCreate(
      input: {
        defaultEnvironmentName: $defaultEnvironmentName,
        description: $description,
        isPublic: $isPublic,
        name: $name,
        plugins: $plugins,
        prDeploys: $prDeploys,
        repo: $repo,
        runtime: $runtime,
        teamId: $teamId
      }
    ) {
      id
      name
      description
      isPublic
      prDeploys
      teamId
    }
  }
`);

export const SERVICE_CREATE = gql(`
  mutation serviceCreate($projectId: String!, $environmentId: String, $name: String, $image: String) {
    serviceCreate(input: {
      environmentId: $environmentId,
      projectId: $projectId,
      name: $name,
      source:  {
         image: $image
      }
    }) {
      id
    }
  }
`);

export const SERVICE_DELETE = gql(`
  mutation serviceDelete($id: String!) {
    serviceDelete(id: $id)
  }
`);

export const VARIABLE_UPSERT = gql(`
  mutation variableUpsert($projectId: String!, $environmentId: String!, $serviceId: String!, $name: String!, $value: String!) {
    variableUpsert(input: {
      projectId: $projectId,
      environmentId: $environmentId,
      serviceId: $serviceId,
      name: $name,
      value: $value
    })
  }
`);

export const VARIABLE_DELETE = gql(`
  mutation variableDelete($projectId: String!, $environmentId: String!, $serviceId: String!, $name: String!) {
    variableDelete(input: {
      projectId: $projectId,
      environmentId: $environmentId,
      serviceId: $serviceId,
      name: $name
    })
  }
`);

export const DEPLOYMENT_REDEPLOY = gql(`
    mutation deploymentRedeploy($id: String!) {
        deploymentRedeploy(id: $id) {
            id
        }
    }
`);

export const DEPLOYMENT_REMOVE = gql(`
    mutation deploymentRemove($id: String!) {
        deploymentRemove(id: $id)
    }
`);
