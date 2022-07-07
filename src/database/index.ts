import PouchDB from 'pouchdb';

export const db = new PouchDB('budgets');

const remoteDB = new PouchDB('http://192.168.68.108:5984/budgets');

db.replicate
  .to(remoteDB)
  .on('complete', function () {
    // yay, we're done!
  })
  .on('error', function (err) {
    // boo, something went wrong!
  });
