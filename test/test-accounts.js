// test-accounts.js
// test our account routes

// basic testing stuff
import chai from 'chai'
import chaiHttp from 'chai-http'
import server from '../server.js'
const should = chai.should()

// our test subject
import Account from '../models/account.js'
const testAccount = {
    name: {
        first: "Katherine",
        last: "Reynolds"
    },
    slug: 'test-slug-42069'
}

chai.use(chaiHttp)

describe('Accounts', function() {

    after(function() {
        Account.deleteMany({
            name: {
                first: "Katherine",
                last: "Reynolds"
            }
        }, function(err) {
            if (err) {
                console.log(err)
            }
        })
        Account.deleteMany({
            name: {
                first: "Kat",
                last: "Westlake"
            }
        }, function(err) {
            if (err) {
                console.log(err)
            }
        })
        Account.deleteMany({
            name: {
                first: "undefined",
                last: "undefined"
            }
        }, function(err) {
            if (err) {
                console.log(err)
            }
        })
    })


    // test accounts index
    it('should index all accounts on /accounts GET', function(done) {
        chai.request(server)
            .get('/accounts')
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.html;
                done();
            });
    })

    // test new account form
    it('should return a new account form on /accounts/new GET', function(done) {
        chai.request(server)
            .get('/accounts/new')
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.html;
                done();
            });
    })

    // test create an account
    it('should create an account on /accounts POST', function(done) {
        let account = new Account(testAccount)
        chai.request(server)
            .post(`/accounts`)
            .send(account)
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.html
                done();
            });
    })

    // test show one account
    it('should return the details of a single account on /accounts/${slug} GET', function(done) {
        let account = new Account(testAccount)
        account.save(function(err, data) {
            chai.request(server)
                .get(`/accounts/${data.slug}`)
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.be.html
                    done();
                });
        })
    })

    // test get edit account form
    it('should return an edit account information form on /accounts/${slug}/edit GET', function(done) {
        let account = new Account(testAccount)
        account.save(function(err, data) {
            chai.request(server)
                .get(`/accounts/${data.slug}/edit`)
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.be.html
                    done();
                });
        })
    })

    // test update account information
    it('should update the information on a single account on /accounts/${slug} PUT', function(done) {
        let account = new Account(testAccount)
        account.save(function(err, data) {
            chai.request(server)
                .put(`/accounts/${data.slug}?method=PUT`)
                .send({
                    firstName: "Kat",
                    lastName: "Westlake"
                })
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.be.html
                    done();
                });
        });
    })

    //test account deletion
    it('should delete an account on /accounts/${id} DELETE', function(done) {
        let account = new Account(testAccount)
        account.save(function(err, data) {
            chai.request(server)
                .delete(`/accounts/${data._id}`)
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.be.html
                    done();
                });
        })
    })


})
