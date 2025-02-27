import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Render,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { envConstant } from './constants';

@Controller()
export class AppController {
  @Get()
  index(@Res() res: Response) {
    return res.send(
      `
        <body style="background-color: #1b1b32; color: #fff;">
            <h1 style="font-family: sans-serif;"> Running on Port: ${envConstant.PORT} </h1>
        </body>
        `,
    );
  }

  @Get('stripe-payment')
  @Render('stripePayment')
  payment(
    @Query('clientSecret') clientSecret: string,
    @Query('stripePublishableKey') stripePublishableKey: string,
  ) {
    if (!clientSecret || !stripePublishableKey) {
      throw new BadRequestException(
        'clientSecret and stripePublishableKey are missing!',
      );
    }
    return {
      clientSecret,
      stripePublishableKey,
    };
  }

  @Get('payment-success')
  @Render('paymentSuccess')
  paymentSuccess() {
    return;
  }
}
