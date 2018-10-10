// test-transactions.js
// test our transaction routes

// basic testing stuff
import chai from 'chai'
import chaiHttp from 'chai-http'
import server from '../server.js'
const should = chai.should()

// our test subjects
import Account from '../models/account.js'
const testAccount = {
    name: {
        first: "Katherine",
        last: "Reynolds"
    }
}
let testSlug = 'Katherine-Reynolds-262a'
import Charity from '../models/charity.js'
const testCharity = {
    name: "Purple Cross",
    ein: 4201969
}
let testTransaction = {
    amount: 150,
    date: Date.now,
    recurring: false
}
let standInTestId = '5bbde88a55ba7f3cad'

chai.use(chaiHttp)

describe('Transactions', () => {

    // before(() => {
    //     let account = new Account(testAccount)
    //     account.save((err, data) => {
    //         testSlug = data.slug
    //         testTransaction.account = data._id
    //         let charity = new Charity(testCharity)
    //         charity.save((err, data) => {
    //             testTransaction.charity = data._id
    //             testTransaction.charityName = data.name
    //             testTransaction.ein = data.ein
    //             account.donations.push(testTransaction)
    //             account.save((err, data) => {
    //                 standInTestId = data.donations[0]._id
    //                 console.log(account);
    //                 done()
    //             })
    //         })
    //     })
    //
    // });

    // cleanup

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
                done()
            })
    });

    // test new transaction form
    it('should return a new transaction form on /accounts/:slug/transactions/new GET', (done) => {
        chai.request(server)
            .get(`/accounts/${testSlug}/transactions/new`)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.html;
                done();
            });
    })

    // test hacky transaction form
    it('should return a new transaction form on /accounts/:slug/transactions/new POST', (done) => {
        chai.request(server)
            .post(`/accounts/${testSlug}/transactions/new`)
            .send(testCharity)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.html
                done();
            });
    })

    // test create a transaction
    it('should create a transaction on /accounts/:slug/transactions/ POST', (done) => {
        chai.request(server)
            .post(`/accounts/${testSlug}/transactions/`)
            .send(testTransaction)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.html
                done();
            });
    })

    // test get edit transaction form
    it('should return an edit transaction information form on /accounts/:slug/transactions/:id/edit GET', (done) => {
        chai.request(server)
            .get(`/accounts/${testSlug}/transactions/${standInTestId}/edit`)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.html
                done();
            });
    })

    // test update account information
    // why doesn't this work? i dunno.
    it('should update the information on a single transaction on /accounts/${testSlug}/transactions/${standInTestId} PUT', (done) => {
        chai.request(server)
        .put(`/accounts/${testSlug}/transactions/${standInTestId}`)
        .send({ amount: 275 })
        .end((err, res) => {
            res.should.have.status(200);
            res.should.be.html
            done();
        });
    })

    //test account deletion
    it('should delete a transaction on /accounts/${testSlug}/transactions/${standInTestId} DELETE', (done) => {
        chai.request(server)
        .delete(`/accounts/${testSlug}/transactions/${standInTestId}`)
        .end((err, res) => {
            res.should.have.status(200);
            res.should.be.html
            done();
        });
    })


})
