ARG NODE_IMAGE=node:20-alpine

FROM ${NODE_IMAGE} as BUILDER
WORKDIR /server
COPY ./ /server
ENV PATH="/usr/local/share/npm-global/bin:${PATH}"

FROM ${NODE_IMAGE} as DEVELOPER
WORKDIR /app
COPY --from=BUILDER /app /app
ENV PATH="/usr/local/share/npm-global/bin:${PATH}"
#RUN npm install --force && npm cache clean --force
