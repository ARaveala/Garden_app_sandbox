FROM gcc:latest

WORKDIR /app

#install mariaDB
#RUN apt-get update && apt-get install -y mariadb-server mariadb-client

RUN apt-get update && apt-get install -y \
	libmariadb-dev \
	libmariadb-dev-compat \
	&& rm -rf /var/lib/apt/lists/*

COPY . .

RUN g++ -o user main.cpp -lmariadb

CMD ["./user"]