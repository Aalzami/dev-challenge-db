/**
 * This javascript file will constitutes the entry point of the solution.
 *
 */


// This is not really required, but means that changes to index.html will cause a reload.
require('./site/index.html')
// Apply the styles in style.css to the page.
require('./site/style.css')

// if you want to use es6, you can do something like
const { default: SortedTable } = require('./es6/table')
// here to load the myEs6code.js file, and it will be automatically transpiled.

// Change this to get detailed logging from the stomp library
global.DEBUG = false

const url = "ws://localhost:8011/stomp"
const client = Stomp.client(url)
client.debug = function(msg) {
  if (global.DEBUG) console.info(msg)
}

function connectCallback() {
  const dataTable = new SortedTable();
  client.subscribe('/fx/prices', dataTable.receiveMessage)
}

client.connect({}, connectCallback, function(error) {
  alert(error.headers.message)
})