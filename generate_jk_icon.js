const Jimp = require('jimp');

async function createJKIcon() {
  try {
    // Create a 96x96 transparent image (0x00000000 = transparent)
    const image = new Jimp(96, 96, 0x00000000);
    
    // Load default white font
    const font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
    
    // Measure text to center it perfectly
    const textWidth = Jimp.measureText(font, 'JK');
    const textHeight = Jimp.measureTextHeight(font, 'JK', 96);
    
    const x = Math.floor((96 - textWidth) / 2);
    // Adjust y slightly to vertically center the baseline
    const y = Math.floor((96 - textHeight) / 2) - 8;
    
    // Print "JK" onto the transparent image
    image.print(font, x, y, 'JK');
    
    // Save to the assets folder
    await image.writeAsync('assets/images/notification-icon.png');
    console.log('Successfully generated JK notification icon!');
  } catch (error) {
    console.error('Failed to generate icon:', error);
  }
}

createJKIcon();
