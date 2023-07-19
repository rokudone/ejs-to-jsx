# Embedded Javascript Template to jsx converter

Under development. (We have verified that it works in one way, but due to lack of examples, it may not work perfectly.
Pull Requests are welcome.

See `src/lib/converter.test.ts` for an example of how it works.

## Usage:

1. `git clone git@github.com:rokudone/ejs-to-jsx`
2. `yarn install && yarn build`
3. `yarn ejs-to-jsx your/file/path.ejs > your/output/file.jsx`

If you want to make it a component.

1. `yarn jsx-to-component your/output/file.jsx ComponentName > your/output/file.jsx`

If you want to develop this plugin.

1. `yarn test:watch`

## Description:

- converter.tsx
    - Main script.
    - call parse.tsx, replace.tsx, render.tsx
- parse.tsx
    - Parse ejs with [sparser](https://github.com/Unibeautify/sparser)
- replace.tsx
    - Replace ejs tags to jsx
- render.tsx
    - Render the data replaced by jsx.


## TODO:
* Publish with npm.
