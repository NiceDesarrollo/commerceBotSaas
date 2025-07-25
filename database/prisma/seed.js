const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // Crear Tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Tenant Principal',
      slug: 'tenant-principal',
      logoUrl: 'https://placehold.co/100x100',
    },
  });

  // Hash de la contraseña
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Crear Usuario Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@tenant.com',
      password: hashedPassword, // ✅ Contraseña hasheada correctamente
      role: "ADMIN",
      tenantId: tenant.id,
    },
  });

  // Crear Productos
  await prisma.product.createMany({
    data: [
      {
        name: 'Producto 1',
        description: 'Primer producto de ejemplo',
        price: 19.99,
        category: 'General',
        imageUrl: 'https://placehold.co/200x200',
        stock: 10,
        tags: ['nuevo', 'oferta'],
        tenantId: tenant.id,
      },
      {
        name: 'Producto 2',
        description: 'Segundo producto de ejemplo',
        price: 29.99,
        category: 'General',
        imageUrl: 'https://placehold.co/200x200',
        stock: 5,
        tags: ['destacado'],
        tenantId: tenant.id,
      },
    ],
  });

  console.log('Seed completado.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 