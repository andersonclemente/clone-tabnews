import database from "infra/database";

export default async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const [resultVersion, resultMaxConnections] = await database.query(`
      SHOW server_version;
      SHOW max_connections;
    `);
  const resultOpenedConnections = await database.query({
    text: "SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [process.env.POSTGRES_DB],
  });

  const pgVersionNumber = resultVersion.rows[0].server_version;
  const maxConenction = resultMaxConnections.rows[0].max_connections;
  const openedConnection = resultOpenedConnections.rows[0].count;

  const databaseStatus = {
    version: pgVersionNumber,
    max_connections: parseInt(maxConenction),
    opened_connections: openedConnection,
  };

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: databaseStatus,
    },
  });
}
