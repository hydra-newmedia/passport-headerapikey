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
import { BadRequestError } from '../../../lib/errors/BadRequestError';

let expect = require('expect.js');

describe('The BadRequestError\'s', () => {
    describe('constructor', () => {
        it('should set members properly', () => {
            let error: BadRequestError = new BadRequestError('test message');
            expect(error.message).to.be.ok();
            expect(error.message).to.be('test message');
            expect(error.name).to.be.ok();
            expect(error.name).to.be('BadRequestError');
        });
    });
});
