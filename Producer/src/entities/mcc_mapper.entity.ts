import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('mcc_mapper')
export class mccMapper {

    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ name: 'mcc_code', nullable: true })
    mccCode: number;

    @Column({ name: 'category_id', nullable: true })
    categoryId: number;
}



