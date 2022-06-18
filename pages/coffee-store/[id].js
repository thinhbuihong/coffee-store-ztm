import cls from 'classnames';
import Head from 'next/head';
import Image from 'next/image';
import { useContext, useEffect, useState } from "react";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { fetchCoffeeStores } from '../../lib/coffee-stores';
import { StoreContext } from "../../store/store-context";
import styles from '../../styles/coffee-store.module.css';
import { fetcher, isEmpty } from "../../utils";
import useSWR from "swr";

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

function CoffeeStore(initialProps) {
	const router = useRouter();
	const id = router.query.id;

	const [votingCount, setVotingCount] = useState(0);
	const [coffeeStore, setCoffeeStore] = useState(
		initialProps.coffeeStore || {}
	);
	const {
		state: { coffeeStores },
	} = useContext(StoreContext);

	const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

	const handleCreateCoffeeStore = async (coffeeStore) => {
		try {
			const { id, name, voting, imgUrl, neighbourhood, address } = coffeeStore;
			const response = await fetch("/api/createCoffeeStore", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id,
					name,
					voting: 0,
					imgUrl,
					neighbourhood: neighbourhood || "",
					address: address || "",
				}),
			});

			const dbCoffeeStore = await response.json();
		} catch (err) {
			console.error("Error creating coffee store", err);
		}
	};

	useEffect(() => {
		if (isEmpty(initialProps.coffeeStore)) {
			if (coffeeStores.length > 0) {
				const coffeeStoreFromContext = coffeeStores.find((coffeeStore) => {
					return coffeeStore.id.toString() === id;
				});

				if (coffeeStoreFromContext) {
					setCoffeeStore(coffeeStoreFromContext);
					handleCreateCoffeeStore(coffeeStoreFromContext);
				}
			}
		} else {
			// SSG
			handleCreateCoffeeStore(initialProps.coffeeStore);
		}
	}, [id, initialProps, initialProps.coffeeStore, coffeeStores]);

	useEffect(() => {
		if (data && data.length > 0) {
			console.log("data from SWR", data);
			setCoffeeStore(data[0]);
			setVotingCount(data[0].voting);
		}
	}, [data]);

	if (router.isFallback) {
		return <div>Loading...</div>
	}
	const { address, name, neighbourhood, imgUrl } = coffeeStore;

	const handleUpvoteButton = async () => {
		try {
			const response = await fetch("/api/favouriteCoffeeStoreById", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					id,
				}),
			});

			const dbCoffeeStore = await response.json();

			if (dbCoffeeStore && dbCoffeeStore.length > 0) {
				let count = votingCount + 1;
				setVotingCount(count);
			}
		} catch (err) {
			console.error("Error upvoting the coffee store", err);
		}
	};

	if (error) {
		return <div>Something went wrong retrieving coffee store page</div>;
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
						<p className={styles.text}>{votingCount}</p>
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