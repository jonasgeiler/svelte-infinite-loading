import { expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Spinner from './Spinner.svelte';

test('renders default spinner when no spinnerType provided', async () => {
	await render(Spinner);
	const el = document.querySelector<HTMLElement>('.loading-default');
	await expect.element(el).toBeVisible();
});

const cases: Array<[string, string, string | null, number]> = [
	['bubbles', '.loading-bubbles', '.bubble-item', 8],
	['circles', '.loading-circles', '.circle-item', 8],
	['spiral', '.loading-spiral', null, 1],
	['wavedots', '.loading-wave-dots', '.wave-item', 5]
];

for (const [type, containerSelector, itemSelector, expectedCount] of cases) {
	test(`renders ${type} spinner correctly`, async () => {
		await render(Spinner, { spinnerType: type });
		const container = document.querySelector<HTMLElement>(containerSelector);
		await expect.element(container).toBeVisible();
		if (itemSelector) {
			const items = document.querySelectorAll(itemSelector);
			expect(items.length).toBe(expectedCount);
		} else {
			expect(!!container).toBe(true);
		}
	});
}
