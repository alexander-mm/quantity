export const env = {

    databaseUrl: process.env.DATABASE_URL!,

    jwtSecret: process.env.JWT_SECRET!,

    jwtExpiresIn: process.env.JWT_EXPIRES_IN as string

}