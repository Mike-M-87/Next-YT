import Head from 'next/head'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import LoadingSpinner from '../components/loading'


let yturl = 'https://yts.mx/api/v2/list_movies.json?'


export default function Home({ movies }) {
  const [movie, setmovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [params, setParams] = useState({
    limit: 10,
    page: 1,
    quality: 'All',
    minimum_rating: 0,
    query_term: '',
    genre: '',
    sort_by: 'date_added',
    order_by: 'desc',
    with_rt_ratings: false,
  })


  useEffect(() => {
    async function fetchmovies() {
      setLoading(true)
      fetch(`${yturl}${Object.entries(params).map(([key, value]) => `${key}=${value}`).join('&')}`)
        .then(res => res.json())
        .then(res => {
          setmovies(res.data.movies)
        })
        .catch(err => {
          console.log(err);
        })
      setLoading(false)
      document.getElementById('ytslist').scrollTo(0, 0)
    }
    fetchmovies()
  }, [params])


  const handleChange = useCallback((key, value) => {
    setParams({
      ...params,
      [key]: value
    })

  }, [params])

  const getTimeOfDay = () => {
    let date = new Date()
    let hour = date.getHours()
    if (hour < 12) {
      return 'Morning'
    } else if (hour < 18) {
      return 'Afternoon'
    } else {
      return 'Evening'
    }
  }

  return (
    <div id='ytslist' className="container-fluid overflow-auto fh-100 bg-black text-light py-1">
      <Head>
        <title>NEXT YT</title>
        <link rel="icon" href="https://yts.mx/assets/images/website/favicon.ico" />
      </Head>

      <div className="hstack justify-content-between p-3">
        <h4 className="">Good {getTimeOfDay()}, Pirate</h4>
        <div className=""><Image alt='profile' className="rounded-circle" src='/profile.jpg' width={50} height={50}></Image></div>
      </div>

      <input className="form-control" type="text" placeholder="Search" onChange={(e) => handleChange("query_term", e.target.value)} />

      <div className="d-flex justify-content-around my-2 gap-2 flex-wrap">

        <div>
          <h5 className='text-center text-success'>Genre</h5>
          <select className="form-select bg-dark text-light bg-dark text-light" onChange={(e) => handleChange("genre", e.target.value)}>
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
          <select className="form-select bg-dark text-light" onChange={(e) => handleChange("sort_by", e.target.value)}>
            <option value="date_added">Date Added</option>
            <option value="year">Year</option>
            <option value="rating">Rating</option>
          </select>
        </div>

        <div>
          <h5 className='text-center text-success'>Order By</h5>
          <select className="form-select bg-dark text-light" onChange={(e) => handleChange("order_by", e.target.value)}>
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>

        <div>
          <h5 className='text-center text-success'>Minimum Rating</h5>
          <select className="form-select bg-dark text-light" onChange={(e) => handleChange("minimum_rating", e.target.value)}>
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
          <select className="form-select bg-dark text-light" onChange={(e) => handleChange("with_rt_ratings", e.target.value)}>
            <option value="false">All</option>
            <option value="true">With RT Ratings</option>
          </select>
        </div>

      </div>

      <section>
        {loading ? <LoadingSpinner /> :
          movie != null && movie != undefined ?
            movie.map(({ id, title, url, summary, year, large_cover_image, rating, runtime, torrents }) => (

              <div className="card my-2 rounded bg-dark" key={id}>
                <div data-bs-toggle="collapse" data-bs-target={`#movie${id}`} className="hstack gap-4 cursor-pointer">
                  <Image className='rounded' alt='cover' src={large_cover_image} height={140} width={100}></Image>
                  <h6 className="flex-grow-1">{title}<br />{year}</h6>

                  <div className='d-flex flex-column me-3'>
                    <div className="text-warning gap-2 hstack"><Image alt='rating' src='/star.png' width={20} height={20}></Image>{rating}</div>
                    <small>{Math.floor(runtime / 60) + " Hrs " + runtime % 60 + " Min"}</small>
                  </div>
                </div>

                <div className="collapse card-body" id={`movie${id}`}>
                  <a href={url} className='btn btn-secondary btn-lg my-3' target="_blank" rel="noreferrer">YTS</a>
                  <p className="card-text">{summary}</p>

                  <div className="d-flex flex-wrap justify-content-center gap-2">
                    {torrents.map(({ hash, url, quality }) => (
                      <a href={url} key={hash} className='btn btn-primary' rel="noreferrer" target="_blank">{quality}</a>
                    ))}
                  </div>
                </div>

              </div>
            )) : <div className='text-center py-5 my-5'>Movie not found</div>}
      </section>

      <ul className="pagination justify-content-center py-4">
        <li className="page-item">
          <button className="page-link" href="#" aria-label="Previous" onClick={(e) => handleChange("page", params.page - 1)} disabled={params.page <= 1 || loading}>
            <span aria-hidden="true">&laquo;</span>
          </button>
        </li>

        <li className="page-item active"><a className="page-link" href="#">{params.page}</a></li>

        <li className="page-item">
          <button className="page-link" href="#" aria-label="Next" onClick={(e) => handleChange("page", params.page + 1)} disabled={loading}>
            <span aria-hidden="true">&raquo;</span>
          </button>
        </li>
      </ul>

    </div>
  )
}

