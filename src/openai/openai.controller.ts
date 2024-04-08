import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { User } from '../auth/decorators/user.decorator';
import { UserModel } from '../user/models/user.model';
import { ReportModel } from './models/report.model';


@Controller('openai')
export class OpenaiController {


  constructor(
    private openaiService: OpenaiService,
  ) {
  }

  @Post('generate')
  public async create(
    @Body() file: unknown,
    @User() user: UserModel
  ): Promise<unknown> {
    const response = await this.openaiService.create(file, user);

    return response;
  }

  @Get(':id')
  public async getRepost(
    @Param() id: number
  ): Promise<ReportModel> {
    const response = await this.openaiService.get(id);

    return response;
  }

  @Get('all')
  public async getRepostsList(
    @User() user: UserModel
  ): Promise<ReportModel[]> {
    const response = await this.openaiService.getList(user);

    return response;
  }

}