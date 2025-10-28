import { db } from '@/database/client'
import { auth } from '@/auth'
import { profiles } from '@/database/schema/profiles'
import { exercises } from '@/database/schema/exercises'
import { workouts } from '@/database/schema/workouts'
import { workoutExercises } from '@/database/schema/workout-exercises'
import { randomUUIDv7 } from 'bun'
import { users } from '../schema/users'

const userList = [
  {
    name: 'Admin Master',
    email: 'admin@gym.com',
    password: 'Admin123!',
    birthDate: new Date('1990-01-01').toISOString(),
    profile: {
      role: 'ADMIN',
      gender: 'MALE',
      weight: '80',
      height: '180',
      mainObjective: 'MASS_GAIN',
      about: 'Usuário administrador do sistema',
    },
  },
  {
    name: 'João Silva',
    email: 'joao@gym.com',
    password: 'User123!',
    birthDate: new Date('1998-05-12').toISOString(),
    profile: {
      role: 'USER',
      gender: 'MALE',
      weight: '75',
      height: '175',
      mainObjective: 'STRENGTH',
      about: 'Usuário focado em força',
    },
  },
  {
    name: 'Maria Oliveira',
    email: 'maria@gym.com',
    password: 'User123!',
    birthDate: new Date('2002-08-30').toISOString(),
    profile: {
      role: 'USER',
      gender: 'FEMALE',
      weight: '65',
      height: '170',
      mainObjective: 'FAT_LOSS',
      about: 'Usuária focada em perda de gordura',
    },
  },
]

async function seed() {
  console.log('🌱 Iniciando seed...')

  await db.delete(users)
  await db.delete(profiles)
  await db.delete(workoutExercises)
  await db.delete(workouts)
  await db.delete(exercises)

  const createdUsers: { id: string; profile: any }[] = []

  for (const info of userList) {
    const { user } = await auth.api.signUpEmail({
      body: {
        name: info.name,
        email: info.email,
        password: info.password,
        birthDate: info.birthDate,
      },
    })

    console.log(`✅ Inserted user: ${user.email}`)

    createdUsers.push({
      id: user.id,
      profile: info.profile,
    })
  }

  await db.insert(profiles).values(
    createdUsers.map(u => ({
      userId: u.id,
      ...u.profile,
    })),
  )
  console.log(`✅ Inserted profiles`)

  const exerciciesList = [
    {
      id: randomUUIDv7(),
      name: 'Supino Reto',
      equipment: 'Peso livre',
      muscleGroup: 'Peito',
    },
    {
      id: randomUUIDv7(),
      name: 'Agachamento Livre',
      equipment: 'Peso livre',
      muscleGroup: 'Pernas',
    },
    {
      id: randomUUIDv7(),
      name: 'Levantamento Terra',
      equipment: 'Peso livre',
      muscleGroup: 'Costas',
    },
    {
      id: randomUUIDv7(),
      name: 'Desenvolvimento Militar',
      equipment: 'Halteres',
      muscleGroup: 'Ombros',
    },
    {
      id: randomUUIDv7(),
      name: 'Barra Fixa',
      equipment: 'Peso livre',
      muscleGroup: 'Costas',
    },
    {
      id: randomUUIDv7(),
      name: 'Rosca Direta',
      equipment: 'Barra',
      muscleGroup: 'Braços',
    },
  ]
  await db.insert(exercises).values(exerciciesList)
  console.log(`✅ Inserted exercises`)

  const workoutId1 = randomUUIDv7()

  await db.insert(workouts).values({
    id: workoutId1,
    userId: createdUsers[0].id,
    date: new Date('2025-09-20T07:00:00Z'),
    completed: false,
  })
  console.log(`✅ Inserted workouts`)

  await db.insert(workoutExercises).values([
    {
      workoutId: workoutId1,
      exerciseId: exerciciesList[0].id,
      sets: 4,
      reps: 8,
      load: '80',
      notes: 'Focar em movimento controlado',
    },
    {
      workoutId: workoutId1,
      exerciseId: exerciciesList[1].id,
      sets: 5,
      reps: 5,
      load: '100',
    },
    {
      workoutId: workoutId1,
      exerciseId: exerciciesList[2].id,
      sets: 3,
      reps: 5,
      load: '120',
    },
  ])
  console.log(`✅ Inserted workoutExercises`)

  console.log('✅ Seed concluído!')
}

seed()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
