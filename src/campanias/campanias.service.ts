import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign } from './campania.entity';
import { Message } from './message.entity';

@Injectable()
export class campaniasService {
  constructor(
    @InjectRepository(Campaign)
    private campaignRepo: Repository<Campaign>,

    @InjectRepository(Message)
    private messageRepo: Repository<Message>,
  ) {}

  findAll() {
    return this.campaignRepo.find();
  }

  create(data: any) {
    return this.campaignRepo.save(data);
  }

  // Actualizar camapaña - calcular totales

  async calcularTotales(campaignId: number) {
    const campaign = await this.campaignRepo.findOne({
      where: { id: campaignId },
    });

    if (!campaign) {
      throw new NotFoundException('Campaña no encontrada');
    }

    const totalRecords = await this.messageRepo.count({
      where: { id: campaignId },
    });

    const totalSent = await this.messageRepo.count({
      where: { id: campaignId, shippingStatus: 2 },
    });

    const totalError = await this.messageRepo.count({
      where: { id: campaignId, shippingStatus: 3 },
    });

    campaign.total_records = totalRecords;
    campaign.total_sent = totalSent;
    campaign.total_error = totalError;

    await this.campaignRepo.save(campaign);

    return {
      message: 'Totales actualizados correctamente',
      campaignId,
      total_records: totalRecords,
      total_sent: totalSent,
      total_error: totalError,
    };
  }
 
  // Actualizar estado de campaña

  async actualizarEstado(campaignId: number) {
    const campaign = await this.campaignRepo.findOne({
      where: { id: campaignId },
    });

    if (!campaign) {
      throw new NotFoundException('Campaña no encontrada');
    }

    const pendientes = await this.messageRepo.count({
      where: { id: campaignId, shippingStatus: 1 },
    });

    if (pendientes > 0) {
      campaign.process_status = 1;
      await this.campaignRepo.save(campaign);

      return {
        campaignId,
        estado: 'PENDIENTE',
      };
    }

    const result = await this.messageRepo
      .createQueryBuilder('m')
      .select('MAX(m.shipping_hour)', 'finalHour')
      .where('m.campaign_id = :id', { id: campaignId })
      .getRawOne();

    campaign.process_status = 2;
    campaign.final_hour = result.finalHour;

    await this.campaignRepo.save(campaign);

    return {
      campaignId,
      estado: 'FINALIZADA',
      final_hour: result.finalHour,
    };
  }

 
// Actualizar estado de campaña 
async actualizarEstadoCampania(campaignId: number) {
  const campaign = await this.campaignRepo.findOne({
    where: { id: campaignId },
  });

  if (!campaign) {
    throw new Error('Campaña no encontrada');
  }

  const pendientes = await this.messageRepo.count({
    where: {
      campaign: { id: campaignId },
      shippingStatus: 1,
    },
  });

  if (pendientes > 0) {
    campaign.process_status = 1;
    await this.campaignRepo.save(campaign);

    return {
      campaignId,
      process_status: 1,
      estado: 'PENDIENTE',
    };
  }

  const maxHour = await this.messageRepo
    .createQueryBuilder('m')
    .select('MAX(m.shipping_hour)', 'finalHour')
    .where('m.campaign_id = :id', { id: campaignId })
    .getRawOne();

  campaign.process_status = 2;
  campaign.final_hour = maxHour.finalHour;

  await this.campaignRepo.save(campaign);

  return {
    campaignId,
    process_status: 2,
    estado: 'FINALIZADA',
    final_hour: maxHour.finalHour,
  };
}
// endpoint Lista de clientes con mensajes enviados

async obtenerClientesConMensajesExitosos(
  fechaInicio: string,
  fechaFin: string,
) {
  return await this.campaignRepo
    .createQueryBuilder('c')
    .innerJoin('c.user', 'u')
    .innerJoin('u.customer', 'cl')
    .innerJoin('c.messages', 'm')
    .select('cl.id', 'customerId')
    .addSelect('cl.name', 'customerName')
    .addSelect('COUNT(m.id)', 'totalMensajesExitosos')
    .where('m.shipping_status = 2')
    .andWhere('c.process_date BETWEEN :inicio AND :fin', {
      inicio: fechaInicio,
      fin: fechaFin,
    })
    .groupBy('cl.id')
    .addGroupBy('cl.name')
    .orderBy('totalMensajesExitosos', 'DESC')
    .getRawMany();
}

}
