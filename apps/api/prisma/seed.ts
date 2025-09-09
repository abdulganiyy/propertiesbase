import * as bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
// import { v4 as uuidv4 } from 'uuid'


async function createUser(
  id: string,
  userData: {
    role: 'user' | 'owner' | 'admin';
    email: string;
    firstname: string;
    lastname: string;
    password: string;
  },
) {
  const { role, ...user } = userData;

  await prisma.user.upsert({
    where: { id },
    update: {},
    create: {
      id,
      role,
      ...user,
    },
  });
  console.log(`Upserted User ${user.firstname}`);

}

async function main() {

   

const superSecretPasswordHash = '$2b$10$1.hQBnDaIB78x1iHfUWMYeUgkvQy8oMs2/zJbQ1zG8nFGgAn4hBJe';

// console.log(superSecretPasswordHash)

  await createUser('58544ec4-d693-4d0c-9a66-95b74e879059', {
    role: 'user',
    email: 'user@example.com',
    firstname: 'Abubakr',
    lastname: 'User',
    password: superSecretPasswordHash,
  });

  await createUser('83e54d70-51db-4392-8f6f-65f70ff30880', {
     role: 'owner',
    email: 'umar@example.com',
    firstname: 'Umar',
    lastname: 'Owner',
    password: superSecretPasswordHash,
  });


  await createUser('fa13e723-d887-4381-b25c-5a2ade423bcc', {
    role: 'admin',
    email: 'usman@example.com',
    firstname: 'Usman',
    lastname: 'Admin',
    password: superSecretPasswordHash,
  });

}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
