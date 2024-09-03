/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  mutation projectCreate(\n    $defaultEnvironmentName: String,\n    $description: String,\n    $isPublic: Boolean,\n    $name: String!,\n    $plugins: [String!],\n    $prDeploys: Boolean,\n    $repo: ProjectCreateRepo,\n    $runtime: PublicRuntime,\n    $teamId: String\n  ) {\n    projectCreate(\n      input: {\n        defaultEnvironmentName: $defaultEnvironmentName,\n        description: $description,\n        isPublic: $isPublic,\n        name: $name,\n        plugins: $plugins,\n        prDeploys: $prDeploys,\n        repo: $repo,\n        runtime: $runtime,\n        teamId: $teamId\n      }\n    ) {\n      id\n      name\n      description\n      isPublic\n      prDeploys\n      teamId\n    }\n  }\n": types.ProjectCreateDocument,
    "\n  mutation serviceCreate($projectId: String!, $environmentId: String, $name: String, $image: String, $repo: String) {\n    serviceCreate(input: {\n      environmentId: $environmentId,\n      projectId: $projectId,\n      name: $name,\n      source:  {\n         image: $image\n         repo: $repo\n      }\n    }) {\n      id\n    }\n  }\n": types.ServiceCreateDocument,
    "\n  mutation serviceInstanceConnect($id: String!, $branch: String!, $repo: String!) {\n    serviceConnect(input: {\n      branch: $branch,\n      repo: $repo\n    }, id: $id) {\n      id\n    }\n  }\n": types.ServiceInstanceConnectDocument,
    "\n  mutation serviceDelete($id: String!) {\n    serviceDelete(id: $id)\n  }\n": types.ServiceDeleteDocument,
    "\n  mutation variableUpsert($projectId: String!, $environmentId: String!, $serviceId: String!, $name: String!, $value: String!) {\n    variableUpsert(input: {\n      projectId: $projectId,\n      environmentId: $environmentId,\n      serviceId: $serviceId,\n      name: $name,\n      value: $value\n    })\n  }\n": types.VariableUpsertDocument,
    "\n  mutation variableDelete($projectId: String!, $environmentId: String!, $serviceId: String!, $name: String!) {\n    variableDelete(input: {\n      projectId: $projectId,\n      environmentId: $environmentId,\n      serviceId: $serviceId,\n      name: $name\n    })\n  }\n": types.VariableDeleteDocument,
    "\n    mutation deploymentRedeploy($id: String!) {\n        deploymentRedeploy(id: $id) {\n            id\n        }\n    }\n": types.DeploymentRedeployDocument,
    "\n    mutation deploymentRemove($id: String!) {\n        deploymentRemove(id: $id)\n    }\n": types.DeploymentRemoveDocument,
    "\n    query me {\n    me {\n      id\n      name\n      email\n      avatar\n    }\n  }\n": types.MeDocument,
    "\n  query dashboard {\n    projects {\n      edges {\n        node {\n          id\n          name\n          services {\n            edges {\n              node {\n                id\n                name\n              }\n            }\n          }\n          plugins {\n            edges {\n              node {\n                id\n                name\n              }\n            }\n          }\n          environments {\n            edges {\n              node {\n                id\n                name\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n": types.DashboardDocument,
    "\n  query project($id: String!) {\n    project(id: $id) {\n      id\n      name\n      environments {\n        edges {\n          node {\n            id\n            name\n          }\n        }\n      }\n      services {\n        edges {\n          node {\n            id\n            name\n            icon\n          }\n        }\n      }\n    }\n  }\n": types.ProjectDocument,
    "\n  query environment($id: String!) {\n    environment(id: $id) {\n      id\n      name\n      serviceInstances {\n        edges {\n          node {\n            id\n            serviceId\n            latestDeployment {\n              id\n              canRedeploy\n              status\n              staticUrl\n            }\n          }\n        }\n      }\n    }\n  }\n": types.EnvironmentDocument,
    "\n  query serviceDetails($environmentId: String!, $projectId: String!, $serviceId: String!) {\n    service(id: $serviceId) {\n      id\n      name\n      icon\n\n    }\n    variables(environmentId: $environmentId, projectId: $projectId, serviceId: $serviceId, unrendered: true)\n    deployments(first: 1, input:  {\n       environmentId: $environmentId,\n       serviceId: $serviceId\n    }) {\n      edges {\n        node {\n          id\n          canRedeploy\n          status\n          meta\n        }\n      }\n    }\n  }\n": types.ServiceDetailsDocument,
    "\n  query deploymentLogs($deploymentId: String!, $filter: String, $startDate: DateTime, $endDate: DateTime, $limit: Int) {\n    deploymentLogs(deploymentId: $deploymentId, filter: $filter, startDate: $startDate, endDate: $endDate, limit: $limit) {\n      severity\n      message\n      timestamp\n      attributes {\n        key\n        value\n      }\n    }\n  }\n": types.DeploymentLogsDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation projectCreate(\n    $defaultEnvironmentName: String,\n    $description: String,\n    $isPublic: Boolean,\n    $name: String!,\n    $plugins: [String!],\n    $prDeploys: Boolean,\n    $repo: ProjectCreateRepo,\n    $runtime: PublicRuntime,\n    $teamId: String\n  ) {\n    projectCreate(\n      input: {\n        defaultEnvironmentName: $defaultEnvironmentName,\n        description: $description,\n        isPublic: $isPublic,\n        name: $name,\n        plugins: $plugins,\n        prDeploys: $prDeploys,\n        repo: $repo,\n        runtime: $runtime,\n        teamId: $teamId\n      }\n    ) {\n      id\n      name\n      description\n      isPublic\n      prDeploys\n      teamId\n    }\n  }\n"): (typeof documents)["\n  mutation projectCreate(\n    $defaultEnvironmentName: String,\n    $description: String,\n    $isPublic: Boolean,\n    $name: String!,\n    $plugins: [String!],\n    $prDeploys: Boolean,\n    $repo: ProjectCreateRepo,\n    $runtime: PublicRuntime,\n    $teamId: String\n  ) {\n    projectCreate(\n      input: {\n        defaultEnvironmentName: $defaultEnvironmentName,\n        description: $description,\n        isPublic: $isPublic,\n        name: $name,\n        plugins: $plugins,\n        prDeploys: $prDeploys,\n        repo: $repo,\n        runtime: $runtime,\n        teamId: $teamId\n      }\n    ) {\n      id\n      name\n      description\n      isPublic\n      prDeploys\n      teamId\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation serviceCreate($projectId: String!, $environmentId: String, $name: String, $image: String, $repo: String) {\n    serviceCreate(input: {\n      environmentId: $environmentId,\n      projectId: $projectId,\n      name: $name,\n      source:  {\n         image: $image\n         repo: $repo\n      }\n    }) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation serviceCreate($projectId: String!, $environmentId: String, $name: String, $image: String, $repo: String) {\n    serviceCreate(input: {\n      environmentId: $environmentId,\n      projectId: $projectId,\n      name: $name,\n      source:  {\n         image: $image\n         repo: $repo\n      }\n    }) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation serviceInstanceConnect($id: String!, $branch: String!, $repo: String!) {\n    serviceConnect(input: {\n      branch: $branch,\n      repo: $repo\n    }, id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation serviceInstanceConnect($id: String!, $branch: String!, $repo: String!) {\n    serviceConnect(input: {\n      branch: $branch,\n      repo: $repo\n    }, id: $id) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation serviceDelete($id: String!) {\n    serviceDelete(id: $id)\n  }\n"): (typeof documents)["\n  mutation serviceDelete($id: String!) {\n    serviceDelete(id: $id)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation variableUpsert($projectId: String!, $environmentId: String!, $serviceId: String!, $name: String!, $value: String!) {\n    variableUpsert(input: {\n      projectId: $projectId,\n      environmentId: $environmentId,\n      serviceId: $serviceId,\n      name: $name,\n      value: $value\n    })\n  }\n"): (typeof documents)["\n  mutation variableUpsert($projectId: String!, $environmentId: String!, $serviceId: String!, $name: String!, $value: String!) {\n    variableUpsert(input: {\n      projectId: $projectId,\n      environmentId: $environmentId,\n      serviceId: $serviceId,\n      name: $name,\n      value: $value\n    })\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation variableDelete($projectId: String!, $environmentId: String!, $serviceId: String!, $name: String!) {\n    variableDelete(input: {\n      projectId: $projectId,\n      environmentId: $environmentId,\n      serviceId: $serviceId,\n      name: $name\n    })\n  }\n"): (typeof documents)["\n  mutation variableDelete($projectId: String!, $environmentId: String!, $serviceId: String!, $name: String!) {\n    variableDelete(input: {\n      projectId: $projectId,\n      environmentId: $environmentId,\n      serviceId: $serviceId,\n      name: $name\n    })\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation deploymentRedeploy($id: String!) {\n        deploymentRedeploy(id: $id) {\n            id\n        }\n    }\n"): (typeof documents)["\n    mutation deploymentRedeploy($id: String!) {\n        deploymentRedeploy(id: $id) {\n            id\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    mutation deploymentRemove($id: String!) {\n        deploymentRemove(id: $id)\n    }\n"): (typeof documents)["\n    mutation deploymentRemove($id: String!) {\n        deploymentRemove(id: $id)\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query me {\n    me {\n      id\n      name\n      email\n      avatar\n    }\n  }\n"): (typeof documents)["\n    query me {\n    me {\n      id\n      name\n      email\n      avatar\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query dashboard {\n    projects {\n      edges {\n        node {\n          id\n          name\n          services {\n            edges {\n              node {\n                id\n                name\n              }\n            }\n          }\n          plugins {\n            edges {\n              node {\n                id\n                name\n              }\n            }\n          }\n          environments {\n            edges {\n              node {\n                id\n                name\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query dashboard {\n    projects {\n      edges {\n        node {\n          id\n          name\n          services {\n            edges {\n              node {\n                id\n                name\n              }\n            }\n          }\n          plugins {\n            edges {\n              node {\n                id\n                name\n              }\n            }\n          }\n          environments {\n            edges {\n              node {\n                id\n                name\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query project($id: String!) {\n    project(id: $id) {\n      id\n      name\n      environments {\n        edges {\n          node {\n            id\n            name\n          }\n        }\n      }\n      services {\n        edges {\n          node {\n            id\n            name\n            icon\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query project($id: String!) {\n    project(id: $id) {\n      id\n      name\n      environments {\n        edges {\n          node {\n            id\n            name\n          }\n        }\n      }\n      services {\n        edges {\n          node {\n            id\n            name\n            icon\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query environment($id: String!) {\n    environment(id: $id) {\n      id\n      name\n      serviceInstances {\n        edges {\n          node {\n            id\n            serviceId\n            latestDeployment {\n              id\n              canRedeploy\n              status\n              staticUrl\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query environment($id: String!) {\n    environment(id: $id) {\n      id\n      name\n      serviceInstances {\n        edges {\n          node {\n            id\n            serviceId\n            latestDeployment {\n              id\n              canRedeploy\n              status\n              staticUrl\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query serviceDetails($environmentId: String!, $projectId: String!, $serviceId: String!) {\n    service(id: $serviceId) {\n      id\n      name\n      icon\n\n    }\n    variables(environmentId: $environmentId, projectId: $projectId, serviceId: $serviceId, unrendered: true)\n    deployments(first: 1, input:  {\n       environmentId: $environmentId,\n       serviceId: $serviceId\n    }) {\n      edges {\n        node {\n          id\n          canRedeploy\n          status\n          meta\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query serviceDetails($environmentId: String!, $projectId: String!, $serviceId: String!) {\n    service(id: $serviceId) {\n      id\n      name\n      icon\n\n    }\n    variables(environmentId: $environmentId, projectId: $projectId, serviceId: $serviceId, unrendered: true)\n    deployments(first: 1, input:  {\n       environmentId: $environmentId,\n       serviceId: $serviceId\n    }) {\n      edges {\n        node {\n          id\n          canRedeploy\n          status\n          meta\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query deploymentLogs($deploymentId: String!, $filter: String, $startDate: DateTime, $endDate: DateTime, $limit: Int) {\n    deploymentLogs(deploymentId: $deploymentId, filter: $filter, startDate: $startDate, endDate: $endDate, limit: $limit) {\n      severity\n      message\n      timestamp\n      attributes {\n        key\n        value\n      }\n    }\n  }\n"): (typeof documents)["\n  query deploymentLogs($deploymentId: String!, $filter: String, $startDate: DateTime, $endDate: DateTime, $limit: Int) {\n    deploymentLogs(deploymentId: $deploymentId, filter: $filter, startDate: $startDate, endDate: $endDate, limit: $limit) {\n      severity\n      message\n      timestamp\n      attributes {\n        key\n        value\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;