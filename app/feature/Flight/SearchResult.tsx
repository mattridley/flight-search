import type {Offer, OfferSliceSegment} from "@duffel/api/types";

interface Props {
    offer: Offer
}

export default function SearchResult({offer: { total_amount, total_currency, slices}}: Props) {
    const [outboundSlice, inboundSlice] = slices;

    return (
        <div className="max-w-full rounded overflow-hidden shadow-lg p-5 m-2">
            <div>{total_amount}{total_currency}</div>
            <div className="mt-2">
                <h3 className="font-semibold">Outbound</h3>
                <ol>
                    {outboundSlice.segments.map((segment) => (<Segment {...segment} key={segment.id} />))}
                </ol>
            </div>
            <div className="mt-2">
                <h3 className="font-semibold">Return</h3>
                <ol>
                    {inboundSlice.segments.map((segment) => (<Segment {...segment} key={segment.id} />))}
                </ol>
            </div>
        </div>
    );
}

function Segment({
                     origin,
                     destination,
                     departing_at,
                     arriving_at,
                     marketing_carrier,
                     marketing_carrier_flight_number
                 }: OfferSliceSegment) {
    return (
        <li>
            {origin.name} {departing_at} -&gt; {arriving_at} {destination.name} ({marketing_carrier.iata_code}{marketing_carrier_flight_number})
        </li>
    );
}