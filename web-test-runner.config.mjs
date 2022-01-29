import { playwrightLauncher } from '@web/test-runner-playwright';
import {
  a11ySnapshotPlugin,
  sendKeysPlugin,
} from '@web/test-runner-commands/plugins';
import { summaryReporter } from '@web/test-runner';

const filteredLogs = ['Running in dev mode', 'lit-html is in dev mode'];

export default /** @type {import("@web/test-runner").TestRunnerConfig} */ ({
  /** Test files to run */
  files: 'dist/test/**/*.test.js',

  plugins: [
    sendKeysPlugin(),
    a11ySnapshotPlugin(),
],

  /** Resolve bare module imports */
  nodeResolve: {
    exportConditions: ['browser', 'development'],
  },

  /** Filter out lit dev mode logs */
  filterBrowserLogs(log) {
    for (const arg of log.args) {
      if (typeof arg === 'string' && filteredLogs.some(l => arg.includes(l))) {
        return false;
      }
    }
    return true;
  },

  coverageConfig: {
    exclude: [
        '**/node_modules/**',
        '**/stories/**',
        '**/test/**',
    ]
  },

  /** Compile JS for older browsers. Requires @web/dev-server-esbuild plugin */
  // esbuildTarget: 'auto',

  /** Amount of browsers to run concurrently */
  // concurrentBrowsers: 2,

  /** Amount of test files per browser to test concurrently */
  // concurrency: 1,

  /** Browsers to run tests on */
  browsers: [
    playwrightLauncher({ product: 'chromium' }),
    playwrightLauncher({ product: 'firefox' }),
    playwrightLauncher({ product: 'webkit' }),
  ],

  // See documentation for all available options
  // reporters: [summaryReporter()],
});
