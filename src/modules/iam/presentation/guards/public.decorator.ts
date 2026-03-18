import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Marca la ruta como pública (no requiere JWT).
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

