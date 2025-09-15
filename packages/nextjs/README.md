# Next.js TypeScript
For getting the full working app running, see the README file in the root folder.

## Script
- `build`: Builds the application for production
- `dev`: Starts the development server (this does not include the backend)
- `ws`: Runs a workspace script (such as `check`, `lint`, `test`, or `typecheck`); run `ws` from `packages/next` for a list of available scripts, but exclusively in the current package/workspace.

### Example: Lint this package
```
pnpm run ws lint
```
