require('@testing-library/jest-dom/extend-expect');

const { render, fireEvent } = require('@testing-library/svelte');

const Spinner = require('./Spinner.svelte');



function testDefaultAnimation(container) {
	const spinner = container.getElementsByTagName('i')[0];

	expect(spinner).not.toBeUndefined();
	expect(container).toContainElement(spinner);
	expect(spinner).toBeInTheDocument();
	expect(spinner).toBeEmptyDOMElement();
	expect(spinner).toHaveClass('loading-default');
}

test('shows default animation when spinner prop set to default', () => {
	const { container } = render(Spinner, { spinner: 'default' });
	expect(container).toBeInTheDocument();

	testDefaultAnimation(container);
});

test('shows default animation when no prop set', () => {
	const { container } = render(Spinner);
	expect(container).toBeInTheDocument();

	testDefaultAnimation(container);
});



function testWaveDotsAnimation(container) {
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
}

test('shows wave dots animation when spinner prop set to wavedots', () => {
	const { container } = render(Spinner, { spinner: 'wavedots' });
	expect(container).toBeInTheDocument();

	testWaveDotsAnimation(container);
});



function testSpiralAnimation(container) {
	const spinner = container.getElementsByTagName('i')[0];

	expect(spinner).not.toBeUndefined();
	expect(container).toContainElement(spinner);
	expect(spinner).toBeInTheDocument();
	expect(spinner).toBeEmptyDOMElement();
	expect(spinner).toHaveClass('loading-spiral');
}

test('shows spiral animation when spinner prop set to spiral', () => {
	const { container } = render(Spinner, { spinner: 'spiral' });
	expect(container).toBeInTheDocument();

	testSpiralAnimation(container);
});



function testCirclesAnimation(container) {
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
}

test('shows circles animation when spinner prop set to circles', () => {
	const { container } = render(Spinner, { spinner: 'circles' });
	expect(container).toBeInTheDocument();

	testCirclesAnimation(container);
});



function testBubblesAnimation(container) {
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
}

test('shows bubbles animation when spinner prop set to bubbles', () => {
	const { container } = render(Spinner, { spinner: 'bubbles' });
	expect(container).toBeInTheDocument();

	testBubblesAnimation(container);
});



test('updates animation when spinner prop changes', async () => {
	const { container, component } = render(Spinner, { spinner: 'default' });
	expect(container).toBeInTheDocument();

	testDefaultAnimation(container);

	await component.$set({ spinner: 'spiral' });

	testSpiralAnimation(container);
});