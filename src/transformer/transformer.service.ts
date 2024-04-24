import { BadGatewayException, Injectable } from '@nestjs/common';
import { UserModel } from '../user/models/user.model';
import { ReportModel } from './models/report.model';
import { transformerResponse } from './dto/transformer.dto';
import { $transformer } from './common/axios';
import { AxiosResponse } from 'axios';


@Injectable()
export class TransformerService {

  public async create(formData: unknown, user: UserModel): Promise<ReportModel> {

    const text = await this.generate(formData)

    const report  = await ReportModel
      .query()
      .insert({
        text: text,
        dateCreated: new Date(),
        userId: user.id
      })

    return report
  }

  public async get(id: number, user: UserModel): Promise<ReportModel> {
    const report = await ReportModel.query()
      .where('id', id)
      .andWhere('userId', user.id)

    if (!report.length) {
      throw new BadGatewayException()
    }

    return report[0]
  }

  public async getList(user: UserModel): Promise<ReportModel[]> {
    const reports = await ReportModel.query().where({'userId': user.id})

    if (!reports.length) {
      throw new BadGatewayException()
    }

    return reports
  }

  private async generate(formData: unknown): Promise<string> {
    const res: AxiosResponse<transformerResponse> = await $transformer.post('', formData)

    return res.data.text
  }

}