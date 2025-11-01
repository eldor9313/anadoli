import { Field, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { NotificationType, NotificationStatus, NotificationGroup } from '../../enums/notification.enum';
import { TotalCounter } from '../member/member';

@ObjectType()
export class Notification {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => NotificationType)
  notificationType: NotificationType;

  @Field(() => NotificationStatus)
  notificationStatus: NotificationStatus;

  @Field(() => NotificationGroup)
  notificationGroup: NotificationGroup;

  @Field()
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

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}


@ObjectType()
export class Notifications {
    @Field(()=> [Notification])
    list: Notification[]

    @Field(()=> [TotalCounter], {nullable:true})
    metaCounter:TotalCounter[];
}