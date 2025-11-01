import { Field, InputType, Int } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { NotificationType, NotificationGroup, NotificationStatus } from '../../enums/notification.enum';
import { IsOptional } from 'class-validator';
import { Direction } from '../../enums/common.enum';

@InputType()
export class CreateNotificationInput {
  @Field(() => NotificationType)
  notificationType: NotificationType;

  @Field(() => NotificationGroup)
  notificationGroup: NotificationGroup;

  @Field(()=> String)
  notificationTitle: string;

  @Field({ nullable: true })
  notificationDesc?: string;

  @Field(() => String)
  authorId: ObjectId;

  @Field(() => String)
  receiverId: ObjectId;

  @Field(() => String, { nullable: true })
  propertyId?: ObjectId;

  @Field(() => String, { nullable: true })
  articleId?: ObjectId;
}


@InputType('NotificationSearch')
export class NotificationSearch {
  @Field(() => String, { nullable: true }) 
  receiverId?: string;
  @Field(() => String, { nullable: true }) 
  authorId?: string;

  @Field(() => [NotificationStatus], { nullable: true })
  statusList?: NotificationStatus[];

  @Field(() => [NotificationGroup], { nullable: true })
  groupList?: NotificationGroup[];

  @Field(() => [NotificationType], { nullable: true })
  typeList?: NotificationType[];
}

@InputType('NotificationInquiry')
export class NotificationInquiry {
  @Field(() => Int) page: number;
  @Field(() => Int) limit: number;

  @Field(() => String, { nullable: true }) sort?: string;    
  @Field(() => Direction, { nullable: true }) direction?: Direction;

  @Field(() => NotificationSearch, { nullable: true })
  search?: NotificationSearch;
}