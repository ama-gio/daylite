![GitHub package.json version](https://img.shields.io/github/package-json/v/mcneel/compute.rhino3d.appserver/main?label=version&style=flat-square)
![node-current (scoped)](https://img.shields.io/badge/dynamic/json?label=node&query=engines.node&url=https%3A%2F%2Fraw.githubusercontent.com%2Fmcneel%2Fcompute.rhino3d.appserver%2Fmain%2Fpackage.json&style=flat-square&color=dark-green)

# project brief
DayLite

## description
DayLite responds to the issues with daylight analysis tools, which require an investment in time and training. DayLite is a tool related to Machine Learning supervised predictions for quick and easy daylighting design. The designs can be evaluated and the selected design can be generated in 3D modeling software and a web application.
<p>Using parametric sliders, the user can control various properties of the a site, such as:</p>
<p>- Floor Height</p>
<p>- Room Dimensions</p>
<p>- Room Orientation</p>
<p>- Window Height</p> 
<p>- Window Sill Height</p>  
<p>- Shading Depth</p>
<p>- Glazing Ratio</p>
<p>- Context Height</p>
<p>- Context Offset </p>
<p>The Daylighting predicted outputs are the following</p> 
<p>1. Spatial Daylight Autonomy (sDA)</p>
<p>2. Useful Daylight Illuminance (UDI)</p>
<p>3. Annual Sunlight Exposure (ASE)</p>

## plugins
<p>Ladybug & Honeybee</p>
<p>Pufferfish</p>

## workflow diagram
![workflow](https://github.com/ama-gio/daylite/blob/main/wokflow.png?raw=true)

## instructions
<p>The machineLearning folder</p>
<p>1. roomsGenerator.gh =  grasshopper script used to produce a generative dataset of rooms</p>
<p>2. daylighting_Macedonia.gh = grasshopper script used to conduct a Daylighting Analysis on each model and record the results to a csv file.</p>
<p>3. roomDaylightData_Training_split.csv = Resulting csv dataset.</p>
<p>4. CleaningData.ipynb = preparing data for Machine Learning</p>
<p>5. PCA_LinRegress_ANN.ipynb = Data analysis and Machine Learning</p>
<p>6. Hops_DaylightPrediction.ipynb = runs flask ngrok for the machine learning model predications in grasshopper.</p>
<p>7. hops.gh = Using the grasshopper hops server and flask ngrok, the machine learning model can be brought back into grasshopper and tested on new models.</p>
<p>The rest of the folders are copied from https://github.com/mcneel/compute.rhino3d.appserver for deploying the web application. </p>
<p>See the folders src>files for the grasshopper file, and src>examples for the html and javascript files.</p>

## author
<p>Amanda Gioia</p>
<p>Background: Architecture + Design Technology</p>
<p>Faculty: Angelos Chronis </p>
<p>Course: Thesis</p>
<p>Program: MaCAD from Institute for Advanced Architecture of Catalonia</p>

## credits
Very special thanks to Angelos Chronis, Aleksandra Jastrzebska, Aris Vartholomaios, David Andres Leon, Hesham Shawqy, and Sophie Moore!