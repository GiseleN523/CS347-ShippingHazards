# We don't want to start from scratch.
# That is why we tell node here to use the current node image as base.
FROM node:22.1.0-bullseye-slim


# The /app directory should act as the main application directory
WORKDIR /app

# Copy the app package and package-lock.json file
COPY package*.json ./

# We copy everything in the current directory on our machine 
# ... into the working directory in the container 
# (In particular, this includes app.py)
COPY . .

# Install node packages
RUN npm install

# Build the app
RUN npm run build

# We want port 5555 (Flask will be using this port) to be used outside the containe
EXPOSE 8000


# Start the app
CMD [ "npm", "start" ]