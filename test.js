const { flattenObject, formatForDatabase } = require('./index');
const assert = require('assert').strict;

function runTests() {
  console.log('Running tests...\n');
  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`✅ ${name}`);
      passed++;
    } catch (err) {
      console.log(`❌ ${name}`);
      console.error(`   ${err.message}`);
      failed++;
    }
  }

  // Original test cases...
  
  // New test for complex genomic-social-product JSON
  test('Handles complex genomic-social-product JSON', () => {
    const complexInput = {
      "dataset_name": "GenomicSocialProductConfig",
      "version": "1.0",
      "metadata": {
        "created_by": "ComplexJSONGenerator",
        "creation_date": "2024-10-27T12:00:00Z",
        "description": "A highly complex JSON object combining genomic, social, product, and configuration data."
      },
      "genome_data": {
        "gene_sequences": [
          {
            "gene_id": "G0001",
            "sequence": "ATGCGTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTAGC",
            "variants": [
              {"variant_id": "V0001", "type": "SNP", "position": 10},
              {"variant_id": "V0002", "type": "Insertion", "sequence": "GATTACA"}
            ]
          },
          {
            "gene_id": "G0002",
            "sequence": "CGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCG",
            "expression_levels": {
              "tissue_1": 0.5,
              "tissue_2": 0.8
            }
          }
        ]
      },
      "social_network": {
        "users": [
          {
            "user_id": "U0001",
            "name": "Alice",
            "connections": [
              {"user_id": "U0002", "relationship": "friend"},
              {"user_id": "U0003", "relationship": "colleague"}
            ],
            "product_reviews": [
              {
                "product_id": "P0001",
                "rating": 4,
                "comment": "Great product!"
              }
            ]
          },
          {
            "user_id": "U0002",
            "name": "Bob"
          }
        ]
      },
      "product_catalog": {
        "products": [
          {
            "product_id": "P0001",
            "name": "Awesome Widget",
            "description": "A very useful widget.",
            "variants": [
              {"variant_id": "PV001", "color": "red", "size": "small"},
              {"variant_id": "PV002", "color": "blue", "size": "large"}
            ],
            "related_genes": ["G0001"]
          }
        ]
      },
      "system_configuration": {
        "database": {
          "host": "db.example.com",
          "port": 5432,
          "connection_pool": {
            "min_connections": 10,
            "max_connections": 100
          }
        },
        "api_endpoints": [
          {"name": "get_data", "url": "/data"},
          {"name": "process_data", "url": "/process"}
        ]
      }
    };

    const result = flattenObject(complexInput);
    
    // Test specific paths in the flattened structure
    assert.equal(result.dataset_name, "GenomicSocialProductConfig");
    assert.equal(result.metadata_created_by, "ComplexJSONGenerator");
    assert.equal(result.genome_data_gene_sequences_0_gene_id, "G0001");
    assert.equal(result.genome_data_gene_sequences_0_variants_0_variant_id, "V0001");
    assert.equal(result.social_network_users_0_name, "Alice");
    assert.equal(result.product_catalog_products_0_variants_0_color, "red");
    assert.equal(result.system_configuration_database_port, 5432);
    assert.equal(result.system_configuration_api_endpoints_0_name, "get_data");
    
    // Test database formatting
    const dbFormat = formatForDatabase(complexInput);
    assert.ok(dbFormat.headers.includes('dataset_name'));
    assert.ok(dbFormat.headers.includes('genome_data_gene_sequences_0_sequence'));
    assert.ok(dbFormat.headers.includes('social_network_users_0_product_reviews_0_comment'));
    
    // Log the flattened structure for inspection
    console.log('\nFlattened structure preview (first 5 keys):');
    const previewKeys = Object.keys(result).slice(0, 5);
    previewKeys.forEach(key => {
      console.log(`${key}: ${result[key]}`);
    });
  });

  // Run original test cases...
  test('Handles simple flat object', () => {
    const input = { a: 1, b: 'test' };
    const result = flattenObject(input);
    assert.deepEqual(result, { a: 1, b: 'test' });
  });

  test('Handles nested objects', () => {
    const input = { a: { b: { c: 1 } } };
    const result = flattenObject(input);
    assert.deepEqual(result, { 'a_b_c': 1 });
  });

  test('Handles arrays', () => {
    const input = { arr: [1, 2, { x: 'test' }] };
    const result = flattenObject(input);
    assert.deepEqual(result, { 
      'arr_0': 1, 
      'arr_1': 2, 
      'arr_2_x': 'test' 
    });
  });

  test('Handles null values', () => {
    const input = { a: null, b: { c: null } };
    const result = flattenObject(input);
    assert.deepEqual(result, { 'a': null, 'b_c': null });
  });

  test('Handles empty arrays', () => {
    const input = { arr: [] };
    const result = flattenObject(input);
    assert.deepEqual(result, { 'arr': [] });
  });

  // Summary
  console.log(`\nTest Summary:`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total: ${passed + failed}`);
}

runTests();