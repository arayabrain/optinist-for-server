#
# optinist Makefile
#

############################## For Testing ##############################

define rm_unused_docker_containers
	docker ps -a --filter "status=exited" --filter "name=$(1)" --format "{{.ID}}" | xargs --no-run-if-empty docker rm
endef

PYTEST = poetry run pytest -s

.PHONY: test_run
test_run:
	# cleanup
	docker compose -f docker-compose.test.yml down
	docker compose -f docker-compose.test.yml rm -f
	@$(call rm_unused_docker_containers, test_studio)
	# build/run
	docker compose -f docker-compose.test.yml build test_studio
	docker compose -f docker-compose.test.yml build test_studio_frontend
	docker compose -f docker-compose.test.yml run test_studio $(PYTEST) -m "not heavier_processing"
	docker compose -f docker-compose.test.yml run test_studio_frontend

.PHONY: test_python
test_python:
	# cleanup
	docker compose -f docker-compose.test.yml down
	docker compose -f docker-compose.test.yml rm -f
	@$(call rm_unused_docker_containers, test_studio)
	# build/run
	docker compose -f docker-compose.test.yml build test_studio
	docker compose -f docker-compose.test.yml run test_studio

.PHONY: test_frontend
test_frontend:
	# cleanup
	docker compose -f docker-compose.test.yml down
	docker compose -f docker-compose.test.yml rm -f
	@$(call rm_unused_docker_containers, test_studio_frontend)
	# build/run
	docker compose -f docker-compose.test.yml build test_studio_frontend
	docker compose -f docker-compose.test.yml run test_studio_frontend

.PHONY: build_frontend
build_frontend:
	# cleanup
	docker compose -f docker-compose.build.yml down
	docker compose -f docker-compose.build.yml rm -f
	@$(call rm_unused_docker_containers, studio-build-fe)
	# build/run
	docker compose -f docker-compose.build.yml build studio-build-fe
	docker compose -f docker-compose.build.yml run studio-build-fe

.PHONY: docs
docs:
	rm -rf docs/_build/
	poetry install --with doc --no-root
	# sphinx-apidoc -f -o ./docs/_build/modules ./studio
	sphinx-autobuild -b html docs docs/_build --port 8001

.PHONY: dockerhub
dockerhub:
	docker build --rm -t oistncu/optinist:latest . --platform=linux/amd64
	docker push oistncu/optinist:latest

.PHONY: local_build
local_build:
	cd frontend && yarn install --ignore-scripts && yarn build
	poetry build

.PHONY: upload_testpypi
upload_testpypi:
	poetry publish -r testpypi

.PHONY: install_testpypi
install_testpypi:
	pip install --index-url https://test.pypi.org/simple/ --extra-index-url https://pypi.org/simple/ optinist
	pip show optinist

.PHONY: push_pypi
push_pypi:
	poetry publish

.PHONY: format
format:
	black studio *.py
	isort studio *.py
	flake8 studio *.py