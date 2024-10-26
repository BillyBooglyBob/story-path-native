// ProjectContext.js
import React, { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProject, getLocations } from "../lib/util"; // Assume these functions fetch the data
import { Project, ProjectLocation } from "../lib/types";

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
  children,
}: {
  projectId: string;
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
    data: locations,
  } = useQuery<ProjectLocation[]>({
    queryKey: ["locations", projectId],
    queryFn: () => getLocations(Number(projectId)),
  });

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
