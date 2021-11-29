export interface BaseMapper {
    // map incoming request from test bank
    testBankMapper(record: any): object;
}
