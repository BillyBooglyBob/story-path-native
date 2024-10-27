import {
  SCORING_OPTIONS,
  HOMESCREEN_DISPLAY_OPTIONS,
  LOCATION_TRIGGER_OPTIONS,
} from "./constants";

type Scoring = (typeof SCORING_OPTIONS)[keyof typeof SCORING_OPTIONS];

type HomeScreenDisplay =
  (typeof HOMESCREEN_DISPLAY_OPTIONS)[keyof typeof HOMESCREEN_DISPLAY_OPTIONS];

export type Project = {
  id?: number;
  title: string;
  description: string;
  is_published: boolean;
  participant_scoring: Scoring;
  instructions: string;
  initial_clue?: string;
  homescreen_display: HomeScreenDisplay;
  username?: string;
};

export type Projects = Project[];

export type ApiOptions = {
  method: string;
  headers: {
    "Content-Type": string;
    Authorization: string;
    Prefer?: string;
  };
  body?: string;
};

type LocationTriggers =
  (typeof LOCATION_TRIGGER_OPTIONS)[keyof typeof LOCATION_TRIGGER_OPTIONS];

export type ProjectLocation = {
  location_name: string;
  location_trigger: LocationTriggers;
  location_position: string;
  score_points: number;
  clue?: string;
  location_content: string;
  username: string;
  project_id: number;
  id?: number;
  location_order?: number;
  extra?: string;
};

// Type returned from API tracking user visits to locations
export type LocationTracking = {
  id?: number;
  project_id: number;
  location_id: number;
  username?: string;
  points: number;
  participant_username: string;
};

// Location data containing only geographical information
export type Location = {
  id: number;
  location: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  distance: {
    metres: number;
    nearby: boolean;
  };
};

// Keep track of user's current location
export type UserLocation = {
  latitude: number;
  longitude: number;
  longitudeDelta: number;
  latitudeDelta: number;
};

export type MapState = {
  locations: Location[];
  userLocation: UserLocation;
  nearbyLocation: Location;
};

// # of participants in a project
export type ProjectParticipantsCount = {
  project_id: number;
  number_participants: number;
};

// # of participants in a location
export type LocationParticipantsCount = {
  project_id: number;
  location_id: number;
  number_participants: number;
};
