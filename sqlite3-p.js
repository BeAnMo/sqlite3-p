const sqlite = require('sqlite3').verbose();
const stream = require('stream');

class Sqlite3_P {
  constructor(path) {
    this._db = new sqlite.Database(path, err => {
      if (err) {
        throw err;
      }
    });
  }

  close() {
    return new Promise((s, f) => this._db.close(f));
  }

  /**
   * @description does not retrieve data
   * used for insertion/update/create
   * @param {String} sql
   * @param {Object} params (optional)
   */
  run(sql, params = []) {
    // failure only callback
    return new Promise((sucess, failure) => this._db.run(sql, params, failure));
  }

  getRow(sql, params = []) {
    return new Promise((success, failure) =>
      this._db.get(sql, params, (err, row) =>
        err ? failure(err) : success(row)
      )
    );
  }

  getAllRows(sql, params = []) {
    return new Promise((success, failure) =>
      this._db.all(sql, params, (err, rows) =>
        err ? failure(err) : success(rows)
      )
    );
  }

  /**
   * @return {Stream} readable stream
   */
  RowStream(sql, params = []) {
    const db = this._db;
    let hasFinished = false;
    let lookup = Object.create(null);

    return new stream.Readable({
      objectMode: true,
      read: function() {
        db.each(
          sql,
          params,
          (err, row) => {
            if (err) {
              this.emit('error', err);
            } else if (lookup[row.rid] || hasFinished) {
              return null;
            } else {
              lookup[row.rid] = 1;
              this.push(row);
            }
          },
          (err, count) => {
            if (err) {
              this.emit('error', err);
            } else {
              if (hasFinished) {
                return null;
              } else {
                hasFinished = true;
                this.push({ rows: count.toString() });
                this.push(null);
              }
            }
          }
        );
      }
    });
  }
}

module.exports = SqliteDB;
