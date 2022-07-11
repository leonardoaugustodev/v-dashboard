import PouchDB from 'pouchdb';
import rel from 'relational-pouch';
import find from 'pouchdb-find';

PouchDB.plugin(rel);
PouchDB.plugin(find);

export const db = new PouchDB('budgets');

// const remoteDB = new PouchDB('http://192.168.68.108:5984/budgets');

// db.replicate
//   .to(remoteDB)
//   .on('complete', function () {
//     // yay, we're done!
//   })
//   .on('error', function (err) {
//     // boo, something went wrong!
//   });

//non relation pouch API is still available

// db.changes({
//   filter: (doc) => {
//     return doc._id.startsWith('category_');
//   },
// }).on('change', (result) => {
//   console.log(result);
// });
