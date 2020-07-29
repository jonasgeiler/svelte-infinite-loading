import App from './App.svelte';
import { assert, test, done } from 'tape-modern';

// setup
const target = document.getElementById('main');

function normalize(html) {
	const div = document.createElement('div');
	div.innerHTML = html
		.replace(/<!--.+?-->/g, '')
		.replace(/svelte-ref-\w+=""/g, '')
		.replace(/\s*svelte-\w+\s*/g, '')
		.replace(/class=""/g, '')
		.replace(/>\s+/g, '>')
		.replace(/\s+</g, '<');

	div.normalize();
	return div.innerHTML;
}

assert.htmlEqual = (a, b, msg) => {
	assert.equal(normalize(a), normalize(b));
};

// tests
test('with no data, creates two <div> elements', async t => {
	const app = new App({
		target
	});
});

// this allows us to close puppeteer once tests have completed
window.done = done;