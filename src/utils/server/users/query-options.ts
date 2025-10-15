import { queryOptions } from "@tanstack/react-query";
import { getUserByIdFn, getUserByIdPublicFn } from "./read";

export const getUserByIdQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: ["user", id],
    queryFn: () => getUserByIdFn({ data: { id } }),
  });
};

export const getUserByIdPublicQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: ["user", "public", id],
    queryFn: () => getUserByIdPublicFn({ data: { id } }),
  });
};
