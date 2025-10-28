import z from 'zod'

export const UserProfileSchema = z.object({
  user: z
    .object({
      id: z.string().describe('ID do usuário'),
      name: z.string().describe('Nome do usuário'),
      email: z.string().describe('Email do usuário'),
      emailVerified: z
        .boolean()
        .describe('Data de verificação do email do usuário'),
      image: z.string().nullable().describe('URL da imagem do usuário'),
      birthDate: z.string().describe('Data de nascimento do usuário'),
      isActive: z.boolean().describe('Se o usuário está ativo'),
      createdAt: z.string().describe('Data de criação do usuário (ISO 8601)'),
      updatedAt: z
        .string()
        .describe('Data de atualização do usuário (ISO 8601)'),
    })
    .describe('Informações básicas do usuário'),
  profile: z
    .object({
      userId: z.string().describe('ID do usuário associado ao perfil'),
      gender: z.enum(['MALE', 'FEMALE']).describe('Gênero do usuário'),
      weight: z.string().describe('Peso do usuário'),
      height: z.string().describe('Altura do usuário'),
      role: z.enum(['ADMIN', 'USER']).describe('Cargo do usuário'),
      mainObjective: z
        .enum([
          'MASS_GAIN',
          'STRENGTH',
          'FAT_LOSS',
          'ENDURANCE',
          'CONDITIONING',
        ])
        .describe('Objetivo principal do usuário'),
      about: z.string().nullable().describe('Sobre o usuário'),
      updatedAt: z
        .string()
        .describe('Data de atualização do perfil (ISO 8601)'),
    })
    .nullable()
    .describe('Informações do perfil do usuário'),
})

export type UserProfile = z.infer<typeof UserProfileSchema>
