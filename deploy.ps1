# This script deploys the app to GitHub Pages by committing all files from
# /build to the gh-pages branch and pushing them.

$gitStatus = $(git status 2>&1)
if ($gitStatus -match "Changes not staged for commit|Your branch is ahead") {
    Write-Warning "This branch has unpushed commits or unstaged changes which may be lost by this operation. Please commit and push all changes prior to deploying."
    exit
}

git checkout --orphan gh-pages
git --work-tree build add --all
git --work-tree build commit -m 'Deploying to GitHub Pages'
git push origin HEAD:gh-pages --force
git checkout -f master
git branch -D gh-pages