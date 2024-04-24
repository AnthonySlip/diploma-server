import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TransformerService } from './transformer.service';
import { User } from '../auth/decorators/user.decorator';
import { UserModel } from '../user/models/user.model';
import { ReportModel } from './models/report.model';


@Controller('openai')
export class TransformerController {


  constructor(
    private transformerService: TransformerService,
  ) {
  }

  @Post('generate')
  public async create(
    @Body() file: unknown,
    @User() user: UserModel
  ): Promise<unknown> {
    const response = await this.transformerService.create(file, user);

    return response;
  }

  @Get(':id')
  public async getRepost(
    @Param() id: number,
    @User() user: UserModel
  ): Promise<ReportModel> {
    const response = await this.transformerService.get(id, user);

    return response;
  }

  @Get('all')
  public async getRepostsList(
    @User() user: UserModel
  ): Promise<ReportModel[]> {
    const response = await this.transformerService.getList(user);

    return response;
  }

}