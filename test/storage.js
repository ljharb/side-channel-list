'use strict';

var test = require('tape');
var execFile = require('child_process').execFile;
var path = require('path');
var getStorage = require('../storage');

test('storage-only entry', { skip: !getStorage }, function (t) {
	// eslint-disable-next-line no-extra-parens
	var storage = /** @type {Exclude<typeof getStorage, false>} */ (getStorage)();
	// eslint-disable-next-line no-extra-parens
	var other = /** @type {Exclude<typeof getStorage, false>} */ (getStorage)();
	var key = {};
	var value = {};

	t.deepEqual(Object.keys(storage), ['delete', 'get', 'has', 'set'], 'only storage methods');
	t.equal(storage.get(key), undefined, 'missing key');
	t.equal(storage.has(key), false, 'missing key is absent');
	storage.set(key, value);
	t.equal(storage.get(key), value, 'stored value retains identity');
	t.equal(storage.has(key), true, 'stored key is present');
	t.equal(other.has(key), false, 'instances are independent');
	t.equal(storage['delete'](key), true, 'stored key can be deleted');
	t.equal(storage.has(key), false, 'deleted key is absent');
	t.equal(storage['delete'](key), false, 'repeated deletion returns false');
	t.end();
});

test('storage dependency graph excludes the assertion formatter', function (t) {
	var script = [
		"var Module = require('module');",
		'var load = Module._load;',
		'Module._load = function (request) {',
		"  if (request === 'object-inspect') { throw new Error('unexpected assertion formatter'); }",
		'  return load.apply(this, arguments);',
		'};',
		'require(' + JSON.stringify(path.resolve(__dirname, '../storage')) + ');'
	].join('\n');
	execFile(process.execPath, ['-e', script], function (error, stdout, stderr) {
		t.error(error, stderr || stdout || 'the storage entry loads without object-inspect');
		t.end();
	});
});
