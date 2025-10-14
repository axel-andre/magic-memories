import { queryOptions } from "@tanstack/react-query";

const getUserByIdQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: ["user", id],
    queryFn: () => getUserByIdFn({ data: { id } }),
  });
};
