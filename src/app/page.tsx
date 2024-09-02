"use client";

import { useQuery } from "@apollo/client";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { gql } from "~/__generated__";
import { CreateProject } from "~/components/projects/create-project";
import { GET_DASHBOARD } from "~/lib/queries";

export default function Home() {
  const { loading, error, data } = useQuery(GET_DASHBOARD);

  return (
    <main className="">
      <div className="flex justify-between items-center ">
        <div>
          <h1 className="text-lg font-semibold">
            Projects{" "}
            {data?.projects.edges.length
              ? `(${data?.projects.edges.length})`
              : ""}
          </h1>
        </div>
        <CreateProject />
      </div>
      <div className="flex flex-col gap-10 mt-10">
        {data?.projects.edges.map((project) => (
          <Link
            href={`/project/${project.node.id}/${project.node.environments.edges[0].node.id}`}
            key={project.node.id}
          >
            <div className="border p-4 rounded-lg shadow flex gap-4">
              <div className="w-1/3">{project.node.name}</div>
              <div className="text-muted-foreground">
                {project.node.services.edges.length} services
              </div>
              <div className="text-muted-foreground">
                {project.node.environments.edges.length} environments
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
