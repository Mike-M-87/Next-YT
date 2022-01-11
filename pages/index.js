import Head from 'next/head'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'

let yturl = 'https://yts.mx/api/v2/list_movies.json?limit=10&sort_by=download_count&page='

export async function getStaticProps() {
  const res = await fetch(yturl)
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
  const [newPage, setPage] = useState(1)
  const [movie, setmovies] = useState(movies)

  const res = useCallback((path) => {
    fetch(path).then((response) => response.json()).then((data) => {
      if (data.status == 'ok') {
        setmovies(data.data.movies)
      }
    });
  },[newPage,movie])

  const nextPage = useCallback(() => {
    setPage(newPage + 1)
    res(yturl + (newPage + 1).toString())
  }, [newPage, movie])

  const prevPage = useCallback(() => {
    if (newPage > 1) {
      setPage(newPage - 1)
      res(yturl + (newPage - 1).toString())
    }
  }, [newPage, movie])

  useEffect(() => {
    console.log('pooch',newPage, movie)
  },)

  


  return (
    <div className="container-fluid">
      <Head>
        <title>NEXT YT</title>
        <link rel="icon" href="https://yts.mx/assets/images/website/favicon.ico" />
      </Head>

      <div className="row p-3 align-items-center">
        <div className="col-sm-10 col-md-11 col-10 h5">Good Morning, Pirate</div>
        <div className="col-sm-2 col-md-1 col-2"><Image alt='profile' className="rounded-circle" src='/profile.jpg' width={100} height={100}></Image></div>
      </div>


      <section>

        {movie.map(({ id, title, url, summary, year, large_cover_image, rating, runtime, torrents }) => (
          <div className="card my-2 bg-dark" key={id}>

            <div data-bs-toggle="collapse" data-bs-target={"#desc" + id} className="row align-items-center p-1">
              <div className="col-sm-2 col-lg-1 col-3"><Image alt='cover' src={large_cover_image} height={140} width={100}></Image></div>
              <h6 className="col-sm-8 col-lg-9 col-6">{title}<br />{year}</h6>

              <div className="col-sm-2 col-3 d-flex flex-column align-items-center">
                <div className="row ms-lg-3">
                  <div className="col-5 col-lg-4"><Image alt='imdb' src='/star.png' width={100} height={100}></Image></div>
                  <small className="col-7 mt-sm-0 mt-md-1 mt-lg-0 rating">{rating}</small>
                </div>
                <small className="my-2 runtime" >{Math.floor(runtime / 60) + " Hrs " + runtime % 60 + " Min"}</small>
              </div>
            </div>

            <div className="collapse card-body" id={"desc" + id}>
              <a href={url} className='btn btn-secondary m-3 p-3' target="_blank" rel="noreferrer">YTS</a>
              <p className="card-text">{summary}</p>

              <div className="d-flex flex-wrap justify-content-center">
                {torrents.map(({ hash, url, quality }) => (
                  <a href={url} key={hash} className='btn btn-primary mx-1 my-1' rel="noreferrer" target="_blank">{quality}</a>
                ))}
              </div>
            </div>

          </div>
        ))}
      </section>


      <ul className="list-group list-group-horizontal justify-content-center">
        <a onClick={prevPage} className="list-group-item list-group-item-info" href='#'>Previous</a>
        <li className="list-group-item list-group-item-info"><a className="badge bg-primary">{newPage}</a></li>
        <a className="list-group-item list-group-item-info" href='#' onClick={nextPage}>Next</a>
      </ul>
      <a className="m-2 btn btn-primary float-end" href="#">Back to top</a>
    </div>

  )
}

