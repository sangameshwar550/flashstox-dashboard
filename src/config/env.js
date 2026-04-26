const ENV = {
  dev: {
    BASE_URL: "http://localhost:8081",
  },
  prod: {
    BASE_URL: "https://your-cloud-run-url.a.run.app",
  },
};

const env = import.meta.env.DEV ? ENV.dev : ENV.prod;

export default env;
