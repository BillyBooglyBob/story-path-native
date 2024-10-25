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

export type ProjectParticipantsCount = {
  project_id: number;
  number_participants: number;
};

export type LocationParticipantsCount = {
  project_id: number;
  location_id: number;
  number_participants: number;
};

// The type for components/locationMap
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


// coordinates: {
//   latitude: x,
//   longitude: y,
// },
// id: location.id,
// location: location.location_name,
// distance: {
//   metres: 0,
//   nearby: false,
// }
// }