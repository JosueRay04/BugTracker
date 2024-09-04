import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { user } from "src/user/user.entity";

@Entity()
export class notification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    message: string;

    @Column({nullable: true})
    sender: string;

    @Column({nullable: true})
    recipient: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
