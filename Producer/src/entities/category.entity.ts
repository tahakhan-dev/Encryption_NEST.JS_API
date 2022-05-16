import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('category')
export class Category {

    @PrimaryGeneratedColumn()
    Id: number;

    @Column({ name: 'name', nullable: true })
    name: string;

    @Column({ name: 'category_id', nullable: true })
    categoryId: number;
}



