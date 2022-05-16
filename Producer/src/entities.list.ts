import { Account } from "./entities/Account.entity";
import { Category } from "./entities/category.entity";
import { mcCodes } from "./entities/mcc_codes.entity";
import { mccMapper } from "./entities/mcc_mapper.entity";
import { unCategorizedTransactions } from "./entities/unCategorizedTransactions.entity";





const entitiesList = [
    Account, Category, mcCodes, mccMapper, unCategorizedTransactions
];


export { entitiesList };