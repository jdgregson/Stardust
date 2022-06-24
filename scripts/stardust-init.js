const readline = require('readline');
const fs = require('fs');
const {exit} = require('process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const replaceInFile = (filePath, searchText, replaceText, callback) => {
  if (fs.existsSync(filePath)) {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return console.log(err);
      }

      const result = data.replace(new RegExp(searchText, 'g'), replaceText);

      fs.writeFile(filePath, result, 'utf8', err => {
        if (err) {
          return console.log(err);
        }
      });

      callback();
    });
  }
};

const finalText = () => {
  console.log('\nStardust had been initialized.');
  console.log("\nDon't forget to:");
  console.log(
    [
      ' - Replace the contents of README.md with the readme of your project.',
      " - Replace the appicon files in src/art with your app's icon.\n",
    ].join('\n')
  );
  exit();
};

const replaceStrings = replacement => {
  console.log(`\n${replacement.description}`);
  rl.question(`${replacement.prompt}: `, newText => {
    replacement.files.forEach(file => {
      replaceInFile(file, replacement.default, newText, () => {});
    });
    if (replacements.length > 0) {
      setTimeout(() => {
        replaceStrings(replacements.pop());
      }, 100);
    } else {
      setTimeout(() => {
        finalText();
      }, 1000);
    }
  });
};

const replacements = [
  {
    description:
      'App Description: this will appear in the HTML meta description tag, in package.json, and as the description of the PWA.',
    prompt: 'App description',
    default: 'An app built with Stardust.',
    files: ['package.json', 'src/index.html', 'src/manifest.webmanifest'],
  },
  {
    description:
      "App Name: this will appear in the HTML title of the application, the header title in the app's UI, the app name in package.json, in sw.js, and as the title of the PWA.",
    prompt: 'App name',
    default: 'Stardust',
    files: [
      'package.json',
      'package-lock.json',
      'src/index.html',
      'src/sw.js',
      'src/manifest.webmanifest',
    ],
  },
];

replaceStrings(replacements.reverse().pop());
