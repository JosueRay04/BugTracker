import { coment } from "src/coment/coment.entity";
import { project } from "src/project/project.entity";
import { user } from "src/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum state {
    open = "OPEN",
    in_progress = "IN PROGRESS",
    resolved = "RESOLVED",
    closed = "CLOSED"
}

export enum priority {
    low = "LOW",
    medium = "MEDIUM",
    high = "HIGH"
}

export enum severity {
    low = "LOW",
    medium = "MEDIUM",
    high = "HIGH"
}

@Entity() 
export class bug {
    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true})
    name: string
    
    @Column()
    summary: string

    @Column()
    description: string
    
    @Column()
    state: state

    @Column()
    priority: priority

    @Column()
    severity: severity

    @Column()
    userName: string

    @Column()
    ProjectName: string
    
    @Column({ nullable: true }) // Cambio aquí
    image: String;

    @Column({nullable: true})
    Answer: string | null;

    @Column({ nullable: true }) // Cambio aquí
    imageAnswer: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date

    @Column({ type: 'datetime', nullable: true })
    finishedAt: Date

    @ManyToOne(() => user)
    @JoinColumn()
    user: user

    @ManyToOne(() => project)
    @JoinColumn()
    project: project

    @OneToMany(() => coment, coment => coment.bug)
    @JoinColumn()
    coment: coment

    @Column('simple-array')
    collaborators: string[]
}