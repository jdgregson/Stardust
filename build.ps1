Param (
    [Switch]$Watch,

    [String]$OutputDirectory = "build",

    [String]$InputDirectory = "src"

)

if (-not (Test-Path .\node_modules\.bin\babel)) {
    Write-Warning "Babel could not be found. Have you run 'npm install' yet?"
    exit
}

if ($Watch) {
    Write-Host "Watching for changes in `"$InputDirectory`" and compiling them into `"$OutputDirectory`"..."
} else {
    Write-Host "Compiling files from `"$InputDirectory`" into `"$OutputDirectory`"..."
}

Write-Host "Compiling SCSS with sass..."
.\node_modules\.bin\node-sass ./src -o ./build --recursive
if ($Watch) {
    Write-Host "Compiling SCSS with sass and starting sass in watch mode..."
    Start-Process -FilePath .\node_modules\.bin\node-sass -ArgumentList "./src -o ./build --recursive --watch"
    Write-Host "Compiling JavaScript and copying misc files with Babel, and starting Babel in watch mode..."
    Invoke-Expression ".\node_modules\.bin\babel ./src --out-dir ./build --copy-files --watch"
} else {
    Write-Host "Compiling JavaScript and copying misc files with Babel"
    .\node_modules\.bin\babel ./src --out-dir ./build --copy-files
}
