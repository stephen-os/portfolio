import next from 'eslint-config-next';
import coreWebVitals from 'eslint-config-next/core-web-vitals';

const config = [
  ...next,
  ...coreWebVitals,
  // Type-aware pass: flag calls to APIs marked @deprecated — ours or a
  // dependency's. Uses the @typescript-eslint plugin eslint-config-next already
  // registers; the rule needs type info, so enable the project service here.
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-deprecated': 'error',
    },
  },
];

export default config;
