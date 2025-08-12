import esbuild from 'esbuild';

const evnVars = [
  'BACKEND_PORT',
  'BACKEND_SOURCE_FILE',
  'VITE_CATS_SERVICE_URL',
  'VITE_APP_VERSION',
  'VITE_BACKEND_URL',
  'VITE_FRONTEND_URL',
  'VITE_ENV',
  'VITE_MFE_NAME',
];

const define = evnVars.reduce((acc, val) => {
  acc[`process.env.${val}`] = `"${process.env[val]}"`;
  return acc;
}, {});

esbuild
  .build({
    define,
    entryPoints: ['./src/backend/server.ts'],
    entryNames: 'index',
    outdir: './dist/backend',
    bundle: true,
    minify: true,
    sourcemap: false,
    platform: 'node',
    target: 'node24',
    format: 'esm',
  })
  .then(() => console.log('Bundle build complete'))
  .catch(() => {
    process.exit(1);
  });
