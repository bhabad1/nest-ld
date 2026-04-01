import { Injectable } from '@nestjs/common';
import { PowerService } from '../power/power.service';

@Injectable()
export class DiskService {
  constructor(private powerService: PowerService) {}
  getData() {
    console.log('Drawing 20 watts of power to read data from disk');
    this.powerService.supplyPower(20);
    return 'data from disk';
  }
}
