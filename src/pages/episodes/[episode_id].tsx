/**
 * Slug
 */

import { format, parseISO } from "date-fns"
import enUS from "date-fns/locale/en-US"
import Image from "next/image"
import Link from "next/link"
import { GetStaticPaths, GetStaticProps } from "next"
//import {useRouter} from "next/router"
import { api } from "../../services/api"
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString"

import styles from "./episode.module.scss"

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAt: string;
  duration: number;
  durationAsString: string;
  description: string;
  url: string;
}

type EpisodeProps = {
  episode: Episode;
}

export default function Episode({episode}: EpisodeProps){
  //hooks can only be accessed by a React component
  //const router = useRouter()

  return(
    //getting episode_id on /episode url
    //<h1>{router.query.episode_id}</h1>
    <div className={styles.episode}>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Go back" />
          </button>
        </Link>
        <Image
          width={700}
          height={160}
          src={episode.thumbnail}
          objectFit="cover"
        />
        <button>
          <img src="/play.svg" alt="Play episode" />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div
        className={styles.description}
        dangerouslySetInnerHTML={{__html: episode.description}}
      />
    </div>
  )
}

//client (front-end/browser) - next.js (node.js) - server (back-end)
export const getStaticPaths: GetStaticPaths = async () => {
  const {data} = await api.get("episodes", {
    params: {
      _limit: 12,
      _sort: "published_at",
      _order: "desc"
    }
  })

  const paths = data.map(episode => {
    return {
      params: {
        episode_id: episode.id
      }
    }
  })

  return {
    paths,
    fallback: "blocking"
  }
}

//ctx -> context
export const getStaticProps: GetStaticProps = async(ctx) => {
  const {episode_id} = ctx.params

  const {data} = await api.get(`/episodes/${episode_id}`)

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), "MMM d, EEEE", {locale: enUS}),
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    description: data.description,
    url: data.file.url
  }

  return{
    props: {
      episode
    },
    revalidate: 60 * 60 * 24 //60seconds * 60minutes * 24hours to revalidate
  }
}