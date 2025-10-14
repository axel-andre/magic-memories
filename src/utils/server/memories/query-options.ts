import { queryOptions, infiniteQueryOptions } from "@tanstack/react-query";
import { getAllMemoriesFnPaginated, getMemoryByIdFn } from "./read";

export const getAllMemoriesQueryOptions = (page: number, limit: number) => {
  return queryOptions({
    queryKey: ["memories", page, limit],
    queryFn: () =>
      getAllMemoriesFnPaginated({
        data: {
          page,
          limit,
        },
      }),
  });
};

export const getMemoryByIdQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: ["memory", id],
    queryFn: () => getMemoryByIdFn({ data: { id } }),
  });
};

export const getAllMemoriesInfiniteQueryOptions = (limit: number) => {
  return infiniteQueryOptions({
    queryKey: ["memories", "infinite", limit],
    queryFn: ({ pageParam }) =>
      getAllMemoriesFnPaginated({
        data: {
          page: pageParam,
          limit,
        },
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.length < limit) {
        return undefined;
      }
      return lastPageParam + 1;
    },
  });
};
