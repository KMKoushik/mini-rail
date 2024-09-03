import { LogAlert } from "@prisma/client";
import useSWR from "swr";
import { fetcher } from "~/lib/utils";
import { Button } from "../ui/button";
import { AddAlert } from "./add-alert";

export const ServiceAlerts = ({ environmentId }: { environmentId: string }) => {
  const { data, isLoading, error } = useSWR<Array<LogAlert>>(
    `/api/logalert?environmentId=${environmentId}`,
    fetcher,
    {
      refreshInterval: 5000,
    }
  );

  return (
    <div className="flex flex-col gap-4 mt-4">
      <AddAlert environmentId={environmentId} />
      {data?.map((d) => (
        <div
          key={d.id}
          className="border rounded-lg shadow p-4 flex justify-between items-center"
        >
          <div className="w-1/5">{d.title}</div>
          <div className="w-1/5">every {d.checkEvery}s</div>
          <div className="w-1/5">
            {d.serviceIds.length === 0 ? "All" : d.serviceIds} services
          </div>
          <div className="w-1/5">
            {d.severity.length === 0 ? "All" : d.severity.join(", ")} severities
          </div>
          <div>
            <Button size="sm">Edit</Button>
          </div>
        </div>
      ))}
    </div>
  );
};
