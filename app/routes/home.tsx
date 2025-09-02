import type {Route} from "./+types/home";
import {duffel} from "~/api/duffelClient";
import {Form} from "react-router";
import SearchResult from "~/feature/Flight/SearchResult";

export async function action({request}: Route.ActionArgs) {
    const formData = await request.formData();
    const adultPassengers = new Array(formData.adults).fill(undefined).map(() => ({type: "adult"}));
    const childPassengers = new Array(formData.children).fill(undefined).map(() => ({age: 10}));

    const result = await duffel.offerRequests.create({
        slices: [
            {
                origin: formData.get('origin'),
                destination: formData.get('destination'),
                departure_date: formData.get('departureDate')
            },
            {
                origin: formData.get('destination'),
                destination: formData.get('origin'),
                departure_date: formData.get('returnDate')
            }
        ],
        passengers: [...adultPassengers, ...childPassengers],
        cabin_class: formData.get('cabinClass'),
    });

    return {offers: result.data.offers};
}

export function meta({}: Route.MetaArgs) {
    return [
        {title: "Flight Search"},
        {name: "description", content: "Search for flights"},
    ];
}

export default function Home({actionData}: Route.ComponentProps) {
    const offers = actionData?.offers

    return (
        <>
            <Form className="w-full max-w-lg p-5" method="post">
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                               htmlFor="grid-origin">
                            From
                        </label>
                        <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                            id="grid-origin" name="origin" type="text"/>
                    </div>
                    <div className="w-full md:w-1/2 px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                               htmlFor="grid-last-name">
                            To
                        </label>
                        <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            id="grid-destination" name="destination" type="text"/>
                    </div>
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                               htmlFor="grid-departure-date">
                            Departing
                        </label>
                        <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                            id="grid-departure-date" name="departureDate" type="date"/>
                    </div>
                    <div className="w-full md:w-1/2 px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                               htmlFor="grid-return-date">
                            Returning
                        </label>
                        <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            id="grid-return-date" name="returnDate" type="date"/>
                    </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-2">
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                               htmlFor="grid-adults">
                            Adults
                        </label>
                        <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            id="grid-adults" name="adults" type="number" min={0} max={8} defaultValue={1}/>
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                               htmlFor="grid-children">
                            Children
                        </label>
                        <input
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            id="grid-children" name="children" type="number" min={0} max={8} defaultValue={0}/>
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                               htmlFor="grid-cabin-class">
                            Class
                        </label>
                        <div className="relative">
                            <select
                                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                id="grid-cabin-class" name="cabinClass" defaultValue="economy">
                                <option value="economy">Economy</option>
                                <option value="premium">Premium Economy</option>
                                <option value="business">Business</option>
                            </select>
                            <div
                                className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                     viewBox="0 0 20 20">
                                    <path
                                        d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Search</button>
            </Form>
            {offers ? (<div><h2 className="font-bold text-lg">Results</h2>
                <div>{offers.map(offer => <SearchResult key={offer.id} offer={offer} />)}</div>
            </div>) : null}
        </>
    );
}
