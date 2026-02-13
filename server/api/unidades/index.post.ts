import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const barbeariaId = event.context.barbeariaId
  const body = await readBody(event)
  const { nome, endereco, telefone } = body

  if (!nome || !endereco) {
    throw createError({ statusCode: 400, statusMessage: 'Nome e endereço são obrigatórios' })
  }

  return prisma.unidade.create({
    data: {
      nome,
      endereco,
      telefone: telefone || null,
      barbeariaId,
      horarios: {
        createMany: {
          data: [
            { diaSemana: 0, aberto: false, inicio: '09:00', fim: '13:00' },
            { diaSemana: 1, aberto: true, inicio: '09:00', fim: '19:00' },
            { diaSemana: 2, aberto: true, inicio: '09:00', fim: '19:00' },
            { diaSemana: 3, aberto: true, inicio: '09:00', fim: '19:00' },
            { diaSemana: 4, aberto: true, inicio: '09:00', fim: '19:00' },
            { diaSemana: 5, aberto: true, inicio: '09:00', fim: '20:00' },
            { diaSemana: 6, aberto: true, inicio: '08:00', fim: '17:00' },
          ],
        },
      },
    },
    include: { horarios: true },
  })
})
