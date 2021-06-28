
import * as Sentry from 'sentry-expo'


const start = () => {
    Sentry.init({
        dsn: "https://b47616e1c7ed43d482ad72435fd9ed78@o834784.ingest.sentry.io/5813079",
        enableInExpoDevelopment: true,
        debug: true,
    });
}

export default {start}
