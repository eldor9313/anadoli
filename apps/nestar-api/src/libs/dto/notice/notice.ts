import { Field, Int, ObjectType } from '@nestjs/graphql';
import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum';
import { ObjectId } from 'mongoose';

@ObjectType()
export class Notice {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => NoticeCategory)
  noticeCategory: NoticeCategory;

  @Field(() => NoticeStatus)
  noticeStatus: NoticeStatus;

  @Field(()=> String)
  noticeTitle: string;

  @Field(()=> String)
  noticeContent: string;

  @Field(() => String)
  memberId: ObjectId;

  @Field(()=> Date)
  createdAt: Date;

  @Field(()=> Date)
  updatedAt: Date;
}

@ObjectType()
export class Notices {
  @Field(() => [Notice])
  notices: Notice[];

  @Field(() => Int)
  totalCount: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;
}
