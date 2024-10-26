// ProjectContext.js
import React, { createContext, useContext } from "react";
import { useQueries, useQuery, UseQueryResult } from "@tanstack/react-query";
import { getProjects, getProjectParticipantsCount } from "../lib/util"; // Assume these functions fetch the data
import { Project, ProjectParticipantsCount } from "../lib/types";

// Define the shape of your context
interface ProjectListContextType {
  projects: Project[] | undefined;
  status: "error" | "success" | "pending";
  error: Error | null;
  participantQueries: UseQueryResult<ProjectParticipantsCount[], Error>[];
}

const ProjectListContext = createContext<ProjectListContextType | undefined>(
  undefined
);

export const useProjectList = () => useContext(ProjectListContext);

export function ProjectListProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    status,
    error,
    data: projects,
  } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  // Get the number of participants for each project
  const participantQueries = useQueries({
    queries: (projects || []).map((project) => ({
      queryKey: ["participants", project.id],
      queryFn: () => getProjectParticipantsCount(project.id!),
      enabled: !!project.id, // Only run if the project has an ID
    })),
  });

  // Pass both project and locations data along with their status/error info
  const contextValue = {
    projects,
    status,
    error,
    participantQueries,
  };

  return (
    <ProjectListContext.Provider value={contextValue}>
      {children}
    </ProjectListContext.Provider>
  );
}
