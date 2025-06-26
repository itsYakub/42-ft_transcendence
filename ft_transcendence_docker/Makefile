all: up

# create:
# 	mkdir -p data/db

up:
	docker compose -f srcs/docker-compose.yml down -v
	docker compose -f srcs/docker-compose.yml up -d --renew-anon-volumes --build --force-recreate
	
down:
	docker compose -f srcs/docker-compose.yml down

clean:
	rm -rf /nfs/homes/lwillis/goinfre/data
	docker system prune -a -f

fclean: down clean

re: fclean up

db:
	docker exec -t sqlite sqlite3

.PHONY: create up down clean fclean re
