import { Injectable } from '@nestjs/common';
import { PowerService } from '../power/power.service';

@Injectable()
export class CpuService {
  constructor(private powerService: PowerService) {}

  compute(a: number, b: number): number {
    console.log('suplying power to cpu');
    this.powerService.supplyPower(50);
    return a + b;
  }
}
