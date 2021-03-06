#!/bin/bash

# If any of this commands fail, stop script.
set -e

# Install AWS CLI
pip install --user awscli

# # Install AWS ECS CLI
sudo curl -o /usr/local/bin/ecs-cli https://s3.amazonaws.com/amazon-ecs-cli/ecs-cli-linux-amd64-latest
sudo chmod +x /usr/local/bin/ecs-cli


# Set AWS access keys.
# This is required so that both aws-cli and ecs-cli can access you account
# programmatically. You should have both AWS_ACCESS_KEY_ID and
# AWS_SECRET_ACCESS_KEY from when we created the admin user.
# AWS_DEFAULT_REGION is the code for the aws region you chose, e.g., eu-west-2.
AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
AWS_DEFAULT_REGION=$AWS_DEFAULT_REGION

# Set AWS ECS vars.
# Here you only need to set AWS_ECS_URL. I have created the others so that
# it's easy to change for a different project. AWS_ECS_URL should be the
# base url.
# use sematic versioning instead of latest
DOCKER_TAG_ID=$(git log -1 --pretty=%h)

AWS_ECS_URL=$AWS_ECS_URL
AWS_ECS_PROJECT_NAME=$AWS_ECS_PROJECT_NAME
AWS_ECS_CONTAINER_NAME=$AWS_ECS_CONTAINER_NAME
AWS_ECS_DOCKER_IMAGE=$AWS_ECS_DOCKER_IMAGE
AWS_ECS_CLUSTER_NAME=$AWS_ECS_CLUSTER_NAME
AWS_ECS_INSTANCE_TAG_NAME=$AWS_ECS_INSTANCE_TAG_NAME

AWS_S3_BUCKET=$AWS_S3_BUCKET

# Set Build args.
# These are the build arguments we used before.
# Note that the DATABASE_URL needs to be set.
POSTGRES_DB_URL=$POSTGRES_DB_URL
POSTGRES_DB_POOL_SIZE=$POSTGRES_DB_POOL_SIZE

PHOENIX_SECRET_KEY_BASE=$PHOENIX_SECRET_KEY_BASE

FIREBASE_SECRET_PEM_FILE_PATH=$FIREBASE_SECRET_PEM_FILE_PATH
FIREBASE_SERVICE_ACCOUNT_EMAIL=$FIREBASE_SERVICE_ACCOUNT_EMAIL
# Set runtime ENV.
# These are the runtime environment variables.
# Note that HOST needs to be set.
HOST=$HOST 
CONTAINER_PORT=$CONTAINER_PORT
HOST_PORT=$HOST_PORT
APP_NAME=$APP_NAME
NODE_COOKIE=$NODE_COOKIE




# Build container.
# As we did before, but now we are going to build the Docker image that will
# be pushed to the repository.
docker build -t $AWS_ECS_CONTAINER_NAME \
  --build-arg AWS_S3_BUCKET=$AWS_S3_BUCKET \
  --build-arg AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
  --build-arg AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
  --build-arg AWS_DEFAULT_REGION=$AWS_DEFAULT_REGION \
  --build-arg PHOENIX_SECRET_KEY_BASE=$PHOENIX_SECRET_KEY_BASE \
  --build-arg POSTGRES_DB_URL=$POSTGRES_DB_URL \
  --build-arg POSTGRES_DB_POOL_SIZE=$POSTGRES_DB_POOL_SIZE \
  --build-arg HOST=$HOST \
  --build-arg PORT=$CONTAINER_PORT \
  --build-arg FIREBASE_SECRET_PEM_FILE_PATH=$FIREBASE_SECRET_PEM_FILE_PATH \
  --build-arg FIREBASE_SERVICE_ACCOUNT_EMAIL=$FIREBASE_SERVICE_ACCOUNT_EMAIL \
  --build-arg APP_NAME=$APP_NAME \
  --build-arg NODE_COOKIE=$NODE_COOKIE \
  .

# # Tag the new Docker image as latest on the ECS Repository.
docker tag $AWS_ECS_DOCKER_IMAGE "$AWS_ECS_URL"/"$AWS_ECS_DOCKER_IMAGE":"$DOCKER_TAG_ID"


# Login to ECS Repository.
eval $(aws ecr get-login --no-include-email --region $AWS_DEFAULT_REGION)

# Upload the Docker image to the ECS Repository.
docker push "$AWS_ECS_URL"/"$AWS_ECS_DOCKER_IMAGE":"$DOCKER_TAG_ID"

# Configure ECS cluster and AWS_DEFAULT_REGION so we don't have to send it
# on every command

ecs-cli configure --cluster=$AWS_ECS_CLUSTER_NAME --region=$AWS_DEFAULT_REGION


# Build docker-compose.yml with our configuration.
# Here we are going to replace the docker-compose.yml placeholders with
# our app's configurations
handle_quote_meta() {
  echo $1 | perl -lne 'print quotemeta()'
}

sed -e 's/$AWS_ECS_URL/'$AWS_ECS_URL'/g' \
  -e 's/$AWS_S3_BUCKET/'$(handle_quote_meta $AWS_S3_BUCKET)'/g' \
  -e 's/$AWS_SECRET_ACCESS_KEY/'$(handle_quote_meta $AWS_SECRET_ACCESS_KEY)'/g' \
  -e 's/$AWS_ACCESS_KEY_ID/'$(handle_quote_meta $AWS_ACCESS_KEY_ID)'/g' \
  -e 's/$AWS_ECS_DOCKER_IMAGE/'$AWS_ECS_DOCKER_IMAGE':'$DOCKER_TAG_ID'/g' \
  -e 's/$AWS_ECS_CONTAINER_NAME/'$AWS_ECS_CONTAINER_NAME'/g' \
  -e 's/$AWS_ECS_CLUSTER_NAME/'$AWS_ECS_CLUSTER_NAME'/g' \
  -e 's/$AWS_DEFAULT_REGION/'$AWS_DEFAULT_REGION'/g' \
  -e 's/$AWS_ECS_INSTANCE_TAG_NAME/'$AWS_ECS_INSTANCE_TAG_NAME'/g' \
  -e 's/$POSTGRES_DB_URL/'$(handle_quote_meta $POSTGRES_DB_URL)'/g' \
  -e 's/$HOST_PORT/'$HOST_PORT'/g' \
  -e 's/$CONTAINER_PORT/'$CONTAINER_PORT'/g' \
  -e 's/$HOST/'$HOST'/g' \
  -e 's/$FIREBASE_SECRET_PEM_FILE_PATH/'$(handle_quote_meta $FIREBASE_SECRET_PEM_FILE_PATH)'/g' \
  -e 's/$PHOENIX_SECRET_KEY_BASE/'$(handle_quote_meta $PHOENIX_SECRET_KEY_BASE)'/g' \
  -e 's/$FIREBASE_SERVICE_ACCOUNT_EMAIL/'$(handle_quote_meta $FIREBASE_SERVICE_ACCOUNT_EMAIL)'/g' \
  -e 's/$APP_NAME/'$APP_NAME'/g' \
  -e 's/$NODE_COOKIE/'$NODE_COOKIE'/g' \
  config/ci/docker-compose.yml.original \
  > config/ci/docker-compose.yml




# Deregister old task definition.
# Every deploy we want a new task definition to be created with the latest
# configurations. Task definitions are a set of configurations that state
# how the Docker container should run and what resources to use: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html
REVISION=$(aws ecs list-task-definitions --region $AWS_DEFAULT_REGION | jq '.taskDefinitionArns[]' | tr -d '"' | tail -1 | rev | cut -d':' -f 1 | rev)
if [ ! -z "$REVISION" ]; then
  aws ecs deregister-task-definition \
    --region $AWS_DEFAULT_REGION \
    --task-definition $AWS_ECS_PROJECT_NAME:$REVISION \
    >> /dev/null

  # Stop current task that is running ou application.
  # This is what will stop the application.
  ecs-cli compose \
    --file config/ci/docker-compose.yml \
    --project-name "$AWS_ECS_PROJECT_NAME" \
    service stop
fi

# https://docs.docker.com/docker-cloud/migration/cloud-to-aws-ecs/#db-service
# Start new task which will create fresh new task definition as well.
# This is what brings the application up with the new changes and configurations.
ecs-cli compose --verbose\
  --file config/ci/docker-compose.yml \
  --project-name "$AWS_ECS_PROJECT_NAME" \
  service up —force-deployment --timeout 10


