import { Controller, Post, Body, Get, Param, Req, UseGuards } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { CreateRatingDto } from './dto/create-rating.dto';
import { AuthGuard } from '../auth/auth.guard'; // Replace with your auth guard

@Controller('property/:propertyId')
export class RatingsController {
  constructor(private ratingsService: RatingsService) {}

  @UseGuards(AuthGuard)
  @Post('reviews')
  addReview(
    @Param('propertyId') propertyId: string,
    @Body() dto: CreateReviewDto,
    @Req() req: any,
  ) {
    return this.ratingsService.addReview(req.user.id, { ...dto, propertyId });
  }

  @Get('reviews')
  getReviews(@Param('propertyId') propertyId: string) {
    return this.ratingsService.getReviews(propertyId);
  }

  @UseGuards(AuthGuard)
  @Post('ratings')
  addRating(
    @Param('propertyId') propertyId: string,
    @Body() dto: CreateRatingDto,
    @Req() req: any,
  ) {
    return this.ratingsService.addRating(req.user.id, { ...dto, propertyId });
  }

  @Get('ratings/average')
  getAverageRating(@Param('propertyId') propertyId: string) {
    return this.ratingsService.getAverageRating(propertyId);
  }
}
