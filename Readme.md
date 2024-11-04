Used a lot of AI in this assignment, just going to list a few for brevity:

- transform the app/profile.tsx to have the image changable by clicking
  on the profile page
- app/projects/index.tsx went from map to Flatlist to list out the projects
- app/index.tsx helped find out how to create a red blurred shape

For the list of projects, the UQ project is the one made with proper
locations based in Brisbane, the other projects have locations all over the
place or no locations at all.

The scoring is based purely on the location_trigger of each locations,
ignoring the scoring_type set for each project.

The location tracking is done so when the user is in the [id] tabs, if they
are within any of the marked locations and it hasn't been visited before,
a location pop up will be show. Irrespective of if they are in the index tab,
map tab or the qr code tab.
