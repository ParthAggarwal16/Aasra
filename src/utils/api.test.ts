import test from 'node:test';
import assert from 'node:assert/strict';

import { buildApiUrl } from './api.ts';

test('buildApiUrl keeps local relative paths in dev', () => {
  assert.equal(buildApiUrl('/api/chat-stream', { DEV: true }), '/api/chat-stream');
});

test('buildApiUrl adds a configured production backend base', () => {
  assert.equal(
    buildApiUrl('/api/chat-stream', { DEV: false, VITE_API_BASE: 'https://api.example.com' }),
    'https://api.example.com/api/chat-stream'
  );
});
