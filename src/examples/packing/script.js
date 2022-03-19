import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.126.0/build/three.module.js'
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.126.0/examples/jsm/controls/OrbitControls.js'
import { Rhino3dmLoader } from 'https://cdn.jsdelivr.net/npm/three@0.126.0/examples/jsm/loaders/3DMLoader.js'
import rhino3dm from 'https://cdn.jsdelivr.net/npm/rhino3dm@0.15.0-beta/rhino3dm.module.js'

// set up loader for converting the results to threejs
const loader = new Rhino3dmLoader()
loader.setLibraryPath( 'https://cdn.jsdelivr.net/npm/rhino3dm@0.15.0-beta/' )

// initialise 'data' object that will be used by compute()
const data = {
  definition: 'packing.gh',
  inputs: getInputs(),
  //'points': [] // start with an empty list (corresponds to "points" input)
}

data.inputs = {...data.inputs, 'points':[]}

// globals
let rhino, doc
let clickCounter = 0;

rhino3dm().then(async m => {
    rhino = m

    init()
    // compute() // don't compute until user clicks - see onClick()
  })

const downloadButton = document.getElementById("downloadButton")
downloadButton.onclick = download

const mouse = new THREE.Vector3()
window.addEventListener( 'click', onClick, false);

  /////////////////////////////////////////////////////////////////////////////
 //                            HELPER  FUNCTIONS                            //
/////////////////////////////////////////////////////////////////////////////

/**
 * Gets <input> elements from html and sets handlers
 * (html is generated from the grasshopper definition)
 */
function getInputs() {
  const inputs = {}
  for (const input of document.getElementsByTagName('input')) {
    switch (input.type) {
      case 'number':
        inputs[input.id] = input.valueAsNumber
        input.onchange = onSliderChange
        break
      case 'range':
        inputs[input.id] = input.valueAsNumber
        input.onmouseup = onSliderChange
        input.ontouchend = onSliderChange
        break
      case 'checkbox':
        inputs[input.id] = input.checked
        input.onclick = onSliderChange
        break
      default:
        break
    }
  }
  return inputs
}

// more globals
let scene, camera, renderer, controls, buildingArea, siteArea, sitePerimeter, buildingPerimeter, volume, floorsCount

/**
 * Sets up the scene, camera, renderer, lights and controls and starts the animation
 */
function init() {

    // Rhino models are z-up, so set this as the default
    THREE.Object3D.DefaultUp = new THREE.Vector3( 0, 0, 1 );

    // create a scene and a camera
    scene = new THREE.Scene()
    
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)
    camera.position.set(1, -1, 1) // like perspective view

    // very light grey for background, like rhino
    scene.background = new THREE.Color('rgb(241, 240, 240)')

    // create the renderer and add it to the html
    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio( window.devicePixelRatio )
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    // add some controls to orbit the camera
    controls = new OrbitControls(camera, renderer.domElement)

    // add a directional light
    const directionalLight1 = new THREE.DirectionalLight( 0xffffff )
    directionalLight1.position.set( 0, 0, 0 )
    directionalLight1.castShadow = false
    directionalLight1.intensity = 2
    scene.add( directionalLight1 )


    const directionalLight2 = new THREE.DirectionalLight( 0xffffff )
    directionalLight2.position.set( -20, -20, -20 )
    directionalLight2.castShadow = false
    directionalLight2.intensity = 2
    scene.add( directionalLight2 )

    const directionalLight3 = new THREE.DirectionalLight( 0xffffff )
    directionalLight3.position.set( 20, 20, 20 )
    directionalLight3.castShadow = false
    directionalLight3.intensity = 2
    scene.add( directionalLight3 )

    const ambientLight = new THREE.AmbientLight()
    scene.add( ambientLight )

    // handle changes in the window size
    window.addEventListener( 'resize', onWindowResize, false )

    animate()
}

/**
 * Call appserver
 */
 async function compute() {
 
  console.log(data.inputs)

  const request = {
    'method': 'POST',
    'body': JSON.stringify(data),
    'headers': { 'Content-Type': 'application/json' }
  }
  console.log(request)
  
  try {
    const response = await fetch('/solve', request)
  
    if(!response.ok) {
      // TODO: check for errors in response json
      throw new Error(response.statusText)
    }

    const responseJson = await response.json()

    collectResults(responseJson)

  } catch(error) {
    console.error(error)
  }
}


/**
 * Parse response
 */
function collectResults(responseJson) {

    const values = responseJson.values

    // clear doc
    if( doc !== undefined)
        doc.delete()

    //console.log(values)
    doc = new rhino.File3dm()

    // for each output (RH_OUT:*)...
    for ( let i = 0; i < values.length; i ++ ) {
      // ...iterate through data tree structure...
      for (const path in values[i].InnerTree) {
        const branch = values[i].InnerTree[path]
        // ...and for each branch...
        for( let j = 0; j < branch.length; j ++) {
          // ...load rhino geometry into doc
          const rhinoObject = decodeItem(branch[j])

          //GET VALUES
            if (values[i].ParamName == "RH_OUT:buildingArea") {
            //buildingArea = JSON.parse(responseJson.values[i].InnerTree['{ 0; }'][0].data)
            buildingArea = Math.round(branch[j].data)

            console.log(buildingArea)
          }

          if (values[i].ParamName == "RH_OUT:siteArea") {
            //siteArea = JSON.parse(responseJson.values[i].InnerTree['{ 0; }'][0].data)
            siteArea = Math.round(branch[j].data)

            console.log(siteArea)
          }

          if (values[i].ParamName == "RH_OUT:sitePerimeter") {
            //sitePerimeter = JSON.parse(responseJson.values[i].InnerTree['{ 0; }'][0].data)
            sitePerimeter = Math.round(branch[j].data)

            console.log(buildingPerimeter)
          }

          if (values[i].ParamName == "RH_OUT:buildingPerimeter") {
            //buildingPerimeter = JSON.parse(responseJson.values[i].InnerTree['{ 0; }'][0].data)
            buildingPerimeter = Math.round(branch[j].data)

            console.log(buildingPerimeter)
          }

          
          if (values[i].ParamName == "RH_OUT:volume") {
            //volume = JSON.parse(responseJson.values[i].InnerTree['{ 0; }'][0].data)
            volume = Math.round(branch[j].data)

            console.log(volume)
          }

          if (values[i].ParamName == "RH_OUT:floorsCount") {
            //floorsCount = JSON.parse(responseJson.values[i].InnerTree['{ 0; }'][0].data)
            floorsCount = Math.round(branch[j].data)

            console.log(floorsCount)
          }

          if (rhinoObject !== null) {
            doc.objects().add(rhinoObject, null)
          }
        }
      }
    }

     //GET VALUES
     document.getElementById('siteArea').innerText = "Site Area = " + siteArea + " m2"
     document.getElementById('buildingArea').innerText = "Total Building Area = " + buildingArea + " m2"
     document.getElementById('sitePerimeter').innerText = "Site Perimeter = " + sitePerimeter + " m"
     document.getElementById('buildingPerimeter').innerText = "Total Building Perimeter = " + buildingPerimeter + " m"
     document.getElementById('volume').innerText = "Total Building Volume = " + volume + " m3"
     document.getElementById('floorsCount').innerText = "Number of Floors = " + floorsCount

    if (doc.objects().count < 1) {
      console.error('No rhino objects to load!')
      showSpinner(false)
      return
    }

    // hack (https://github.com/mcneel/rhino3dm/issues/353)
    doc.objects().addSphere(new rhino.Sphere([0,0,0], 1), null)

    // load rhino doc into three.js scene
    const buffer = new Uint8Array(doc.toByteArray()).buffer
    loader.parse( buffer, function ( object ) 
    {
      //cool colors
        // object.traverse(child => {
        //   if (child.material !== undefined)
        //     child.material = new THREE.MeshNormalMaterial()
        // }, false)

       // color Mesh
      object.traverse(child => {
        if (child.isMesh) {
          if (child.userData.attributes.geometry.userStringCount > 0) {
            //console.log(child.userData.attributes.geometry.userStrings[0][1])
            const col = child.userData.attributes.geometry.userStrings[0][1]
            const threeColor = new THREE.Color( "rgb(" + col + ")")
            const mat = new THREE.MeshPhysicalMaterial( {color: threeColor, transparent: true, opacity: 0.8})
            child.material = mat 
          }
        }
      })


        // clear objects from scene. do this here to avoid blink
        scene.traverse(child => {
            if (!child.isLight) {
                scene.remove(child)
            }
        })

      // color crvs
      object.traverse(child => {
        if (child.isLine) {
          if (child.userData.attributes.geometry.userStringCount > 0) {
            //console.log(child.userData.attributes.geometry.userStrings[0][1])
            const col = child.userData.attributes.geometry.userStrings[0][1]
            const threeColor = new THREE.Color( "rgb(" + col + ")")
            const mat = new THREE.LineBasicMaterial({color:threeColor})
            child.material = mat            
          }
        }
      })

        // add object graph from rhino model to three.js scene
        scene.add( object )

        // hide spinner and enable download button
        showSpinner(false)
        downloadButton.disabled = false

        // zoom to extents
        zoomCameraToSelection(camera, controls, scene.children)
    })
}

/**
 * Attempt to decode data tree item to rhino geometry
 */
function decodeItem(item) {
  const data = JSON.parse(item.data)
  if (item.type === 'System.String') {
    // hack for draco meshes
    try {
        return rhino.DracoCompression.decompressBase64String(data)
    } catch {} // ignore errors (maybe the string was just a string...)
  } else if (typeof data === 'object') {
    return rhino.CommonObject.decode(data)
  }
  return null
}

/**
 * Called when a slider value changes in the UI. Collect all of the
 * slider values and call compute to solve for a new scene
 */
function onSliderChange () {
  showSpinner(true)
  // get slider values
  let inputs = {}
  for (const input of document.getElementsByTagName('input')) {
    switch (input.type) {
    case 'number':
      inputs[input.id] = input.valueAsNumber
      break
    case 'range':
      inputs[input.id] = input.valueAsNumber
      break
    case 'checkbox':
      inputs[input.id] = input.checked
      break
    }
  }
  
  data.inputs = inputs

  compute()
}

/**
 * Handle click events
 */
 function onClick( event ) {
  clickCounter++;
  if(clickCounter > 2) {
    document.getElementById('instructions').style.display = "none";
  }
  console.log(mouse)
  console.log(`The ctrl key is pressed: ${event.ctrlKey}`)
  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components
  if(event.ctrlKey){
    mouse.x = ( event.clientX / window.innerWidth ) * 100 - 1
    mouse.y = - ( event.clientY / window.innerHeight ) * 100 + 1
    mouse.z = 0
    mouse.unproject(camera)

    console.log( `${mouse.x},${mouse.y},${mouse.z}` )

    // add json-encoded Point3d to list
    // e.g. '{ "X": 1.0, "Y": 2.0, "Z": 0.0 }'
    const pt = "{\"X\":"+mouse.x+",\"Y\":"+mouse.y+",\"Z\":"+0+"}"
    // in delaunay.gh the input is "points"
    data.inputs['points'].push(pt)

    // don't bother solving until we have three points
    if (data.inputs['points'].length < 3) {
      console.log("Need at least three points!")
      return
    }

    // solve and update the geometry!
    compute()
  }
}

/**
 * The animation loop!
 */
function animate() {
  requestAnimationFrame( animate )
  controls.update()
  renderer.render(scene, camera)
}

/**
 * Helper function for window resizes (resets the camera pov and renderer size)
  */
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize( window.innerWidth, window.innerHeight )
  animate()
}

/**
 * Helper function that behaves like rhino's "zoom to selection", but for three.js!
 */
function zoomCameraToSelection( camera, controls, selection, fitOffset = 1.2 ) {
  
  const box = new THREE.Box3();
  
  for( const object of selection ) {
    if (object.isLight) continue
    box.expandByObject( object );
  }
  
  const size = box.getSize( new THREE.Vector3() );
  const center = box.getCenter( new THREE.Vector3() );
  
  const maxSize = Math.max( size.x, size.y, size.z );
  const fitHeightDistance = maxSize / ( 2 * Math.atan( Math.PI * camera.fov / 360 ) );
  const fitWidthDistance = fitHeightDistance / camera.aspect;
  const distance = fitOffset * Math.max( fitHeightDistance, fitWidthDistance );
  
  const direction = controls.target.clone()
    .sub( camera.position )
    .normalize()
    .multiplyScalar( distance );
  controls.maxDistance = distance * 10;
  controls.target.copy( center );
  
  camera.near = distance / 100;
  camera.far = distance * 100;
  camera.updateProjectionMatrix();
  camera.position.copy( controls.target ).sub(direction);
  
  controls.update();
  
}

/**
 * This function is called when the download button is clicked
 */
function download () {
    // write rhino doc to "blob"
    const bytes = doc.toByteArray()
    const blob = new Blob([bytes], {type: "application/octect-stream"})

    // use "hidden link" trick to get the browser to download the blob
    const filename = data.definition.replace(/\.gh$/, '') + '.3dm'
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = filename
    link.click()
}

/**
 * Shows or hides the loading spinner
 */
function showSpinner(enable) {
  if (enable)
    document.getElementById('loader').style.display = 'block'
  else
    document.getElementById('loader').style.display = 'none'
}