import { bug } from "src/bug/bug.entity";
import { user } from "src/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum category {
    open = 'OPEN',
    in_progress = 'IN PROGRESS',
    closed = 'CLOSED'
}

@Entity()
export class project {
    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true})
    name: string

    @Column()
    userName: string
    
    @ManyToOne(() => user, (user) => user.projects)
    @JoinColumn({ name: 'userName', referencedColumnName: 'userName' })
    fk_user: user;

    @Column()
    description: string

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date

    @Column()
    expectedCompletionAt: string

    @Column()
    category: string

    @OneToMany(() => bug, bug => bug.project)
    @JoinColumn()
    bug: bug

    //@ManyToMany(() => user, user => user.projects_collaborations)
    //@JoinTable()
    @Column('simple-json', { nullable: true})
    collaborators: { name: string; collaborator: string; role: string }[];
}