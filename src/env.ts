export const dataSource = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'variable-pricing-calculator',
  autoLoadEntities: true,
};

export const testDataSource = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'variable-pricing-calculator',
  autoLoadEntities: true,
  synchronize: true,
};

export const jwtConfig = {
  issuer: 'https://variable-pricing-calculation.localhost',
  algorithm: 'ES256',
  expiresIn: '1d',
  public_key:
    '-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEEVs/o5+uQbTjL3chynL4wXgUg2R9\nq9UU8I5mEovUf86QZ7kOBIjJwqnzD1omageEHWwHdBO6B+dFabmdT9POxg==\n-----END PUBLIC KEY-----',
};
