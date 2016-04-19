'use strict';

const Lab = require('lab');
const Hapi = require('hapi');
const Code = require('code');
const HapiLevelMongo = require('..');
const RmDir = require('rimraf');

const location = './test/fixtures/level';

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const after = lab.after;
const expect = Code.expect;

describe('hapi-level-mongo', () => {

    after((done) => {

        RmDir(location, (err) => {

            expect(err).to.not.exist();
            done();
        });

    });


    it('should register plugin with valid options', { parallel: false }, (done) => {

        const server = new Hapi.Server();
        server.connection();
        const plugins = {
            register: HapiLevelMongo,
            options: {
                location: location,
                collections: {
                    users: {
                        key: '_id'
                    }
                }
            }
        };

        server.register(plugins, (err) => {

            expect(err).to.not.exist();

            server.start((err) => {

                expect(err).to.not.exist();
                expect(server.leveldb).to.exist();
                expect(server.levelmongo).to.exist();
                server.stop(done);
            });
        });
    });

    it('should fail to register plugin due to invalid options', { parallel: false }, (done) => {

        const server = new Hapi.Server();
        server.connection();

        const invalidPlugins = {
            register: require('..'),
            options: {
                collections: {

                }
            }
        };

        server.register(invalidPlugins, (err) => {

            expect(err).to.exist();
            done();

        });
    });


});
