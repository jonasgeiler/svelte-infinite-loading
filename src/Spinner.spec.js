require('@testing-library/jest-dom/extend-expect');

const { render, fireEvent } = require('@testing-library/svelte');

const Spinner = require('./Spinner.svelte');

test('shows default animation when spinner set to default', () => {
	const { container } = render(Spinner, { spinner: 'default' });
	expect(container).toBeInTheDocument();

	const spinner = container.getElementsByTagName('i')[0];

	expect(spinner).not.toBeUndefined();
	expect(container).toContainElement(spinner);
	expect(spinner).toBeInTheDocument();
	expect(spinner).toBeEmptyDOMElement();
	expect(spinner).toHaveClass('loading-default');
});

test('shows wave dots animation when spinner set to wavedots', () => {
	const { container } = render(Spinner, { spinner: 'wavedots' });
	expect(container).toBeInTheDocument();

	const waveContainer = container.getElementsByTagName('span')[0];

	expect(waveContainer).not.toBeUndefined();
	expect(container).toContainElement(waveContainer);
	expect(waveContainer).toBeInTheDocument();
	expect(waveContainer).toHaveClass('loading-wave-dots');

	const waveItems = waveContainer.getElementsByTagName('span');

	expect(waveItems).toHaveLength(5);

	for (let waveItem of waveItems) {
		expect(waveItem).toBeInTheDocument();
		expect(waveItem).toBeEmptyDOMElement();
		expect(waveItem).toHaveClass('wave-item');
	}
});

test('shows spiral animation when spinner set to spiral', () => {
	const { container } = render(Spinner, { spinner: 'spiral' });
	expect(container).toBeInTheDocument();

	const spinner = container.getElementsByTagName('i')[0];

	expect(spinner).not.toBeUndefined();
	expect(container).toContainElement(spinner);
	expect(spinner).toBeInTheDocument();
	expect(spinner).toBeEmptyDOMElement();
	expect(spinner).toHaveClass('loading-spiral');
});

test('shows circles animation when spinner set to circles', () => {
	const { container } = render(Spinner, { spinner: 'circles' });
	expect(container).toBeInTheDocument();

	const circlesContainer = container.getElementsByTagName('span')[0];

	expect(circlesContainer).not.toBeUndefined();
	expect(container).toContainElement(circlesContainer);
	expect(circlesContainer).toBeInTheDocument();
	expect(circlesContainer).toHaveClass('loading-circles');

	const circleItems = circlesContainer.getElementsByTagName('span');

	expect(circleItems).toHaveLength(8);

	for (let circleItem of circleItems) {
		expect(circleItem).toBeInTheDocument();
		expect(circleItem).toBeEmptyDOMElement();
		expect(circleItem).toHaveClass('circle-item');
	}
});

test('shows bubbles animation when spinner set to bubbles', () => {
	const { container } = render(Spinner, { spinner: 'bubbles' });
	expect(container).toBeInTheDocument();

	const bubblesContainer = container.getElementsByTagName('span')[0];

	expect(bubblesContainer).not.toBeUndefined();
	expect(container).toContainElement(bubblesContainer);
	expect(bubblesContainer).toBeInTheDocument();
	expect(bubblesContainer).toHaveClass('loading-bubbles');

	const bubblesItems = bubblesContainer.getElementsByTagName('span');

	expect(bubblesItems).toHaveLength(8);

	for (let bubblesItem of bubblesItems) {
		expect(bubblesItem).toBeInTheDocument();
		expect(bubblesItem).toBeEmptyDOMElement();
		expect(bubblesItem).toHaveClass('bubble-item');
	}
});