"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { DEPLOYMENT_REDEPLOY } from "~/lib/mutations";
import { GET_SERVICE_DETAILS } from "~/lib/queries";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { PlayCircle, RefreshCcwIcon } from "lucide-react";

export const StartDeployment = ({
  deploymentId,
  serviceName,
  isRedeploy,
}: {
  deploymentId: string;
  serviceName: string;
  isRedeploy?: boolean;
}) => {
  const [open, setOpen] = useState(false);

  const [mutateFunction, { loading, error }] = useMutation(
    DEPLOYMENT_REDEPLOY,
    {
      refetchQueries: [GET_SERVICE_DETAILS],
    }
  );

  function onConfirm() {
    mutateFunction({
      variables: {
        id: deploymentId,
      },
    }).then(() => {
      setOpen(false);
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(_open) => (_open !== open ? setOpen(_open) : null)}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {isRedeploy ? (
            <RefreshCcwIcon className="h-4 w-4 mr-2 text-blue-600" />
          ) : (
            <PlayCircle className="h-4 w-4 mr-2 text-green-600" />
          )}
          {isRedeploy ? "Redeploy" : "Start Deployment"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isRedeploy ? "Redeploy" : "Start Deployment"}
          </DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <p className="mb-4">
            Are you sure you want to {isRedeploy ? "redeploy" : "start"} the
            deployment for <b>{serviceName}</b>?
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={onConfirm} disabled={loading}>
              {loading ? "Starting..." : "Start Deployment"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
