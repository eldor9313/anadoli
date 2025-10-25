import { registerEnumType } from '@nestjs/graphql';

export enum PropertyType {
	HOTEL = 'HOTEL',
	HISTORICAL = 'HISTORICAL',
	CULINARY = 'CULINARY',
}
registerEnumType(PropertyType, {
	name: 'PropertyType',
});

export enum PropertyStatus {
	ACTIVE = 'ACTIVE',
	CLOSED = 'CLOSED',
	DELETE = 'DELETE',
}
registerEnumType(PropertyStatus, {
	name: 'PropertyStatus',
});

export enum PropertyLocation {
	ISTANBUL = 'ISTANBUL',
	ANTALYA = 'ANTALYA',
	MUGLA = 'MUGLA',
	IZMIR = 'IZMIR',
	ADANA = 'ADANA',
	MARMARIS = 'MARMARIS',
	ANKARA = 'ANKARA',
	BODRUM = 'BODRUM',
	CAPPADOCIA = 'CAPPADOCIA',
}
registerEnumType(PropertyLocation, {
	name: 'PropertyLocation',
});
