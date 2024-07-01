FROM node:14

# Set the working directory in the container
WORKDIR /client

# Copy package.json and package-lock.json
COPY package*.json ./

RUN npm cache clean --force

# Install the dependencies
RUN npm install

# Copy all the content of the client folder to the working directory in the container
COPY . .

# Command to run the React application
CMD ["npm", "start"]
