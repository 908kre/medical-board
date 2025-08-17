init:
	docker compose build --parallel app
	@make install
	@make migrate
	@make down

update:
	@make install
	@make migrate

up:
	docker compose up -d web-console

up.storybook:
	docker compose up storybook

up.backend:
	docker compose up -d core-api worker watcher scheduler

up.frontend:
	docker compose up -d web-console

logs:
	docker compose logs -f

logs.backend:
	docker compose logs -f core-api worker watcher scheduler

logs.frontend:
	docker compose logs -f web-console

restart:
	docker compose restart

restart.backend:
	docker compose restart core-api worker watcher scheduler

restart.frontend:
	docker compose restart web-console

down:
	docker compose down --remove-orphans

down.backend:
	docker compose down --remove-orphans core-api worker watcher scheduler

down.frontend:
	docker compose down --remove-orphans web-console

down.storybook:
	docker compose down --remove-orphans storybook

ps:
	docker compose ps

down-v:
	docker compose down --remove-orphans --volumes

app:
	docker compose run --rm app bash

migrate:
	docker compose up -d db
	docker compose run --rm app wait-for-it db:3306 -- yarn workspace @md/infrastructure prisma migrate deploy

install:
	docker compose run --rm app yarn install --immutable
	docker compose run --rm app yarn generate

clean:
	docker compose run --rm app yarn clean

test:
	docker compose run --rm -T app yarn test

fmt:
	docker compose run --rm -T app yarn fmt
tsc:
	docker compose run --rm -T app yarn tsc
sql:
	docker compose exec db mysql -u user -ppassword pmng

PROFILE ?= pm-awsdev-terraform
SERVICE ?= core-api

ecs-bash:
	TASK_ID=$$(aws ecs list-tasks --cluster pmng --service-name pmng/$(SERVICE) --query 'taskArns[0]' --output text --profile $(PROFILE) --region ap-northeast-1); \
	aws ecs execute-command --cluster pmng --container pmng-$(SERVICE) --interactive --command "/bin/bash" --profile $$PROFILE --task $$TASK_ID --region ap-northeast-1

ecs-prod-bash:
	$(MAKE) ecs-bash PROFILE=pm-aws-terraform

ecs-dev-bash:
	$(MAKE) ecs-bash PROFILE=pm-awsdev-terraform

# mysql -h pmng-dev-mysql.ctgg4dtqh702.ap-northeast-1.rds.amazonaws.com -u root -p
create-root:
	docker compose run --rm app md terms-of-use create -k "PicoManager" -c "testContent"
	docker compose run --rm app md organization create-root
