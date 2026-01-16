import { Controller, Get, Post, Patch, Param, Body,Query } from '@nestjs/common';
import { campaniasService } from './campanias.service';

@Controller('campanias')
export class campaniasController {
  constructor(private readonly service: campaniasService) {}

  // Listar campañas
  @Get()
  getCampanias() {
    return this.service.findAll();
  }

 
  @Post()
  createCampania(@Body() body: any) {
    return this.service.create(body);
  }

  @Patch(':id/calcular-totales')
  calcularTotales(@Param('id') id: number) {
    return this.service.calcularTotales(Number(id));
  }

  @Patch(':id/estado')
  actualizarEstado(@Param('id') id: number) {
    return this.service.actualizarEstado(Number(id));
  }

@Patch(':id/estado-campania')
actualizarEstadoCampania(@Param('id') id: number) {
  return this.service.actualizarEstadoCampania(Number(id));
}

@Get('reporte/clientes')
obtenerReporteClientes(
  @Query('fechaInicio') fechaInicio: string,
  @Query('fechaFin') fechaFin: string,
) {
  return this.service.obtenerClientesConMensajesExitosos(
    fechaInicio,
    fechaFin,
  );
}
  
}
