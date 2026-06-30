const fs = require('fs');
const https = require('https');
const { execSync } = require('child_process');

console.log('Installing jimp...');
execSync('npm install jimp@0.16.13 --no-save', { stdio: 'inherit' });
const Jimp = require('jimp');

async function run() {
  try {
    console.log('Processing icon...');
    const image = await Jimp.read('assets/images/app-icon.png');
    
    // Get center pixel color for the theme
    const cx = Math.floor(image.bitmap.width / 2);
    const cy = Math.floor(image.bitmap.height / 2);
    const centerColorInt = image.getPixelColor(cx, cy);
    const rgba = Jimp.intToRGBA(centerColorInt);
    
    // Fallback to black if transparent
    let hexColor = '#000000';
    if (rgba.a > 0) {
      hexColor = '#' + [rgba.r, rgba.g, rgba.b].map(x => x.toString(16).padStart(2, '0')).join('');
      console.log('Extracted theme color from app icon:', hexColor);
    }

    // Convert to monochrome white
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const alpha = this.bitmap.data[idx + 3];
      if (alpha > 0) {
        this.bitmap.data[idx] = 255;   
        this.bitmap.data[idx + 1] = 255; 
        this.bitmap.data[idx + 2] = 255; 
      }
    });
    image.resize(96, 96);
    await image.writeAsync('assets/images/notification-icon.png');
    console.log('Icon processed and saved.');

    // Update app.json color
    const appJsonPath = 'app.json';
    let appJson = fs.readFileSync(appJsonPath, 'utf8');
    appJson = appJson.replace(/"color": "#[a-fA-F0-9]{6}"/g, '"color": "' + hexColor + '"');
    fs.writeFileSync(appJsonPath, appJson);
    console.log('Updated app.json color.');

  } catch (e) {
    console.error('Error processing image:', e);
  }

  // Download Sound
  console.log('Downloading sound...');
  if (!fs.existsSync('assets/sounds')) {
    fs.mkdirSync('assets/sounds', { recursive: true });
  }
  const file = fs.createWriteStream('assets/sounds/custom_sound.wav');
  https.get('https://upload.wikimedia.org/wikipedia/commons/f/f9/Beep.wav', function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close();
      console.log('Sound downloaded and saved.');
    });
  }).on('error', function(err) {
    fs.unlinkSync('assets/sounds/custom_sound.wav');
    console.error('Error downloading sound:', err.message);
  });
}

run();
