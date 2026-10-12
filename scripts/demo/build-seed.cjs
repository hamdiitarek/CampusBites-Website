#!/usr/bin/env node
/**
 * Builds app/lib/demo/seed.json for demo mode.
 *
 * Runs the real scripts/setup_demo_data_appwrite.cjs, but with node-appwrite
 * swapped for an in-memory fake, so the demo data has exactly the shape the
 * real Appwrite setup would create. Nothing touches the network.
 *
 *   node scripts/demo/build-seed.cjs
 */
const Module = require('module');
const path = require('path');
const fs = require('fs');

const collections = {};
const authUsers = [];
let seq = 0;
const newId = () => `${Date.now().toString(36)}${(seq++).toString(36).padStart(4, '0')}`.slice(-20);

class AppwriteException extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

/** Orders carry their real placement time in statusHistory; use it as $createdAt. */
function createdAtFor(data) {
  try {
    const history = typeof data.statusHistory === 'string' ? JSON.parse(data.statusHistory) : data.statusHistory;
    if (Array.isArray(history) && history[0]?.timestamp) return history[0].timestamp;
  } catch {}
  return new Date().toISOString();
}

const fake = {
  Client: class {
    setEndpoint() { return this; }
    setProject() { return this; }
    setKey() { return this; }
  },
  Databases: class {
    async getDocument(_db, coll, id) {
      const doc = (collections[coll] || []).find((d) => d.$id === id);
      if (!doc) throw new AppwriteException('Document not found', 404);
      return doc;
    }
    async createDocument(db, coll, id, data) {
      collections[coll] = collections[coll] || [];
      const $id = id === 'unique()' || !id ? newId() : id;
      if (collections[coll].some((d) => d.$id === $id)) throw new AppwriteException('Document exists', 409);
      const $createdAt = createdAtFor(data);
      const doc = { $id, $collectionId: coll, $databaseId: db, $createdAt, $updatedAt: $createdAt, $permissions: [], ...data };
      collections[coll].push(doc);
      return doc;
    }
    async listDocuments(_db, coll) {
      const documents = collections[coll] || [];
      return { total: documents.length, documents };
    }
    async deleteDocument(_db, coll, id) {
      collections[coll] = (collections[coll] || []).filter((d) => d.$id !== id);
      return {};
    }
    async updateDocument(_db, coll, id, data) {
      const doc = (collections[coll] || []).find((d) => d.$id === id);
      if (!doc) throw new AppwriteException('Document not found', 404);
      Object.assign(doc, data);
      return doc;
    }
  },
  Users: class {
    async create(id, email, _phone, password, name) {
      if (authUsers.some((u) => u.email === email)) throw new AppwriteException('User exists', 409);
      const user = { $id: id === 'unique()' || !id ? newId() : id, email, password, name };
      authUsers.push(user);
      return user;
    }
  },
  Account: class {},
  // Real ids (not the 'unique()' placeholder) so cross-references like
  // menuItem.categoryId point at the documents they were meant to.
  ID: { unique: () => newId() },
  Query: new Proxy({}, { get: () => () => '' }),
};

const realLoad = Module._load;
Module._load = function (request, parent, isMain) {
  if (request === 'node-appwrite') return fake;
  if (request === 'dotenv') return { config: () => ({}) };
  if (request.endsWith('utils/logger.cjs')) {
    return { log: () => {}, validateConfig: () => {} };
  }
  return realLoad.apply(this, arguments);
};

process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID = 'demo';
process.env.APPWRITE_API_KEY = 'demo';
process.argv = [process.argv[0], 'setup_demo_data_appwrite.cjs'];

const quiet = console.log;
console.log = () => {};
// The script exits the process when it finishes; write the seed first.
const realExit = process.exit;
process.exit = (code) => {
  done();
  realExit(code);
};
let written = false;
// setupDemoData() ships with the university/student/admin/vendor steps commented
// out (they're meant to run once against a real project). Re-enable them here.
const scriptPath = path.join(__dirname, '..', 'setup_demo_data_appwrite.cjs');
const source = fs
  .readFileSync(scriptPath, 'utf8')
  .replace('//await createUniversity();', 'await createUniversity();')
  .replace('//await createDemoStudents();', 'await createDemoStudents();')
  .replace('//await createDemoAdmins();', 'await createDemoAdmins();')
  .replace('//const vendors = await createDemoVendors();', 'const vendors = await createDemoVendors();');
const m = new Module(scriptPath, module);
m.filename = scriptPath;
m.paths = Module._nodeModulePaths(path.dirname(scriptPath));
m._compile(source, scriptPath);

// The script kicks off async work at require time; wait for it to settle.
const started = Date.now();
const wait = () => {
  const orders = (collections.orders || []).length;
  if (orders > 0 && Date.now() - started > 1500) return done();
  if (Date.now() - started > 30000) return done();
  setTimeout(wait, 250);
};
function done() {
  if (written) return;
  written = true;
  console.log = quiet;
  const out = {
    builtAt: new Date().toISOString(),
    authUsers,
    collections,
  };
  const file = path.join(__dirname, '..', '..', 'app', 'lib', 'demo', 'seed.json');
  fs.writeFileSync(file, JSON.stringify(out));
  const counts = Object.fromEntries(Object.entries(collections).map(([k, v]) => [k, v.length]));
  console.log('seed written:', path.relative(process.cwd(), file), counts, 'auth users:', authUsers.length);
}
wait();
