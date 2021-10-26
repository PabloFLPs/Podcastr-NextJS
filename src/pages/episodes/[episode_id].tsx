/**
 * Slug
 */

import { format, parseISO } from "date-fns"
import enUS from "date-fns/locale/en-US"
import { GetStaticPaths, GetStaticProps } from "next"
//import {useRouter} from "next/router"
import { api } from "../../services/api"
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString"

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;
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
    <h1>{episode.title}</h1>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return{
    paths: [],
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