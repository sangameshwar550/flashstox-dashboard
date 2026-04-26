const ENV = {
  dev: {
    BASE_URL: "http://localhost:8081",
  },
  prod: {
    BASE_URL: "https://flashstox-node-app-git-869534904643.asia-south1.run.app",
  },
};

const env = import.meta.env.DEV ? ENV.dev : ENV.prod;

export default env;
