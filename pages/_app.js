import '../styles/globals.css'
import webData from "../data.json";

export default function App({ Component, pageProps }) {
  return <Component {...pageProps } webData={webData} />
}
