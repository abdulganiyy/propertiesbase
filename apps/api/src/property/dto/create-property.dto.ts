import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  IsEnum,
  ValidateNested,
  IsUrl,
} from 'class-validator'
import { Type } from 'class-transformer'
import { PropertyStatus } from '@prisma/client'

class CreateImageDto {
  @IsString()
  @IsUrl()
  imageUrl: string

  @IsOptional()
  @IsBoolean()
  isCover?: boolean
}

export class CreatePropertyDto {
  @IsString()
  ownerId: string

  @IsString()
  title: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsNumber()
  price?: number

  @IsOptional()
  @IsString()
  currency?: string

  @IsOptional()
  @IsBoolean()
  trending?: boolean

  @IsOptional()
  @IsBoolean()
  featured?: boolean

  @IsEnum(PropertyStatus)
  status: PropertyStatus

  @IsOptional()
  @IsString()
  propertyType?: string

  @IsString()
  listingType: string

  @IsOptional()
  @IsNumber()
  bedrooms?: number

  @IsOptional()
  @IsNumber()
  bathrooms?: number

  @IsOptional()
  @IsNumber()
  areaSqft?: number

  @IsOptional()
  @IsString()
  city?: string

  @IsOptional()
  @IsString()
  state?: string

  @IsOptional()
  @IsString()
  country?: string

  @IsOptional()
  @IsString()
  address?: string

  @IsOptional()
  @IsNumber()
  salePrice?: number

  @IsOptional()
  @IsNumber()
  monthlyRent?: number

  @IsOptional()
  @IsNumber()
  yearlyRent?: number

  @IsOptional()
  @IsString()
  rentPeriod?: string

  @IsOptional()
  @IsNumber()
  leaseAmount?: number

  @IsOptional()
  @IsString()
  leaseDuration?: string

  @IsOptional()
  @IsNumber()
  securityDeposit?: number

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[]

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateImageDto)
  images?: CreateImageDto[]
}
