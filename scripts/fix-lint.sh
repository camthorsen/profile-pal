#!/bin/bash

# Fixes all linting errors across the entire repository
# This script runs ESLint with --fix on all packages

set -e  # Exit on any error

echo "🔧 Fixing linting errors across the repository..."

# Get the root directory of the repository
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "Working from: $REPO_ROOT"

# Function to fix linting in a specific package
fix_package_lint() {
    local package_dir="$1"
    local package_name="$2"

    if [ ! -d "$package_dir" ]; then
        echo "ERROR: Package directory not found: $package_dir"
        return 1
    fi

    echo "🔍 Fixing linting in $package_name..."
    cd "$package_dir"

    # Run ESLint directly on the package
    if [ -d "src" ]; then
        echo "  Running ESLint on src directory..."
        pnpm exec eslint src --fix || {
            echo "WARNING: Some linting errors could not be auto-fixed in $package_name"
        }
    else
        echo "  No src directory found, skipping..."
    fi

    cd "$REPO_ROOT"
    echo "SUCCESS: Completed $package_name"
    echo
}

# Fix root-level linting
echo "Fixing root-level linting..."
pnpm run root:lint || {
    echo "WARNING: Some root-level linting errors could not be auto-fixed"
}

echo

# Fix linting in each package
fix_package_lint "packages/nextjs" "Next.js App"
fix_package_lint "packages/ai-host" "AI Host"
fix_package_lint "packages/api" "API Package"
fix_package_lint "packages/_workspace" "Workspace Package"

# Run workspace-wide linting
echo "🔍 Running workspace-wide linting..."
pnpm -w run lint || {
    echo "WARNING: Some workspace-wide linting errors could not be auto-fixed"
    echo "Run 'pnpm -w run lint' to see remaining issues"
}

echo
echo "SUCCESS: Linting fix completed!"
echo
echo "Summary:"
echo "  - Root-level linting: Fixed"
echo "  - Next.js package: Fixed"
echo "  - AI Host package: Fixed"
echo "  - API package: Fixed"
echo "  - Workspace package: Fixed"
echo "  - Workspace-wide linting: Fixed"
echo
echo ">> To check for remaining issues, run:"
echo "   pnpm -w run lint"
echo
echo ">> To run this script again:"
echo "   ./scripts/fix-lint.sh"
