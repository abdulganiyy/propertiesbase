import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma:PrismaService) {}


  
  async getUserStats(userId: string) {
    const [favorites, unreadMessages, viewings, views] = await Promise.all([
      this.prisma.favorite.count({
        where: { userId, isDeleted: false },
      }),
      this.prisma.chat.count({
        where: { userId },
      }),
      this.prisma.viewing.count({
        where: { userId },
      }),
      this.prisma.uniquePropertyView.count({
      where: { userId}    })
    ]);

    return {
      favoritedProperties: favorites,
      unreadMessages,
      scheduledViewings: viewings,
      propertiesViews: views,

    };
  }

  async getOwnerStats(ownerId: string) {
    const [properties, messages, viewings,views] = await Promise.all([
      this.prisma.property.count({
        where: { ownerId },
      }),
      this.prisma.chat.count({
        where: { property: { ownerId } },
      }),
      this.prisma.viewing.count({
        where: { property: { ownerId } },
      }),
      this.prisma.uniquePropertyView.count({
      where: { property:{ownerId }}    })
    ]);

    return {
      totalProperties: properties,
      allMessages: messages,
      scheduledViewings: viewings,
      propertiesViews:views
    }
  }

  async getAdminStats() {
    const [users, properties, viewings, inquiries,views] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.property.count(),
      this.prisma.viewing.count(),
      this.prisma.chat.count(),
      this.prisma.uniquePropertyView.count()
    ]);

    return {
      totalUsers: users,
      totalProperties: properties,
      totalViewings: viewings,
      totalMessages: inquiries,
    };
  }  

  async getRecentActivities(){

    const [users,properties,unverifiedUsers] = await Promise.all([
      this.prisma.user.findMany(),
      this.prisma.property.findMany({include:{owner:true}}),
      this.prisma.user.findMany({where:{
        OR:[{isOwnerVerified:false},{isUserVerified:false}]
      }}),

    ])

    return {
      user:users[0],
      property:properties[0],
      pendingProperties:properties.filter((property)=>property.status == "PENDING").length,
      pendingUsers:unverifiedUsers.length

    }
  }

  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({data:createUserDto});
  }

  findAll() {
    return this.prisma.user.findMany({
  include: {
    _count: {
      select: { properties: true },
    },
  },
});

}

  findOne(id: string) {
    return this.prisma.user.findUnique({where:{id}})
  }

   findByEmail(email: string) {
    return this.prisma.user.findUnique({where:{email}})
  }

   findUserProperties(userId:string) {
    return this.prisma.property.findMany({
      where:{
        ownerId:userId
      }
    })
  }


  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where:{id},
      data:updateUserDto
    })

  }

  remove(id: string) {
    return this.prisma.user.delete({where:{id}})
  }
}
