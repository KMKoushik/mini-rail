import { GET_DEPLOYMENT_LOGS, GET_ENVIRONMENT } from "~/lib/queries";
import { apolloClient } from "./client";
import prisma from "./db";
import { Log } from "~/__generated__/graphql";

export async function checkLogAlert(id: string) {
  const logAlert = await prisma.logAlert.findUnique({
    where: {
      id,
    },
  });

  if (!logAlert) {
    console.error("Log alert not found");
    return;
  }

  const {
    serviceIds,
    filter,
    email,
    token,
    checkEvery,
    environmentId,
    severity,
    logLimit,
  } = logAlert;

  const deployments = await getDeploymentIds({
    environmentId,
    token,
    serviceIds,
  });

  const logs = await getLogs(
    deployments,
    filter,
    checkEvery,
    severity,
    logLimit,
    token
  );

  console.log("logs", logs);

  if (logs.length < logLimit) {
    return;
  }

  console.log("log alert triggered", logs);
}

// get latest deployments accross given services for a given environment
async function getDeploymentIds({
  environmentId,
  token,
  serviceIds,
}: {
  environmentId: string;
  token: string;
  serviceIds: string[];
}) {
  const { data, errors } = await apolloClient.query({
    query: GET_ENVIRONMENT,
    variables: { id: environmentId },
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  if (errors) {
    console.error(errors);
    return [];
  }

  const deployments = [];

  for (const instance of data.environment.serviceInstances.edges) {
    const { id, serviceId } = instance.node;

    if (
      (serviceIds.length === 0 || serviceIds.includes(serviceId)) &&
      instance.node.latestDeployment
    ) {
      deployments.push(instance.node.latestDeployment.id);
    }
  }

  return deployments;
}

async function getLogs(
  deploymentIds: string[],
  filter: string | null,
  timeInterval: number,
  severity: string[],
  logLimit: number,
  token: string
) {
  const logs: Array<Log> = [];

  const logQueries = deploymentIds.map((deploymentId) =>
    apolloClient.query({
      query: GET_DEPLOYMENT_LOGS,
      variables: {
        deploymentId,
        filter,
        limit: 5000,
        startDate: new Date(Date.now() - timeInterval * 1000),
        endDate: new Date(),
      },
      context: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    })
  );

  const results = await Promise.all(logQueries);

  for (const { data, errors } of results) {
    if (errors) {
      console.error("Error fetching logs:", errors);
      continue;
    }
    if (data && data.deploymentLogs) {
      for (const log of data.deploymentLogs) {
        if (severity.length === 0) {
          logs.push(log);
        } else if (log.severity && severity.includes(log.severity)) {
          logs.push(log);
        }
      }

      // if we have reached the log limit, break out of the loop
      if (logs.length >= logLimit) {
        break;
      }
    }
  }

  return logs;
}
