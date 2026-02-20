#include <iostream>
#include <mysql/mysql.h>
#include <cstdlib>

//int main() {
//	// Initialize MySQL connection
//	MYSQL *conn;
//	conn = mysql_init(NULL);
//	
//	// Connect to the database
//	if (mysql_real_connect(conn, "localhost", "root", "password", "testdb", 0, NULL, 0)) {
//		std::cout << "Connected to MySQL database successfully!" << std::endl;
//	} else {
//		std::cerr << "Failed to connect to MySQL database: " << mysql_error(conn) << std::endl;
//	}
//	mysql_close(conn);
//}

/**
 * @brief reference code for connecting to MySQL database and querying data 
*/
#include <iostream>
#include <mysql/mysql.h>
#include <cstdlib>

int main() {
    MYSQL *conn = mysql_init(nullptr);
    
    if (conn == nullptr) {
        std::cerr << "mysql_init() failed\n";
        return 1;
    }

    const char* host = std::getenv("DB_HOST");
    const char* user = std::getenv("DB_USER");
    const char* pass = std::getenv("DB_PASS");
    const char* db = std::getenv("DB_NAME");

    if (mysql_real_connect(conn, host, user, pass, db, 3306, nullptr, 0) == nullptr) {
        std::cerr << "mysql_real_connect() failed: " << mysql_error(conn) << "\n";
        mysql_close(conn);
        return 1;
    }

    std::cout << "Connected to database\n";

    // Query the data
    if (mysql_query(conn, "SELECT * FROM raw_harvest ORDER BY id DESC LIMIT 1")) {
        std::cerr << "SELECT failed: " << mysql_error(conn) << "\n";
        mysql_close(conn);
        return 1;
    }

    MYSQL_RES *result = mysql_store_result(conn);
    if (result == nullptr) {
        std::cerr << "mysql_store_result() failed\n";
        mysql_close(conn);
        return 1;
    }

    MYSQL_ROW row;
    while ((row = mysql_fetch_row(result))) {
        std::cout << "ID: " << row[0] << "\n";
        std::cout << "Source: " << row[1] << "\n";
        std::cout << "Plant: " << row[2] << "\n";
        std::cout << "Data Type: " << row[3] << "\n";
        std::cout << "JSON: " << row[4] << "\n";
        std::cout << "Timestamp: " << row[5] << "\n";
    }

    mysql_free_result(result);
    mysql_close(conn);

    return 0;
}
