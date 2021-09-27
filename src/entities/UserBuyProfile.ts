import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class UserBuyProfile {

    @PrimaryColumn({ type: 'varchar' })
    CPF: string;

    @Column("int")
    Private: number;

    @Column("int")
    NotCompleted: number;

    @Column({ nullable: true, type: 'date' })
    LastPurchaseDate: string;

    @Column({ nullable: true, type: 'money' })
    MidTicket: string;

    @Column({ nullable: true, type: 'money' })
    LastPurchaseTicket: string;

    @Column({ nullable: true, type: 'varchar' })
    MostVisitedStore: string;

    @Column({ nullable: true, type: 'varchar' })
    LastPurchaseStore: string;
}
