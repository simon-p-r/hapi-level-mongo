'use strict';

const Db = require('level-mongo');


exports.register = (plugin, options, next) => {

    let db;

    try {
        db = new Db(options);
    }
    catch (e) {

        return next(e);
    }

    plugin.ext('onPreStart', (server, cb) => {

        db.open((err) => {

            // $lab:coverage:off$
            if (err) {
                return cb(err);
            }
            // $lab:coverage:on$

            //raw leveldb object for using database wide leveldb commands
            server.decorate('server', 'leveldb', db._db);

            // generated collection namespaces using mongo syntax
            server.decorate('server', 'levelmongo', db);
            return cb();

        });
    });

    plugin.ext('onPreStop', (server, cb) => {

        db.close((err) => {

            // $lab:coverage:off$
            if (err) {
                return cb(err);
            }
            // $lab:coverage:on$

            return cb();

        });
    });

    return next();
};



exports.register.attributes = {

    pkg: require('../package.json')
};
