import Head from 'next/head'
import Banner from '../components/banner'
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

      <footer className={styles.footer}>

      </footer>
    </div>
  )
}
