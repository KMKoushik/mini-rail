"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { DEPLOYMENT_REMOVE } from "~/lib/mutations";
import { GET_SERVICE_DETAILS } from "~/lib/queries";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { StopCircle } from "lucide-react";

export const StopDeployment = ({
  deploymentId,
  serviceName,
}: {
  deploymentId: string;
  serviceName: string;
}) => {
  const [open, setOpen] = useState(false);

  const [mutateFunction, { loading, error }] = useMutation(DEPLOYMENT_REMOVE, {
    refetchQueries: [GET_SERVICE_DETAILS],
  });

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
        <Button variant="outlineDestructive" size="sm">
          <StopCircle className="h-4 w-4 mr-2" />
          Stop Deployment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Stop Deployment</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <p className="mb-4">
            Are you sure you want to stop the deployment for{" "}
            <b>{serviceName}</b>?
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={loading}
              variant="destructive"
            >
              {loading ? "Stopping..." : "Stop Deployment"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
