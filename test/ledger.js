let server = require('../ledger');
let chai = require('chai');
let chaiHttp = require('chai-http');
const { response } = require('express');
//Assertion
chai.should();
chai.use(chaiHttp);
describe('Ledger API', () => {
	describe('Test GET /ledger', () => {
		it('It should return a json array', (done) => {
			chai
				.request(server)
				.get('/ledger')
				.query({
					start_date: '2020-03-28',
					end_date: '2020-05-26',
					frequency: 'fortnightly',
					weekly_rent: 550,
					timezone: 'Australia/NSW'
				})
				.end((err, response) => {
					response.should.have.status(200);
					response.body.should.be.a('array');
					response.body.length.should.not.be.eq(0);
					done();
				});
		});

		it('It should return not json array', (done) => {
			chai
				.request(server)
				.get('/ledger')
				.query({
					start_date: '2020-03-28',
					end_date: '2020-05-26',
					frequency: 'fortnightly',
					timezone: 'Australia/NSW'
				})
				.end((err, response) => {
					response.should.have.status(400);
					done();
				});
		});
        
		

        
	});
});
