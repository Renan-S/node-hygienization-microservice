import { Connection, Repository } from "typeorm";
import { UserBuyProfile } from "../entities/UserBuyProfile";

let localRepository: Repository<UserBuyProfile>;

export const userBuyProfileRepository = (connection: Connection): void => {
    localRepository = connection.getRepository(UserBuyProfile);
}

export const saveUserBuyProfile = async (profiles: UserBuyProfile[]): Promise<void> => {
    await localRepository.save(profiles, { chunk: 30 });
}

export const findUserBuyProfile = async (): Promise<UserBuyProfile[]> => {
    const allUserBuyProfile = await localRepository.find();
    return allUserBuyProfile;
}