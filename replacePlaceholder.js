const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'build', 'index.html');

// Read the file
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        return console.error('Error reading file:', err);
    }

    // Count the placeholders
    const matcher = /%CUSTOM_URL%/g;
    const matches = data.match(matcher);

    if(matches){
        console.log(`The %CUSTOM_URL% appeared ${matches.length} time(s)`);
    }
    else{
        console.log("No matches found for %CUSTOM_URL%");
    }

    // Replace the placeholder
    const result = data.replace(matcher, '.');

    // Write the file back
    fs.writeFile(filePath, result, 'utf8', (err) => {
        if (err) return console.error('Error writing file:', err);
        console.log('Placeholder replaced successfully.');
    });
});