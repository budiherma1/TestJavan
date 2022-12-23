#ganti compose file sesuai environment
compose-file = docker-compose-dev.yml
docker-start:
	docker-compose -f $(compose-file) up -d
docker-start-watch:
	docker-compose -f $(compose-file) up
docker-build:
	docker-compose -f $(compose-file) up --build --remove-orphans --force-recreate
docker-deploy:
	docker-compose -f $(compose-file) up --build --remove-orphans --force-recreate -d
docker-stop:
	docker-compose -f $(compose-file) stop
docker-down:
	docker-compose -f $(compose-file) down
docker-migrate:
	docker-compose -f $(compose-file) exec javan_be npm run migrate:up
docker-rollback:
	docker-compose -f $(compose-file) exec javan_be npm run migrate:down
docker-seed:
	docker-compose -f $(compose-file) exec javan_be npm run seed:run