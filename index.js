// Enhanced JSON Processing Utility
function flattenObject(obj, prefix = '', options = { maxDepth: 100, ignoreNull: false }) {
  // Guard against circular references and max depth
  if (!obj || typeof obj !== 'object') return {};
  if (options.maxDepth <= 0) {
    throw new Error('Maximum depth exceeded. Possible circular reference.');
  }

  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];
    const pre = prefix.length ? `${prefix}_` : '';
    
    // Handle null values based on options
    if (value === null) {
      if (!options.ignoreNull) {
        acc[`${pre}${key}`] = null;
      }
      return acc;
    }
    
    // Handle different data types
    if (typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(
        acc, 
        flattenObject(value, `${pre}${key}`, { 
          ...options, 
          maxDepth: options.maxDepth - 1 
        })
      );
    } else if (Array.isArray(value)) {
      // Handle empty arrays
      if (value.length === 0) {
        acc[`${pre}${key}`] = [];
        return acc;
      }
      
      // Process array elements
      value.forEach((item, index) => {
        if (item === null) {
          if (!options.ignoreNull) {
            acc[`${pre}${key}_${index}`] = null;
          }
        } else if (typeof item === 'object') {
          Object.assign(
            acc, 
            flattenObject(item, `${pre}${key}_${index}`, {
              ...options,
              maxDepth: options.maxDepth - 1
            })
          );
        } else {
          acc[`${pre}${key}_${index}`] = item;
        }
      });
    } else {
      // Handle primitive values
      acc[`${pre}${key}`] = value;
    }
    
    return acc;
  }, {});
}

// Format data for database loading
function formatForDatabase(data) {
  const flattened = flattenObject(data);
  const headers = Object.keys(flattened);
  const values = Object.values(flattened).map(value => {
    if (value === null) return 'NULL';
    if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
    if (Array.isArray(value)) return `'${JSON.stringify(value)}'`;
    return value;
  });

  return {
    headers,
    values,
    headerString: headers.join(','),
    valueString: values.join(',')
  };
}

module.exports = { flattenObject, formatForDatabase };

// Example usage
if (require.main === module) {
  const sampleData = {
    id: 1,
    user: {
      name: 'John Doe',
      address: {
        street: '123 Main St',
        city: 'Boston',
        country: {
          code: 'US',
          name: 'United States'
        }
      },
      orders: [
        {
          orderId: 'A1',
          items: [
            { product: 'Book', price: 29.99 },
            { product: 'Pen', price: 5.99 }
          ]
        }
      ]
    }
  };

  const result = formatForDatabase(sampleData);
  console.log('Flattened Structure:');
  console.log(JSON.stringify(result, null, 2));
}