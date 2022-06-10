import Head from 'next/head'
import Image from 'next/image';
import Banner from '../components/banner'
import Card from '../components/card';
import styles from '../styles/Home.module.css'

import data from '../data/coffee-stores.json'
import { fetchCoffeeStores } from '../lib/coffee-stores';
import useTrackLocation from '../hooks/use-track-location';

//prod: only server side
//dev: both server and client 
export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores();
  return {
    props: {
      coffeeStores
    }
  }
}

export default function Home({ coffeeStores }) {
  const { handleTrackLocation, latLong, locationErrorMsg, isFindingLocation } = useTrackLocation()

  console.log("", { latLong, locationErrorMsg });

  const handleOnBannerBtnClick = () => {
    console.log("hi banner button",);
    handleTrackLocation()
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
      </Head>

      <main className={styles.main}>
        <Banner buttonText={isFindingLocation ? "Locating..." : "View stores nearby"}
          handleOnClick={handleOnBannerBtnClick} />

        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
        {/* {coffeeStoresError && <p>Something went wrong: {coffeeStoresError}</p>} */}
      </main>

      <div className={styles.heroImage}>
        <Image src="/static/hero-image.png" width={700} height={400} alt="hero-image" />
      </div>

      {coffeeStores.length > 0 &&
        <div className={styles.sectionWrapper}>
          <h2 className={styles.heading2}>Toronto Stores</h2>

          <div className={styles.cardLayout}>
            {
              coffeeStores.map(store => {
                return (<Card name={store.name}
                  key={store.id}
                  imgUrl={store.imgUrl || '/static/hero-image.png'}
                  href={`/coffee-store/${store.id}`}
                  className={styles.card}
                />)
              })
            }
          </div>
        </div>}
    </div>
  )
}
