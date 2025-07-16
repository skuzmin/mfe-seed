// Replace all occurrences of parameters that relate to "mfe-blueprint"
// with those that fit the needs of your mfe

import path from 'node:path';
import prompts from 'prompts';

const REPLACE_TAG = 'mfe-blueprint-lean';
const REPLACE_NAME = 'MFE Blueprint Lean';
const REPLACE_CLASS_NAME = 'MfeBlueprintLean';

const CUSTOM_ELEMENT_REGEX =
    /^[a-z](?:[\-\.0-9_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*-(?:[\-\.0-9_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*$/;
const WELL_KNOWN_TEAMS = [
    { title: 'TITLE', value: { team: 'checkout', email: 'EMAIL' } },
];
const WELL_KNOWN_BUSINESS_UNIT = 'sales';
const WELL_KNOWN_SUB_UNIT = 'aaa';
const WELL_KNOWN_REGION = 'cr';

const WELL_KNOWN_TEMPLATES = [
    { title: 'With Decorators and typed events', value: 'enhanced', selected: true },
    { title: 'Basic (VanillaJS)', value: 'basic' },
];

const getGitInfo = () => {
    let suggestRepo = '';
    let suggestName = '';

    const gitInfo = fs.readFileSync('.git/config').toString();
    gitInfo.split('\n').map((line) => {
        if (line.trim().startsWith('url = ')) {
            suggestRepo = line.trim().replace('url = ', '').replace('git@ssh.source.aaa:', 'https://source.aaa/');
            suggestName = suggestRepo.substring(suggestRepo.lastIndexOf('/') + 1, suggestRepo.lastIndexOf('.git'));
        }
    });
    return { suggestName, suggestRepo };
};

const prompt = async (options, ...args) => {
    let abortionAttempts = 0;
    do {
        console.log('');

        const result = await prompts(
            {
                format: (value) => (typeof value === 'string' ? value.trim() : value),
                validate: (value) => Boolean(typeof value === 'string' ? value.trim().length > 1 : value),
                ...options,
            },
            ...args
        );

        if ('value' in result) {
            return result.value;
        }

        console.log('Ctrl+C to abort setup.');
    } while (++abortionAttempts < 2);

    throw 'Aborted by user.';
};

const validateKebabCase = (value) => /^[a-z0-9-_.]+$/.test(value.trim());

//#region Wizard

let name;
let repo;
let team;
let contact;
let businessUnit;
let subUnit;
let region;
let template;
let description;

console.log('\n🚀 Welcome to the MFE setup wizard!');
console.log('You can restart the wizard with Ctrl+C.');

const confirm = async () => {
    const { suggestName, suggestRepo } = getGitInfo();

    console.log('\nVerify:');
    console.log(`→ Project and MFE tag name: \t'${suggestName}'`);
    console.log(`→ Project repo: \t\t'${suggestRepo}'\n`);

    console.log(`→ Template: \t\t\t'${WELL_KNOWN_TEMPLATES.find(({ value }) => value === template).title}'\n`);

    console.log(`→ Team name: \t\t\t'${team}'`);
    console.log(`→ Team contact: \t\t'${contact}'`);
    console.log(`→ Business Unit: \t\t'${businessUnit}'`);
    console.log(`→ Sub Unit: \t\t\t'${subUnit}'`);
    console.log(`→ Region: \t\t\t'${region}'`);
    console.log('\n');

    return await prompt({
        type: 'confirm',
        name: 'value',
        message: `Are those values correct? Type 'y' to confirm and continue, 'n' to start over.`,
        initial: false,
    });
};

export default async () => {
    const { suggestName, suggestRepo } = getGitInfo();

    let wizardFinished;
    do {
        wizardFinished = false;
        try {
            name = await prompt({
                type: 'text',
                name: 'value',
                message: 'Provide the tag name of your MFE (should be a valid custom element name, e.g.: mfe-blueprint): ',
                validate: (value) => {
                    return CUSTOM_ELEMENT_REGEX.test(value.trim());
                },
                initial: name || suggestName,
            });

            repo = await prompt({
                type: 'text',
                name: 'value',
                message: 'Provide the git repository of your mfe: ',
                initial: repo || suggestRepo,
            });

            const wellKnownTeam = await prompt({
                type: 'select',
                name: 'value',
                message: 'Select your team',
                choices: [...WELL_KNOWN_TEAMS, { title: 'Other (not in the list)', value: 'other' }],
                hint: '- Space to select',
            });

            if (wellKnownTeam !== 'other') {
                team = wellKnownTeam.team;
                contact = wellKnownTeam.email;
                businessUnit = WELL_KNOWN_BUSINESS_UNIT;
                subUnit = WELL_KNOWN_SUB_UNIT;
                region = WELL_KNOWN_REGION;
            } else {
                team = await prompt({
                    type: 'text',
                    name: 'value',
                    message: 'Provide your team name: (No whitespace allowed)',
                    validate: (value) => /^[a-z0-9-_.]+$/.test(value.trim()),
                    initial: team,
                });

                contact = await prompt({
                    type: 'text',
                    name: 'value',
                    message: 'Provide your team email: (Personal emails is not allowed)',
                    validate: (value) => value.trim().match(/^[^.@]+@.+$/),
                    initial: contact,
                });

                businessUnit = await prompt({
                    type: 'text',
                    name: 'value',
                    message: 'Provide your Business Unit as of LeanIX or your AWS Tags: (eg. osp, sales) (kebab-case, lowercase)',
                    validate: validateKebabCase,
                    initial: businessUnit,
                });

                subUnit = await prompt({
                    type: 'text',
                    name: 'value',
                    message: 'Provide your Sub Unit as of LeanIX or your AWS Tags: (eg. aaacom, book) (kebab-case, lowercase)',
                    validate: validateKebabCase,
                    initial: subUnit,
                });

                region = await prompt({
                    type: 'text',
                    name: 'value',
                    message:
                        'Provide Source Market two letters abbreviation as of LeanIX or your AWS Tags: (eg. cr, nr, wr) (lowercase)',
                    validate: (value) => /^[a-z]{2}$/.test(value.trim()),
                    initial: region,
                });
            }

            template = await prompt({
                type: 'select',
                name: 'value',
                message: 'Select one of the templates for your MFE',
                choices: WELL_KNOWN_TEMPLATES,
                hint: '- Space to select',
            });

            description = await prompt({
                type: 'text',
                name: 'value',
                message: 'Provide MFE description. What it is made for and what it does: (min 50 characters)',
                validate: (value) => value.trim().length >= 50,
                initial: description,
            });

            wizardFinished = true;
        } catch (error) {
            console.error(error);

            const resolution = await prompt({
                type: 'select',
                name: 'value',
                message: 'What would you like:',
                choices: [
                    { title: 'Start over', value: 'start-over' },
                    { title: 'Abort and abandon setup', value: 'abort' },
                ],
                hint: '- Space to select',
            });

            if (resolution === 'abort') {
                console.log('Aborted by user.');
                process.exit(1);
            }
        }
    } while (!wizardFinished || !(await confirm()));

    //#endregion Wizard
    const replaceInContent = (content, search, replace) => {
        if (search instanceof RegExp) {
            return content.replace(search, replace);
        } else {
            return content.replaceAll(search, replace);
        }
    };

    const updateFile = (file, search, replace) => {
        const filepath = path.join(process.cwd(), file);
        let fileContents = fs.readFileSync(filepath).toString();

        if (search instanceof Array) {
            search.forEach(([search, replace]) => {
                fileContents = replaceInContent(fileContents, search, replace);
            });
        } else {
            fileContents = replaceInContent(fileContents, search, replace);
        }

        fs.writeFileSync(filepath, fileContents);
    };

    ///////////////////////////////////////////////////////////////////
    ////////////////////// 0. prepare files ///////////////////////////

    console.log('🛸 Preparing your files ...');

    // Delete index.ts if no default case
    if (template.value === 'basic') {
        await $`rm ./src/frontend/index.ts`;
        await $`mv ./.setup/index.basic.ts ./src/frontend/index.ts`;
    }

    // replace README
    console.log('🧑‍🚀 Preparing your README.md ...');
    await $`rm ./README.md`;
    await $`mv ./.setup/README_COMP.md ./README.md`;

    // Delete setup folder
    console.log('🪐 Deleting unused files ...');
    await $`rm -r ./.setup`;

    ///////////////////////////////////////////////////////////////////
    //////////////////// 1. get all the variables /////////////////////

    // Generate a readable name from tag name
    // e.g. from "my-awesome-mfe" make "My Awesome Mfe"
    const readableName = name
        .split('-')
        .map((el) => el.charAt(0).toUpperCase() + el.slice(1).toLowerCase())
        .join(' ');

    // Generate a class name from readable name
    // e.g. from "My Awesome Mfe" make "MyAwesomeMfe"
    const className = readableName.replaceAll(' ', '');

    // Generate the ssh link to the git repo
    const repoSSH = repo.replace('https://source.aaa/', 'git@ssh.source.aaa:');

    ///////////////////////////////////////////////////////////////////
    //////////////////// 2. replace repositories //////////////////////

    console.log('🔧 Replacing repository names ...');

    const repoReplace = ['./cloudformation.yml', './src/manifest.yaml', './package.json', './README.md'];

    repoReplace.forEach((file) => {
        updateFile(file, 'https://source.aaa/cr/aaacom/templates/mfe-blueprint-lean.git', repo);
        updateFile(file, 'git@ssh.source.aaa:cr/aaacom/templates/mfe-blueprint-lean.git', repoSSH);
    });

    ///////////////////////////////////////////////////////////////////
    //////////////////// 3. replace tags //////////////////////////////

    console.log('🔧 Replacing tag-names ...');

    const tagReplace = [
        './.gitlab-ci.yml',
        './src/frontend/styles/skeleton.scss',
        './src/frontend/styles/styles.scss',
        './src/frontend/config.ts',
        './test/prerender.spec.ts',
        './test/index.spec.ts',
        './src/manifest.yaml',
        './package.json',
        './catalog-info.yaml',
        './sonar-project.properties',
        './README.md',
        './src/.env.ci',
        './src/.env.dev.ci',
        './src/.env.example',
        './.env.test',
    ];

    tagReplace.forEach((file) => updateFile(file, REPLACE_TAG, name));

    ///////////////////////////////////////////////////////////////////
    //////////////////// 4. replace names /////////////////////////////

    console.log('🔧 Replacing mfe names ...');

    const nameReplace = [
        './src/frontend/index.ts',
        './src/backend/middlewares/server-header.ts',
        './cloudformation.yml',
        './src/manifest.yaml',
        './catalog-info.yaml',
        './README.md',
    ];

    nameReplace.forEach((file) => updateFile(file, REPLACE_NAME, readableName));

    ///////////////////////////////////////////////////////////////////
    //////////////////// 5. replace classnames ////////////////////////

    console.log('🔧 Replacing class names ...');

    const classNameReplace = ['./src/frontend/index.ts', './test/index.spec.ts'];
    classNameReplace.forEach((file) => updateFile(file, REPLACE_CLASS_NAME, className));

    ///////////////////////////////////////////////////////////////////
    //////////// 5. replace ownership and catalog entries /////////////

    console.log('🔧 Replacing ownership tags ...');

    updateFile('./catalog-info.yaml', [
        [REPLACE_TAG, name],
        [REPLACE_NAME, readableName],
        [/description:.+$/im, `description: ${description}`],
        [
            /gitlab\.com\/project\-slug.+$/im,
            `gitlab.com/project-slug: ${repo.replace(/^[^.]+[^/]+\//, '').replace(/\..+$/, '')}`,
        ],
        [/namespace:.$/im, `namespace: ${businessUnit === 'osp' ? 'osp' : region}`],
        [`owner: 'platform'`, `owner: '${team}'`],
        [`system: aaa.com`, subUnit === WELL_KNOWN_SUB_UNIT ? `system: aaa.com` : `system: ${businessUnit}`],
    ]);
    // );
    updateFile('./.gitlab-ci.yml', [
        [/STACK_NAME:.+$/im, `STACK_NAME: ${name}`],
        [/TEAM:.+$/im, `TEAM: ${team}`],
        [/CONTACT:.+$/im, `CONTACT: ${contact}`],
        [/SUB_UNIT:.+$/im, `SUB_UNIT: ${subUnit}`],
        [/REGION:.+$/im, `REGION: ${region}`],
        [/BUSINESS_UNIT:.+$/im, `BUSINESS_UNIT: ${businessUnit}`],
    ]);

    updateFile('./src/manifest.yaml', [
        [REPLACE_TAG, name],
        [REPLACE_NAME, readableName],
        [/description:.+$/m, `description: ${description}`],
    ]);

    const sonarProjectKey = `${businessUnit}.${subUnit}.${name}`;
    ['./catalog-info.yaml', './sonar-project.properties'].forEach((file) =>
        updateFile(file, /(sonarqube\.org\/project-key\:\s?|sonar\.projectKey\=).+$/im, `$1${sonarProjectKey}`)
    );

    ///////////////////////////////////////////////////////////////////
    //////////////////// 6. create .env ///////////////////////////////

    console.log('🍹 Generating environment file ...');

    $`mv ./src/.env.example ./src/.env`;

    console.log(`\nEverything was set! You're good to go 🚀\n`);
};
