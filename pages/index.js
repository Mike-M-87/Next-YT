import Head from 'next/head'
import Image from 'next/image'

// import {page,yturl} from '../lib/events.js'
let page = 1
let yturl = 'https://yts.mx/api/v2/list_movies.json?limit=10&sort_by=download_count&page=' + page


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
  const navigate = (val) => {
    if (val === 'next') {
      page = page + 1
    }
    if (val === 'prev' && page > 1) {
      page = page - 1
    }
    console.log(page)

  };
  return (
    <div className="container-fluid">
      <Head>
        <title>NEXT YT</title>
        <link rel="icon" href="https://yts.mx/assets/images/website/favicon.ico" />
      </Head>

      <div className="row p-3 align-items-center">
        <div className="col-11 h5">Good Morning, Pirate</div>
        <div className="col-1"><Image alt='profile' className="rounded-circle" src='/profile.jpg' width={100} height={100}></Image></div>
      </div>


      <section>
        {movies.map(({ id, title, url, summary, year, large_cover_image, rating, runtime, torrents }) => (
          <div className="card my-2 bg-dark" key={id}>

            <div data-bs-toggle="collapse" data-bs-target={"#desc" + id} className="row justify-content-evenly align-items-center p-2">
              <div className="col-sm-2 col-3"><Image alt='cover' src={large_cover_image} height={100} width={100}></Image></div>
              <h6 className="col-sm-8 col-6 card-title">{title}<br />{year}</h6>

              <div className="col-sm-2 col-3 d-flex flex-column align-items-center">
                <div className="row">
                  <div  className="col-5"><Image alt='imdb' src='/star.png' width={100} height={100}></Image></div>
                  <small className="col-7">{rating}</small>
                </div>
                <small className="my-2" >{Math.floor(runtime / 60) + " Hrs " + runtime % 60 + " Min"}</small>
              </div>
            </div>

            <div className="collapse card-body" id={"desc" + id}>
              <a href={url} className='btn btn-secondary m-3 p-3' target="_blank">YTS</a>
              <p className="card-text">{summary}</p>

              <div className="d-flex flex-wrap justify-content-center">
                {torrents.map(({ hash, url, quality }) => (
                  <a href={url} key={hash} className='btn btn-primary mx-1 my-1' target="_blank">{quality}</a>
                ))}
              </div>
            </div>

          </div>
        ))}
      </section>


      <ul className="list-group list-group-horizontal justify-content-center">
        <li className="list-group-item list-group-item-info"><a onClick={() => navigate('prev')}>Previous</a></li>
        <li className="list-group-item list-group-item-info"><a className="badge bg-primary">1</a></li>
        <li className="list-group-item list-group-item-info"><a onClick={() => navigate('next')}>Next</a></li>
      </ul>
      <a className="m-2 btn btn-primary float-end" href="#">Back to top</a>
    </div>

  )
}

