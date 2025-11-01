import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { NoticeStatus } from '../../libs/enums/notice.enum';
import { CreateNoticeInput, NoticesInquiry } from '../../libs/dto/notice/notice.input';
import { ChangeNoticeStatusInput, UpdateNoticeInput } from '../../libs/dto/notice/notice.update';
import { Notice, Notices } from '../../libs/dto/notice/notice';
import { Direction, Message } from '../../libs/enums/common.enum';
import { shapeIntoMongoObjectId } from '../../libs/config';

@Injectable()
export class NoticeService {
	constructor(@InjectModel('Notice') private readonly noticeModel: Model<Notice>) {}

	async createNotice(input: CreateNoticeInput, authMemberId?: string): Promise<Notice> {
		const memberId = input.memberId ?? authMemberId;
		if (!memberId) throw new BadRequestException('memberId is required');

		const doc = await this.noticeModel.create({
			noticeCategory: input.noticeCategory,
			noticeStatus: NoticeStatus.ACTIVE,
			noticeTitle: input.noticeTitle,
			noticeContent: input.noticeContent,
			memberId,
		});
		return doc?.toJSON?.() ?? doc;
	}

	async updateNotice(input: UpdateNoticeInput): Promise<Notice> {
		const { _id, ...rest } = input;
		const doc = await this.noticeModel.findByIdAndUpdate(_id, { $set: { ...rest } }, { new: true });
		if (!doc) throw new NotFoundException('Notice not found');
		return doc?.toJSON?.() ?? doc;
	}

	async changeNoticeStatus(input: ChangeNoticeStatusInput): Promise<Notice> {
		const doc = await this.noticeModel.findByIdAndUpdate(
			input._id,
			{ $set: { noticeStatus: input.noticeStatus } },
			{ new: true },
		);
		if (!doc) throw new NotFoundException('Notice not found');
		return doc?.toJSON?.() ?? doc;
	}

	/**
	 * Soft delete -> sets status to DELETE
	 */
	async deleteNotice(_id: string): Promise<boolean> {
		const doc = await this.noticeModel.findByIdAndUpdate(
			_id,
			{ $set: { noticeStatus: NoticeStatus.DELETE } },
			{ new: true },
		);
		if (!doc) throw new NotFoundException('Notice not found');
		return true;
	}

	async getNoticeById(_id: string, includeDeleted = false): Promise<Notice> {
		const filter: FilterQuery<any> = { _id };
		if (!includeDeleted) filter.noticeStatus = { $ne: NoticeStatus.DELETE };

		const doc = await this.noticeModel.findOne(filter);
		if (!doc) throw new NotFoundException('Notice not found');
		return doc?.toJSON?.() ?? doc;
	}

	public async getNotices(inquiry: NoticesInquiry): Promise<Notices> {
		const { page = 1, limit = 20, sort = 'createdAt', direction = Direction.DESC, search } = inquiry;

		const match: any = {};
		if (search?.noticeStatus) {
			match.noticeStatus = search.noticeStatus;
		} else {
			match.noticeStatus = NoticeStatus.ACTIVE;
		}

		if (search?.noticeCategory) match.noticeCategory = search.noticeCategory;
		if (search?.memberId) match.memberId = shapeIntoMongoObjectId(search.memberId);

		if (search?.text) {
			const rx = new RegExp(search.text, 'i');
			match.$or = [{ noticeTitle: { $regex: rx } }, { noticeContent: { $regex: rx } }];
		}

		// Mongo sort dir: 1 | -1
		const sortDir = direction === Direction.ASC ? 1 : -1;
		const sortStage: Record<string, 1 | -1> = { [sort]: sortDir };

		const pipeline = [
			{ $match: match },
			{ $sort: sortStage },
			{
				$facet: {
					list: [{ $skip: (page - 1) * limit }, { $limit: limit }],
					metaCounter: [{ $count: 'total' }],
				},
			},
		];

		const result = await this.noticeModel.aggregate(pipeline).exec();
		const first = result?.[0] ?? { list: [], metaCounter: [] };
		const notices = first.list ?? [];
		const totalCount = first.metaCounter?.[0]?.total ?? 0;

		return {
			notices,
			totalCount,
			page,
			limit,
		};
	}
}
