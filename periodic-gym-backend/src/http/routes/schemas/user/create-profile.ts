import z from 'zod'

export const CreateProfileBodySchema = z.object({
  weight: z
    .string()
    .min(2, 'Peso deve ter pelo menos 2 caracteres')
    .describe('Peso do usuário'),
  height: z
    .string()
    .min(2, 'Altura deve ter pelo menos 2 caracteres')
    .describe('Altura do usuário'),
  gender: z.enum(['MALE', 'FEMALE']).describe('Gênero do usuário'),
  mainObjective: z
    .enum(['MASS_GAIN', 'STRENGTH', 'FAT_LOSS', 'ENDURANCE', 'CONDITIONING'])
    .describe('Objetivo principal do usuário'),
  about: z.string().nullable().optional().describe('Sobre o usuário'),
})
export const CreateProfileParamsSchema = z.object({
  id: z.string().describe('ID do usuário'),
})
export const CreateProfileResponseSchema = z.object({
  userId: z.string().describe('ID do usuário associado ao perfil'),
  weight: z.string().optional().describe('Peso do usuário'),
  height: z.string().optional().describe('Altura do usuário'),
  mainObjective: z
    .enum(['MASS_GAIN', 'STRENGTH', 'FAT_LOSS', 'ENDURANCE', 'CONDITIONING'])
    .optional()
    .describe('Objetivo principal do usuário'),
  about: z.string().nullable().optional().describe('Sobre o usuário'),
})

export type CreateProfileBody = z.infer<typeof CreateProfileBodySchema>
export type CreateProfileParams = z.infer<typeof CreateProfileParamsSchema>
export type CreateProfileResponse = z.infer<typeof CreateProfileResponseSchema>
