import { DeploymentStatus } from "~/__generated__/graphql";
import { Badge } from "../ui/badge";
import { Loader2Icon } from "lucide-react";

export const StatusBadge = ({ status }: { status: DeploymentStatus }) => {
  let color = "bg-gray-200 text-gray-800";

  switch (status) {
    case DeploymentStatus.Success:
      color = "bg-green-200 text-green-800";
      break;
    case DeploymentStatus.Crashed:
    case DeploymentStatus.Failed:
      color = "bg-red-200 text-red-800";
      break;
    case DeploymentStatus.Waiting:
    case DeploymentStatus.Deploying:
    case DeploymentStatus.Building:
    case DeploymentStatus.Initializing:
    case DeploymentStatus.Sleeping:
      color = "bg-yellow-200 text-yellow-800";
      break;
  }

  const isLoadingStates = [
    DeploymentStatus.Deploying,
    DeploymentStatus.Building,
    DeploymentStatus.Initializing,
  ].includes(status);

  return (
    <Badge className={`${color} font-medium text-xs hover:${color}`}>
      {status}{" "}
      {isLoadingStates ? (
        <Loader2Icon className="h-3 w-3 ml-1 animate-spin" />
      ) : null}
    </Badge>
  );
};
