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
    }
}

chai.use(chaiHttp)

describe('Accounts', () => {

    // cleanup
    /*
    after(() => {
        Account.deleteMany({
                name: {
                    first: "Katherine",
                    last: "Reynolds"
                }
            })
            .exec((err, accounts) => {
                console.log(accounts)
                accounts.remove()
            })

        Account.deleteMany({
                name: {
                    first: "Kat",
                    last: "Westlake"
                }
            })
            .exec((err, accounts) => {
                console.log(accounts)
                accounts.remove()
            })
    })
    */

    // test accounts index
    it('should index all accounts on /accounts GET', (done) => {
        chai.request(server)
            .get('/accounts')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.html;
                done();
            });
    })

    // test new account form
    it('should return a new account form on /accounts/new GET', (done) => {
        chai.request(server)
            .get('/accounts/new')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.html;
                done();
            });
    })

    // test create an account
    it('should return the account index on /accounts POST', (done) => {
        let account = new Account(testAccount)
        account.save((err, data) => {
            chai.request(server)
                .post(`/accounts`)
                .send(account)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.html
                    done();
                });
        })
    })

    // test show one account
    it('should return the details of a single account on /accounts/${slug} GET', (done) => {
        let account = new Account(testAccount)
        account.save((err, data) => {
            chai.request(server)
                .get(`/accounts/${data.slug}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.html
                    done();
                });
        })
    })

    // test get edit account form
    it('should return an edit account information form on /accounts/${slug}/edit GET', (done) => {
        let account = new Account(testAccount)
        account.save((err, data) => {
            chai.request(server)
                .get(`/accounts/${data.slug}/edit`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.html
                    done();
                });
        })
    })

    // test update account information
    // why doesn't this work? i dunno.
    it('should update the information on a single account on /accounts/${slug} PUT', (done) => {
        let account = new Account(testAccount)
        account.save((err, data) => {
            chai.request(server)
                .put(`/accounts/${data.slug}?method=PUT`)
                .send({ firstName: "Kat", lastName: "Westlake" })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.html
                    done();
                });
        });
    })

    //test account deletion
    it('should delete an account on /accounts/${id} DELETE', (done) => {
        let account = new Account(testAccount)
        account.save((err, data) => {
            chai.request(server)
                .delete(`/accounts/${data._id}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.html
                    done();
                });
        })
    })


})
