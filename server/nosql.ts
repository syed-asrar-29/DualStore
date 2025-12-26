// Simulating MongoDB using NeDB (file-based NoSQL)
import Datastore from 'nedb-promises';
import path from 'path';

// In Replit, we can use the /tmp directory or a local directory.
// Using in-memory for ephemeral state or local files for persistence across restarts.
// We'll use in-memory for simplicity in this demo, or files if we want persistence.
// Let's use files to demonstrate "durability" across process restarts.

const DATA_DIR = path.join(process.cwd(), 'data');
import fs from 'fs';
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export const inventoryStore = Datastore.create({ filename: path.join(DATA_DIR, 'inventory.db'), autoload: true });
export const sagaLogStore = Datastore.create({ filename: path.join(DATA_DIR, 'saga_log.db'), autoload: true });

// Ensure indices
inventoryStore.ensureIndex({ fieldName: '_id', unique: true });
sagaLogStore.ensureIndex({ fieldName: '_id', unique: true });
