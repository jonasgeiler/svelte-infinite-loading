import { render } from '@testing-library/svelte';
import InfiniteLoading from '../src/InfiniteLoading.svelte';

test('renders successfully', () => {
	const { container } = render(InfiniteLoading);
	expect(container).toBeInTheDocument();
});

/* TODO: Add tests */