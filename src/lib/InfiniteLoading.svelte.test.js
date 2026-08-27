import { expect, test } from 'vitest';
import { render } from 'vitest-browser-svelte';
import InfiniteLoading from './InfiniteLoading.svelte';

// Simple case: onInfinite immediately completes -> show "No results." (first load)
test('shows No results when onInfinite completes on first load', async () => {
	const onInfinite = async (stateChanger) => {
		// simulate fetch and mark complete
		stateChanger.complete();
	};

	const screen = await render(InfiniteLoading, { onInfinite });

	// wait for the final message to appear
	const node = await screen.getByText('No results.');
	await expect.element(node).toBeVisible();
});

// Error then retry: first call -> error, clicking retry triggers attemptLoad -> complete -> show no results
test('retries after error and then shows No results', async () => {
	let calls = 0;
	const onInfinite = async (stateChanger) => {
		calls += 1;
		if (calls === 1) {
			stateChanger.error();
			return;
		}
		// on second call, finish as complete
		stateChanger.complete();
	};

	const screen = await render(InfiniteLoading, { onInfinite });

	// wait for error text
	const errorNode = await screen.getByText('Something went wrong. Please retry later.');
	await expect.element(errorNode).toBeVisible();

	// click the retry button
	const retryButton = await screen.getByRole('button', { name: 'Retry' });
	await retryButton.click();

	// after retry the component should end up showing "No results." (first load complete)
	const noResults = await screen.getByText('No results.');
	await expect.element(noResults).toBeVisible();
	// ensure the onInfinite handler was called at least twice (initial + retry)
	expect(calls).toBeGreaterThanOrEqual(2);
});
