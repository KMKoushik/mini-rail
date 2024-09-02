import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

const tokenFormSchema = z.object({
  token: z.string().min(1, "Token cannot be empty"),
});

type TokenFormProps = {
  handleTokenSubmit: (token: string) => void;
  currentToken?: string;
};

export const TokenForm: React.FC<TokenFormProps> = ({
  handleTokenSubmit,
  currentToken = "",
}) => {
  const form = useForm<z.infer<typeof tokenFormSchema>>({
    resolver: zodResolver(tokenFormSchema),
    defaultValues: {
      token: currentToken,
    },
  });

  function onSubmit(values: z.infer<typeof tokenFormSchema>) {
    handleTokenSubmit(values.token);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="token"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Railway token</FormLabel>
              <FormControl>
                <Input placeholder="token" {...field} />
              </FormControl>
              <FormDescription>
                Currently team token is not supported.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
