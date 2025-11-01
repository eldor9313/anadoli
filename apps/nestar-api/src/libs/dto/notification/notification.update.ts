import { Field, InputType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { NotificationStatus } from '../../enums/notification.enum';

@InputType()
export class UpdateNotificationInput {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => NotificationStatus, { nullable: true })
  notificationStatus?: NotificationStatus;

  @Field(()=> String,{ nullable: true })
  notificationTitle?: string;

  @Field(()=> String,{ nullable: true })
  notificationDesc?: string;
}
