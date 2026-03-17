import { AppDataSource } from './data-source';

AppDataSource.initialize()
  .then(async () => {
    await AppDataSource.runMigrations();
    console.log('Migraciones ejecutadas correctamente.');
    await AppDataSource.destroy();
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error al ejecutar migraciones:', err);
    process.exit(1);
  });
