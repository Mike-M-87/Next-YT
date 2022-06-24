/* eslint-disable @next/next/no-img-element */
import Head from 'next/head'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/loading'

const yturl = 'https://yts.mx/api/v2/list_movies.json?'

const defaultparams = {
  limit: 20,
  page: 1,
  quality: 'All',
  minimum_rating: 0,
  query_term: '',
  genre: '',
  sort_by: 'download_count',
  order_by: 'desc',
  with_rt_ratings: false,
}

export default function Home() {
  const [movies, setmovies] = useState(null)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [params, setParams] = useState(defaultparams)
  const [trailer, setTrailer] = useState('')
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    async function fetchmovies() {
      setLoading(true)
      try {
        const response = await fetch(`${yturl}${Object.entries(params).map(([key, value]) => `${key}=${value}`).join('&')}`)
        const json = await response.json()
        setmovies(json.data.movies)
      } catch (error) {
        toast.error(error.message)
      }
      setLoading(false)
      document.getElementById('ytslist').scrollTo(0, 0)
    }
    fetchmovies()
  }, [params])


  const handleChange = useCallback((key, value) => {
    if (timer) {
      clearTimeout(timer)
      setTimer(null)
    }
    setTimer(setTimeout(() => {
      if (key === 'query_term') {
        setParams({
          ...params,
          [key]: value,
          page: 1
        })
      } else {
        setParams({
          ...params,
          [key]: value
        })
      }
    }, 500))
  }, [params, timer])



  const getTimeOfDay = () => {
    let date = new Date()
    let hour = date.getHours()
    return hour < 12 ? 'Morning' : hour < 18 ? 'Afternoon' : 'Evening'
  }


  useEffect(() => {
    const myModalEl = document.getElementById('trailerModal')
    if (myModalEl) {
      myModalEl.addEventListener('hidden.bs.modal', event => {
        setTrailer('')
      })
    }
  })

  return (
    <>
      <main id='ytslist' className="container-fluid overflow-auto fh-100 bg-black text-light py-1">

        <Head>
          <title>NEXT YT</title>
          <meta property="og:image" content="/yify.jpg" />
          <meta name="theme-color" content="#5CD85A" />
          <meta name="color-scheme" content="light dark" />
          <meta property="og:description" content="Basic implementation of the yts.mx/api" />
          <meta property="og:url" content="https://next-yt.vercel.app/" />
          <link rel="icon" href="https://yts.mx/assets/images/website/favicon.ico" />
        </Head>

        <div className="hstack justify-content-between py-3">
          <h4>Good {getTimeOfDay()}, Pirate</h4>
          <a href="https://github.com/Mike-M-87/Next-YT.git" target="_blank" rel="noreferrer"><img alt='profile' className="rounded-circle" src='/github.webp' width={40} height={40} /></a>
        </div>

        <div className="hstack gap-3 align-items-center justify-content-between">
          <input className="bg-dark border-0 py-2 text-light form-control" type="text" placeholder="Search" onChange={(e) => {
            handleChange("query_term", e.target.value);
          }} />
          <button className="btn btn-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#filters" aria-expanded="false" aria-controls="filters">
            <span className="material-icons align-middle">tune</span>
          </button>
        </div>


        <div className="collapse" id="filters">
          <div className="d-flex justify-content-around gap-2 py-2 flex-wrap">

            <div>
              <h5 className='text-center text-success'>Genre</h5>
              <select className="form-select  custom-scrollbar bg-dark border-0 text-light" onChange={(e) => handleChange("genre", e.target.value)}>
                <option value="">All</option>
                <option value="Action">Action</option>
                <option value="Adventure">Adventure</option>
                <option value="Animation">Animation</option>
                <option value="Biography">Biography</option>
                <option value="Comedy">Comedy</option>
                <option value="Crime">Crime</option>
                <option value="Documentary">Documentary</option>
                <option value="Drama">Drama</option>
                <option value="Family">Family</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Film-Noir">Film-Noir</option>
                <option value="History">History</option>
                <option value="Horror">Horror</option>
                <option value="Music">Music</option>
                <option value="Musical">Musical</option>
                <option value="Mystery">Mystery</option>
                <option value="Romance">Romance</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Short">Short</option>
                <option value="Sport">Sport</option>
                <option value="Superhero">Superhero</option>
                <option value="Thriller">Thriller</option>
                <option value="War">War</option>
                <option value="Western">Western</option>
              </select>
            </div>

            <div>
              <h5 className='text-center text-success'>Sort By</h5>
              <select defaultValue="download_count" className="form-select bg-dark border-0 text-light" onChange={(e) => handleChange("sort_by", e.target.value)}>
                <option value="date_added">Date Added</option>
                <option value="year">Year</option>
                <option value="rating">Rating</option>
                <option value="download_count">Download Count</option>
                <option value="like_count">Like Count</option>
                <option value="title">Title</option>
                <option value="peers">Peers</option>
                <option value="seeds">Seeds</option>
              </select>
            </div>

            <div>
              <h5 className='text-center text-success'>Order By</h5>
              <select className="form-select border-0 bg-dark text-light" onChange={(e) => handleChange("order_by", e.target.value)}>
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>

            <div>
              <h5 className='text-center text-success'>Minimum Rating</h5>
              <select className="form-select border-0 bg-dark text-light" onChange={(e) => handleChange("minimum_rating", e.target.value)}>
                <option value="0">All</option>
                <option value="10">10</option>
                <option value="9">9</option>
                <option value="8">8</option>
                <option value="7">7</option>
                <option value="6">6</option>
                <option value="5">5</option>
                <option value="4">4</option>
                <option value="3">3</option>
                <option value="2">2</option>
                <option value="1">1</option>
              </select>
            </div>

            <div>
              <h5 className='text-center text-success'>With RT ratings</h5>
              <select className="form-select border-0 bg-dark text-light" onChange={(e) => handleChange("with_rt_ratings", e.target.value)}>
                <option value="false">All</option>
                <option value="true">With RT Ratings</option>
              </select>
            </div>

          </div>
        </div>

        <section className='mt-3'>
          {loading ? <LoadingSpinner /> :
            movies ?
              movies.map(({ id, title, url, summary, year, large_cover_image, rating, runtime, torrents, yt_trailer_code }) => (

                <div className="card my-2 rounded bg-dark" key={id}>
                  <div data-bs-toggle="collapse" data-bs-target={`#movie${id}`} className="hstack gap-4 cursor-pointer align-items-center">
                    <div><img className='rounded' alt='cover' src={large_cover_image} height={140} width={100} /></div>
                    <h6 className="flex-grow-1">{title}<br />{year}</h6>

                    <div className='d-flex flex-column me-3'>
                      <div className="text-warning gap-2 hstack align-items-center">
                        <div><img alt='rating' src='/star.png' width={15} height={15}></img></div>
                        <span className='mt-1 mt-md-0'>{rating}</span>
                      </div>
                      <small>{Math.floor(runtime / 60) + " Hrs " + runtime % 60 + " Min"}</small>
                    </div>
                  </div>

                  <div className="collapse card-body" id={`movie${id}`}>
                    <div className='hstack gap-4 my-3'>
                      <a href={url} className='btn btn-secondary' target="_blank" rel="noreferrer">YTS</a>
                      <a className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#trailerModal" onClick={(e) => setTrailer(yt_trailer_code)}>Trailer and Clips</a>
                      <a href={`/watch/${id}`} className='btn btn-secondary'>Watch</a>
                    </div>
                    <p className="card-text">{summary}</p>

                    <div className="d-flex flex-wrap justify-content-center gap-3">
                      {torrents.map(({ hash, url, quality }) => (
                        <a key={hash} className="btn btn-success" href={url}>{quality}</a>
                      ))}
                    </div>
                  </div>

                </div>
              )) : <h5 className='text-center py-5 my-5 text-danger'>No Movies Found</h5>}
        </section>

        <ul className="pagination justify-content-center py-4">
          <li className="page-item">
            <button className="page-link text-success bg-dark border-0" href="#" aria-label="Previous" onClick={(e) => handleChange("page", params.page - 1)} disabled={params.page <= 1 || loading}>
              <span aria-hidden="true">&laquo;</span>
            </button>
          </li>
          <li className="page-item active"><a className="page-link bg-success border-0" href="#">{params.page}</a></li>
          <li className="page-item">
            <button className="page-link text-success bg-dark border-0" href="#" aria-label="Next" onClick={(e) => handleChange("page", params.page + 1)} disabled={loading}>
              <span aria-hidden="true">&raquo;</span>
            </button>
          </li>
        </ul>

      </main>

      <div className="modal fade" id="trailerModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className='ratio ratio-16x9'>
              <iframe src={`https://www.youtube.com/embed/${trailer}`} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}
