import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

const FormSchema = z.object({
  title: z.string().min(2, {
    message: "Alert title must be at least 2 characters.",
  }),
  checkEvery: z.number().min(1, {
    message: "Check interval must be at least 1 second.",
  }),
  logLimit: z.number().min(1, {
    message: "Log limit must be at least 1.",
  }),
  filter: z.string().optional(),
  severity: z.array(z.string()),
  email: z.string().email({
    message: "Invalid email address.",
  }),
});

export const AddAlert = ({ environmentId }: { environmentId: string }) => {
  const [open, setOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const createAlert = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/logalert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, environmentId }),
      });
      if (!response.ok) {
        throw new Error("Failed to create alert");
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating alert:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      checkEvery: 300,
      logLimit: 20,
      severity: [],
      filter: "",
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await createAlert(data);
      setOpen(false);
    } catch (error) {
      console.error("Error creating alert:", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-[200px]">
          <Plus className="h-4 w-4 mr-1" />
          Add Alert
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new alert</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alert Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="checkEvery"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Check Interval (seconds)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Log Limit</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="severity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Severity Levels</FormLabel>
                  <FormControl>
                    {/* Add a multi-select component for severity levels */}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="filter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Filter</FormLabel>
                  <FormControl>
                    <Input placeholder="prisma error" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Alert"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
