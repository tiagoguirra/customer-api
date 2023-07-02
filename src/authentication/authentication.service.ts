import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import { decode, verify, Jwt, JwtPayload } from 'jsonwebtoken';
import { JwksClient, SigningKey } from 'jwks-rsa';

@Injectable()
export class AuthenticationService {
  private async getJwksUri(issuer: string): Promise<string> {
    const { data } = await axios.get(
      `${issuer}/.well-known/openid-configuration`,
    );

    return data?.jwks_uri;
  }

  private getSigningKey(jwksUri: string, kid: string): Promise<SigningKey> {
    const client = new JwksClient({ jwksUri });

    return client.getSigningKey(kid);
  }

  async verify(token: string): Promise<JwtPayload> {
    const tokenDecoded = decode(token, { complete: true, json: true });

    const { payload, header } = tokenDecoded as Jwt;

    const jwksUri = await this.getJwksUri((payload as JwtPayload).iss);

    const signingKey = await this.getSigningKey(jwksUri, header?.kid);

    if (!signingKey) throw new UnauthorizedException('Invalid token signature');

    const publicKey = signingKey.getPublicKey();

    return verify(token, publicKey) as JwtPayload;
  }
}
