import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';
import { Length } from 'class-validator';

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Review, (review) => review.reviewer, { cascade: true })
  assignedReviews: Review[];

  @OneToMany(() => Review, (review) => review.reviewee, { cascade: true })
  feedbacks: Review[];
}

@ObjectType()
@Entity('reviews')
export class Review extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ nullable: true })
  @Length(10)
  @Column('text', { nullable: true })
  text?: string;

  @Field()
  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  reviewer: User;

  @Field()
  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  reviewee: User;

  @Field()
  @Column({ default: false })
  completed: boolean;
}
