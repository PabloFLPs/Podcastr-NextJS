//import "./styles.module.scss"
import styles from "./styles.module.scss"

import format from "date-fns/format"
import enUS from "date-fns/locale/en-US"

import Link from "next/link"

export default function Header(){
  const currentDate = format(new Date(), "MMM d, EEEE", {
    locale: enUS,
  })

  return(
    <header className={styles.headerContainer}>
      <Link href={"/"}>
        <img src="/logo.svg" alt="Podcastr" />
      </Link>

      <p>The best to you listen, always</p>

      <span>{currentDate}</span>
    </header>
  )
}
