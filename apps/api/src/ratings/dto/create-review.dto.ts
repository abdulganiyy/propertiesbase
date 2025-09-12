import { IsString, IsNotEmpty } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  propertyId: string;
}
