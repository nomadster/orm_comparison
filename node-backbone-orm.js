var Backbone = require('backbone');
var SQLSync = require('backbone-sql');
//var backbone_orm = require('backbone-orm');
var LIMIT = process.env.LIMIT || 10000;
var database = process.env.DATABASE || 'test_orm'
var tableName = 'node_backboneSQL';

var dbURL = 'mysql://root@localhost:3306' + '/' + database + '/' + tableName;
console.log(dbURL);

var Entry = Backbone.Model.extend({
    urlRoot: dbURL,
    schema: {
//        id: LO AGGIUNGE DA SOLO,
        string: ['String', {required: true, nullable: false}   ],
        number: [ 'Integer', {required: true} ],
        createdAt: ['DateTime', {required: true}],
        updatedAt:  ['DateTime', {required: true}]
    }
});

//Sovrascrive la sync() di backbone con quella di backbone-sql
Entry.prototype.sync = SQLSync.sync(Entry);

var db = Entry.db();
db.resetSchema(function(err) { //Fa tipo droptableIfExist + createTableIfNotExist

    if(err) throw err;

    var testInsert = function(afterInsertCback){
        var start = Date.now(),
            duration,
            done = 0;

        var createEntry = function(cback){
            var entry = new Entry({string: 'asdasdasd', number: Math.floor(Math.random() * 99999),  createdAt: '2012-01-24 16:57:51', updatedAt: '2012-01-24 16:57:51'});
            entry.save(function(err,entry){
                if(err) throw err;
                cback && cback();
            })
        }

        var createEntryCallback = function(){
            if((++done) === LIMIT) {
                duration = Date.now() - start
                console.log('node-backbone-orm timings for ' + LIMIT + ' inserts is ' + duration + ' ms')
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
