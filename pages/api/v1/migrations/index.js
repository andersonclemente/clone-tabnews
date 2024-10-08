import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

export default async function migrations(request, response) {
  if (request.method !== "POST" && request.method !== "GET") {
    return response
      .status(405)
      .json({ msg: "this endpoint does not allow this method" });
  }

  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const defaultMigrationsConfig = {
      dbClient,
      dryRun: true,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    if (request.method === "GET") {
      const pendingMigrations = await migrationRunner(defaultMigrationsConfig);
      return response.status(200).json(pendingMigrations);
    }
    if (request.method === "POST") {
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationsConfig,
        dryRun: false,
      });

      const statusCode = migratedMigrations.length > 0 ? 201 : 200;
      return response.status(statusCode).json(migratedMigrations);
    }
  } catch (error) {
    console.error(error);
    return response.status(405).end();
  } finally {
    dbClient.end();
  }
}
