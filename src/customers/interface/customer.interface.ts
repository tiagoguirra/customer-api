import { Repository } from '../../repository/interface/repository.interface';

export interface Customer extends Repository {
  id: string;
  name: string;
  document: string;
}
