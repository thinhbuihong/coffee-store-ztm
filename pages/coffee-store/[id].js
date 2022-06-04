import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router'
import React from 'react'

import data from '../../data/coffee-stores.json'

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
	const { address, name, neighbourhood } = props.coffeeStore;

	return (
		<div>
			<Head>
				<title>{name}</title>
			</Head>

			<Link href="/">Back to home page</Link>

			<p>{address}</p>
			<p>{name}</p>
			<p>{neighbourhood}</p>
		</div>
	)
}

export default CoffeeStore