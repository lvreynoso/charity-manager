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
        first: "Kat",
        last: "Reynolds"
    },
    slug: 'Katherine-Reynolds-420a' // KEYYYYYYYY
}
import Charity from '../models/charity.js'
const testCharity = {
    name: "Purple Cross",
    ein: 4201969
}
let testTransaction = {
    amount: 150,
    date: '14 Jul 2016',
    recurring: false
}
let testTransactionTwo = {
    amount: 150,
    date: '6 June 2018',
    recurring: false
}
let testTransactionThree = {
    amount: 150,
    date: '6 June 2018',
    recurring: false
}

chai.use(chaiHttp)

describe('Transactions', function() {

    after(function() {
        Account.deleteMany({
            name: {
                first: "Kat",
                last: "Reynolds"
            }
        }, function(err) {
            if (err) {
                console.log(err)
            }
        })

        Charity.deleteMany({
            name: "Purple Cross",
            ein: 4201969
        }, function(err) {
            if (err) {
                console.log(err)
            }
        })
    })


    // test new transaction form
    it('should return a new transaction form on /accounts/:slug/transactions/new GET', function(done) {
        let account = new Account(testAccount)
        account.save(function(err, data) {
            chai.request(server)
                .get(`/accounts/${data.slug}/transactions/new`)
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.be.html;
                    done();
                });
        })
    })

    // test hacky transaction form
    it.skip('should return a new transaction form on /accounts/:slug/transactions/new POST', function(done) {
        chai.request(server)
            .post(`/accounts/${testSlug}/transactions/new`)
            .send(testCharity)
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.html
                done();
            });
    })

    // test create a transaction
    it('should create a transaction on /accounts/:slug/transactions/ POST', function(done) {
        const account = new Account(testAccount)
        const charity = new Charity(testCharity)
        account.save(function(err, savedAccount) {
            charity.save(function(err, savedCharity) {
                testTransaction.charity = savedCharity._id
                chai.request(server)
                    .post(`/accounts/${savedAccount.slug}/transactions/`)
                    .send(testTransaction)
                    .end(function(err, res) {
                        res.should.have.status(200);
                        res.should.be.html;
                        done();
                    });
            })
        })

    })

    // test get edit transaction form
    it('should return an edit transaction information form on /accounts/:slug/transactions/:id/edit GET', function(done) {
        const account = new Account(testAccount)
        const charity = new Charity(testCharity)
        account.save(function(err, savedAccount) {
            charity.save(function(err, savedCharity) {
                testTransaction.charity = savedCharity._id
                Account.findById(savedAccount._id).then(function(response) {
                    response.donations.push(testTransactionTwo);
                    response.save(function(err, data) {
                        if (err) {
                            console.log(err);
                        }
                        chai.request(server)
                            .get(`/accounts/${data.slug}/transactions/${data.donations[0]._id}/edit`)
                            .end(function(err, res) {
                                res.should.have.status(200);
                                res.should.be.html;
                                done();
                            });
                    })
                })
            })
        })
    })

    // test update transaction information
    it('should update the information on a single transaction on /accounts/:slug/transactions/:id PUT', function(done) {
        let account = new Account(testAccount)
        account.slug = 'test-slug-69ab' // VERY IMPORTANT
        const charity = new Charity(testCharity)
        account.save(function(err, savedAccount) {
            charity.save(function(err, savedCharity) {
                testTransaction.charity = savedCharity._id
                    savedAccount.donations.push(testTransactionThree);
                    savedAccount.save(function(err, data) {
                        if (err) {
                            console.log(err);
                        }
                        let updatedTransaction = data.donations[0]
                        updatedTransaction.amount = 250
                        chai.request(server)
                            .post(`/accounts/${data.slug}/transactions/${data.donations[0]._id}?_method=PUT`)
                            .send(updatedTransaction)
                            .end(function(err, res) {
                                if (err) {
                                    console.log(err);
                                }
                                res.should.have.status(200);
                                res.should.be.html;
                                done();
                            });
                    })
            })
        })
    })

    // test transaction deletion
    it('should delete a transaction on /accounts/:slug/transactions/:id DELETE', function(done) {
        let account = new Account(testAccount)
        account.slug = 'delete-slug-42dc' // VERY IMPORTANT
        const charity = new Charity(testCharity)
        account.save(function(err, savedAccount) {
            charity.save(function(err, savedCharity) {
                testTransaction.charity = savedCharity._id
                    savedAccount.donations.push(testTransactionThree);
                    savedAccount.save(function(err, data) {
                        if (err) {
                            console.log(err);
                        }
                        chai.request(server)
                            .delete(`/accounts/${data.slug}/transactions/${data.donations[0]._id}`)
                            .end(function(err, res) {
                                if (err) {
                                    console.log(err);
                                }
                                res.should.have.status(200);
                                res.should.be.html;
                                done();
                            });
                    })
            })
        })
    })


})
