const { PrismaClient } = require('../generated/prisma');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // Crear Tenant - Friki Plaza (Tienda Gaming)
  const tenant = await prisma.tenant.create({
    data: {
      name: "Friki Plaza",
      slug: "friki-plaza",
      logoUrl:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop&crop=center",
    },
  });

  console.log(`✅ Tenant creado: ${tenant.name} (ID: ${tenant.id})`);

  // Hash de la contraseña
  const hashedPassword = await bcrypt.hash("admin123", 10);

  // Crear Usuario Admin
  const admin = await prisma.user.create({
    data: {
      email: "admin@frikiplaza.com",
      password: hashedPassword,
      role: "ADMIN",
      tenantId: tenant.id,
    },
  });

  console.log(`✅ Admin creado: ${admin.email}`);

  // Crear Productos Gaming Realistas
  const products = await prisma.product.createMany({
    data: [
      // 🖥️ PCs y Componentes
      {
        name: "PC Gamer RTX 4060 Ti - AMD Ryzen 5 7600X",
        description:
          "PC Gaming completa con procesador AMD Ryzen 5 7600X, tarjeta gráfica RTX 4060 Ti 16GB, 16GB RAM DDR5, SSD 1TB NVMe. Ideal para gaming 1440p y streaming.",
        price: 1299.99,
        category: "PCs y Componentes",
        imageUrl:
          "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop&crop=center",
        stock: 15,
        tags: ["gaming", "rtx", "amd", "high-end", "nuevo"],
        tenantId: tenant.id,
      },
      {
        name: "Tarjeta Gráfica RTX 4070 Super 12GB",
        description:
          "NVIDIA GeForce RTX 4070 Super con 12GB GDDR6X. Ray tracing y DLSS 3.0. Perfecta para gaming 1440p en ultra configuración.",
        price: 649.99,
        category: "PCs y Componentes",
        imageUrl:
          "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=400&fit=crop",
        stock: 8,
        tags: ["gpu", "nvidia", "rtx", "ray-tracing", "dlss"],
        tenantId: tenant.id,
      },
      {
        name: "Procesador Intel Core i7-13700K",
        description:
          "Intel Core i7-13700K de 13va generación, 16 núcleos (8P+8E), hasta 5.4GHz. Ideal para gaming y creación de contenido.",
        price: 389.99,
        category: "PCs y Componentes",
        imageUrl:
          "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop&crop=center",
        stock: 12,
        tags: ["cpu", "intel", "procesador", "high-performance"],
        tenantId: tenant.id,
      },

      // ⌨️ Periféricos
      {
        name: "Teclado Mecánico Corsair K70 RGB Pro",
        description:
          "Teclado gaming mecánico con switches Cherry MX Red, iluminación RGB por tecla, reposamuñecas magnético y construcción en aluminio.",
        price: 159.99,
        category: "Periféricos",
        imageUrl:
          "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop",
        stock: 25,
        tags: ["teclado", "mecánico", "rgb", "corsair", "cherry-mx"],
        tenantId: tenant.id,
      },
      {
        name: "Mouse Gaming Logitech G Pro X Superlight",
        description:
          "Mouse inalámbrico ultraligero (63g) con sensor HERO 25K, hasta 70 horas de batería. Preferido por profesionales de esports.",
        price: 129.99,
        category: "Periféricos",
        imageUrl:
          "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop",
        stock: 30,
        tags: [
          "mouse",
          "wireless",
          "gaming",
          "logitech",
          "esports",
          "ultraligero",
        ],
        tenantId: tenant.id,
      },
      {
        name: "Headset HyperX Cloud Alpha S",
        description:
          "Auriculares gaming con audio espacial 7.1, micrófono ajustable con cancelación de ruido, almohadillas de memory foam.",
        price: 89.99,
        category: "Periféricos",
        imageUrl:
          "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop",
        stock: 20,
        tags: ["headset", "audio", "7.1", "hyperx", "micrófono"],
        tenantId: tenant.id,
      },

      // 🖥️ Monitores
      {
        name: 'Monitor Gaming ASUS ROG Swift 27" 1440p 165Hz',
        description:
          "Monitor gaming QHD (2560x1440) de 27 pulgadas, 165Hz, 1ms de respuesta, G-SYNC Compatible, panel IPS con 95% DCI-P3.",
        price: 449.99,
        category: "Monitores",
        imageUrl:
          "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop",
        stock: 10,
        tags: ["monitor", "1440p", "165hz", "asus", "rog", "g-sync"],
        tenantId: tenant.id,
      },
      {
        name: 'Monitor Ultrawide LG 34" 3440x1440 144Hz',
        description:
          'Monitor ultrawide curvo de 34", resolución UWQHD (3440x1440), 144Hz, HDR10, ideal para gaming inmersivo y productividad.',
        price: 549.99,
        category: "Monitores",
        imageUrl:
          "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=400&fit=crop",
        stock: 6,
        tags: ["ultrawide", "curvo", "144hz", "lg", "hdr", "inmersivo"],
        tenantId: tenant.id,
      },

      // 🪑 Setup Gaming
      {
        name: "Silla Gaming Secretlab Titan Evo 2022",
        description:
          "Silla ergonómica premium con espuma cold-cure, soporte lumbar magnético, reposabrazos 4D y tapizado Neo Hybrid Leatherette.",
        price: 459.99,
        category: "Mobiliario Gaming",
        imageUrl:
          "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop&crop=center",
        stock: 8,
        tags: ["silla", "ergonómica", "secretlab", "premium", "confort"],
        tenantId: tenant.id,
      },
      {
        name: "Escritorio Gaming IKEA BEKANT con RGB",
        description:
          "Escritorio gaming de 140x60cm con sistema de gestión de cables, soporte para monitor dual y tira LED RGB incluida.",
        price: 199.99,
        category: "Mobiliario Gaming",
        imageUrl:
          "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=400&h=400&fit=crop",
        stock: 12,
        tags: ["escritorio", "gaming", "rgb", "cable-management", "amplio"],
        tenantId: tenant.id,
      },

      // 🎮 Consolas y Accesorios
      {
        name: "PlayStation 5 Slim 1TB + Spider-Man 2",
        description:
          "Consola PlayStation 5 Slim con 1TB de almacenamiento, incluye Marvel's Spider-Man 2 y control DualSense.",
        price: 549.99,
        category: "Consolas",
        imageUrl:
          "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=400&h=400&fit=crop",
        stock: 5,
        tags: ["ps5", "playstation", "consola", "spiderman", "nuevo"],
        tenantId: tenant.id,
      },
      {
        name: "Control Xbox Series X|S Wireless - Edición Forza",
        description:
          "Control inalámbrico Xbox con acabado especial Forza Motorsport, gatillos impulsores, D-pad híbrido y conectividad Bluetooth.",
        price: 74.99,
        category: "Consolas",
        imageUrl:
          "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&h=400&fit=crop",
        stock: 15,
        tags: ["xbox", "control", "wireless", "forza", "edición-especial"],
        tenantId: tenant.id,
      },

      // 🔧 Accesorios y Cables
      {
        name: "Cable DisplayPort 1.4 - 2 metros 8K Ready",
        description:
          "Cable DisplayPort 1.4 certificado VESA, soporte 8K@60Hz, 4K@120Hz, compatibilidad total con G-SYNC y FreeSync.",
        price: 24.99,
        category: "Accesorios",
        imageUrl:
          "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop&crop=center",
        stock: 50,
        tags: ["cable", "displayport", "8k", "gaming", "alta-velocidad"],
        tenantId: tenant.id,
      },
      {
        name: "Hub USB 3.0 Gaming con 7 Puertos + RGB",
        description:
          "Hub USB 3.0 con 7 puertos de alta velocidad, iluminación RGB personalizable y diseño gaming. Incluye fuente de alimentación.",
        price: 39.99,
        category: "Accesorios",
        imageUrl:
          "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400&h=400&fit=crop",
        stock: 35,
        tags: ["usb-hub", "rgb", "7-puertos", "gaming", "conectividad"],
        tenantId: tenant.id,
      },
    ],
  });

  console.log(`✅ ${products.count} productos gaming creados`);

  // Crear configuración del bot por defecto para Friki Plaza
  const botConfig = await prisma.botConfig.create({
    data: {
      tenantId: tenant.id,
      botName: "FrikiBot",
      promptStyle:
        "Entusiasta gamer, conocedor de tecnología y persuasivo para ventas. Usa jerga gaming moderada.",
      greeting:
        "¡Hola gamer! 🎮 Soy FrikiBot de Friki Plaza. ¿Buscas armar tu setup perfecto o tienes alguna duda sobre nuestros productos gaming?",
      temperature: 0.8,
      useImages: true,
      aiProvider: "gemini",
    },
  });

  console.log(`✅ Configuración del bot creada: ${botConfig.botName}`);
  console.log("\n🎮 ¡Friki Plaza está listo para la acción!");
  console.log(`📧 Admin: admin@frikiplaza.com`);
  console.log(`🔑 Password: admin123`);
  console.log(`🆔 TenantId: ${tenant.id}`);
}

main()
  .catch((e) => {
    console.error("❌ Error en el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 