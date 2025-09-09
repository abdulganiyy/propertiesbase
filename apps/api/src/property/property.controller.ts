import { Controller, Get, Post, Body, Patch, Param, Delete ,UseGuards,Request, Query} from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Request() req, @Body() createPropertyDto: CreatePropertyDto) {
    return this.propertyService.create({...createPropertyDto,ownerId:req.user.id});
  }

  @UseGuards(AuthGuard)
  @Post(':id/favorite')
  async toggleFavorite(@Param('id') propertyId: string, @Request() req: any) {
    const userId = req.user.id; 
    return this.propertyService.toggleFavorite(userId, propertyId);
  }

  @Get()
  findAll(@Query() query : Record<string,string>) {
    return this.propertyService.findAll(query)
  }

  
  @UseGuards(AuthGuard)
  @Get("admin")
  findAllProperties(@Query() query : Record<string,string>) {
    return this.propertyService.findAllProperties(query)
  }

  @UseGuards(AuthGuard)
  @Get("/favorites")
  async getUserFavorites(@Request() req: any) {
    const userId = req.user.id;
    return this.propertyService.getUserFavorites(userId);
  }

  @UseGuards(AuthGuard)
  @Get("/owner")
  async getOwnerProperties(@Request() req: any,@Query() query : Record<string,string>) {
    const userId = req.user.id;
    return this.propertyService.findOwnerProperties(userId,query);
  }


  @UseGuards(AuthGuard)
  @Get("viewings")
  getMyViewings(@Request() req: any) {
    const userId = req.user.id;
    return this.propertyService.getUserViewings(userId);
  }


  @UseGuards(AuthGuard)
  @Get("viewings/owner")
  getOwnerViewings(@Request() req: any) {
    const userId = req.user.id;
    return this.propertyService.getOwnerViewings(userId);
  }

  @Get("views")
  async getAllPropertyViews() {
    return this.propertyService.getAllPropertiesViews()
  }


  @UseGuards(AuthGuard)
  @Get("owner/views")
  async getOWnerViews(@Request() req: any) {
    const userId = req.user.id;
    return this.propertyService.getOwnerViewedProperties(userId)
  }


  @UseGuards(AuthGuard)
  @Get("user/views")
  async getUserViews(@Request() req: any) {
    const userId = req.user.id;
    return this.propertyService.getUserViewedProperties(userId)
  }


  @Post(":id/view")
  async trackPropertyView(@Param("id") propertyId: string, @Request() req) {
    /* Implement function to extract user directly from token without using auth guard */
    const userId = req.user?.id
    const ipAddress = req.ip
    return this.propertyService.trackView(propertyId, userId, ipAddress)
  }

  @Get(":id/views")
  async getViews(@Param("id") propertyId: string) {
    return this.propertyService.getPropertyViews(propertyId)
  }
 

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertyService.findOne(id);
  }


  @UseGuards(AuthGuard)
  @Post(':id/viewing')
  async scheduleViewing(
    @Param('id') propertyId: string,
    @Body('scheduledAt') scheduledAt: string,
    @Body('notes') notes: string,
    @Request() req: any,
  ) {
    const userId = req.user.id; // assuming auth middleware adds user
    return this.propertyService.scheduleViewing(userId, propertyId, new Date(scheduledAt), notes)
  }



  @Get(':id/viewings')
  async getPropertyViewings(@Param('id') propertyId: string) {
    return this.propertyService.getPropertyViewings(propertyId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePropertyDto: UpdatePropertyDto) {
    return this.propertyService.update(id, updatePropertyDto);
  }

  @Patch(':id/:viewingId/status')
  async updateStatus(
    @Param('viewingId') viewingId: string,
    @Body('status') status: 'PENDING' | 'CONFIRMED' | 'CANCELLED',
  ) {
    return this.propertyService.updateStatus(viewingId, status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertyService.remove(id);
  }
}
