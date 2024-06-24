import { createTestToken } from './token';

const { argv } = process
if (argv.length < 3) {
    console.log('Usage: node src/cli.js <user> <role>...')
    process.exit(1)
}

const [, , sub, ...roles] = argv;
const token = createTestToken(sub, ...roles);
console.info('>> ACCESS TOKEN FOR', sub, 'WITH ROLES', roles.join(', '), '>>\n');
console.info(token)
