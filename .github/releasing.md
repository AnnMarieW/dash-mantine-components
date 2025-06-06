

### Before release:

- [ ] Update Mantine dependency in `package.json`
- [ ] check for any added props or significant changes from the Mantine changelog.  Open issues for any missing features.
- [ ] Update other dependencies - see notes section below for details
- [ ] Remove usage/demo apps used for testing

- [ ] Review and update changelog - include PR numbers and contributor's GitHub username


### Release

On the Master branch:

1. Clean up build and  dist - removes old and temp tarballs:
```
rm -rf dist build
```

2. Run a new build
```
npm install
npm run build
```

Note: the build has a warning: ! Missing proptypes.js in dash_mantine_components/__init__.py !
Do not add that yet because it doesn't handle Mantine prop types correctly. 


Push updated `package-lock.json`

2. Build source distribution.  
```
npm run dist

```
Confirm that this excluded metadata.json file which reduces the package size


3. Test your tarball by copying it into a new environment and installing it locally, for example:
```
pip install dash-mantine-components-0.14.5.tar.gz
```

4. Run the docs with the new release locally

4. Prepare release on the GitHub UI - For more information see [Managing Releases](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository)
When in doubt, do an alpha release first

5. Publish on PyPI
```
$ twine upload dist/*
```

6. Publish on NPM 

```
$ npm publish
```


### After release:
 - [ ] Update dmc-docs.  When the version changes, be sure to run `poetry update` and push the new `poetry.lock` file. The docs deploy automatically on Render
 - [ ] Update the version info on the home page
 - [ ] Include new contributors in the docs
 - [ ] Make announcement on Plotly forum and dmc Discord
 
 
### Updating other dependencies
My notes from a discussion with alexj

Anything that’s not a major should be safe to just bump. The ones to pay attention to:
- rect* -  since these all are going to be provided by Dash in actual use anyway, best to pin to  what Dash uses.
- ramda - sometimes makes breaking changes in “major” releases so it’s worth looking at their changelog and seeing if we’re using anything they changed.
- types/ramda - just match ramda
- style-loader and css-loader - these are used together within the webpack config. IIRC these particular upgrades don’t require any changes to the config for our normal usage, so most likely it’ll just work. If the bundle builds without errors you’re fine, otherwise need to look at the docs for these packages.
- typescript - even if it's not a major bump, sometimes they tighten up their error checking in minor releases so the bundle fails to build and something about type annotations needs to be updated

Others:
- "dash-extensions-js": "^0.0.8" is required for the `renderDashComponent` function in Dash 2.  Do not upgrade unless support for dash 2 is dropped or the newer version of dash-extensions is dash 2 compatible

