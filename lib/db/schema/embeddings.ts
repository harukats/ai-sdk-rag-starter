import { nanoid } from '@/lib/utils';
import { index, pgTable, text, varchar, vector } from 'drizzle-orm/pg-core';
import { resources } from './resources';

export const embeddings = pgTable(
  'embeddings',
  {
    id: varchar('id', { length: 191 })
      .primaryKey()
      .$defaultFn(() => nanoid()),
    resourceId: varchar('resource_id', { length: 191 }).references(
      () => resources.id,
      { onDelete: 'cascade' },
    ),
    content: text('content').notNull(),
    embeddings: vector('embeddings', { dimensions: 512 }).notNull(),
  },
  (table) => ({
    embeddingsIndex: index('embeddingIndex').using(
      'hnsw',
      table.embeddings.op('vector_cosine_ops'),
    ),
  }),
);