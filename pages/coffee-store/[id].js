import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router'
import React from 'react'
import cls from 'classnames';

import data from '../../data/coffee-stores.json'

import styles from '../../styles/coffee-store.module.css'

export function getStaticPaths() {
	return {
		paths: data.map(st => ({
			params: { id: st.id.toString() }
		})),
		fallback: true
	}
}

export function getStaticProps({ params }) {
	return {
		props: {
			coffeeStore: data.find(st => st.id.toString() === params.id)
		}
	}
}

function CoffeeStore(props) {
	const router = useRouter();
	if (router.isFallback) {
		return <div>Loading...</div>
	}
	const { address, name, neighbourhood, imgUrl } = props.coffeeStore;

	const handleUpvoteButton = () => {

	}

	return (
		<div className={styles.layout}>
			<Head>
				<title>{name}</title>
			</Head>

			<div className={styles.container}>
				<div className={styles.col1}>
					<div className={styles.backToHomeLink}>
						<Link href="/">Back to home page</Link>
					</div>

					<div className={styles.nameWrapper}>
						<h1 className={styles.name}>{name}</h1>
					</div>
					<Image src={imgUrl} width={600} height={360} className={styles.storeImg}
						alt={name}></Image>
				</div>

				<div className={cls("glass", styles.col2)}>
					<div className={styles.iconWrapper}>
						<Image src="/static/icons/places.svg" width="24" height="24" alt="icon" />
						<p className={styles.text}>{address}</p>
					</div>

					<div className={styles.iconWrapper}>
						<Image src="/static/icons/nearMe.svg" width="24" height="24" alt="icon" />
						<p className={styles.text}>{neighbourhood}</p>
					</div>

					<div className={styles.iconWrapper}>
						<Image src="/static/icons/star.svg" width="24" height="24" alt="icon" />
						<p className={styles.text}>1</p>
					</div>

					<button className={styles.upvoteButton} onClick={handleUpvoteButton}>
						Up vote!
					</button>
				</div>
			</div>

		</div>
	)
}

export default CoffeeStore