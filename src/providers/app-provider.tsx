"use client";

import { useState, useEffect } from "react";

import { ApolloClientProvider } from "./apollo-provider";

import { Button } from "~/components/ui/button";
import { TokenForm } from "~/components/token-form";
import { GET_DASHBOARD, GET_ME } from "~/lib/queries";
import { useQuery } from "@apollo/client";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { AlertCircle, Loader2Icon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Toaster } from "~/components/ui/sonner";
import { useRouter } from "next/navigation";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  const handleTokenSubmit = (newToken: string) => {
    localStorage.setItem("authToken", newToken);
    setToken(newToken);
  };

  if (isLoading) {
    return null;
  }

  if (!token) {
    return (
      <div className=" max-w-xl mx-auto mt-20">
        <div className=" text-xl font-semibold mb-10">Mini Railway</div>
        <p className="mb-2 text-xl">Need Railway API token to continue</p>
        <TokenForm handleTokenSubmit={handleTokenSubmit} />
      </div>
    );
  }

  return (
    <ApolloClientProvider token={token}>
      <AuthProvider onTokenUpdate={handleTokenSubmit}>{children}</AuthProvider>
      <Toaster />
    </ApolloClientProvider>
  );
};

// to verify if the given auth is valid
const AuthProvider = ({
  children,
  onTokenUpdate,
}: {
  children: React.ReactNode;
  onTokenUpdate: (token: string) => void;
}) => {
  const { data } = useQuery(GET_ME);
  const {
    data: dashboardData,
    loading: dashboardLoading,
    error: dashboardError,
  } = useQuery(GET_DASHBOARD);

  const router = useRouter();

  if (dashboardLoading && !dashboardData) {
    return (
      <div className="h-full container py-10 flex justify-center items-center">
        <Loader2Icon className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (dashboardError) {
    return (
      <div className=" max-w-xl mx-auto mt-20 flex flex-col gap-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Token seems to be invalid. Try again!
          </AlertDescription>
        </Alert>
        <TokenForm handleTokenSubmit={onTokenUpdate} />
      </div>
    );
  }

  return (
    <div className="h-full container py-5">
      <nav className=" flex justify-between mb-28 items-center">
        <div className=" text-xl font-semibold">Mini Railway</div>
        <div>
          <div className="flex gap-2 items-center">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={data?.me.avatar ?? undefined}
                alt={data?.me.name ?? "name"}
              />
              <AvatarFallback>TM</AvatarFallback>
            </Avatar>
            <div className="">
              <p>{data?.me.name ?? data?.me.email}</p>
              <Button
                variant="outline"
                size="sm"
                className=" py-2 h-6"
                onClick={() => {
                  onTokenUpdate("");
                  router.replace("/");
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {children}
    </div>
  );
};
