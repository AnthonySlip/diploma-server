import { Body, Injectable } from '@nestjs/common';
import { UserModel } from '../user/models/user.model';
import { ReportModel } from './models/report.model';
import { openaiResponse } from './dto/openai.dto';


@Injectable()
export class OpenaiService {



  public async create(file: unknown, user: UserModel) {

    const openaiRes = await this.generate(file)

  }

  public async get(id: number): Promise<ReportModel> {
    const report = await ReportModel.query().findById(id)
    return report
  }

  public async getList(user: UserModel): Promise<ReportModel[]> {
    const reports = await ReportModel.query().where({'userId': user.id})
    return reports
  }

  private async generate(file: unknown): Promise<openaiResponse> {



    return
  }

}