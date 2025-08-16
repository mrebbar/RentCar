import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum CarType {
  Sedan = 'Sedan',
  Hatchback = 'Hatchback',
  SUV = 'Suv',
  Coupe = 'Coupe',
  Pickup = 'Pickup',
  SportCar = 'SportCar',
  ElectricCar = 'ElectricCar',
  HybridCar = 'HybridCar',
}

@Entity()
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: CarType, nullable: true })
  type: CarType;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  color: string;

  @Column()
  count: number;

  @Column()
  price: number;

  @Column({ nullable: true })
  categoryId: number;

  @Column({ nullable: true })
  userId: number; // Qaysi user yaratgan

  @ManyToOne(() => Category, (category) => category.cars, { nullable: true })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User; // User bilan bog'lash

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  averageRating: number;

  @Column({ type: 'int', default: 0, nullable: true })
  totalReviews: number;
}
