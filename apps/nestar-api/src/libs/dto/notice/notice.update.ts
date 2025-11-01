import { Field, ID, InputType } from '@nestjs/graphql';
import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum';
import { ObjectId } from 'mongoose';

@InputType()
export class UpdateNoticeInput {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => NoticeCategory, { nullable: true })
  noticeCategory?: NoticeCategory;

  @Field({ nullable: true })
  noticeTitle?: string;

  @Field({ nullable: true })
  noticeContent?: string;
}

@InputType()
export class ChangeNoticeStatusInput {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => NoticeStatus)
  noticeStatus: NoticeStatus;
}
