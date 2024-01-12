import database from "infra/database";

export default async function status(request, response) {
  const result = await database.query("SELECT 1 + 1 as sum;");
  if (result.rows[0].sum == 2) {
    response.status(200).json({ msg: "testes de http são maneiros" });
  } else {
    response.status(500).json({ msg: "banco de dados não conectado" });
  }
}
