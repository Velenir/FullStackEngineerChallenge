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
import { USER_ROLE } from '../../consts';

// TABLE users
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

  @Column('int', { default: 0 })
  tokenVersion: number;

  @Field(() => Int)
  @Column('int', { default: USER_ROLE.EMPLOYEE })
  role: USER_ROLE;
}

// TABLE reviews
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
  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' }) // when user delete, delete review
  reviewer: User;

  @Field()
  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' }) // when user delete, delete review
  reviewee: User;

  @Field()
  @Column({ default: false })
  completed: boolean;
}
