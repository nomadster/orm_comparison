var Sequelize = require('sequelize');
var LIMIT = process.env.LIMIT || 10000;

var database = process.env.DATABASE || 'test_orm';

var sequelize = new Sequelize('mysql://root@localhost/' + database, {
    logging: false,
    maxConcurrentQueries: 100,
    define: {
        //syncOnAssociation: true,
        charset: 'utf8',
        timestamps: true //Ci da updatedAt e createdAt
       /*******
        Con timestamps true si può usare anche paranoid: true che non
        cancella le entry ma setta deletedAt e poi lo considera come cancellato
        *******/
    }
});

var tableName = 'test_sequelize';

var Entry = sequelize.define(tableName, {
    string: {
        type: Sequelize.STRING, // VARCHAR(255)
        allowNull: false//,
        /* get: function() {
               do your magic here and return something!
                'this' allows you to access attributes of the model.
                   example: this.getDataValue('name') works
         */
    },
    number: {
        type: Sequelize.INTEGER,
        allowNull: false//,
        // validate: {
        // http://sequelizejs.com/docs/latest/models#block-9-line-3
        // http://sequelizejs.com/docs/latest/models#block-12-line-0
        // }
    }
});

var insertEntry = function(){

}

Entry.sync() //oppure sequelize.sync() per syncare tutti i modelli definiti
    .success( function(){
        //Usiamo il queryChainer, che farebbe una "bulk query" per tutti in modo
        // seriale così facciamo una query alla volta!
        var chainer = new Sequelize.Utils.QueryChainer;
        var start = Date.now();
        for(var i=0; i<LIMIT; i++){
            chainer.add(Entry.create({number: Math.floor(Math.random() * 99999) , string: 'asdasdasd'}))
        }

        chainer.runSerially()
            .success(function(){
                var duration = Date.now() -start;
                console.log('node-sequelize timings for ' + LIMIT + ' inserts is ' + duration + ' ms');
                process.exit();
            })
    })

//Entry.build() e poi .save() mi consente di creare una istanza del mio model
// non persistente e poi salvarla solo quando mi necessita farlo
// Oppure posso usare entry.create() per fargliela salvare subito.
