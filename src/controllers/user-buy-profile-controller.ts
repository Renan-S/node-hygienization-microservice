import { UserBuyProfile } from "../entities/UserBuyProfile";
import { saveUserBuyProfile } from "../repositories/user-buy-profile-repository";
import * as fs from 'fs';
import * as eventStream from 'event-stream';
import * as path from 'path';
import { cpf } from 'cpf-cnpj-validator';
import { cnpj } from 'cpf-cnpj-validator';

//Used old school for because of performance

export const userBuyProfileController = async (fileName: string): Promise<void> => {
    let crudeDataList: Array<string[]> = [];
    let lineNr: number = 0;

    const readFile = (): void => {
        const filesPath = path.join(__dirname, '..', 'input', fileName);
        streamFile(filesPath);
    }

    const streamFile = (path: string): void => {
        const stream = fs.createReadStream(path)
            .pipe(eventStream.split())
            .pipe(eventStream.mapSync(line => {
                // pause the readstream
                stream.pause();

                if (lineNr > 0) {
                    const validator = parseToArrayAndRemoveSpaces(line)
                    if (validateUserBuyProfile(validator)) crudeDataList.push(validator)
                }
                lineNr++;

                // resume the readstream after doing some processing
                stream.resume();
            })
                .on('error', err => {
                    console.log('Error while reading file.', err);
                })
                .on('end', async () => {
                    crudeDataList = removeDuplicates(crudeDataList)
                    await saveUserBuyProfileList(createUser(crudeDataList))
                })
            );
    }

    const parseToArrayAndRemoveSpaces = (line: any): any => {
        return line.split(/(\s+)/).filter(element => element.trim().length > 0)
    }

    const validateUserBuyProfile = (validator: string[]): boolean => {
        const isCpfValid = cpf.isValid(validator[0])
        const isMostVisitedValid = cnpj.isValid(validator[6]) || validator[6] === "NULL"
        const isLastPurchaseValid = cnpj.isValid(validator[7]) || validator[7] === "NULL"

        if (isCpfValid && isMostVisitedValid && isLastPurchaseValid) {
            return true
        }
        return false
    }

    const removeDuplicates = (array: any[]) => {
        return Array.from(new Set(array.map(
            stringfyElement => JSON.stringify(stringfyElement))),
            parseElement => JSON.parse(parseElement))
    }

    const removeAllSpecialCharacters = (string: string): string => {
        return string.replace(/[-~`!@#$%^&*()+={}\[\];:\'\"<>.,\/\\\?-_]/g, '');
    }

    const cleanUserBuyProfileData = (dirtyData: string[]): string[] => {
        let cleanData = dirtyData
        for (let index = 0; index < cleanData.length; index++) {
            if (cleanData[index] === 'NULL') {
                cleanData[index] = null
                continue;
            }

            if (index === 4 || index === 5) cleanData[index] = cleanData[index].replace(',', '.')

            if (index === 0 || index === 6 || index === 7) cleanData[index] = removeAllSpecialCharacters(cleanData[index])
        }
        return cleanData
    }

    const createUser = (user: Array<string[]>): UserBuyProfile[] => {
        const userBuyProfileList = []
        for (let index = 0; index < user.length; index++) {
            const element = cleanUserBuyProfileData(user[index]);
            const localUser = new UserBuyProfile()
            localUser.CPF = element[0]
            localUser.Private = parseInt(element[1])
            localUser.NotCompleted = parseInt(element[2])
            localUser.LastPurchaseDate = element[3]
            localUser.MidTicket = element[4]
            localUser.LastPurchaseTicket = element[5]
            localUser.MostVisitedStore = element[6]
            localUser.LastPurchaseStore = element[7]
            userBuyProfileList.push(localUser)
        }
        return userBuyProfileList
    }

    const saveUserBuyProfileList = async (userBuyProfile: UserBuyProfile[]): Promise<void> => {
        try {
            console.time('Saving on DB took')
            console.log('Trying to save on data base')
            await saveUserBuyProfile(userBuyProfile);
            console.timeEnd('Saving on DB took')
            console.log('Saved! Run docker exec -it postgreSQL-base-db psql -U admin base-db and then SELECT * FROM "user_buy_profile" LIMIT 100; to see the values')
        } catch (error) {
            console.log(error)
        }
    }

    readFile();
}