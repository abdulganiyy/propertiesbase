import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class RatingsService {
  constructor(private prisma: PrismaService) {}

  async addReview(userId: string, dto: CreateReviewDto) {
    return this.prisma.review.create({
      data: {
        content: dto.content,
        propertyId: dto.propertyId,
        userId,
      },
    });
  }

  async getReviews(propertyId: string) {
    return this.prisma.review.findMany({
      where: { propertyId },
      include: { user: { select: { id: true, firstname: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addRating(userId: string, dto: CreateRatingDto) {
    try {
      return await this.prisma.rating.upsert({
        where: {
          propertyId_userId: {
            propertyId: dto.propertyId,
            userId,
          },
        },
        update: { value: dto.value },
        create: {
          value: dto.value,
          propertyId: dto.propertyId,
          userId,
        },
      });
    } catch (e) {
      throw new BadRequestException('Failed to add rating');
    }
  }

  async getAverageRating(propertyId: string) {
    const ratings = await this.prisma.rating.findMany({
      where: { propertyId },
      select: { value: true },
    });

    if (!ratings.length) return { average: 0, count: 0 };
    const total = ratings.reduce((acc, r) => acc + r.value, 0);
    return { average: total / ratings.length, count: ratings.length };
  }
}
