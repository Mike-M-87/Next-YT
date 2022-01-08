import Head from 'next/head'
import styles from '../styles/Home.module.css'

export async function getStaticProps() {
  const res = await fetch('https://yts.mx/api/v2/list_movies.json?limit=10&sort_by=download_count')
  const data = await res.json()
  const movies = data["data"]["movies"]

  if (data["status"] != "ok") {
    return {
      notFound: true,
    }
  }
  else {
    return {
      props: {
        movies,
      }
    }
  }
}


export default function Home({ movies }) {
  return (
    <>
      <Head>
        <title>NEXT YT</title>
        <link rel="icon" href="https://yts.mx/assets/images/website/favicon.ico" />
      </Head>
      <h1 className={styles.title}>YT LOL</h1>
      <section>
        <ul>
          {movies.map(({ id, title, url, summary, year, large_cover_image, torrents }) => (
            <li className={styles.card} key={id}>
              <div>
                <img src={large_cover_image}></img>
                <h1>{title}<br/>{year}
                </h1>
                {/* <img  src="star.png"></img> */}
              </div>
              <br />
              <a href={url} target="_blank"><button>YTS</button></a>
              <p>{summary}</p>

              <ul>
                {torrents.map(({ hash, url, quality }) => (
                  <li className={styles.torrentlink} key={hash}>
                    <a href={url} target="_blank"><button>{quality}</button></a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>
      <a style={{ float: "right" }} href="#"><button>Back to top</button></a>
    </>

  )
}
