export const COMMON_SCHEMA_OPTIONS = {
  collection: 'cafeteria',  // tüm dokümanlar aynı koleksiyona yazılacak
  timestamps: true,
};

export type DocType = 'user' | 'vote' | 'suggestion' | 'menu';
