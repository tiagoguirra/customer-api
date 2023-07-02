import { Factory } from 'rosie';
import { faker } from '@faker-js/faker';

export const CustomerFactory = Factory.define('CustomerFactory')
  .attr('id', () => faker.string.uuid())
  .attr('name', () => faker.internet.userName())
  .attr('document', () => faker.string.numeric(11));
