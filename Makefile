all:
	docker compose up --build

clean:
	docker compose down

fclean: clean
	docker system prune

.PHONY: all clean fclean
