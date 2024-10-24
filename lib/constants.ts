export const SCORING_OPTIONS = {
  notScored: "Not Scored",
  QRCodes: "Number of Scanned QR Codes",
  locations: "Number of Locations Entered",
} as const;

export const HOMESCREEN_DISPLAY_OPTIONS = {
  initialClue: "Display initial clue",
  allLocations: "Display all locations",
} as const;

export const LOCATION_TRIGGER_OPTIONS = {
  locationEntry: "Location Entry",
  QRCode: "QR Code Scan",
  LocationEntryAndQRCode: "Both Location Entry and QR Code Scan",
};

export const TEXT_EDITOR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["link", "image", "video"],
  ["clean"],
];
