DO $$
DECLARE
    p_ids UUID[];
    u_ids UUID[];
    o_id UUID;
    p_id UUID;
    u_id UUID;
    p_price NUMERIC;
    v_total NUMERIC;
    i INT;
    j INT;
    status_list TEXT[] := ARRAY['completed', 'completed', 'completed', 'pending', 'processing', 'cancelled'];
    payment_methods TEXT[] := ARRAY['cod', 'banking', 'momo'];
BEGIN
    -- Get all Product IDs
    SELECT ARRAY_AGG(id) INTO p_ids FROM products;
    
    -- Get all Profile User IDs
    SELECT ARRAY_AGG(user_id) INTO u_ids FROM profiles;

    -- If no products, we can't create realistic orders
    IF p_ids IS NULL THEN
        RAISE NOTICE 'No products found. Skipping seed.';
        RETURN;
    END IF;

    -- Generate 30 Orders
    FOR i IN 1..30 LOOP
        -- Select random user (nullable)
        IF u_ids IS NOT NULL AND array_length(u_ids, 1) > 0 THEN
            u_id := u_ids[1 + floor(random() * array_length(u_ids, 1))::int];
        ELSE
            u_id := NULL;
        END IF;

        -- Create Order with placeholder total (will update later)
        INSERT INTO orders (
            shipping_name,
            shipping_address,
            shipping_phone,
            status,
            payment_method,
            user_id,
            total_amount,
            created_at
        ) VALUES (
            'Khách hàng ' || (floor(random() * 1000)::text),
            'Số ' || (floor(random() * 100)::text) || ' Đường Nguyễn Văn Cừ, TP.HCM',
            '09' || (10000000 + floor(random() * 89999999)::int)::text,
            status_list[1 + floor(random() * array_length(status_list, 1))::int],
            payment_methods[1 + floor(random() * array_length(payment_methods, 1))::int],
            u_id,
            0, -- Temporary
            NOW() - (random() * interval '60 days')
        ) RETURNING id INTO o_id;

        v_total := 0;

        -- Add 1-4 random items to the order
        FOR j IN 1..(1 + floor(random() * 4)::int) LOOP
            -- Pick random product
            p_id := p_ids[1 + floor(random() * array_length(p_ids, 1))::int];
            
            -- Get price (fallback to 100000 if not found)
            SELECT price INTO p_price FROM products WHERE id = p_id;
            
            -- Insert item
            INSERT INTO order_items (
                order_id,
                product_id,
                quantity,
                price
            ) VALUES (
                o_id,
                p_id,
                1 + floor(random() * 2)::int,
                p_price
            );
            
            v_total := v_total + (p_price * (1 + floor(random() * 2)::int));
        END LOOP;

        -- Update order total
        UPDATE orders SET total_amount = v_total WHERE id = o_id;

    END LOOP;
END $$;
