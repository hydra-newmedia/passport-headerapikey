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
import * as _ from 'lodash';
import { Request } from 'express';
import { Strategy as PassportStrategy } from 'passport-strategy';
import { BadRequestError } from './errors/BadRequestError';

export class Strategy extends PassportStrategy {

    apiKeyHeader: string;
    name: string;
    verify: (apiKey: string, verified: (err: Error, user?: Object, info?: Object) => void, req?: Request) => void;
    passReqToCallback: boolean;

    constructor(header: string, passReqToCallback: boolean,
                verify: (apiKey: string, verified: (err: Error, user?: Object, info?: Object) => void, req?: Request) => void) {
        super();
        this.apiKeyHeader = header || 'apikey';

        this.name = 'headerapikey';
        this.verify = verify;
        this.passReqToCallback = passReqToCallback || false;
    }

    authenticate(req: Request, options?: Object): void {
        let apiKey = _.get<string>(req.headers, this.apiKeyHeader);

        if (!apiKey) {
            return this.fail(new BadRequestError('Missing API Key'), null);
        }

        let verified = (err: Error, user?: Object, info?: Object) => {
            if (err) {
                return this.error(err);
            }
            if (!user) {
                return this.fail(info, null);
            }
            this.success(user, info);
        };

        this.verify(apiKey, verified, this.passReqToCallback ? req : null);
    }
}
