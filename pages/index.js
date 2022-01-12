import Head from 'next/head'
import Image from 'next/image'
import { useCallback, useState } from 'react'


let yturl = 'https://yts.mx/api/v2/list_movies.json?limit=30&sort_by=download_count'
let changepage = ''

export async function getStaticProps() {
  let movies = "404"
  try {
    const res = await fetch(yturl)
    const data = await res.json()
    movies = data["data"]["movies"]
    if (data["status"] != "ok") {
      return {
        notFound: true,
      }
    }
  } catch (error) { }
  return {
    props: {
      movies
    }
  }
}



export default function Home({ movies }) {
  const [newPage, setPage] = useState(1)
  const [movie, setmovies] = useState(movies)

  // function res(path, pageEnable) {
  //   try {
  //     await fetch(path).then((response) => response.json()).then((data) => {
  //       changepage = pageEnable ? '' : 'disabled'
  //       if (data.status == 'ok') {
  //         setmovies(data.data.movies)
  //       }
  //     });
  //   } catch (error) {
  //     setmovies("404")
  //   }
  // }

  const res = useCallback((path, pageEnable) => {
    fetch(path).then((response) => response.json()).then((data) => {
      changepage = pageEnable ? '' : 'disabled'
      if (data.status == 'ok') {
        setmovies(data.data.movies)
      }
    });
  },[])

  const searcher = useCallback((event) => {
    event.preventDefault()
    let val = event.target["0"].value
    if (val != '') {
      res(yturl + '&query_term=' + val, false)
    } else {
      res(yturl + '&page=' + (newPage).toString(), true)
    }
  }, [newPage])

  const searchboxEmpty = useCallback((event) => {
    if (event.target.value == '') {
      res(yturl + '&page=' + (newPage).toString(), true)
    }
  }, [newPage])

  const nextPage = useCallback(() => {
    changepage = 'disabled'
    setPage(newPage + 1)
    res(yturl + '&page=' + (newPage + 1).toString(), true)
  }, [newPage])


  const prevPage = useCallback(() => {
    if (newPage > 1) {
      changepage = 'disabled'
      setPage(newPage - 1)
      res(yturl + '&page=' + (newPage - 1).toString(), true)
    }
  }, [newPage])


  if (movie == "404") {
    return (
      <section className='errormsg'>
        <div className='display-2'>Error!</div>
        <p className=''>Please check your network and reload the page</p>
        <a href='https://next-yt.vercel.app/' className='btn btn-secondary'>Reload</a>
      </section>
    )
  };


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
      <form className="d-flex mb-4" onSubmit={searcher}>
        <input className="form-control text-white me-2 bg-dark" onChange={searchboxEmpty} type="text" placeholder="Search" />
        <button className="btn btn-primary">Search</button>

        <div className="dropdown">
          <button className='btn' data-bs-toggle="dropdown">
            <span className=" material-icons text-white">sort</span>
          </button>
          <ul className="dropdown-menu dropdown-menu-dark">
            <li className='dropdown-header'>Feature Disabled</li>
            <li className='dropdown-divider'></li>
            <li className="dropdown-item disabled">Download_count</li>
            <li className="dropdown-item disabled">Year</li>
            <li className="dropdown-item disabled">Rating</li>
          </ul>
        </div>
      </form>

      <section>
        {movie != null && movie != undefined ?
          movie.map(({ id, title, url, summary, year, rating, runtime, torrents, medium_cover_image }) => (
            <div className="card my-2 bg-dark" key={id}>

              <div data-bs-toggle="collapse" data-bs-target={"#desc" + id} className="row align-items-center p-1">
                <div className="col-sm-2 col-lg-1 col-3"><Image priority="true" alt='cover' src={medium_cover_image} height={140} width={100}></Image></div>
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
          )) : <div className='text-center p-5'>Movie not found</div>}
      </section>


      <ul className="mt-4 list-group list-group-horizontal justify-content-center">
        <a onClick={prevPage} className={"list-group-item list-group-item-info " + changepage} href='#'>Previous</a>
        <li className="list-group-item list-group-item-info"><a className="badge bg-primary">{newPage}</a></li>
        <a className={"list-group-item list-group-item-info " + changepage} onClick={nextPage} href='#'>Next</a>
      </ul>
      <a className="m-2 btn btn-primary float-start" href="https://next-yt.vercel.app/">Page 1</a>
      <a className="m-2 btn btn-primary float-end" href="#">Back to top</a>
    </div>
  )
}

