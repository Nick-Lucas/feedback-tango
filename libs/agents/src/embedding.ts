import { google } from '@ai-sdk/google'
import { embed, type EmbedResult } from 'ai'

const embeddingModel = google.textEmbeddingModel('gemini-embedding-001')
export const embeddingDimensions = 3072

export async function embedText(
  text: string
): Promise<EmbedResult<string>['embedding']> {
  const { embedding } = await embed({
    model: embeddingModel,
    value: text,
  })

  return embedding
}
