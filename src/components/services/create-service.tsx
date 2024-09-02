"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Plus } from "lucide-react";
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
import { SERVICE_CREATE, SERVICE_INSTANCE_CONNECT } from "~/lib/mutations";
import { GET_ENVIRONMENT, GET_PROJECT } from "~/lib/queries";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Service name must be at least 2 characters.",
  }),
  image: z.string().min(1, {
    message: "Image name is required.",
  }),
});

export const CreateService = ({
  projectId,
  environmentId,
}: {
  projectId: string;
  environmentId?: string;
}) => {
  const [open, setOpen] = useState(false);

  const [mutateFunction, { loading }] = useMutation(SERVICE_CREATE, {
    refetchQueries: [GET_PROJECT, GET_ENVIRONMENT],
  });

  const [mutateConnectGithubFunction, { loading: loadingInstance }] =
    useMutation(SERVICE_INSTANCE_CONNECT, {
      refetchQueries: [GET_PROJECT, GET_ENVIRONMENT],
    });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      image: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const isRepo = data.image.startsWith("https://github.com/");
    const repo = isRepo
      ? data.image.substring("https://github.com/".length)
      : null;

    const service = await mutateFunction({
      variables: {
        projectId,
        environmentId,
        name: data.name,
        image: isRepo ? null : data.image,
        repo: isRepo ? repo : null,
      },
    });

    // connect github repo and branch to service to trigger a build
    if (isRepo && service.data && repo) {
      try {
        await mutateConnectGithubFunction({
          variables: {
            id: service.data.serviceCreate.id,
            branch: "main",
            repo,
          },
        });
      } catch (error) {
        // no problem, this usually fails cuz no service instance is found but this will trigger a build and creates an instance
        console.error(error);
      }
    }

    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(_open) => (_open !== open ? setOpen(_open) : null)}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-1" />
          Create Service
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new service</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6 w-full"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Name</FormLabel>
                    <FormControl>
                      <Input placeholder="My Awesome Service" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image or Repository</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="nginx:latest or https://github.com/org/repo"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading || loadingInstance}>
                {loading || loadingInstance ? "Creating..." : "Create Service"}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
