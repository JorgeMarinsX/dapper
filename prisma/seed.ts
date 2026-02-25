import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

const FIRST_NAMES = [
  'João', 'Pedro', 'Lucas', 'Carlos', 'Felipe', 'Rafael', 'Bruno', 'Diego',
  'Marcos', 'André', 'Thiago', 'Gabriel', 'Mateus', 'Leonardo', 'Gustavo',
  'Ricardo', 'Fernando', 'Eduardo', 'Roberto', 'Daniel', 'Rodrigo', 'Alex',
  'Vinicius', 'Henrique', 'Paulo', 'Caio', 'Igor', 'Fábio', 'Hugo', 'Renato',
  'Leandro', 'Sérgio', 'Márcio', 'Adriano', 'Rogério',
]

const LAST_NAMES = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves',
  'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho',
  'Araújo', 'Melo', 'Barbosa', 'Nascimento', 'Moreira', 'Nunes',
]

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function phone(): string {
  const ddd = String(11 + Math.floor(Math.random() * 80)).padStart(2, '0')
  const n = String(900000000 + Math.floor(Math.random() * 99999999))
  return `(${ddd}) ${n.slice(0, 5)}-${n.slice(5, 9)}`
}

function randomDate(daysAhead: number): Date {
  const now = new Date()
  const day = new Date(now)
  day.setDate(day.getDate() + Math.floor(Math.random() * daysAhead))
  return day
}

async function main() {
  console.log('Seeding database...')

  // 1. Create barbearia
  const senha = await hash('123456', 10)
  const barbearia = await prisma.barbearia.upsert({
    where: { email: 'seed@dapper.com' },
    update: {},
    create: {
      nome: 'Barbearia Seed',
      slug: 'barbearia-seed',
      email: 'seed@dapper.com',
      senha,
      cnpj: '00.000.000/0001-00',
      telefone: '(11) 99999-0000',
      endereco: 'Rua Teste, 123 - São Paulo/SP',
    },
  })

  // 2. Create unidade + hours
  const unidade = await prisma.unidade.upsert({
    where: { id: 'seed-unidade-1' },
    update: {},
    create: {
      id: 'seed-unidade-1',
      nome: 'Matriz',
      endereco: 'Rua Teste, 123 - São Paulo/SP',
      barbeariaId: barbearia.id,
    },
  })

  // Business hours (Mon-Sat 09:00-19:00, Sun closed)
  for (let dia = 0; dia <= 6; dia++) {
    await prisma.horarioFuncionamento.upsert({
      where: { unidadeId_diaSemana: { unidadeId: unidade.id, diaSemana: dia } },
      update: {},
      create: {
        unidadeId: unidade.id,
        diaSemana: dia,
        aberto: dia !== 0, // closed on Sunday
        inicio: '09:00',
        fim: '19:00',
      },
    })
  }

  // 3. Create barbeiros
  const barbeiroNames = ['Marcos', 'Felipe', 'Diego']
  const barbeiros = await Promise.all(
    barbeiroNames.map((nome, i) =>
      prisma.barbeiro.upsert({
        where: { email: `barbeiro${i + 1}@seed.com` },
        update: {},
        create: {
          nome: `${nome} Barbeiro`,
          email: `barbeiro${i + 1}@seed.com`,
          telefone: phone(),
          barbeariaId: barbearia.id,
          unidadeId: unidade.id,
        },
      }),
    ),
  )

  // 4. Create servicos
  const servicoData = [
    { nome: 'Corte Masculino', preco: 45, duracao: 30 },
    { nome: 'Barba', preco: 30, duracao: 20 },
    { nome: 'Corte + Barba', preco: 65, duracao: 50 },
    { nome: 'Degradê', preco: 55, duracao: 40 },
  ]

  const servicos = await Promise.all(
    servicoData.map((s, i) =>
      prisma.servico.upsert({
        where: { id: `seed-servico-${i + 1}` },
        update: {},
        create: {
          id: `seed-servico-${i + 1}`,
          ...s,
          barbeariaId: barbearia.id,
        },
      }),
    ),
  )

  // 5. Create 35 clientes
  const usedPhones = new Set<string>()
  const clientes = []
  for (let i = 0; i < 35; i++) {
    let tel: string
    do { tel = phone() } while (usedPhones.has(tel))
    usedPhones.add(tel)

    const nome = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`
    const cliente = await prisma.cliente.create({
      data: {
        nome,
        telefone: tel,
        email: i < 25 ? `cliente${i + 1}@example.com` : undefined,
        barbeariaId: barbearia.id,
      },
    })
    clientes.push(cliente)
  }
  console.log(`  Created ${clientes.length} clients`)

  // 6. Create 50 agendamentos spread across the next 14 days
  const statuses = ['AGUARDANDO', 'CONCLUIDO', 'CANCELADO', 'EM_ANDAMENTO', 'NAO_COMPARECEU'] as const
  const slots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00']

  // Track used (barbeiro, date, slot) to avoid conflicts
  const usedSlots = new Set<string>()
  let created = 0

  for (let i = 0; i < 50; i++) {
    const barbeiro = pick(barbeiros)
    const servico = pick(servicos)
    const cliente = pick(clientes)
    const date = randomDate(14)

    // Skip Sundays
    if (date.getDay() === 0) { date.setDate(date.getDate() + 1) }

    const slot = pick(slots)
    const key = `${barbeiro.id}-${date.toISOString().slice(0, 10)}-${slot}`
    if (usedSlots.has(key)) continue
    usedSlots.add(key)

    const [h, m] = slot.split(':').map(Number)
    const dataHora = new Date(date)
    dataHora.setHours(h + 3, m, 0, 0) // +3 for São Paulo → UTC offset

    await prisma.agendamento.create({
      data: {
        dataHora,
        status: pick(statuses),
        barbeariaId: barbearia.id,
        unidadeId: unidade.id,
        barbeiroId: barbeiro.id,
        clienteId: cliente.id,
        servicoId: servico.id,
      },
    })
    created++
  }
  console.log(`  Created ${created} appointments`)

  // 7. Notification config
  await prisma.configuracaoNotificacao.upsert({
    where: { barbeariaId: barbearia.id },
    update: {},
    create: {
      barbeariaId: barbearia.id,
      emailConfirmacao: true,
      smsLembrete: true,
      antecedencia: 2,
    },
  })

  console.log('Seed complete!')
  console.log(`  Login: seed@dapper.com / 123456`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
