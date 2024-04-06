import test from 'node:test';
import main from './index.js';

test('synchronous passing test', (t) => {
    main('garbage.json');
});
