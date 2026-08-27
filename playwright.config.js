/**************************************************/
/*             Playwright config file             */
/* https://playwright.dev/docs/test-configuration */
/**************************************************/

import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: { command: 'pnpm run build && pnpm run preview', port: 4173 },
	testMatch: '**/*.e2e.{ts,js}'
});
