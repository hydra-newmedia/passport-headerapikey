/**
 *  Creator: Christian Hotz
 *  Company: hydra newmedia GmbH
 *  Date: 27.06.16
 *
 *  Copyright hydra newmedia GmbH
 */

/**
 *  Imports
 */
import { HeaderAPIKeyStrategy } from '../../lib';
import { Request } from 'express';
import * as express from 'express';
import * as sinon from 'sinon';
import { Strategy } from 'passport-strategy';
import { BadRequestError } from '../../lib/errors/BadRequestError';

let expect = require('expect.js');

describe('The HeaderAPIKeyStrategy\'s', () => {
    describe('constructor', () => {
        let testVerify: (apiKey: string, verified: (err: Error, user?: Object, info?: Object) => void, req?: Request) => void =
            (apiKey: string, verified: (err: Error, user?: Object, info?: Object) => void, req?: Request) => {
                verified(null, { username: 'test' });
            };
        it('should set members properly', () => {
            let strategy: HeaderAPIKeyStrategy = new HeaderAPIKeyStrategy({ header: 'testheader', prefix: 'asdf' }, true, testVerify);
            expect(strategy.apiKeyHeader).to.be.ok();
            expect(strategy.apiKeyHeader).to.eql({ header: 'testheader', prefix: 'asdf' });
            expect(strategy.name).to.be.ok();
            expect(strategy.name).to.be('headerapikey');
            expect(strategy.verify).to.be.ok();
            expect(strategy.verify).to.be.a('function');
            expect(strategy.verify).to.equal(testVerify);
            expect(strategy.passReqToCallback).to.be(true);
        });
        it('should default header member to \'X-Api-Key\' without prefix', () => {
            let strategy: HeaderAPIKeyStrategy = new HeaderAPIKeyStrategy(null, true, testVerify);
            expect(strategy.apiKeyHeader).to.be.ok();
            expect(strategy.apiKeyHeader).to.eql({ header: 'x-api-key', prefix: '' });
        });
        it('should default header prefix to empty, if omitted', () => {
            let strategy: HeaderAPIKeyStrategy = new HeaderAPIKeyStrategy({ header: 'apikey', prefix: undefined }, true, testVerify);
            expect(strategy.apiKeyHeader).to.be.ok();
            expect(strategy.apiKeyHeader).to.eql({ header: 'apikey', prefix: '' });
        });
        it('should default passReqToCallback member to false', () => {
            let strategy: HeaderAPIKeyStrategy = new HeaderAPIKeyStrategy({ header: 'apikey', prefix: ''}, null, testVerify);
            expect(strategy.passReqToCallback).to.be(false);
        });
    });
    describe('authenticate method', () => {
        let err: Error = new Error('something went wrong');
        let strategy: HeaderAPIKeyStrategy;
        let req: Request;
        let verify: sinon.SinonStub,
            fail: sinon.SinonSpy,
            success: sinon.SinonSpy,
            error: sinon.SinonSpy;
        before('setup mocks and spies', () => {
            verify = sinon.stub();
            verify.onFirstCall().yields(err);
            verify.onSecondCall().yields(null, null, { message: 'faily' });
            verify.onThirdCall().yields(null, { username: 'testuser' }, { message: 'success' });
            strategy = new HeaderAPIKeyStrategy({ header: 'Authorization', prefix: 'Api-Key ' }, true, verify);
            fail = strategy['fail'] = sinon.spy();
            success = strategy['success'] = sinon.spy();
            error = strategy['error'] = sinon.spy();
        });
        beforeEach('reset mocks and spies', () => {
            req = express().request;
            req.headers = { authorization: 'Api-Key topSecretApiKey' };
            fail.reset();
            success.reset();
            error.reset();
        });

        it('should error if verify errors', () => {
            strategy.authenticate(req);
            expect(fail.called).not.to.be.ok();
            expect(success.called).not.to.be.ok();
            expect(error.calledOnce).to.be.ok();
            expect(error.getCall(0).args[0]).to.equal(err);
        });
        it('should fail if verify yields no user', () => {
            strategy.authenticate(req);
            expect(fail.calledOnce).to.be.ok();
            expect(fail.getCall(0).args[0]).to.eql({ message: 'faily' });
            expect(fail.getCall(0).args[1]).to.eql(null);
            expect(success.called).not.to.be.ok();
            expect(error.called).not.to.be.ok();
        });
        it('should succeed if verify succeeds', () => {
            strategy.authenticate(req);
            expect(fail.called).not.to.be.ok();
            expect(success.calledOnce).to.be.ok();
            expect(success.getCall(0).args[0]).to.eql({ username: 'testuser' });
            expect(success.getCall(0).args[1]).to.eql({ message: 'success' });
            expect(error.called).not.to.be.ok();
        });
        it('should get the correct api key from the headers', () => {
            strategy.authenticate(req);
            expect(verify.lastCall.args[0]).to.eql('topSecretApiKey');
        });
        it('should fail if no apikey set', () => {
            delete req.headers['authorization'];
            strategy.authenticate(req);
            expect(fail.calledOnce).to.be.ok();
            expect(fail.getCall(0).args[0]).to.eql(new BadRequestError('Missing API Key'));
            expect(fail.getCall(0).args[1]).to.eql(null);
            expect(success.called).not.to.be.ok();
            expect(error.called).not.to.be.ok();
        });
        it('should fail if empty apikey set', () => {
            req.headers['authorization'] = '';
            strategy.authenticate(req);
            expect(fail.calledOnce).to.be.ok();
            expect(fail.getCall(0).args[0]).to.eql(new BadRequestError('Missing API Key'));
            expect(fail.getCall(0).args[1]).to.eql(null);
            expect(success.called).not.to.be.ok();
            expect(error.called).not.to.be.ok();
        });
        it('should fail if apikey is prefixed in a false manner', () => {
            req.headers['authorization'] = 'WrongPrefix mySuperduperApiKey';
            strategy.authenticate(req);
            expect(fail.calledOnce).to.be.ok();
            expect(fail.getCall(0).args[0]).to.eql(
                new BadRequestError('Invalid API Key prefix, authorization header should start with "Api-Key "')
            );
            expect(fail.getCall(0).args[1]).to.eql(null);
            expect(success.called).not.to.be.ok();
            expect(error.called).not.to.be.ok();
        });
    });
});
