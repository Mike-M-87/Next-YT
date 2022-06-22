import '../styles/globals.css'
import Head from "next/head";
import Script from 'next/script';
import { Toaster } from 'react-hot-toast';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"></link>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor" crossOrigin="anonymous"></link>
      <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.bundle.min.js" integrity="sha384-pprn3073KE6tl6bjs2QrFaJGz5/SUsLqktiwsUTF55Jfv3qYSDhgCecCxMW52nD2" crossOrigin="anonymous"></Script>
      <Script src="https://cdn.jsdelivr.net/npm/@webtor/embed-sdk-js/dist/index.min.js" charSet="utf-8" async></Script>

      <Toaster
        position="top-center"
        reverseOrder={false}
        containerStyle={{
          textTransform: 'capitalize',
        }}
        toastOptions={{
          duration: 1000,
          error: {
            style: {
              background: '#1c1c1c',
              color: '#5CD85A',
            },
            iconTheme: { primary: 'red', secondary: 'white' },
          },
          style: {
            background: '#5CD85A',
            borderRadius: '20px',
            color: '#000',
          },
          iconTheme: { primary: '#000', secondary: '#5CD85A' },
        }}
      />

      <Component {...pageProps} />
    </>
  );
}
export default MyApp;
