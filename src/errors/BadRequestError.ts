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

export class BadRequestError implements Error {
    name: string;
    message: string;

    constructor(message) {
        this.name = 'BadRequestError';
        this.message = message;
    }
}
