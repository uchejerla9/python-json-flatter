import unittest
from jsonflattener import flatten_object, format_for_database

class TestJSONFlattener(unittest.TestCase):
    def test_simple_object(self):
        input_data = {'a': 1, 'b': 'test'}
        result = flatten_object(input_data)
        self.assertEqual(result, {'a': 1, 'b': 'test'})
    
    def test_nested_object(self):
        input_data = {'a': {'b': {'c': 1}}}
        result = flatten_object(input_data)
        self.assertEqual(result, {'a_b_c': 1})
    
    def test_arrays(self):
        input_data = {'arr': [1, 2, {'x': 'test'}]}
        result = flatten_object(input_data)
        self.assertEqual(result, {
            'arr_0': 1,
            'arr_1': 2,
            'arr_2_x': 'test'
        })
    
    def test_complex_structure(self):
        input_data = {
            "dataset_name": "Test",
            "metadata": {
                "created_by": "Tester",
                "values": [1, 2, {"x": "test"}]
            }
        }
        result = flatten_object(input_data)
        self.assertEqual(result['dataset_name'], "Test")
        self.assertEqual(result['metadata_created_by'], "Tester")
        self.assertEqual(result['metadata_values_2_x'], "test")
    
    def test_database_format(self):
        input_data = {'a': 1, 'b': "test's"}
        result = format_for_database(input_data)
        self.assertIn('a', result['headers'])
        self.assertIn('b', result['headers'])
        self.assertIn("'test''s'", result['value_string'])

if __name__ == '__main__':
    unittest.main()