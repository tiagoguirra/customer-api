import { Factory } from 'rosie';
import { faker } from '@faker-js/faker';

export const JwtPayloadFactory = Factory.define('JwtPayloadFactory').attr(
  'iss',
  'https://test.com',
);

export const JwtHeaderFactory = Factory.define('JwtHeaderFactory')
  .attr('alg', 'RS256')
  .attr('kid', 'JWT')
  .attr('typ', () => faker.string.uuid());

export const JwtFactory = Factory.define('JwtFactory')
  .attr('payload', () => JwtPayloadFactory.build())
  .attr('header', () => JwtHeaderFactory.build());
