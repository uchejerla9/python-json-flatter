# JSONFlattener

A Python library for flattening complex JSON structures and preparing them for database loading.

## Installation

```bash
pip install jsonflattener
```

## Usage

```python
from jsonflattener import flatten_object, format_for_database

# Flatten a complex JSON structure
data = {
    "user": {
        "name": "John",
        "address": {
            "city": "New York",
            "zip": "10001"
        }
    }
}

flattened = flatten_object(data)
# Result: {
#     'user_name': 'John',
#     'user_address_city': 'New York',
#     'user_address_zip': '10001'
# }

# Format for database loading
db_format = format_for_database(data)
# Returns headers and values ready for database insertion
```

## Features

- Flattens nested JSON structures
- Handles arrays and nested objects
- Formats data for database loading
- Configurable max depth and null handling
- Safe string escaping for SQL

## License

MIT License