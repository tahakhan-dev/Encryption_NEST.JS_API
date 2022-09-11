import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('mcc_codes')
export class mcCodes {

    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ name: 'mcc_code', nullable: true })
    mccCode: number;

    @Column({ name: 'description', nullable: true })
    Description: string;
}



