import { HttpException } from "@nestjs/common";

export class Exceptions extends HttpException {

    constructor(
        message: string,
        statusCode: number,

    ) {
        super(message, statusCode);

    }

     ExceptionHandler(errorCode: string): Exceptions {
        switch (errorCode) {
            case 'P2002':
                return new Exceptions('Record already exists', 409);
            case 'P2005':
                return new Exceptions('Invalid input', 400);
            default:
                return new Exceptions('Unknown error', 500);
        }
    }


    RecordExists() {
        return new Exceptions('Record already exists', 409);
    }
    ErrorCreatingRecord() {
        return new Exceptions('Error creating record', 500);
    }


}
