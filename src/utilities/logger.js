
import * as Sentry from 'sentry-expo'


const start = () => {
    Sentry.init({
        dsn: "https://5f7b4a619f274176b0fd96c42366d515@o541240.ingest.sentry.io/5805068",
        enableInExpoDevelopment: true,
        debug: true,
    });
}

export default {start}
