import {Duffel} from '@duffel/api'
import {envServer} from "~/env.server";

export const duffel = new Duffel({
    token: envServer.DUFFEL_API_KEY,
});