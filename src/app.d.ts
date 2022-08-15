/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
	// interface Locals {}
	// interface Platform {}
	// interface Session {}
	// interface Stuff {}
}

export type TidePrediction = {
	type: 'HIGH' | 'LOW';
	time: string;
};

export type TideStation = {
	name: string;
	distance: number;
	predictions: [TidePrediction];
};

export type Coordinate = {
	lat: number;
	lon: number;
};
