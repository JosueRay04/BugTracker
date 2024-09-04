import { bug } from "src/bug/bug.entity"
import { user } from "src/user/user.entity"
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from "typeorm"

@Entity()
export class coment {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    textComent: string

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date

    @ManyToOne(() => user)
    @JoinColumn()
    user: user

    @ManyToOne(() => bug)
    @JoinColumn()
    bug: bug

}