// test-charities.js
// test our charity controller

// basic testing stuff
import chai from 'chai'
import chaiHttp from 'chai-http'
import server from '../server.js'
const should = chai.should()

// test charity
import Charity from '../models/charity.js'
const testCharity = {
    name: "Purple Cross",
    ein: 4201969
}

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

describe('Charities', function() {

    it('should show us the charity search page', function(done) {
        chai.request(server)
        .get('/charities')
        .end(function(err, res) {
            if (err) {
                console.log(err);
            }
            res.should.have.status(200);
            res.should.be.html;
            done()
        })
    })

    // can't figure out how to make this work with the api keys and such
    it.skip('should show us charity search results', function(done) {
        chai.request(server)
        .post('/charities/search')
        .send('girl scouts')
        .end(function(err, res) {
            if (err) {
                console.log(err);
            }
            res.should.have.status(200);
            res.should.be.html;
            done()
        })
    })

})
