import { prisma } from "../../database/index.js";

export abstract class BaseRepository {

    protected readonly prisma = prisma;

}