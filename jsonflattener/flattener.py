def flatten_object(obj, prefix='', options=None):
    if options is None:
        options = {'max_depth': 100, 'ignore_null': False}
    
    if not obj or not isinstance(obj, (dict, list)):
        return {}
    if options['max_depth'] <= 0:
        raise ValueError('Maximum depth exceeded. Possible circular reference.')
    
    result = {}
    
    if isinstance(obj, dict):
        for key, value in obj.items():
            pre = f"{prefix}_{key}" if prefix else key
            
            if value is None:
                if not options['ignore_null']:
                    result[pre] = None
                continue
                
            if isinstance(value, (dict, list)):
                result.update(
                    flatten_object(
                        value,
                        pre,
                        {'max_depth': options['max_depth'] - 1, 'ignore_null': options['ignore_null']}
                    )
                )
            else:
                result[pre] = value
                
    elif isinstance(obj, list):
        if not obj:
            result[prefix] = []
            return result
            
        for i, item in enumerate(obj):
            pre = f"{prefix}_{i}"
            
            if item is None:
                if not options['ignore_null']:
                    result[pre] = None
                continue
                
            if isinstance(item, (dict, list)):
                result.update(
                    flatten_object(
                        item,
                        pre,
                        {'max_depth': options['max_depth'] - 1, 'ignore_null': options['ignore_null']}
                    )
                )
            else:
                result[pre] = item
                
    return result

def format_for_database(data):
    """Format flattened data for database loading."""
    flattened = flatten_object(data)
    headers = list(flattened.keys())
    
    def format_value(value):
        if value is None:
            return 'NULL'
        if isinstance(value, str):
            return f"'{value.replace("'", "''")}'"
        if isinstance(value, (list, dict)):
            return f"'{str(value).replace("'", "''")}'"
        return str(value)
    
    values = [format_value(flattened[header]) for header in headers]
    
    return {
        'headers': headers,
        'values': values,
        'header_string': ','.join(headers),
        'value_string': ','.join(values)
    }