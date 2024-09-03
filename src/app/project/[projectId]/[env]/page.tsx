"use client";

import { useQuery } from "@apollo/client";
import { ChevronRightIcon, ServerIcon, ChevronDownIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import { GET_PROJECT, GET_ENVIRONMENT } from "~/lib/queries";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Badge } from "~/components/ui/badge";
import { CreateService } from "~/components/services/create-service";
import { DeleteService } from "~/components/services/delete-service";
import { useUrlState } from "~/hooks/useUrlState";
import { Sheet, SheetContent } from "~/components/ui/sheet";
import { ServiceDetails } from "~/components/services/service-details";
import { StatusBadge } from "~/components/services/status-badge";
import { ServiceAlerts } from "~/components/services/service-alerts";

export default function ProjectPage() {
  const { projectId, env } = useParams<{
    projectId: string;
    env: string;
  }>();

  const [serviceId, setServiceId] = useUrlState("serviceId");

  const { data } = useQuery(GET_PROJECT, {
    variables: { id: projectId },
  });

  const currentEnv = data?.project.environments.edges.find(
    (e) => e.node.id === env
  );

  const { data: envData } = useQuery(GET_ENVIRONMENT, {
    variables: { id: env },
    pollInterval: 5000,
  });

  const serviceDetails =
    data?.project.services.edges.reduce((acc, service) => {
      acc[service.node.id] = service.node;
      return acc;
    }, {} as Record<string, { id: string; name: string; icon?: string | null }>) ??
    {};

  const handleSheetChange = (isOpen: boolean) => {
    if (!isOpen) {
      setServiceId(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center ">
        <div className="flex items-center gap-1">
          <Link
            href="/"
            className="text-blue-600 cursor-pointer hover:underline text-lg font-semibold"
          >
            <p className="text-lg font-semibold">{data?.project.name}</p>
          </Link>
          {data && (
            <ChevronRightIcon className="h-5 w-5 text-muted-foreground" />
          )}
          {(data?.project.environments.edges.length ?? 0) > 1 ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-1">
                  {currentEnv?.node.name}
                  <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {data?.project.environments.edges.map((env) => (
                  <Link
                    key={env.node.id}
                    href={`/project/${projectId}/${env.node.id}`}
                    passHref
                  >
                    <DropdownMenuItem>{env.node.name}</DropdownMenuItem>
                  </Link>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
        <CreateService projectId={projectId} environmentId={env} />
      </div>

      <div className="mt-10">
        <p className="text-lg font-semibold">Services</p>
        <div className="flex flex-col gap-4 mt-6">
          {envData?.environment.serviceInstances.edges.map((si) => {
            const service = serviceDetails[si.node.serviceId];

            if (!service) return null;

            return (
              <div key={si.node.id} className="border p-4 shadow rounded-xl ">
                <div className="flex items-center gap-2">
                  <div
                    className="flex items-center gap-4 w-1/3 cursor-pointer"
                    onClick={() => setServiceId(si.node.serviceId)}
                  >
                    {service.icon ? (
                      <Image
                        src={service.icon}
                        alt={service.name}
                        width={24}
                        height={24}
                      />
                    ) : (
                      <ServerIcon size={24} className="text-gray-700" />
                    )}
                    <p className="underline decoration-dashed underline-offset-2">
                      {service.name}
                    </p>
                  </div>
                  <div className="w-1/3">
                    {si.node.latestDeployment?.status ? (
                      <StatusBadge status={si.node.latestDeployment.status} />
                    ) : (
                      <Badge
                        className={`font-medium bg-muted-foreground/20 text-muted-foreground`}
                      >
                        No deployments
                      </Badge>
                    )}
                  </div>
                  <div className="w-1/3 overflow-hidden text-ellipsis">
                    {si.node.latestDeployment?.staticUrl ? (
                      <Link
                        href={`https://${si.node.latestDeployment.staticUrl}`}
                        target="_blank"
                        className="text-blue-600 cursor-pointer hover:underline whitespace-nowrap "
                      >
                        {si.node.latestDeployment.staticUrl}
                      </Link>
                    ) : null}
                  </div>
                  <DeleteService
                    serviceId={service.id}
                    serviceName={service.name}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-lg font-semibold mt-10">Alerts</p>
        <ServiceAlerts environmentId={env} />
      </div>
      <Sheet open={!!serviceId} onOpenChange={handleSheetChange}>
        <SheetContent className=" sm:max-w-3xl">
          {serviceId ? (
            <ServiceDetails
              serviceId={serviceId}
              environmentId={env}
              projectId={projectId}
            />
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
