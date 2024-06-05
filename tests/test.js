const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index.js');
const should = chai.should();
const expect = chai.expect;
const supertest = require('supertest');
const api = supertest(server);

chai.use(chaiHttp);

let token; // to store the JWT token

describe('API Tests', () => {
  // Test registration
  it('should register a new user', (done) => {
    api.post('/register')
      .send({ username: 'testuser', name: 'testname', password: 'testpassword' })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('User registered successfully');
        done();
      });
  });

  // Test login
  it('should login a user', (done) => {
    api.post('/login')
      .send({ username: 'testuser', password: 'testpassword' })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('User logged in successfully!');
        res.body.should.have.property('token');
        token = res.body.token; // store the token for future tests
        done();
      });
  });

  // Test check nearby restaurants
  it('should access a check nearby restaurants', (done) => {
    api.get('/restaurants')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('results');
        res.body.should.have.property('status').eql('OK');
        done();
      });
  });

  // Test movements record
  it('should access movements record', (done) => {
    api.get('/record')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('list');
        done();
      });
  });

  // Test logout
  it('should logout a user', (done) => {
    api.post('/api/logout')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('status').eql('User logged out successfully!');
        done();
      });
  });

  // Test accessing a protected route after logout
  it('should not access a protected route after logout', (done) => {
    api.get('/restaurants')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have.property('message').eql('Please authenticate');
        done();
      });
  });
});