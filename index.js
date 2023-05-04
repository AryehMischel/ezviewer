const Jimp = require('jimp') ; //javascript image manipulation https://github.com/jimp-dev/jimp
const fs = require('fs'); // file system 
const storage = require('node-persist'); //persistent data so we can keep count of files and avoid overwriting 


/* 
*  SIMPLE TOOL FOR SPLITTING 360 STEREOSCOPIC IMAGES.
*  IMPORTANT** EXPECTS STEREO IMAGES TO BE FORMATTED  WITH THE TOP HALF OF THE IMAGE BEING THE LEFT EYE POV AND THE BOTTOM HALF BEING THE RIGHT EYE POV. 
*  NOTE: THIS IS SIMPLY AN EXTENSION OF MY PROJECT WORKFLOW SO IT ISN'T VERY ROBUST.                                                               
* * */

storage.initSync();
//storage.removeItemSync("counter")                     //uncomment this to reset counter 
storage.getItemSync('counter') == null ? storage.setItemSync('counter', 0): console.log("starting session at photo " + storage.getItemSync("counter")); //I.E if no counter then create counter and set to 0;


const inputDirectory = "./assets/RawPhotos/"  // replace text with the directory of your combined stereo 360 images
const outputDirectory = "./assets/StereoImages/" // replace text with the directory you'd like the new images to be outputted to

fs.readdir("./assets/RawPhotos/", (err, files) => {
    if (err)
        console.log(err);
    else {
        console.log(files.length)
        cropAll(files)
    }
})

async function cropAll(files){
    for(let i = 0; i < files.length; i++){
        await cropStereo(inputDirectory + files[i]) //folder + file is just the full path to the image
    }
}

async function cropStereo(link) {
    console.log("cropping..." + link)
    const count = parseInt(storage.getItemSync('counter'));
    const imageL = await Jimp.read(link); //left image
    const imageR = await Jimp.read(link);//right image
    imageL.crop( 0,0, imageL.bitmap.width, imageL.bitmap.height/2).write(`${outputDirectory}L${count}.png`); //crop left and save to output folder
    imageR.crop(0, imageR.bitmap.height/2, imageR.bitmap.width, imageR.bitmap.height/2).write(`${outputDirectory}R${count}.png`); //crop right and save to output folder
    storage.setItemSync('counter', count + 1) //increment counter
}

console.log("Images were processed successfully");

