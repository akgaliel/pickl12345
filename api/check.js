// GET /api/check?id=TICKET_ID
// Returns { status: 'valid' | 'used', checkedInAt?: string }
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing ticket ID' });

  const store = await getStore();
  const record = store[id];

  if (record) {
    return res.status(200).json({ status: 'used', checkedInAt: record.checkedInAt, name: record.name });
  }

  return res.status(200).json({ status: 'valid' });
}

// Simple file-based store using Vercel's /tmp (resets on cold start — upgrade to Vercel KV for persistence)
import { readFileSync, writeFileSync, existsSync } from 'fs';
const STORE_PATH = '/tmp/checkins.json';

export function getStore() {
  if (!existsSync(STORE_PATH)) return {};
  try { return JSON.parse(readFileSync(STORE_PATH, 'utf8')); } catch { return {}; }
}

export function saveStore(store) {
  writeFileSync(STORE_PATH, JSON.stringify(store), 'utf8');
}
