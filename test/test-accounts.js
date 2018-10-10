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
    after( () => {
        Account.deleteMany({ name: { first: "Katherine", last: "Reynolds" }})
        .exec((err, accounts) => {
            console.log(accounts)
            accounts.remove()
        })

        Account.deleteMany({ name: { first: "Kat", last: "Westlake" }})
        .exec((err, accounts) => {
            console.log(accounts)
            accounts.remove()
        })
    })

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


})
