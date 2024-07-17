const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

async function main() {
  // Crear un tipo de usuario
  const adminType = await prisma.typeUser.create({
    data: {
      type_name: "admin",
    },
  });

  // Crear un usuario con el tipo de usuario creado
  const hashedPassword = await bcrypt.hash("password123", 10);
  const user = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      telefono: "123456789",
      password: hashedPassword,
      type_user_id: adminType.id,
    },
  });

  // Crear los meses
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  for (const mes of meses) {
    await prisma.mes.create({
      data: {
        nombre: mes,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  // Crear los últimos 10 años
  const currentYear = new Date().getFullYear();
  for (let i = 0; i < 10; i++) {
    await prisma.anio.create({
      data: {
        nombre: (currentYear - i).toString(),
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  // Crear 5 sedes
  for (let i = 0; i < 5; i++) {
    await prisma.sede.create({
      data: {
        name: `Sede ${i + 1}`,
      },
    });
  }

  // Crear los tipos de combustible
  const tiposCombustible = [
    { abreviatura: "P500", nombre: "Petróleo Industrial 500", unidad: "L" },
    { abreviatura: "P6", nombre: "Petróleo Industrial 6", unidad: "L" },
    { abreviatura: "GH", nombre: "Gasohol", unidad: "L" },
    { abreviatura: "", nombre: "Gasohol 84", unidad: "L" },
    { abreviatura: "", nombre: "Gasohol 90", unidad: "L" },
    { abreviatura: "", nombre: "Gasohol 95", unidad: "L" },
    { abreviatura: "", nombre: "Gasohol 97", unidad: "L" },
    { abreviatura: "", nombre: "Gasohol 98 BA Plus", unidad: "L" },
    { abreviatura: "DB5", nombre: "Diesel B5", unidad: "L" },
    { abreviatura: "DB5 S50", nombre: "Diesel B5 S50", unidad: "L" },
    { abreviatura: "D2", nombre: "Diésel 2", unidad: "L" },
    { abreviatura: "GA", nombre: "Gasolina", unidad: "L" },
    { abreviatura: "GLP", nombre: "Gas Licuado de Petróleo", unidad: "kg" },
    { abreviatura: "GNL", nombre: "Gas Natural Licuado", unidad: "kg" },
    { abreviatura: "GN", nombre: "Gas Natural", unidad: "m³" },
    { abreviatura: "BG", nombre: "Biogás", unidad: "m³" },
    { abreviatura: "GNV", nombre: "Gas Natural Vehicular", unidad: "m³" },
    { abreviatura: "BI", nombre: "Biocombustible 100%", unidad: "L" },
    { abreviatura: "BZ", nombre: "Bagazo", unidad: "kg" },
    { abreviatura: "CV", nombre: "Carbón vegetal", unidad: "kg" },
    { abreviatura: "CM", nombre: "Carbón mineral antracita", unidad: "kg" },
    { abreviatura: "CB", nombre: "Carbón mineral bituminoso", unidad: "kg" },
    { abreviatura: "ET", nombre: "Etanol", unidad: "L" },
    { abreviatura: "CO", nombre: "Coque", unidad: "kg" },
    { abreviatura: "LE", nombre: "Leña", unidad: "kg" },
    { abreviatura: "TA1", nombre: "Turbo A1", unidad: "L" },
    { abreviatura: "GA100L", nombre: "Gasolina 100L", unidad: "L" },
    { abreviatura: "IF3", nombre: "IFO 380", unidad: "L" },
    { abreviatura: "IF1", nombre: "IFO 180", unidad: "L" },
  ];

  for (const tipo of tiposCombustible) {
    await prisma.tipoCombustible.create({
      data: {
        nombre: tipo.nombre,
        abreviatura: tipo.abreviatura,
        unidad: tipo.unidad,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  // Obtener ids de Mes, Anio, Sede y tipoCombustible
  const allMeses = await prisma.mes.findMany();
  const allAnios = await prisma.anio.findMany();
  const allSedes = await prisma.sede.findMany();
  const allTiposCombustible = await prisma.tipoCombustible.findMany();

  // Crear datos aleatorios para Combustible
  for (let i = 0; i < 100; i++) {
    await prisma.combustible.create({
      data: {
        tipo: faker.helpers.arrayElement(["estacionario", "movil"]),
        tipoEquipo: faker.lorem.word(),
        consumo: faker.number.float({ min: 0, max: 100 }),
        tipoCombustible_id:
          allTiposCombustible[
            Math.floor(Math.random() * allTiposCombustible.length)
          ].id,
        mes_id: allMeses[Math.floor(Math.random() * allMeses.length)].id,
        anio_id: allAnios[Math.floor(Math.random() * allAnios.length)].id,
        sede_id: allSedes[Math.floor(Math.random() * allSedes.length)].id,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  // Crear tipos de Fertilizantes

  const tiposFertilizantes = [
    {
      clase: "Sintético",
      nombre: "Urea uso agrícola",
      porcentajeNitrogeno: 46,
    },
    {
      clase: "Sintético",
      nombre: "Fosfato diamónico",
      porcentajeNitrogeno: 18,
    },
    {
      clase: "Organico",
      nombre: "Sulfato de Amonio",
      porcentajeNitrogeno: 21,
    },
    {
      clase: "Organico",
      nombre: "Nitrato de Amonio",
      porcentajeNitrogeno: 34,
    },
  ];

  for (const tipo of tiposFertilizantes) {
    await prisma.tipoFertilizante.create({
      data: {
        clase: tipo.clase,
        nombre: tipo.nombre,
        porcentajeNitrogeno: tipo.porcentajeNitrogeno,

        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  for (let i = 0; i < 100; i++) {
    await prisma.documento.create({
      data: {
        nombre: faker.lorem.words(),
        contenido: Buffer.from(faker.lorem.paragraphs()), // Asegúrate de que el contenido sea de tipo Bytes
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  const allTiposFertilizantes = await prisma.tipoFertilizante.findMany();
  const allDocument = await prisma.documento.findMany(); // Asumiendo que 'document' es el nombre correcto del modelo

  const fichaIds = allDocument.map((doc: { id: any }) => doc.id); // Obtener los IDs de los documentos creados

  for (let i = 0; i < 40; i++) {
    await prisma.fertilizante.create({
      data: {
        tipoFertilizante_id:
          allTiposFertilizantes[
            Math.floor(Math.random() * allTiposFertilizantes.length)
          ].id,
        cantidad: faker.number.float({ min: 0, max: 100 }),
        is_ficha: faker.datatype.boolean(),
        ficha_id: fichaIds[i], // Usar valores del 1 al 100 para ficha_id
        anio_id: allAnios[Math.floor(Math.random() * allAnios.length)].id,
        sede_id: allSedes[Math.floor(Math.random() * allSedes.length)].id,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  const tipoPapel = [
    // A3
    {
      nombre: "A3",
      gramaje: 80.0,
      unidad_paquete: "500 hojas",
      is_certificado: false,
      is_reciclable: true,
      porcentaje_reciclado: 0.0,
      nombre_certificado: null,
    },
    {
      nombre: "A3",
      gramaje: 90.0,
      unidad_paquete: "millar",
      is_certificado: true,
      is_reciclable: true,
      porcentaje_reciclado: 80.0,
      nombre_certificado: "FSC",
    },
    {
      nombre: "A4",
      gramaje: 70.0,
      unidad_paquete: "millar",
      is_certificado: false,
      is_reciclable: true,
      porcentaje_reciclado: 0.0,
      nombre_certificado: null,
    },
    {
      nombre: "A4",
      gramaje: 80.0,
      unidad_paquete: "millar",
      is_certificado: true,
      is_reciclable: true,
      porcentaje_reciclado: 90.0,
      nombre_certificado: "FSC",
    },
    {
      nombre: "Letter",
      gramaje: 70.0,
      unidad_paquete: "500 hojas",
      is_certificado: false,
      is_reciclable: true,
      porcentaje_reciclado: 0.0,
      nombre_certificado: null,
    },
    {
      nombre: "Letter",
      gramaje: 75.0,
      unidad_paquete: "500 hojas",
      is_certificado: true,
      is_reciclable: true,
      porcentaje_reciclado: 100.0,
      nombre_certificado: "FSC",
    },
    {
      nombre: "Legal",
      gramaje: 80.0,
      unidad_paquete: "500 hojas",
      is_certificado: true,
      is_reciclable: true,
      porcentaje_reciclado: 100.0,
      nombre_certificado: "FSC",
    },
    {
      nombre: "Legal",
      gramaje: 90.0,
      unidad_paquete: "500 hojas",
      is_certificado: false,
      is_reciclable: false,
      porcentaje_reciclado: 0.0,
      nombre_certificado: null,
    },
  ];
  for (const tipo of tipoPapel) {
    await prisma.tipoPapel.create({
      data: {
        nombre: tipo.nombre,
        gramaje: tipo.gramaje,
        unidad_paquete: tipo.unidad_paquete,
        is_certificado: tipo.is_certificado,
        is_reciclable: tipo.is_reciclable,
        porcentaje_reciclado: tipo.porcentaje_reciclado,
        nombre_certificado: tipo.nombre_certificado,
        created_at: new Date(),
        updated_at: new Date(),

      },
    });
  }

  const allTiposPapel = await prisma.tipoPapel.findMany();

  for (let i = 0; i < 50; i++) {
    await prisma.consumoPapel.create({
      data: {
        tipoPapel_id:
        allTiposPapel[
            Math.floor(Math.random() * allTiposPapel.length)
          ].id,
        
        cantidad_paquete: faker.number.float({ min: 1, max: 50 }),
        anio_id: allAnios[Math.floor(Math.random() * allAnios.length)].id,
        sede_id: allSedes[Math.floor(Math.random() * allSedes.length)].id,
        
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }


  console.log({ adminType, user });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
