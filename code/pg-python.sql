CREATE OR REPLACE FUNCTION get_user_stats(user_id integer)
RETURNS json AS $$
    name_query = "SELECT name FROM users WHERE id = $1"
    name_plan = plpy.prepare(name_query, ['integer'])
    name = plpy.execute(name_plan, [user_id])[0]['name']
    
    # Get user's total orders
    orders_query = "SELECT COUNT(*) as count FROM orders WHERE user_id = $1"
    orders_plan = plpy.prepare(orders_query, ['integer'])
    order_count = plpy.execute(orders_plan, [user_id])[0]['count']
    
    return {'name': name, 'total_orders': order_count}
$$ LANGUAGE plpython3u;

-- Usage:
SELECT get_user_stats(123);
