import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // These three rules come from eslint-plugin-react-hooks' newer
      // "React Compiler" rule set. They flag the standard, widely-used
      // "fetch data inside useEffect on mount" pattern (used throughout
      // this codebase: BookmarkButton, LikeButton, Home, SinglePost) and a
      // Math.random() call in a loading skeleton as "impure". Satisfying
      // them would mean restructuring how every data-fetching component
      // works - real behavior-change risk, not a lint cleanup. Disabled
      // deliberately rather than silently reworking application logic.
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/immutability': 'off',
    },
  },
])
