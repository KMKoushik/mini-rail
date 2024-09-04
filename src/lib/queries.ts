import { gql } from "~/__generated__";

export const GET_ME = gql(`
    query me {
    me {
      id
      name
      email
      avatar
    }
  }
`);

export const GET_DASHBOARD = gql(`
  query dashboard {
    projects {
      edges {
        node {
          id
          name
          services {
            edges {
              node {
                id
                name
              }
            }
          }
          plugins {
            edges {
              node {
                id
                name
              }
            }
          }
          environments {
            edges {
              node {
                id
                name
              }
            }
          }
        }
      }
    }
  }
`);

export const GET_PROJECT = gql(`
  query project($id: String!) {
    project(id: $id) {
      id
      name
      environments {
        edges {
          node {
            id
            name
          }
        }
      }
      services {
        edges {
          node {
            id
            name
            icon
          }
        }
      }
    }
  }
`);

export const GET_ENVIRONMENT = gql(`
  query environment($id: String!) {
    environment(id: $id) {
      id
      name
      serviceInstances {
        edges {
          node {
            id
            serviceId
            latestDeployment {
              id
              canRedeploy
              status
              staticUrl
            }
          }
        }
      }
    }
  }
`);

export const GET_SERVICE_DETAILS = gql(`
  query serviceDetails($environmentId: String!, $projectId: String!, $serviceId: String!) {
    service(id: $serviceId) {
      id
      name
      icon

    }
    variables(environmentId: $environmentId, projectId: $projectId, serviceId: $serviceId, unrendered: true)
    deployments(first: 1, input:  {
       environmentId: $environmentId,
       serviceId: $serviceId
    }) {
      edges {
        node {
          id
          canRedeploy
          status
          meta
        }
      }
    }
  }
`);

export const GET_DEPLOYMENT_LOGS = gql(`
  query deploymentLogs($deploymentId: String!, $filter: String, $startDate: DateTime, $endDate: DateTime, $limit: Int) {
    deploymentLogs(deploymentId: $deploymentId, filter: $filter, startDate: $startDate, endDate: $endDate, limit: $limit) {
      severity
      message
      timestamp
      attributes {
        key
        value
      }
    }
  }
`);
