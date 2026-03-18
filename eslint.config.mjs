import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import baselineJs from 'eslint-plugin-baseline-js';
import * as moduleReplacements from 'eslint-plugin-depend';
import jsxA11yX from 'eslint-plugin-jsx-a11y-x';
import reactYouMightNotNeedAnEffect from 'eslint-plugin-react-you-might-not-need-an-effect';
import sonarjs from 'eslint-plugin-sonarjs';
import { defineConfig, globalIgnores } from 'eslint/config';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'coverage/**',
    'postcss.config.mjs',
    '.prettierrc.mjs',
    'eslint.config.mjs',
  ]),

  // Default rules
  {
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    languageOptions: { parserOptions: { projectService: true } },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/no-unnecessary-condition': ['error', { allowConstantLoopConditions: true }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          argsIgnorePattern: '^_',
        },
      ],
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: 'const', next: 'return' },
        { blankLine: 'always', prev: 'let', next: 'return' },
        { blankLine: 'always', prev: 'if', next: 'return' },
        { blankLine: 'always', prev: 'block', next: 'return' },
      ],
      quotes: ['error', 'single', { allowTemplateLiterals: false, avoidEscape: true }],
      curly: ['error', 'all'],
      'object-shorthand': 'error',
      'nonblock-statement-body-position': ['error', 'below'],
      'no-constant-binary-expression': 'error',
      'react/button-has-type': 'error',
      'react/jsx-curly-brace-presence': ['warn', { props: 'never', children: 'never' }],
      'react/jsx-no-constructed-context-values': 'error',
      'react/jsx-no-useless-fragment': 'error',
      'react/jsx-no-leaked-render': 'error',
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-no-target-blank': ['error', { warnOnSpreadAttributes: true }],
      'react/no-invalid-html-attribute': 'error',
      'react/no-object-type-as-default-prop': 'error',
      'react/self-closing-comp': 'error',
      'react/void-dom-elements-no-children': 'error',
    },
  },

  // SonarJS
  sonarjs.configs.recommended,
  {
    rules: {
      'sonarjs/fixme-tag': 'warn',
      'sonarjs/todo-tag': 'warn',
      'sonarjs/no-unused-vars': 'off',
      'sonarjs/function-return-type': 'off',
    },
  },

  // React: detect unnecessary useEffect usage
  reactYouMightNotNeedAnEffect.configs.recommended,

  // Suggest lighter alternatives for heavy dependencies
  moduleReplacements.configs['flat/recommended'],
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: { moduleReplacements },
  },

  // jsx-a11y-x: enhanced accessibility linting
  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    plugins: { 'jsx-a11y-x': jsxA11yX },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
  },

  // Baseline JS: flag usage of non-widely-available JS features
  baselineJs.configs['recommended-ts']({ available: 'widely', level: 'error' }),
  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    plugins: { 'baseline-js': baselineJs },
  },
]);

export default eslintConfig;
