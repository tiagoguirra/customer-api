# Documentação do repositorio

Essa documentação destina-se a explicar a implementação feita para o repositório e como podemos tirar proveito dessa abstração em implementações futuras.

## Abstração

O repositório funciona abstraindo a camada de conexão com o banco de dados que no nosso cenário é utilizado o `Redis` como banco de dados *chave-valor*, caso no futuro venhamos a optar por utilizar outro banco de dados a abstração criada tende a facilitar essa migração.

## Módulo dinâmico

O módulo do repositório é uma implementação de módulo dinâmico do `NestJs` que permite criar instâncias de repositórios para as entidades passando o prefixo da chave que será utilizada para armazenar os dados no `Redis`.

```typescript

@Module({
  imports: [RepositoryModule.register('customer', 'product'), AuthenticationModule],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}
```

## Injeção de dependência

Após a importação e registro do módulo do repositório, para cada entidade passada no registro será disponibilizada um depência para uso dentro do módulo.

A depedência pode ser injetada utilizando o padrão camel case e sufixo `Repository` (CustomerRepository, ProductRepository).

```typescript
@Injectable()
export class CustomersService {
  constructor(
    @Inject('CustomerRepository')
    private readonly CustomerRepository: RepositoryService<Customer>,
  ) {}
}
```