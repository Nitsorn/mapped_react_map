# mapped_react_map
Snippet of a complex map component I built using React.




sasd
Building an efficient complex map component can be slightly tricky on React, since most of the rendering would be done outside the `render()` function. When building features that involve live tracking, route optmization and viewing past travel routes, the data-flow if the map-render component should be able to catch changes in props from the parent components.
