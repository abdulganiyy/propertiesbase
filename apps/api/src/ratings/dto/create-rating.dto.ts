import { IsInt, IsNotEmpty, IsString, Min, Max } from 'class-validator';

export class CreateRatingDto {
  @IsInt()
  @Min(1)
  @Max(5)
  value: number;

  @IsString()
  @IsNotEmpty()
  propertyId: string;
}
