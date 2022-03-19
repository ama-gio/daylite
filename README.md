![GitHub package.json version](https://img.shields.io/github/package-json/v/mcneel/compute.rhino3d.appserver/main?label=version&style=flat-square)
![node-current (scoped)](https://img.shields.io/badge/dynamic/json?label=node&query=engines.node&url=https%3A%2F%2Fraw.githubusercontent.com%2Fmcneel%2Fcompute.rhino3d.appserver%2Fmain%2Fpackage.json&style=flat-square&color=dark-green)

# project brief
Volumetric massing diagram using Grasshopper

## description
The volumetric massing app will require point inputs for the vertices of the site boundary. The user can draw the site boundary by holding ctrl and clicking on the canvas at least three times. After creating the site boundary, buildings will populate the site with random dimensions. 
Using parametric sliders, the user can control various properties of the buildings, such as: the number of buildings, their dimension, their shape, their rotation, and their height, as well as the floor height.  It is also possible to change the seed to re-generate more iterations with the same settings. 
The data outputs will be the following:
perimeter of the site boundary
total perimeter of the buildings
area of the site 
total area of the buildings, including all the floors 
total volume of the resulting geometry
number of floors

The output geometry will have a color attached to each volume representing the height.

## plugins
Kangaroo

## data flow diagram
Miro link: https://miro.com/app/board/uXjVOMjxtEs=/ 

## author
amanda gioia
background: architecture + design technology
faculty: david andres leon + hesham shawqy
course: cloud based data management
program: MaCAD from Institute for Advanced Architecture of Catalonia

## credits
very special thanks to my instructors david andres leon + hesham shawqy and my classmates, especially sophie moore, and silvio!
