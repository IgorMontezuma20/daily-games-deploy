import { redirect } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";

import { GameProps } from "@/utils/types/game";
import { Container } from "@/components/container";
import { Label } from "./components/label";
import { GameCard } from "@/components/GameCard";
import { FavoriteCard } from "@/app/profile/components/favorite";

interface ParamsProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: ParamsProps): Promise<Metadata> {
  const BASE_URL = "https://sujeitoprogramador.com/";
  try {
    const response: GameProps = await fetch(
      `${BASE_URL}/next-api/?api=game&id=${params.id}`,
      { next: { revalidate: 60 } }
    )
      .then((res) => res.json())
      .catch(() => {
        return {
          title: "DailyGames - Descubra novos jogos.",
        };
      });

    return {
      title: response.title,
      description: `${response.description.slice(0, 100)}...`,
      openGraph: {
        title: response.title,
        images: [response.image_url],
      },
      robots: {
        index: true,
        follow: true,
        nocache: true,
        googleBot: {
          index: true,
          follow: true,
          noimageindex: true,
        },
      },
    };
  } catch (err) {
    return {
      title: "DailyGames - Descubra novos jogos.",
    };
  }
}

async function getData(id: string) {
  const BASE_URL = "https://sujeitoprogramador.com/";
  try {
    const res = await fetch(`${BASE_URL}/next-api/?api=game&id=${id}`, {
      cache: "no-store",
    });
    return res.json();
  } catch (error) {
    throw new Error("failed to fetch data.");
  }
}

async function getSortedGame() {
  const BASE_URL = "https://sujeitoprogramador.com/";
  try {
    const res = await fetch(`${BASE_URL}/next-api/?api=game_day`);
    return res.json();
  } catch (error) {
    throw new Error("failed to fetch data.");
  }
}

export default async function GameDetail({
  params: { id },
}: {
  params: { id: string };
}) {
  const data: GameProps = await getData(id);
  const sortedGame: GameProps = await getSortedGame();

  if (!data) {
    redirect("/");
  }

  return (
    <main className="w-full text-black">
      <div className="bg-black h-80 sm:h-96 w-full relative">
        <Image
          className="object-cover w-full h-80 sm:h-96 opacity-75"
          src={data.image_url}
          alt={data.title}
          priority={true}
          fill={true}
          quality={100}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 44vw"
        />
      </div>

      <Container>
        <h1 className="font-bold text-xl my-4">{data.title}</h1>
        <p>{data.description}</p>

        <h2 className="font-bold text-lg mt-7 mb-2">Plataformas</h2>
        <div className="flex gap-2 flex-wrap">
          {data.platforms.map((item) => (
            <Label name={item} key={item} />
          ))}
        </div>

        <h2 className="font-bold text-lg mt-7 mb-2">Categorias</h2>
        <div className="flex gap-2 flex-wrap">
          {data.categories.map((item) => (
            <Label name={item} key={item} />
          ))}
        </div>

        <p className="mt-7 mb-2">
          <strong>Data de lancamento: </strong>
          {data.release}
        </p>

        <h2 className="font-bold text-lg mt-7 mb-2">Jogo recomendado:</h2>
        <div className="flex">
          <div className="flex-grow">
            <GameCard data={sortedGame} />
          </div>
        </div>
      </Container>
    </main>
  );
}
