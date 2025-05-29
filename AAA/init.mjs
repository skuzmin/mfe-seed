#!/usr/bin/env zx

import { $, cd } from 'zx';
import { basename } from 'node:path';
import { chdir } from 'node:process';
import bootstrap from './setup.mjs';

// npx @tui/mfe-tools my-mfe git@ssh.source.tui:cr/tuicom/templates/my-mfe.git

if (process.argv.length >= 5) {
    console.warn('Second parameter is now removed. Usage: \nnpx mfe-blueprint-generator [repo]');

    process.exit(1);
}

const repo = process.argv[3];
const app = basename(repo).replace(/.git.*/, '');

if (!app) {
    console.error('Please provide a name for your MFE');
    process.exit(1);
}

const appPath = path.join(process.cwd(), app);
const templateRepo = 'REPO WHERE COE TEMPLATE ARE';

console.log(`Creating a new MFE in ${chalk.green(appPath)}`);

await $`git clone --depth=1 ${templateRepo} ${app}`.quiet();

console.log(`Changing current work dir to ${app}/`);
chdir(appPath);
cd(appPath);

console.log(process.cwd(), process.env.PWD);

console.log('Installing pnpm ...');
await $`npm install -g pnpm`;

console.log('Installing packages...');

await $`pnpm i`.quiet();

console.log('Initialising git repository...');

await $`rm -rf .git && git init`.quiet();

if (repo) {
    await $`git remote add origin ${repo}`.quiet();
}

console.log('Running setup...');
await bootstrap();

console.log('Building project...');
await $`pnpm build`.quiet();

console.log('Running initial tests ...');
await $`pnpm t -- --u`.quiet();

const BRANCH = await $`git log`
    .quiet()
    .then(() => `chore/blueprint-lean`)
    .catch(() => `main`);

console.log('Creating initial git commit...');
if (BRANCH !== 'main') {
    await $`git checkout -b chore/blueprint-lean`;
}

await $`git add . && git commit -m "Initialise project u"`;

if (repo) {
    console.log(`Pushing to remote branch ${BRANCH}...`);
    await $`git push --set-upstream origin +${BRANCH}`;
}

if (BRANCH !== 'main') {
    console.log(`!!! Visit repo and open a Merge Request`);
}

console.log(`Success! Created ${app} at ${appPath}
Inside that directory, you can run several commands:

  pnpm dev
    Starts the development server.

  pnpm build
    Bundles the app into static files for production.

  pnpm test
    Starts the test runner.

We suggest that you begin by typing:

  cd ${app}
  pnpm dev

Happy hacking!`);
