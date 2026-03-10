import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Plant } from "../backend.d";
import { useActor } from "./useActor";

export function useInitializePlants() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) return;
      await actor.initializePlants();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plants"] });
    },
  });
}

export function useGetPlants() {
  const { actor, isFetching } = useActor();
  return useQuery<Plant[]>({
    queryKey: ["plants"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPlants();
    },
    enabled: !!actor && !isFetching,
  });
}
