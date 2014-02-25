//TODO: Generare la data che viene inserita perché ora guadagnamo un po' di tempo sul fatto che è pre-calcolata!
var mysql = require('mysql');
var LIMIT = process.env.LIMIT || 10000

var client = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    database: process.env.DATABASE || 'test_orm'
});
//Apre la connessione!
client.connect();

var tableName = 'node_mysql';

//Crea la tabella tableName e poi invoca la callback (serve a concatenare gli eventi)
var createTable = function(tableName, callback){
    var drop = 'DROP TABLE IF EXISTS `' + tableName + '`;',
        create = 'CREATE TABLE IF NOT EXISTS `' + tableName + '` (`number` INTEGER, `string` VARCHAR(255), `id` INTEGER NOT NULL auto_increment , `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`id`));';
    client.query(drop, function(err,result,fields){
        if(err) throw new Error(err)
        client.query(create, function(err,result,fields){
            if(err) throw new Error(err)

            //Qui sfrutta la lazy evaluation per capire se mi han passato
            // la callback e nel caso chiamarla.
            callback && callback();
        })
    })
}


var testInsert = function( afterInsert ){

    createTable(tableName, function(){
        var start = Date.now(),
            done = 0,
            duration;

        var createEntry = function(cback){
            var insert = "INSERT INTO `" + tableName + "` (`number`,`string`,`id`,`createdAt`,`updatedAt`) VALUES (" + Math.floor(Math.random() * 99999) + ",'asdasdad',NULL,'2012-01-24 16:57:51','2012-01-24 16:57:51');"
            client.query(insert,function(err, rows, fields) {
                if(err) throw new Error(err)
                cback && cback()
            });
        }

        var createEntryCallback = function() {
            if((++done) === LIMIT){
                duration = Date.now() - start;
                console.log('node-mysql timings for ' + LIMIT + ' inserts is ' + duration + ' ms');
            }

            if(done < LIMIT)
                createEntry(createEntryCallback);
            else
                afterInsert && afterInsert() //Termina il test;
        }

        //Avvia il test!
        createEntry(createEntryCallback);

    })
}




testInsert(function(){
    client.end();
    process.exit();
})