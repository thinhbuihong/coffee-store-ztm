import Head from 'next/head'
import Image from 'next/image';
import Banner from '../components/banner'
import Card from '../components/card';
import styles from '../styles/Home.module.css'

export default function Home() {
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

      <Card name="darkhorse coffe" imgUrl="/static/hero-image.png"
        href="/coffee-store/darkhorse-coffee"
      />
    </div>
  )
}
