// ProjectContext.js
import React, { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getProject,
  getLocations,
  getLocationsVisitedByUser,
} from "../lib/util"; // Assume these functions fetch the data
import { LocationTracking, Project, ProjectLocation } from "../lib/types";
import { HOMESCREEN_DISPLAY_OPTIONS } from "../lib/constants";

// Define the shape of your context
interface ProjectContextType {
  project: Project | undefined;
  projectStatus: "error" | "success" | "pending";
  projectError: Error | null;
  locations: ProjectLocation[] | undefined;
  locationStatus: "error" | "success" | "pending";
  locationError: Error | null;
}
const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProject = () => useContext(ProjectContext);

export function ProjectProvider({
  projectId,
  username,
  children,
}: {
  projectId: string;
  username: string;
  children: React.ReactNode;
}) {
  // Retrieve project details
  const {
    status: projectStatus,
    error: projectError,
    data: projectData,
  } = useQuery<Project[]>({
    queryKey: ["project", projectId],
    queryFn: () => getProject(Number(projectId)),
  });

  const project = projectData?.[0];

  // Retrieve project locations
  const {
    status: locationStatus,
    error: locationError,
    data: locationsData,
  } = useQuery<ProjectLocation[]>({
    queryKey: ["locations", projectId],
    queryFn: () => getLocations(Number(projectId)),
  });

  const { data: locationsVisitedData } = useQuery<LocationTracking[]>({
    queryKey: ["locationsVisited", projectId],
    queryFn: () => getLocationsVisitedByUser(Number(projectId), username),
  });

  // Filter locations based on project setting
  // Either show all locations or only visited locations
  let locations = locationsData;
  if (project?.homescreen_display !== HOMESCREEN_DISPLAY_OPTIONS.allLocations) {
    // Filter for locations visited by the user only
    locations = locations?.filter((location) => {
      return locationsVisitedData?.some(
        (visitedLocation) => visitedLocation.location_id === location.id
      )
    });
  }

  // Pass both project and locations data along with their status/error info
  const contextValue = {
    project,
    projectStatus,
    projectError,
    locations,
    locationStatus,
    locationError,
  };

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
}
