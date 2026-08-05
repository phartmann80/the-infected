import next from 'eslint-config-next';

const config = [
  { ignores: ['.next/**', 'next-env.d.ts', 'node_modules/**'] },
  ...next,
];

export default config;