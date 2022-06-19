import Head from 'next/head'
import Image from 'next/image';
import Banner from '../components/banner'
import Card from '../components/card';
import styles from '../styles/Home.module.css'
import { ACTION_TYPES, StoreContext } from "../store/store-context";

import { fetchCoffeeStores } from '../lib/coffee-stores';
import useTrackLocation from '../hooks/use-track-location';
import { useEffect, useState, useContext } from 'react';

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

export default function Home(props) {
  const { handleTrackLocation, locationErrorMsg, isFindingLocation } = useTrackLocation()
  // const [coffeeStores, setCoffeeStores] = useState("");
  const [coffeeStoresError, setCoffeeStoresError] = useState(null);

  const { dispatch, state } = useContext(StoreContext);

  const { coffeeStores, latLong } = state;

  console.log("", { latLong, coffeeStores });

  useEffect(() => {
    (async () => {
      if (latLong) {
        try {
          const response = await fetch(
            `/api/getCoffeeStoresByLocation?latLong=${latLong}&limit=10`
          );
          const coffeeStores = await response.json();
          // setCoffeeStores(fetchedCoffeeStores)
          console.log("fetc", { coffeeStores });

          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: {
              coffeeStores,
            },
          });
          setCoffeeStoresError("");
        } catch (err) {
          setCoffeeStoresError(err.message)
          console.log("err", err);
        }
      }
    })()
  }, [latLong])

  const handleOnBannerBtnClick = () => {
    console.log("hi banner button",);
    handleTrackLocation()
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <meta
          name="description"
          content="allows you to discover coffee stores"
        />
      </Head>

      <main className={styles.main}>
        <Banner buttonText={isFindingLocation ? "Locating..." : "View stores nearby"}
          handleOnClick={handleOnBannerBtnClick} />

        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
        {coffeeStoresError && <p>Something went wrong: {coffeeStoresError}</p>}
      </main>

      <div className={styles.heroImage}>
        <Image src="/static/hero-image.png" width={700} height={400} alt="hero-image" />
      </div>


      {coffeeStores.length > 0 && (
        <div className={styles.sectionWrapper}>
          <h2 className={styles.heading2}>Stores near me</h2>
          <div className={styles.cardLayout}>
            {coffeeStores.map((coffeeStore) => {
              return (
                <Card
                  key={coffeeStore.id}
                  name={coffeeStore.name}
                  imgUrl={
                    coffeeStore.imgUrl ||
                    "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                  }
                  href={`/coffee-store/${coffeeStore.id}`}
                />
              );
            })}
          </div>
        </div>
      )}

      {props.coffeeStores.length > 0 && (
        <div className={styles.sectionWrapper}>
          <h2 className={styles.heading2}>Toronto stores</h2>
          <div className={styles.cardLayout}>
            {props.coffeeStores.map((coffeeStore) => {
              return (
                <Card
                  key={coffeeStore.id}
                  name={coffeeStore.name}
                  imgUrl={
                    coffeeStore.imgUrl ||
                    "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                  }
                  href={`/coffee-store/${coffeeStore.id}`}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  )
}
