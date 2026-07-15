import { Serializer } from "../serializers/index.js";

export class ApiResponse {

    static success<T>(
        message: string,
        data?: T
    ) {

        return {

            success: true,

            message,

            data: data === undefined
                ? undefined
                : Serializer.serialize(data)

        };

    }

    static error(
        message: string
    ) {

        return {

            success: false,

            message

        };

    }

}