# Profile Pal (Pet Profile Generator): Monorepo

## Prerequisites

### Docker Setup

This project requires Docker to run the AI services (Whisper and CLIP models). You'll need to install and start Docker before running the development environment.

#### Install Docker

**macOS:**

1. Download [Docker Desktop for Mac](https://docs.docker.com/desktop/mac/install/)
2. Install and start Docker Desktop
3. Verify installation: `docker --version`

**Windows:**

1. Download [Docker Desktop for Windows](https://docs.docker.com/desktop/windows/install/)
2. Install and start Docker Desktop
3. Verify installation: `docker --version`

#### Verify Docker is Running

Before starting the project, you have to ensure Docker is running:

```shell
docker info
```

If this command fails, start Docker Desktop or the Docker service.

### Node.js and pnpm Setup

This project uses [pnpm](https://github.com/pnpm/pnpm) and NodeJS. The versions of each are set in `.tool-versions`.

If you don't have PNPM installed, you can use the [ASDF runtime manager](https://asdf-vm.com/) to install it. For alternative methods, see the [pnpm installation instructions](https://pnpm.io/installation).

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

## Development Scripts

### Quick Start

First run `$ pnpm install`

Then, start all services (AI host, Next.js app, and Docker services):

```shell
pnpm run start
```

You can now view the app at http://localhost:5181/ in your browser.

**Note:** The first time you start the project, Docker will download tAI models (Whisper-tiny and CLIP, about 1.2GB total), which may take 1-2 minutes.

**Services started:**

- AI Host: http://localhost:8787
- Next.js App: http://localhost:5181
- Docker services: pyclip, pywhisper

### Stop services

Stop all services:

```shell
pnpm run stop
```

### Available Scripts

Install dependencies (this script has the same effect regardless of where it is run in the project):

```shell
pnpm install
```

#### Code checks

Run ALL code checks (typecheck, linting, unit tests):

```shell
pnpm run check
```

Run the typechecker

```shell
pnpm run typecheck
```

Run prettier:

```shell
pnpm run fmt
```

Run the linter:

```shell
pnpm run lint
```

Fix linting errors automatically:

```shell
pnpm run lint:fix
```

Run tests:

````shell
# Test and watch for changes
pnpm test

# Run tests once
pnpm run test:run


Check for outdated dependencies (entire monorepo):

```shell
# Check for updates compatible with the current version ranges
pnpm run outdated
# Check for latest versions
pnpm run outdated:latest
````

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
