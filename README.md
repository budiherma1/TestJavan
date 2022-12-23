- Make sure you have docker on your local machine
- This app contain 2 service: 
  - test_javan_be (DB included)
  - test_javan_fe

- Run docker for test_javan_be first then test_javan_fe
- Please follow the following step:
  - clone this repo
  ```bash
  git clone https://github.com/budiherma1/TestJavan.git
  ```
  - copy .env on each directory on this repo
  ```bash
  cp test_javan_be/.env.example test_javan_be/.env
  cp test_javan_fe/.env.example test_javan_fe/.env
  ```
  - run docker compose for BE
  ```bash
  cd test_javan_be && make docker-start
  ```
  - run migration and seeder (currrent directory: test_javan_be)
  ```bash
  make docker-migrate
  make docker-seed
  ```
  - run docker compose for FE
  ```bash
  cd test_javan_fe && make docker-start
  ```
  - Access the FE through http://localhost:8888/
  - Login using email: 'test@mail.com', pass: 12345