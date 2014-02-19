var Waterline = require('waterline');
var sailsMysql = require('sails-mysql');

var LIMIT = process.env.LIMIT || 10000;

var database = process.env.DATABASE || 'test_orm';
var tableName = process.env.TABLENAME || 'test_waterline';

var Entity = Waterline.Collection.extend({
    tableName: tableName,
    adapter: 'mysql', //O uno di quelli supportati. Dopo gli dovremo passare l'istanza dell'adapter.

    //Crea e usa i campi createdAt, updatedAt, id
    autoCreatedAt: true,
    autoUpdatedAt: true,
    autoPK: true,

    attributes: {
        number: { type: 'integer', required: true },
        string: { type: 'string', minLength: 1, maxLength: 255, required: true }
    }
});

sailsMysql.config = {
    host: 'localhost',
    user: 'root',
    database: database
}

new Entity({ adapters: { mysql: sailsMysql } }, function(err, Model){
   if(err) throw err;
    var done = 0,
        start = Date.now(),
        duration;

    var createEntryCallback = function(){
        if((++done) === LIMIT){
            duration = Date.now() - start;
            console.log('node-waterline timings for ' + LIMIT + 'inserts is ' + duration + ' ms')
        }
        if(done < LIMIT)
            createEntry(createEntryCallback);
        else
            process.exit();
    }

    var createEntry = function(cback){
        Model.create({number: Math.floor(Math.random() * 99999), string: 'asdasdasd'}, function(){
            cback && cback();
        });
    }

    createEntry(createEntryCallback);
});

