/* 
  since every sane way of telling post-css and rollup to save extracted CSS files
  to a subdirectory failed, we're gonna use a script to move the css file into
  the subdirectory after the build completes
*/

import fs from 'fs';
import path from 'path';

// directory from which we are going to move the file
const ASSETS_DIR = 'modules/common-styling/public/assets';
// directory to where we are going to move the file
const CSS_SUBDIR = 'style';

// get absulte paths
const assetsPath = path.resolve(ASSETS_DIR);
const targetPath = path.join(assetsPath, CSS_SUBDIR);



function moveCssFiles() {
  // ensure the target directory exists
  if (!fs.existsSync(targetPath)) {
    console.log(`Creating target directory: ${targetPath}`);
    fs.mkdirSync(targetPath, { recursive: true });
  }

  // read all files in the assets directory
  const files = fs.readdirSync(assetsPath);

  // filter for CSS files that are NOT already in the target subfolder
  const cssFiles = files.filter(file => 
    file.endsWith('.css') && 
    fs.statSync(path.join(assetsPath, file)).isFile()
  );

  // move each CSS file
  cssFiles.forEach(file => {
    const oldPath = path.join(assetsPath, file);
    const newPath = path.join(targetPath, file);
      
    try {
      fs.renameSync(oldPath, newPath);
    } catch (error) {
      console.error(`Error moving ${file}:`, error.message);
    }
  });
}

moveCssFiles();