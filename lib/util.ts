import {
  Project,
  ApiOptions,
  ProjectLocation,
  ProjectParticipantsCount,
  LocationParticipantsCount,
  LocationTracking,
} from "./types";

// Constants
const API_BASE_URL: string = "https://0b5ff8b0.uqcloud.net/api";
const JWT_TOKEN: string = process.env.VITE_JWT_TOKEN as string;
const USERNAME: string = process.env.VITE_USERNAME as string;

// Helper function to handle API requests.
// It sets the Authorization token and optionally includes the request body.
async function apiRequest(
  endpoint: string,
  method = "GET",
  body: Project | ProjectLocation | null = null
) {
  const options: ApiOptions = {
    method, // Set the HTTP method (GET, POST, PATCH)
    headers: {
      "Content-Type": "application/json", // Indicate that we are sending JSON data
      Authorization: `Bearer ${JWT_TOKEN}`, // Include the JWT token for authentication
    },
  };

  // If the method is POST or PATCH, we want the response to include the full representation
  if (method === "POST" || method === "PATCH") {
    options.headers["Prefer"] = "return=representation";
  }

  // If a body is provided, add it to the request and include the username
  if (body) {
    options.body = JSON.stringify({ ...body, username: USERNAME });
  }

  // Make the API request and check if the response is OK
  const requestUrl = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Return the response as a JSON object
  return response.json();
}

// Function to insert a new project into the database.
export async function createProject(project: Project): Promise<object> {
  return apiRequest("/project", "POST", project);
}

// Function to list all projects associated with the current user.
export async function getProjects(): Promise<Array<Project>> {
  return apiRequest("/project");
}

// Function to get a single project by its ID.
export async function getProject(id: number): Promise<Array<Project>> {
  return apiRequest(`/project?id=eq.${id}`);
}

// Updates a project by id
export async function updateProject(id: number, project: Project) {
  return apiRequest(`/project?id=eq.${id}`, "PATCH", project);
}

// Deletes a project by id
export async function deleteProject(id: number) {
  return apiRequest(`/project?id=eq.${id}`, "DELETE");
}

// Create location for a project
export async function createLocation(
  location: ProjectLocation
): Promise<object> {
  return apiRequest("/location", "POST", location);
}

// Function to list all location associated with the project
export async function getLocations(
  projectId: number
): Promise<Array<ProjectLocation>> {
  return apiRequest(`/location?project_id=eq.${projectId}`);
}

// Function to get a single location by its ID.
export async function getLocation(
  locationId: number
): Promise<Array<ProjectLocation>> {
  return apiRequest(`/location?id=eq.${locationId}`);
}

// Updates a location by id
export async function updateLocation(
  locationId: number,
  location: ProjectLocation
) {
  return apiRequest(`/location?id=eq.${locationId}`, "PATCH", location);
}

// Deletes a location by id
export async function deleteLocation(locationId: number) {
  return apiRequest(`/location?id=eq.${locationId}`, "DELETE");
}

// Get project's number of participants
export async function getProjectParticipantsCount(
  id: number
): Promise<Array<ProjectParticipantsCount>> {
  //
  return apiRequest(`/project_participant_counts?project_id=eq.${id}`);
}

// Get location's number of participants
export async function getLocationParticipantsCount(
  id: number
): Promise<Array<LocationParticipantsCount>> {
  return apiRequest(`/location_participant_counts?location_id=eq.${id}`);
}

// Get locations visited by the user
export async function getLocationsVisitedByUser(
  projectId: number,
  username: string
): Promise<Array<LocationTracking>> {
  return apiRequest(
    `/tracking?project_id=eq.${projectId}&participant_username=eq.${username}`
  );
}
