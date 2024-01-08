FROM loadimpact/k6:latest
WORKDIR /scripts
COPY ./scripts/script.js .
CMD ["run", "./script.js","--vus","250","--duration","60m"]