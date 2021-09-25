import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn 
} from 'typeorm'

@Entity({ name: 'customers' })
export class Customer {
  @PrimaryGeneratedColumn()
  readonly id: string

  @Column()
  public name: string

  @Column()
  public email: string

  @Column({ name: 'average_salary' })
  public averageSalary: number

  @Column()
  public status: number

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date
}