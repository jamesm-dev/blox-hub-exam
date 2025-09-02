const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

// Simplest approach: cache + mtime check on each request, no watcher
let cachedStats = null;
let cachedMtimeMs = 0;

function computeStats(items) {
  const total = Array.isArray(items) ? items.length : 0;
  if (total === 0) return { total: 0, averagePrice: 0 };
  const sum = items.reduce((acc, cur) => acc + (Number(cur.price) || 0), 0);
  return { total, averagePrice: sum / total };
}

async function readAndCompute() {
  const raw = await fs.readFile(DATA_PATH, 'utf8');
  const items = JSON.parse(raw);
  return computeStats(items);
}

// GET /api/stats
router.get('/', async (req, res, next) => {
  try {
    let stat = null;
    try {
      stat = await fs.stat(DATA_PATH);
    } catch (_) {}
    if (stat && cachedStats && stat.mtimeMs === cachedMtimeMs) {
      return res.json(cachedStats);
    }
    const stats = await readAndCompute();
    cachedStats = stats;
    cachedMtimeMs = stat ? stat.mtimeMs : cachedMtimeMs;
    return res.json(stats);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;