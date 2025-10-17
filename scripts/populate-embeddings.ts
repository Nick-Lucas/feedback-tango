import { eq } from 'drizzle-orm'
import { embedText } from '../libs/agents/src/embedding.ts'
import { createDb } from '../libs/db/src/db/db.ts'
import { Features } from '../libs/db/src/db/schema.ts'
import { config } from 'dotenv'

config({
  path: '.env',
})

const db = createDb()

const featuresWithoutEmbedding = await db.query.Features.findMany({
  where: (feature, { isNull }) => isNull(feature.nameEmbedding),
})

for (const feature of featuresWithoutEmbedding) {
  console.log('Embedding feature:', feature.id, feature.name)
  const embedding = await embedText(feature.name)
  await db
    .update(Features)
    .set({
      nameEmbedding: embedding,
    })
    .where(eq(Features.id, feature.id))
}

console.log('Done populating embeddings')
await db.$client.end()
