import { GameProps } from "@/utils/types/game";

import { Container } from "@/components/container";
import { Input } from "@/components/input";
import { GameCard } from "@/components/GameCard";
import { decode } from "punycode";

async function getData(title: string) {
  const BASE_URL = 'https://sujeitoprogramador.com/'
  try {
    const decodeTitles = decodeURI(title);
    const res = await fetch(
      `${BASE_URL}/next-api/?api=game&title=${decodeTitles}`
    );
    return res.json();
  } catch (error) {
    return null;
  }
}

export default async function Search({
  params: { title },
}: {
  params: { title: string };
}) {
  const games: GameProps[] = await getData(title);

  return (
    <main className="w-full text-black">
      <Container>
        <Input />

        <h1 className="font-bold text-xl mt-8 mb-5">Jogos encontrados:</h1>
        {!games && <p>Jogo não encontrado!</p>}

        <section className="grid gap-7 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {games && games.map((item) => <GameCard key={item.id} data={item} />)}
        </section>
      </Container>
    </main>
  );
}
