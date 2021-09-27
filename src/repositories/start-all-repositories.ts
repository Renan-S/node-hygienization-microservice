import { Connection } from "typeorm"
import { userBuyProfileRepository } from "./user-buy-profile-repository"

export const startAllRepositories = (connection: Connection): void => {
    userBuyProfileRepository(connection);
}