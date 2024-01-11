export default function status(request, response) {
  response.status(200).json({ chave: "teste de http são maneiros" });
}
