# mapped_react_map
Snippet of a complex map component I built using React.





Building an efficient complex map component can be slightly tricky on React, since most of the rendering would be done outside the `render()` function. When building features that involve live tracking, route optmization and viewing past travel routes, the data-flow if the map-render component should be able to catch changes in props from the parent components.

In this repo I will talk about how I built a heavy-functioning map feature for tracking drivers that covers the following:

- Each driver has many jobs
- We would like to see jobs of one/multiple drivers on a particular day
- If looking at today, we would like to see each drivers' current position and their route to their future jobs today, as well as their past routes since start of day.
- If looking at past days, we woud like to see their whole day from start to finish (when they clock out).
- If looking at future days, we would like see locations of their jobs.
- Markers showing location of jobs assigned on that day that is not assigned to any drivers.
- Ability to assign/unassign jobs to/from drivers right from the interface.
- Hovering on job/driver markers should show additional information about them.
- Clicking on job/driver markers should give more details about the item.
- Efficiently update/add/remove markers based on new props being polled.
