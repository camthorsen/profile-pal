# Scripts

This directory contains utility scripts for the pet-profile-generator project.

## Available Scripts

### `fix-lint.sh`
Automatically fixes linting errors across the entire repository.

**Usage:**
```bash
# Run the script directly
./scripts/fix-lint.sh

# Or use the npm script
pnpm run lint:fix
```

**What it does:**
- Fixes root-level linting errors
- Runs ESLint with `--fix` on all packages
- Provides a summary of what was fixed
- Shows remaining issues that couldn't be auto-fixed

**Note:** Some linting errors cannot be automatically fixed and require manual intervention. The script will show you which errors remain after running.

## Adding New Scripts

When adding new scripts to this directory:

1. Make them executable: `chmod +x script-name.sh`
2. Add a corresponding npm script in `package.json` if needed
3. Update this README with usage instructions
4. Test the script thoroughly before committing
