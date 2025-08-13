export const COMMON_SCHEMA_OPTIONS = {
  collection: 'cafeteria',       // ↩️ tek koleksiyon
  timestamps: true,
}

export type DocType =
  | 'user'
  | 'vote'
  | 'suggestion'
  | 'menu';
