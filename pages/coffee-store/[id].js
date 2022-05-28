import Link from 'next/link';
import { useRouter } from 'next/router'
import React from 'react'

function CoffeeStore() {
	const router = useRouter();
	return (
		<div>
			CoffeeStore detail
			<Link href="/">Back to home page</Link>
		</div>
	)
}

export default CoffeeStore