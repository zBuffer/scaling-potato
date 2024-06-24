"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConfig = exports.testDataSource = exports.dataSource = void 0;
exports.dataSource = {
    type: 'postgres',
    host: 'postgres',
    port: 5432,
    username: 'postgres',
    password: 'password',
    database: 'variable-pricing-calculator',
    autoLoadEntities: true,
};
exports.testDataSource = {
    type: 'postgres',
    host: 'postgres',
    port: 5432,
    username: 'postgres',
    password: 'password',
    database: 'variable-pricing-calculator',
    autoLoadEntities: true,
    synchronize: true,
};
exports.jwtConfig = {
    issuer: 'https://variable-pricing-calculation.localhost',
    algorithm: 'ES256',
    expiresIn: '1d',
    public_key: '-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEEVs/o5+uQbTjL3chynL4wXgUg2R9\nq9UU8I5mEovUf86QZ7kOBIjJwqnzD1omageEHWwHdBO6B+dFabmdT9POxg==\n-----END PUBLIC KEY-----',
};
//# sourceMappingURL=env.js.map