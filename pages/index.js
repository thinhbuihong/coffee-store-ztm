import Head from 'next/head'
import Image from 'next/image';
import Banner from '../components/banner'
import Card from '../components/card';
import styles from '../styles/Home.module.css'

import data from '../data/coffee-stores.json'

//prod: only server side
//dev: both server and client 
export async function getStaticProps(context) {
  return {
    props: {
      coffeeStores: data
    }
  }
}

export default function Home(props) {
  console.log("===", props);
  const handleOnBannerBtnClick = () => {
    console.log("hi banner button",);
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
      </Head>

      <main className={styles.main}>
        <Banner buttonText="View stores nearby"
          handleOnClick={handleOnBannerBtnClick} />
      </main>

      <div className={styles.heroImage}>
        <Image src="/static/hero-image.png" width={700} height={400} alt="hero-image" />
      </div>

      <div className={styles.cardLayout}>
        {
          props.coffeeStores.map(store => {
            return (<Card name={store.name}
              key={store.id}
              imgUrl={store.imgUrl}
              href={`/coffee-store/${store.id}`}
              className={styles.card}
            />)
          })
        }
      </div>
    </div>
  )
}
