var LIMIT = process.env.LIMIT || 10000;
var database = process.env.DATABASE || 'test_orm'
var tableName = 'test_jugglingdb';

var Schema = require('jugglingdb').Schema;
//Schema constructor accepts two arguments. First argument is adapter. It could be adapter name or adapter package:
var options = {
    host:'localhost',
    port: '3306',
    username: 'root', //Security FTW
    database: database,
    debug: false
}
//Devo installare jugglingdb-mysql!
var mysqldb = new Schema('mysql', options);
//For adapter-specific settings refer to adapter's readme file.


//Connecting to database
//Schema connecting to database automatically. Once connection established schema object emit 'connected' event,
// and set connected flag to true, but it is not necessary to wait for 'connected' event because
// all queries cached and executed when schema emit 'connected' event.
// To disconnect from database server call schema.disconnect method. This call forwarded to adapter if
// adapter have ability to connect/disconnect.

//Model definition
//To define model schema have single method schema.define. It accepts three argumets:

var properties = {
    string: {type: String, limit: 255, required: true},
    number: {type: Number, dataType: 'int', required: true },
    createdAt: { type: Date, default: function(){ return new Date}},
    updatedAt: { type: Date, default: function(){ return new Date}}
}


var Entry = mysqldb.define('Entry', properties, { table: tableName});


mysqldb.autoupdate(function(err){
    if(err) throw err;

    var testInsert = function(afterInsertCback){
        var start = Date.now(),
            duration,
            done = 0;

        var createEntry = function(cback){
            var entry = new Entry({string: 'asdasdasd', number: Math.floor(Math.random() * 99999)});
            entry.save(function(err,entry){
                if(err) throw err;
                cback && cback();
            })
        }

        var createEntryCallback = function(){
            if((++done) === LIMIT) {
                duration = Date.now() - start
                console.log('node-jugglingdb timings for ' + LIMIT + ' inserts is ' + duration + ' ms')
            }
            if(done < LIMIT)
                createEntry(createEntryCallback);
            else
                afterInsertCback && afterInsertCback() //Termina il test;
        }
        //Avviamo il test.
        createEntry(createEntryCallback);
    }

    testInsert(function(){
        process.exit();
    })

});


