import Head from "next/head"

export async function getServerSideProps({ params }) {
  const title = params.hash.split('-')[0]
  const moviehash = params.hash.split('-')[1]
  return {
    props: {
      moviehash,
      title
    }
  }
}

export default function Watch({ title, moviehash }) {
  return (
    <>
      <Head>
        <title>{title.toUpperCase()}</title>
        <link rel="icon" href="https://yts.mx/assets/images/website/favicon.ico" />
      </Head>
      <video controls src={`magnet:?xt=urn:btih:${moviehash}&dn=Sintel`} poster="https://via.placeholder.com/150/0000FF/808080" width="100%" data-title="Sintel">
        <track srcLang="en" label="test" default src="https://raw.githubusercontent.com/andreyvit/subtitle-tools/master/sample.srt" />
      </video>

    </>
  )
}