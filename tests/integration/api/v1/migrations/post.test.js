import database from "infra/database";
import fs from "fs";

import orchestrator from "../orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await database.query("drop schema public cascade; create schema public;");
});

test("POST to /api/v1/migrations should return 200", async () => {
  const numberMigrationsToRun = fs.readdirSync("infra/migrations").length;

  const responseMigrations = await fetch(
    "http://localhost:3000/api/v1/migrations",
    {
      method: "POST",
    },
  );
  expect(responseMigrations.status).toBe(201);

  const responseBody = await responseMigrations.json();
  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBe(numberMigrationsToRun);

  const responseAfterMigrations = await fetch(
    "http://localhost:3000/api/v1/migrations",
    {
      method: "POST",
    },
  );
  expect(responseAfterMigrations.status).toBe(200);

  const responseAfterMigrationsBody = await responseAfterMigrations.json();
  expect(responseAfterMigrationsBody.length).toBe(0);
});
