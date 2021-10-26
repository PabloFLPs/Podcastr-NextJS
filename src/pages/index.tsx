//SPA - Single Page Application
//SSR - Server Side Rendering
//SSG - Static Side Generating

import { GetStaticProps } from "next"
import { api } from "../services/api"
import {format, parseISO} from "date-fns"
import enUS from "date-fns/locale/en-US"
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString"

import styles from "./home.module.scss"

type Episode = {
  id: string,
  title: string,
  thumbnail: string,
  members: string,
  publishedAt: string,
  duration: number,
  durationAsString: string,
  description: string,
  url: string
}

type HomeProps = {
  latestEpisodes: Array<Episode> //or Episode[]
  allEpisodes: Array<Episode>
}

export default function Home({latestEpisodes, allEpisodes}: HomeProps) {
  //problem with latestEpisodes
  return (
    <div className={styles.homepage}>
      <section className={styles.lastestEpisodes}>
        <h2>Latest episodes</h2>
        
        <ul>
          {allEpisodes.map(episode => {
            return(
              <li>
                <a href="">{episode.title}</a>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>

      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const {data} = await api.get("episodes", {
    params: {
      _limit: 12,
      _sort: "published_at",
      _order: "desc"
    }
    //localhost:3030/episodes?_limit=12&_sort=published_at&_order=desc
  })

  const episodes = data.map(episode => {
    return{
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), "MMM d, EEEE", {locale: enUS}),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url
    }
  })

  const lastestEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.length)

  return{
    props: {
      lastestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 24, //60seconds * 60minutes * 24hours to revalidate
  }
}