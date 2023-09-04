import Link from "next/link";
import Image from "next/image";

import { Container } from "@/components/container";
import { GameProps } from "@/utils/types/game";

import { Input } from "@/components/input";

import { BsArrowRightSquare } from "react-icons/bs";
import { GameCard } from "@/components/GameCard";

async function getDailyGame() {

  const BASE_URL = 'https://sujeitoprogramador.com/'

  try {
    const res = await fetch(
      `${BASE_URL}/next-api/?api=game_day`,
      { next: { revalidate: 320 } }
    );

    return res.json();
  } catch (err) {
    throw new Error("Failed to fetch data");
  }
}

async function getGamesData() {
  const BASE_URL = 'https://sujeitoprogramador.com/'
  try {
    const res = await fetch(`${BASE_URL}/next-api/?api=games`, {
      next: { revalidate: 320 },
    });
    return res.json();
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch data");
  }
}

export default async function Home() {
  const dailyGame: GameProps = await getDailyGame();
  const data: GameProps[] = await getGamesData();

  return (
    <main className="w-full">
      <Container>
        <h1 className="text-center font-bold text-xl mt-8 mb-5">
          Separamos um jogo exclusivamente para você!
        </h1>
        <Link href={`/game/${dailyGame.id}`}>
          <section className="w-full bg-black rounded-lg">
            <div className="w-full max-h-96 h-96 relative rounded-lg">
              <div className="absolute z-20 bottom-0 p-3 flex justify-center items-center gap-2">
                <p className="font-bold text-xl text-white">
                  {dailyGame.title}
                </p>
                <BsArrowRightSquare size={24} color="#FFF" />
              </div>
              <Image
                className="max-h-96 object-cover rounded-lg opacity-50 hover:opacity-100 transition-all duration-300"
                src={dailyGame.image_url}
                alt={dailyGame.title}
                priority
                quality={100}
                fill={true}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 44vw"
              />
            </div>
          </section>
        </Link>

        <Input />

        <h2 className="text-lg font-bold mt-8 mb-5">Jogos para conhecer</h2>
        <section className="grid gap-7 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {data.map((item) => (
            <GameCard key={item.id} data={item} />
          ))}
        </section>
      </Container>
    </main>
  );
}
