import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { envConstant } from '@constants/index';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: envConstant.GOOGLE_CLIENT_ID,
      clientSecret: envConstant.GOOGLE_CLIENT_SECRET,
      callbackURL:
        envConstant.BASE_URL + envConstant.GOOGLE_LOGIN_REDIRECT_ENDPOINT,
      scope: ['email', 'profile'],
      prompt: 'consent',
      access_type: 'offline',
    });
  }

  authorizationParams(): { [key: string]: string } {
    return {
      prompt: 'consent',
      access_type: 'offline',
    };
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;
    const user = {
      googleId: id,
      firstName: name?.givenName,
      lastName: name?.familyName,
      email: emails[0].value,
      photo: photos[0].value,
      accessToken,
      refreshToken,
    };

    done(null, user);
  }
}
