import { Injectable,NotFoundException,BadRequestException } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PropertyService {
      constructor(private prisma:PrismaService) {}
  
 async create(dto: CreatePropertyDto) {
    const { images, ...propertyData } = dto

    const price = propertyData.salePrice || propertyData.leaseAmount || propertyData.yearlyRent || propertyData.monthlyRent || 0;

    const property = await this.prisma.property.create({
      data: {
        ...propertyData,
        bathrooms:Number(propertyData.bathrooms),
        bedrooms:Number(propertyData.bedrooms),
        price,
        images: images?.length
          ? {
              create: images.map((img) => ({
                imageUrl: img.imageUrl,
                isCover: img.isCover ?? false,
              })),
            }
          : undefined,
      },
      include: {
        images: true, // include images in response
      },
    })

    return property
  }

  async findAll(query:Record<string,any>) {


    const {page = 1, limit = 10, sortBy = "created_at",order="asc",...filters } = query

    const skip : number = (+page - 1) * +limit


    const where:any = {status:"AVAILABLE"}

    if (filters.search) {
      where.address = { contains: filters.search, mode: 'insensitive' }
    }

      if (filters.bedrooms) {
      where.bedrooms = +filters.bedrooms
    }

      if (filters.amenities) {
      where.amenities =  { hasSome: filters.amenities.split(",") }
    }

    if (filters.minPrice || filters.maxPrice) {
      where.price = {};
      if (filters.minPrice) where.price.gte = Number(filters.minPrice);
      if (filters.maxPrice) where.price.lte = Number(filters.maxPrice);
    }
    if (filters.listingType) {
      where.listingType = filters.listingType;
    }

     if (filters.propertyType) {
      where.propertyType = filters.propertyType;
    }

    

      const [data, total] = await Promise.all([
      this.prisma.property.findMany({
        include:{owner:true,images:true,views:true},
        where,
        skip,
        take: Number(limit),
        // orderBy: {
        //   [sortBy]: order,
        // },
      }),
      this.prisma.property.count({ where }),
    ]);

    return {
      page: Number(page),
      // limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
      properties:data,
    };


  }

  async findOwnerProperties(userId:string,query:Record<string,any>) {

    const {page = 1, limit = 10, sortBy = "created_at",order="desc",...filters } = query

    const skip : number = (page - 1) * limit;


    const where:any = {
        ownerId:userId
   
      
    }

    if (filters.search) {
      where.address = { contains: filters.search, mode: 'insensitive' };
    }

      if (filters.bedrooms) {
      where.bedrooms = +filters.bedrooms
    }

      if (filters.amenities) {
      where.amenities =  { hasSome: filters.amenities.split(",") }
    }

    if (filters.minPrice || filters.maxPrice) {
      where.price = {};
      if (filters.minPrice) where.price.gte = Number(filters.minPrice);
      if (filters.maxPrice) where.price.lte = Number(filters.maxPrice);
    }
    if (filters.listingType) {
      where.listingType = filters.listingType;
    }

     if (filters.propertyType) {
      where.propertyType = filters.propertyType;
    }

    

      const [data, total] = await Promise.all([
      this.prisma.property.findMany({
        include:{owner:true,images:true,views:true},
        where,
        skip,
        take: Number(limit),
        orderBy: {
          [sortBy]: order,
        },
      }),
      this.prisma.property.count({ where }),
    ]);

    return {
      page: Number(page),
      // limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
      properties:data,
    };


  }

  async findAllProperties(query:Record<string,any>) {


    const {page = 1, limit = 10, sortBy = "created_at",order="asc",...filters } = query

    const skip : number = (+page - 1) * +limit


    const where:any = {}

    if (filters.search) {
      where.address = { contains: filters.search, mode: 'insensitive' }
    }

      if (filters.bedrooms) {
      where.bedrooms = +filters.bedrooms
    }

      if (filters.amenities) {
      where.amenities =  { hasSome: filters.amenities.split(",") }
    }

    if (filters.minPrice || filters.maxPrice) {
      where.price = {};
      if (filters.minPrice) where.price.gte = Number(filters.minPrice);
      if (filters.maxPrice) where.price.lte = Number(filters.maxPrice);
    }
    if (filters.listingType) {
      where.listingType = filters.listingType;
    }

     if (filters.propertyType) {
      where.propertyType = filters.propertyType;
    }

    

      const [data, total] = await Promise.all([
      this.prisma.property.findMany({
        include:{owner:true,images:true,views:true},
        where,
        skip,
        take: Number(limit),
        // orderBy: {
        //   [sortBy]: order,
        // },
      }),
      this.prisma.property.count({ where }),
    ]);

    return {
      page: Number(page),
      // limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
      properties:data,
    };


  }


  findOne(id: string) {
    return this.prisma.property.findFirst({
      where:{id},
      include:{owner:true,images:true,ratings:true,reviews:{include:{
        user:true
      }}}})
    
  }

    async toggleFavorite(userId: string, propertyId: string) {
    const existing = await this.prisma.favorite.findUnique({
      where: {
        userId_propertyId: { userId, propertyId },
      },
    });

    if (!existing) {
      // Create new favorite
      return this.prisma.favorite.create({
        data: {
          userId,
          propertyId,
        },
      });
    }

    // If exists, toggle isDeleted
    return this.prisma.favorite.update({
      where: {
        userId_propertyId: { userId, propertyId },
      },
      data: {
        isDeleted: !existing.isDeleted,
        deleted_at: existing.isDeleted ? null : new Date(),
      },
    });
  }

    async getUserFavorites(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId, isDeleted: false },
      include: {
      property: {
        include: {
          images: true, // 👈 include property images
        },
      },
    },
    });
  }

    async scheduleViewing(userId: string, propertyId: string, scheduledAt: Date, notes?: string) {
    // Check if property exists
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
    });
    if (!property) throw new NotFoundException('Property not found');

    // Optional: prevent booking past dates
    if (scheduledAt < new Date()) {
      throw new BadRequestException('Cannot schedule in the past');
    }

    return this.prisma.viewing.create({
      data: {
        userId,
        propertyId,
        scheduledAt,
        notes,
      },
    });
  }


   getUserViewings(userId: string) {
    return this.prisma.viewing.findMany({
      where: { userId },
      include: { property: {
        select:{
          title:true,
          address:true,
          owner:true
        }
      },user:true},
      orderBy: { scheduledAt: 'desc' },
    })
  }

     getOwnerViewings(userId: string) {
    return this.prisma.viewing.findMany({
      where: { property:{
        ownerId:userId
      } },
      include: { property: {
        select:{
          title:true,
          address:true,
          owner:true
        }
      },user:true},
      orderBy: { scheduledAt: 'desc' },
    })
  }

  async getPropertyViewings(propertyId: string) {
    return this.prisma.viewing.findMany({
      where: { propertyId },
      include: { user: true , property:true},
      orderBy: { scheduledAt: 'asc' },
    });
  }

   async trackView(propertyId: string, userId?: string, ipAddress?: string) {
    if (!userId && !ipAddress) {
      throw new Error("Either userId or ipAddress must be provided")
    }

    try {
      return await this.prisma.uniquePropertyView.create({
        data: {
          propertyId,
          userId: userId ?? null,
          ipAddress: userId ? null : ipAddress,
        },
      })
    } catch (err) {
      // If unique constraint error, it means this view already exists → ignore
      if (err.code === "P2002") {
        return null
      }
      throw err
    }
  }

    async getAllPropertiesViews() {
    return this.prisma.uniquePropertyView.count()
  }

  async getPropertyViews(propertyId: string) {
    return this.prisma.uniquePropertyView.count({
      where: { propertyId },
    })
  }

  async getUserViewedProperties(userId: string) {
    return this.prisma.uniquePropertyView.findMany({
      where: { userId },
      include: { property: true },
    })
  }

   async getOwnerViewedProperties(userId: string) {
    return this.prisma.uniquePropertyView.findMany({
      where: { property:{
        ownerId:userId
      } },
      include: { property: true },
    })
  }

  async updateStatus(viewingId: string, status: 'PENDING' | 'CONFIRMED' | 'CANCELLED') {
    const viewing = await this.prisma.viewing.findUnique({ where: { id: viewingId } });
    if (!viewing) throw new NotFoundException('Viewing not found');

    return this.prisma.viewing.update({
      where: { id: viewingId },
      data: { status },
    });
  }



  async update(id: string, updatePropertyDto: UpdatePropertyDto) {
       const { images, ...propertyData } = updatePropertyDto

    const price = propertyData.salePrice || propertyData.leaseAmount || propertyData.yearlyRent || propertyData.monthlyRent || 0;

    const property = await this.prisma.property.update({
     where:{id},
        data: {
        ...propertyData,
        bathrooms:Number(propertyData.bathrooms),
        bedrooms:Number(propertyData.bedrooms),
        price,
        images: images?.length
          ? {
              create: images.map((img) => ({
                imageUrl: img.imageUrl,
                isCover: img.isCover ?? false,
              })),
            }
          : undefined,
      },
      include: {
        images: true, // include images in response
      },
    })

    return property
  }

  async remove(id: string) {

     // Check if property exists
    const property = await this.prisma.property.findUnique({
      where: { id },
      include:{
        chats:true
      }
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    // If your schema does not have ON DELETE CASCADE, delete manually:
    await this.prisma.$transaction([
      this.prisma.propertyImage.deleteMany({
        where: { propertyId:id },
      }),
      this.prisma.favorite.deleteMany({
        where: { propertyId:id },
      }),
      this.prisma.viewing.deleteMany({
        where: { propertyId:id },
      }),
         this.prisma.uniquePropertyView.deleteMany({
        where: { propertyId:id },
      }),
      
        this.prisma.message.deleteMany({
        where: {chat:{ propertyId:id} },
      }),
        this.prisma.chat.deleteMany({
        where: { propertyId:id },
      }),
      this.prisma.property.delete({
        where: { id },
      }),
    ]);

    return { message: 'Property and related data deleted successfully' };
  }
}
