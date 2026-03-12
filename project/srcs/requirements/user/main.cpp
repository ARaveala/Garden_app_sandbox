#include <iostream>
#include <mysql/mysql.h>
#include <cstdlib>
#include <string>
#include <iomanip>

/**
 * @brief Pretty prints a JSON string with proper indentation and formatting to console.
 * Handles nested objects and arrays, and ensures that string values are not affected by formatting.
 * 
 * Pretty loging does something similiar, this may become redundant, but it is useful for debugging and development to have a simple way to visualize the JSON data in the console without needing to rely on external tools or libraries.
 * 
 * @param json object to be pretty printed
 */
void printPrettyJSON(const std::string& json) {
    int indent = 0;
    bool inString = false;
    
    for (size_t i = 0; i < json.length(); i++) {
        char c = json[i];
        
        // Track if we're inside a string
        if (c == '"' && (i == 0 || json[i-1] != '\\')) {
            inString = !inString;
        }
        
        if (!inString) {
            if (c == '{' || c == '[') {
                std::cout << c << "\n" << std::string(++indent * 2, ' ');
            } else if (c == '}' || c == ']') {
                std::cout << "\n" << std::string(--indent * 2, ' ') << c;
            } else if (c == ',') {
                std::cout << c << "\n" << std::string(indent * 2, ' ');
            } else if (c == ':') {
                std::cout << c << " ";
            } else if (c != ' ' && c != '\n' && c != '\r' && c != '\t') {
                std::cout << c;
            }
        } else {
            std::cout << c;
        }
    }
    std::cout << "\n";
}

/**
 * @brief Main function to connect to MySQL database and retrieve raw_harvest data
 * 
 * This main is a placeholder for testing the database connection and retrieval of data from the raw_harvest table.
 * It connects to the database using credentials from environment variables, executes a query to get the most recent record,
 * and prints the results to the console.
 * 
 * User in the future will likley not interact with the databse directly, instead it will feed the data into the calculation pipeline, and recieve clean output.
 * This is useful for testing and debugging the database connection and data retrieval during development.
 * 
 * The JSON data is printed in a pretty format for easier readability during development and debugging.
 * 
 * @return int Exit status of the program 0 SUCCESS, 1 FAILURE
 */

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
       // printPrettyJSON(row[4]);
        std::cout << "Timestamp: " << row[5] << "\n";
    }

    mysql_free_result(result);
    mysql_close(conn);

    return 0;
}
