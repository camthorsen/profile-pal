# Pet Profile Generator: Monorepo

# Command sequence for evaluators
FIXME: To be updated

## — 1: Python side — #
cd packages/api
### 1.1: Install Poetry dependencies
poetry install
### 1.2: (If no GPU) Install CPU‐only PyTorch
poetry run pip install --upgrade torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
(This one didn't work for me, so I had to install the CPU version of PyTorch manually:)

Also did this:
```bash
pip install --upgrade torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
```

```bash
$ poetry add torch --platform macosx_10_9_x86_64
```
### 1.3: Download all model weights (~4.8 GB)
poetry run python download_models.py
### 1.4: Start the FastAPI server
poetry run uvicorn api_app.main:app --host 0.0.0.0 --port 8000

(Leave this terminal open; it’s serving /transcribe, /clip_tags, /summarize)


## — 2: Next.js side — #
cd packages/nextjs
### 2.1: Install pnpm dependencies
pnpm install
### 2.2: Start Next.js dev server
pnpm dev

Now open http://localhost:5181/ in your browser.




## Getting started

This project uses [pnpm](https://github.com/pnpm/pnpm) and NodeJS. The versions of each are set in `.tool-versions`.

If you don't have PNPM installed, it is recommended that you use the [ASDF runtime manager](https://asdf-vm.com/) to install it. For alternative methods, see the [pnpm installation instructions](https://pnpm.io/installation).

```shell
# Install ASDF runtime-version manager
git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.10.2
# OR (not tested)
brew install asdf

# Install PNPM
asdf plugin add pnpm
asdf install pnpm 7.21.0
```

You can also use ASDF to install the correct version of Node:

```shell
asdf plugin add nodejs
asdf install nodejs 18.12.1
```

## Scripts

Install dependencies (this script has the same effect regardless of where it is run in the project):

```shell
pnpm install
```

---

These commands can be run at the project level or at the level of an individual package (i.e., the simulator API or the Svelte app).

To run at the project level, run the command from the project root. To run at a package level, change to the package's directory. Example: `cd packages/svelte`.

Run all code checks:

```shell
pnpm run check
```

Run the typechecker

```shell
pnpm run typecheck
```

Run the linter:

```shell
pnpm run lint
# OR check for lint and fix issues that can be automatically
pnpm run lint:fix
```

Run tests:

```shell
# Test and watch for changes
pnpm test

# Run tests once
pnpm run test:run

# Run coverage checker
pnpm run test:coverage
```

Shortcut to run typechecking, linting, and tests:

```shell
pnpm run check
```

Check for outdated dependencies (entire monorepo):

```shell
# Check for updates compatible with the current version ranges
pnpm run outdated
# Check for latest versions
pnpm run outdated:latest
```

Upgrade dependencies (entire monorepo):

```shell
# Update dependencies compatible with the current version ranges
pnpm run update
# Update to the latest versions
pnpm run update:latest
```

Upgrade transitive dependencies (entire monorepo):

```shell
pnpm upgrade
```
