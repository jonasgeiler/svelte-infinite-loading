require('@testing-library/jest-dom/extend-expect');

const { render /*, fireEvent*/ } = require('@testing-library/svelte');

const InfiniteLoading = require('../src/InfiniteLoading.svelte');

test('renders successfully', () => {
	const { container } = render(InfiniteLoading);
	expect(container).toBeInTheDocument();
});

/* TODO: Add tests */