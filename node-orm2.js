//TODO: Generare la data al momento dell'inserzione!
var orm = require('orm');
var LIMIT = process.env.LIMIT || 10000;


var conn_opts = {
    database: process.env.DATABASE || 'test_orm',
    protocol: 'mysql',
    host: 'localhost',
    user: 'root'
}

var tableName = 'node_orm2';

orm.connect(conn_opts, function(err, db){
    if (err) throw err;

    var Entry = db.define(tableName, {
        string: {type: 'text', required: true},
        number: {type: 'number', required: true, unsigned: true},
        createdAt: {type: 'date', required: true, time: true},
        updatedAt: {type: 'date', required: true, time: true}
    }, {
        validations: {
            string: orm.enforce.ranges.length(1,255)
        }
    }); //Fine della db.define

    var testInsert = function( afterInsert ){
        var done = 0,
            start = Date.now(),
            duration;

        Entry.sync(); //Crea la tabella se non c'è;

        var createEntry = function(cback){
            Entry.create([{string: 'asdasdasd', number: Math.floor(Math.random() * 99999), createdAt: '2012-01-24 16:57:51', updatedAt: '2012-01-24 16:57:51'}], function(){
                cback && cback();
            })
        }

        var createEntryCallback = function(){
            if((++done) === LIMIT) {
                duration = Date.now() - start
                console.log('node-orm2 timings for ' + LIMIT + ' inserts is ' + duration + ' ms')
            }
            if(done < LIMIT)
                createEntry(createEntryCallback);
            else
                afterInsert && afterInsert() //Termina il test;
        }
        //Avvia il test!
        createEntry(createEntryCallback);
    }

    testInsert(function(){
        process.exit();
    })
});