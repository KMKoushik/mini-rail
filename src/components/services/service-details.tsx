import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { VARIABLE_UPSERT, VARIABLE_DELETE } from "~/lib/mutations";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useQuery } from "@apollo/client";
import {
  CheckIcon,
  Edit2,
  Loader2Icon,
  ServerIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import { GET_SERVICE_DETAILS } from "~/lib/queries";
import { StatusBadge } from "./status-badge";
import { StopDeployment } from "./stop-deployment";
import { StartDeployment } from "./start-deployment";

export const ServiceDetails = ({
  serviceId,
  environmentId,
  projectId,
}: {
  serviceId: string;
  environmentId: string;
  projectId: string;
}) => {
  const { data, loading, error } = useQuery(GET_SERVICE_DETAILS, {
    variables: {
      serviceId,
      environmentId,
      projectId,
    },
    pollInterval: 5000,
  });

  if (loading && !data) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const deployment = data?.deployments.edges[0]?.node;

  return (
    <div className="flex flex-col gap-10 h-full">
      <div className="flex items-center  gap-4">
        {data?.service.icon ? (
          <Image
            src={data.service.icon}
            alt={data.service.name}
            width={30}
            height={30}
          />
        ) : (
          <ServerIcon size={30} className="text-gray-600" />
        )}
        <div className="text-2xl font-bold">{data?.service.name}</div>
      </div>
      <div className="flex flex-col gap-10 h-full overflow-auto">
        <div>
          <div className="text-lg font-semibold">Status</div>
          {deployment ? (
            <div className="mt-2 border rounded-md p-2 shadow flex items-center justify-between">
              <StatusBadge status={deployment.status} />
              <div className="flex items-center gap-2">
                {deployment.canRedeploy ? (
                  <StartDeployment
                    deploymentId={deployment.id}
                    serviceName={data?.service.name}
                    isRedeploy
                  />
                ) : null}
                {deployment.status === "SUCCESS" ? (
                  <StopDeployment
                    deploymentId={deployment.id}
                    serviceName={data?.service.name}
                  />
                ) : null}
                {deployment.status === "REMOVED" ? (
                  <StartDeployment
                    deploymentId={deployment.id}
                    serviceName={data?.service.name}
                  />
                ) : null}
              </div>
            </div>
          ) : (
            <div className="mt-2">No deployment found</div>
          )}
        </div>
        <div>
          <div className="text-lg font-semibold">Variables</div>
          <div className="mt-2 flex flex-col gap-4 border rounded-md p-4 shadow">
            {Object.keys(data?.variables ?? {}).map((varKey) => {
              return (
                <div key={varKey} className="">
                  {/* <div className="w-1/2">{varKey}</div>
                <div>*******</div> */}
                  <Variable
                    name={varKey}
                    value={data?.variables[varKey]}
                    projectId={projectId}
                    environmentId={environmentId}
                    serviceId={serviceId}
                  />
                </div>
              );
            })}
            <AddVariable
              projectId={projectId}
              environmentId={environmentId}
              serviceId={serviceId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Variable = ({
  name,
  value,
  projectId,
  environmentId,
  serviceId,
}: {
  name: string;
  value: string;
  projectId: string;
  environmentId: string;
  serviceId: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newValue, setNewValue] = useState(value);

  useEffect(() => {
    setNewValue(value);
  }, [value]);

  const [upsertVariable, { loading: upsertLoading }] = useMutation(
    VARIABLE_UPSERT,
    {
      refetchQueries: [GET_SERVICE_DETAILS],
    }
  );

  const [deleteVariable, { loading: deleteLoading }] = useMutation(
    VARIABLE_DELETE,
    {
      refetchQueries: [GET_SERVICE_DETAILS],
    }
  );

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = () => {
    deleteVariable({
      variables: {
        projectId,
        environmentId,
        serviceId,
        name,
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    upsertVariable({
      variables: {
        projectId,
        environmentId,
        serviceId,
        name,
        value: newValue,
      },
    }).then(() => {
      setIsEditing(false);
    });
  };

  return (
    <div className="flex items-center gap-4 justify-between">
      <div className="w-1/3">{name}</div>
      <div>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              disabled={upsertLoading}
              className="h-8"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              <XIcon className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              type="submit"
              disabled={upsertLoading}
            >
              <CheckIcon className="h-4 w-4 text-green-600" />
            </Button>
          </form>
        ) : (
          "********"
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={handleEdit}
          disabled={upsertLoading}
          variant="outline"
          size="sm"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          onClick={handleDelete}
          disabled={deleteLoading}
          variant="outlineDestructive"
          size="sm"
        >
          <Trash2Icon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const AddVariable = ({
  projectId,
  environmentId,
  serviceId,
}: {
  projectId: string;
  environmentId: string;
  serviceId: string;
}) => {
  const [name, setName] = useState("");
  const [value, setValue] = useState("");

  const [upsertVariable, { loading: upsertLoading }] = useMutation(
    VARIABLE_UPSERT,
    {
      refetchQueries: [GET_SERVICE_DETAILS],
    }
  );

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await upsertVariable({
        variables: {
          name,
          value,
          projectId,
          environmentId,
          serviceId,
        },
      });
      setName("");
      setValue("");
    } catch (error) {
      console.error("Error adding variable:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleAdd} className="flex items-center gap-4">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Key"
          disabled={upsertLoading}
          className="h-8"
        />
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Value"
          disabled={upsertLoading}
          className="h-8"
        />

        <Button
          size="sm"
          variant="outline"
          type="submit"
          disabled={upsertLoading}
        >
          {upsertLoading ? <Loader2Icon className="h-4 w-4" /> : "Add"}
        </Button>
      </form>
    </div>
  );
};
