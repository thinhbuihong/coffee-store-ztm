import cls from 'classnames';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import data from '../../data/coffee-stores.json';
import { fetchCoffeeStores } from '../../lib/coffee-stores';
import styles from '../../styles/coffee-store.module.css';

export async function getStaticPaths() {
	const coffeeStores = await fetchCoffeeStores();
	const paths = coffeeStores.map((coffeeStore) => ({
		params: {
			id: coffeeStore.id.toString(),
		},
	}));
	return {
		paths,
		fallback: true,
	};
}

export async function getStaticProps({ params }) {
	const coffeeStores = await fetchCoffeeStores();
	const findCoffeeStoreById = coffeeStores.find((coffeeStore) => coffeeStore.id.toString() === params.id);

	return {
		props: {
			coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
		},
	};
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
						<Link href="/">← Back to home page</Link>
					</div>

					<div className={styles.nameWrapper}>
						<h1 className={styles.name}>{name}</h1>
					</div>
					<Image src={imgUrl || '/static/hero-image.png'} width={600} height={360} className={styles.storeImg}
						alt={name}></Image>
				</div>

				<div className={cls("glass", styles.col2)}>
					<div className={styles.iconWrapper}>
						<Image src="/static/icons/places.svg" width="24" height="24" alt="icon" />
						<p className={styles.text}>{address}</p>
					</div>


					{neighbourhood && <div className={styles.iconWrapper}>
						<Image src="/static/icons/nearMe.svg" width="24" height="24" alt="icon" />
						<p className={styles.text}>{neighbourhood}</p>
					</div>}

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