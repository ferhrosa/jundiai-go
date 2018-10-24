import { environment } from '../../environments/environment';

const root = `environments/${environment.firebaseEnvironment}/`;

export const collections = {
    places: `${root}places`,
};
