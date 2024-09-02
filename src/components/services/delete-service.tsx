"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Trash2Icon } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useMutation } from "@apollo/client";
import { SERVICE_DELETE } from "~/lib/mutations";
import { GET_ENVIRONMENT, GET_PROJECT } from "~/lib/queries";

const FormSchema = z.object({
  confirmation: z.string(),
});

export const DeleteService = ({
  serviceId,
  serviceName,
}: {
  serviceId: string;
  serviceName: string;
}) => {
  const [open, setOpen] = useState(false);

  const [mutateFunction, { loading, error }] = useMutation(SERVICE_DELETE, {
    refetchQueries: [GET_PROJECT, GET_ENVIRONMENT],
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      confirmation: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    mutateFunction({
      variables: {
        id: serviceId,
      },
    }).then(() => {
      setOpen(false);
    });
  }

  const confirmation = form.watch("confirmation");

  return (
    <Dialog
      open={open}
      onOpenChange={(_open) => (_open !== open ? setOpen(_open) : null)}
    >
      <DialogTrigger asChild>
        <Button variant="outlineDestructive" size="sm">
          <Trash2Icon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Service</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <p className="mb-4">
            Are you sure you want to delete the service <b>{serviceName}</b>?
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6 w-full"
            >
              <FormField
                control={form.control}
                name="confirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Type <b>DELETE</b> to confirm
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="DELETE" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={loading || confirmation.toUpperCase() !== "DELETE"}
                variant="destructive"
              >
                {loading ? "Deleting..." : "Delete Service"}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
