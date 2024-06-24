import { Controller, Get, Post, Body, Param, Patch, HttpCode } from '@nestjs/common';
import { PricingRulesService } from './pricing-rules.service';
import { CreatePricingRuleDto } from './dto/create-pricing-rule.dto';
import { PaginateQuery, Paginate } from 'nestjs-paginate';
import { throwNotFoundIfFalsey } from '../helpers';
import {
  AllowedRoles,
  AppRoles,
} from '../authentication/authentication.decorator';
import { UpdatePricingRuleDto } from './dto/update-pricing-rule.dto';

@AllowedRoles(AppRoles.PRODUCT)
@Controller('pricing-rules')
export class PricingRulesController {
  constructor(private readonly pricingRulesService: PricingRulesService) { }

  @Post()
  create(@Body() createPricingRuleDto: CreatePricingRuleDto) {
    return this.pricingRulesService.create(createPricingRuleDto);
  }

  @Get()
  findAll(@Paginate() query: PaginateQuery) {
    return this.pricingRulesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return throwNotFoundIfFalsey(this.pricingRulesService.findOne(id));
  }

  @HttpCode(204)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePricingRuleDto: UpdatePricingRuleDto) {
    const pricingRule = await throwNotFoundIfFalsey(this.pricingRulesService.findOne(id));
    return this.pricingRulesService.update(pricingRule, updatePricingRuleDto);
  }
}
