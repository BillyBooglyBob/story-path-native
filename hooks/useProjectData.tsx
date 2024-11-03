import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTracking,
  getLocations,
  getLocationsVisitedByUser,
  getProject,
} from "../lib/util";
import {
  LocationTracking,
  Project,
  ProjectLocation,
} from "../lib/types";

export const useProjectData = (projectId: number, username: string) => {
  const queryClient = useQueryClient();

  const projectQuery = useQuery<Project[]>({
    queryKey: ["project", projectId],
    queryFn: () => getProject(Number(projectId)),
  });

  // Retrieve project locations
  const locationQuery = useQuery<ProjectLocation[]>({
    queryKey: ["locations", projectId],
    queryFn: () => getLocations(Number(projectId)),
  });

  // Retrieve locations visited by the user
  const locationTrackingQuery = useQuery<LocationTracking[]>({
    queryKey: ["locationsVisited", username],
    queryFn: () => getLocationsVisitedByUser(Number(projectId), username ?? ""),
  });

  const createTrackingFn = async (
    location: ProjectLocation,
    locationScored: boolean
  ) => {
    return createTracking(
      Number(projectId),
      location,
      username,
      locationScored
    );
  };

  const setLocationVisitedMutation = useMutation({
    mutationFn: ({
      location,
      locationScored,
    }: {
      location: ProjectLocation;
      locationScored: boolean;
    }) => createTrackingFn(location, locationScored),
    onSuccess: () => {
      console.log("Location marked as visited");

      // Invalidate the location query to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ["locationsVisited", username],
      });
      queryClient.invalidateQueries({ queryKey: ["locations", projectId] });
    },
    onError: (error) => {
      console.log("Error marking location as visited", error);
    },
  });

  return {
    projectQuery,
    locationQuery,
    locationTrackingQuery,
    setLocationVisitedMutation,
  };
};
