pushd "$(dirname "$0")"
# Create dist
npm run build

# Remove the previous build
GLOBIGNORE=**/.git:**/LICENSE
rm -rf galaxy-sim.github.io/**
unset GLOBIGNORE

# Copy dst
cp -r dist/** galaxy-sim.github.io
pushd galaxy-sim.github.io
git add .
git commit -am "Auto commit from publish.sh"
git push origin master
popd
popd