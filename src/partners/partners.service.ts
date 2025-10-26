import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TenantService } from 'src/tenant/tenant.service';
import { CreatePartnerDto } from './dto/create-partner.dto';

@Injectable()
export class PartnersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly tenantService: TenantService,
  ) {}

  async create(createPartnerDto: CreatePartnerDto & { userId: number }) {
    //modo transação
    const partner = await this.prismaService.$transaction(async (prisma) => {
      const partner = await prisma.partner.create({
        data: {
          name: createPartnerDto.name,
        },
      });

      await prisma.partnerUser.create({
        data: {
          partnerId: partner.id,
          userId: createPartnerDto.userId,
        },
      });
      return partner;
    });

    return partner;
  }

  findAll() {
    return this.prismaService.partner.findMany();
  }

  async relate(userId: number) {
    const partner = await this.prismaService.partner.findUnique({
      where: { id: this.tenantService.getTenant().id },
    });
    if (!partner) {
      throw new Error('Partner not found');
    }
    return this.prismaService.partnerUser.create({
      data: {
        partnerId: partner.id,
        userId,
      },
    });
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} partner`;
  // }

  // update(id: number, updatePartnerDto: UpdatePartnerDto) {
  //   return `This action updates a #${id} partner`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} partner`;
  // }
}
