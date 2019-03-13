# sqlite3-p

A wrapper for the sqlite3 package.

IN PROGRESS

### Instantiation

```js
const db = new Sqlite3_P(<"/path/to/file" or ":memory:">)
```

### API

##### <code>#.close(): () -> Promise</code>

Based on sqlite3.Database.close.
Error only, non-thennable.

##### <code>#.run(...): String, [...Params] -> Promise</code>

Based on sqlite3.Database.run. The run method does not return any kind of query result.
Error only, non-thennable.

```js
db.run('CREATE TABLE test_table (tid INTEGER)', []);
```

##### <code>#.getRow(...): String, [...Params] -> Promise</code>

Based on <code>sqlite3.Database.get</code>. Returns a single row from the given query.
Thennable.

```js
db.getRow('SELECT * FROM test_table', []);
```

##### <code>#.getAllRows(...): String, [...Params] -> Promise</code>

Based on <code>sqlite3.Database.all</code>. Returns all rows from the given query.
Thennable.

```js
db.getAllRows('SELECT * FROM test_table', []);
```

##### <code>#.RowStream(...): String, [...Params] -> ReadableStream</code>

Based on <code>sqlite3.Database.each</code>. The <code>.each</code> method fires a callback for each row encountered. This operation has been converted to a stream.

```js
const RowStream = db.RowStream('SELECT * FROM test_table', [])

RowStream.on('data', row => {
    //...
})

// or with Node v10+
for await(const row of RowStream){
    //...
}
```
