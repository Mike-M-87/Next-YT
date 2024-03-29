/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ShareButton } from "../../components/shareButton";

export async function getServerSideProps({ params }) {
  let moviehash = null;
  let movie = null;

  try {
    const id = params.id;
    const response = await fetch(
      `https://yts.mx/api/v2/movie_details.json?movie_id=${id}&with_images=true&with_cast=true`
    );
    const result = await response.json();
    movie = result.data.movie;
    moviehash = movie.torrents.filter(
      (torrent) => torrent.quality === "720p"
    )[0].hash;
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      moviehash,
      movie,
    },
  };
}

export default function Watch({ moviehash, movie }) {
  const [trailer, setTrailer] = useState("");

  useEffect(() => {
    const myModalEl = document.getElementById("trailerModal");
    if (myModalEl) {
      myModalEl.addEventListener("hidden.bs.modal", (event) => {
        setTrailer("");
      });
    }
  }, [trailer]);

  return (
    <main className="container-fluid fh-100 overflow-auto bg-black text-light">
      {movie && moviehash && (
        <>
          <video
            controls
            src={`magnet:?xt=urn:btih:${moviehash}&dn=Sintel`}
            poster="https://via.placeholder.com/150/0000FF/808080"
            width="100%"
            data-title="Sintel"
          ></video>

          <Head>
            <meta charSet="UTF-8" />
            <meta
              content="width=device-width, initial-scale=1"
              name="viewport"
            />
            <meta name="theme-color" content="#5CD85A" />
            <meta name="color-scheme" content="light dark" />
            <meta
              property="og:title"
              content={movie.title + " ⭐" + movie.rating}
            />
            <meta property="og:description" content={movie.description_full} />
            <meta
              property="og:url"
              content={"https://next-yt.vercel.app/watch/" + movie.id}
            />
            <meta property="og:image" content={movie.large_cover_image} />
            <meta property="og:image:type" content="image/jpeg" />
            <meta property="og:image:width" content="400" />
            <meta property="og:image:height" content="300" />
            <meta property="og:image:alt" content={movie.title} />
            <title>{movie.title}</title>
            <link
              rel="icon"
              href="https://yts.mx/assets/images/website/favicon.ico"
            />
          </Head>

          <div className="vstack gap-4">
            <div className="hstack gap-3 align-items-center flex-wrap">
              <div>
                <img
                  className="rounded border border-5 border-success"
                  alt="cover"
                  src={movie.large_cover_image}
                  height={300}
                  width={200}
                />
              </div>
              <h4 className="flex-grow-1">
                {movie.title}
                <br />
                {movie.year}
              </h4>

              <div className="d-flex flex-column me-5">
                <div className="text-warning gap-2 hstack align-items-center">
                  <div>
                    <img
                      alt="rating"
                      src="/star.png"
                      width={20}
                      height={20}
                    ></img>
                  </div>
                  <span className="mt-2">{movie.rating}</span>
                </div>
                <span>
                  {Math.floor(movie.runtime / 60) +
                    " Hrs " +
                    (movie.runtime % 60) +
                    " Min"}
                </span>
              </div>
            </div>

            <div className="hstack flex-wrap gap-3 align-items-center">
              <Link href="/" passHref>
                <i className="cursor-pointer fs-1 text-success align-middle fas fa-solid fa-circle-chevron-left"></i>
              </Link>
              <a
                href={movie.url}
                className="btn btn-secondary"
                target="_blank"
                rel="noreferrer"
              >
                YTS
              </a>
              <a
                className="btn btn-secondary"
                data-bs-toggle="modal"
                data-bs-target="#trailerModal"
                onClick={(e) => setTrailer(movie.yt_trailer_code)}
              >
                Trailer
              </a>
              <ShareButton id={movie.id} title={movie.title} />
            </div>

            <p className="lead">{movie.description_full}</p>

            <div className="d-flex flex-wrap align-items-center justify-content-center gap-3 mb-5">
              {movie.torrents.map(({ hash, url, quality }) => (
                <a href={url} key={hash} className="btn btn-success">
                  {quality}
                </a>
              ))}
            </div>
          </div>

          <div
            className="modal fade"
            id="trailerModal"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="ratio ratio-16x9">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailer}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
