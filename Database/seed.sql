-- ============================================================
-- SFITS DBMS - Seed Data (Real Indian Startup Ecosystem)
-- Run AFTER schema.sql:  mysql -u root -p SFITS_DBMS_PRJ < seed.sql
-- ============================================================

USE SFITS_DBMS_PRJ;

-- 1. USERS

INSERT IGNORE INTO
    USERS (
        user_id,
        username,
        email,
        password,
        role
    )
VALUES (
        1,
        'Vaishnavi Karve',
        'vaishnavi@gmail.com',
        'pass123',
        'founder'
    ),
    (
        2,
        'Tejal Udgave',
        'tejal@gmail.com',
        'pass123',
        'founder'
    ),
    (
        3,
        'Trupti Mete',
        'trupti@gmail.com',
        'pass123',
        'investor'
    ),
    (
        4,
        'Rohit Singh',
        'rohit@gmail.com',
        'pass123',
        'investor'
    ),
    (
        5,
        'Deepinder Goyal',
        'deepinder@gmail.com',
        'pass123',
        'founder'
    ),
    (
        6,
        'Harshil Mathur',
        'harshil@gmail.com',
        'pass123',
        'founder'
    ),
    (
        7,
        'Kunal Shah',
        'kunal@gmail.com',
        'pass123',
        'founder'
    ),
    (
        8,
        'Nithin Kamath',
        'nithin@gmail.com',
        'pass123',
        'founder'
    ),
    (
        9,
        'Anupam Mittal',
        'anupam@gmail.com',
        'pass123',
        'investor'
    ),
    (
        10,
        'Namita Thapar',
        'namita@gmail.com',
        'pass123',
        'investor'
    );

-- ──────────────────────────────────────────────
-- 2. INDUSTRIES
-- ──────────────────────────────────────────────
-- Seed industries
INSERT IGNORE INTO INDUSTRY VALUES ('I001', 'FinTech');

INSERT IGNORE INTO INDUSTRY VALUES ('I002', 'HealthTech');

INSERT IGNORE INTO INDUSTRY VALUES ('I003', 'EdTech');

INSERT IGNORE INTO INDUSTRY VALUES ('I004', 'E-Commerce');

INSERT IGNORE INTO INDUSTRY VALUES ('I005', 'FoodTech');

INSERT IGNORE INTO INDUSTRY VALUES ('I006', 'Logistics');

INSERT IGNORE INTO INDUSTRY VALUES ('I007', 'AgriTech');

INSERT IGNORE INTO INDUSTRY VALUES ('I008', 'Mobility');

INSERT IGNORE INTO INDUSTRY VALUES ('I009', 'Beauty & Fashion');

INSERT IGNORE INTO INDUSTRY VALUES ('I010', 'SaaS');

INSERT IGNORE INTO INDUSTRY VALUES ('I011', 'Gaming');

INSERT IGNORE INTO INDUSTRY VALUES ('I012', 'Social Media');

-- ──────────────────────────────────────────────
-- 3. STARTUPS (Famous Indian Startups - Real Data)
-- ──────────────────────────────────────────────
INSERT IGNORE INTO
    STARTUP
VALUES
    -- FinTech
    (
        'S001',
        'Razorpay',
        2014,
        'Series C',
        'Bangalore',
        'Karnataka',
        'India',
        'I001'
    ),
    (
        'S002',
        'CRED',
        2018,
        'Series C',
        'Bangalore',
        'Karnataka',
        'India',
        'I001'
    ),
    (
        'S003',
        'Zerodha',
        2010,
        'Seed',
        'Bangalore',
        'Karnataka',
        'India',
        'I001'
    ),
    (
        'S004',
        'PhonePe',
        2015,
        'Series C',
        'Bangalore',
        'Karnataka',
        'India',
        'I001'
    ),

-- FoodTech
(
    'S005',
    'Zomato',
    2008,
    'Series C',
    'Gurugram',
    'Haryana',
    'India',
    'I005'
),
(
    'S006',
    'Swiggy',
    2014,
    'Series C',
    'Bangalore',
    'Karnataka',
    'India',
    'I005'
),

-- E-Commerce
(
    'S007',
    'Flipkart',
    2007,
    'Series C',
    'Bangalore',
    'Karnataka',
    'India',
    'I004'
),
(
    'S008',
    'Nykaa',
    2012,
    'Series C',
    'Mumbai',
    'Maharashtra',
    'India',
    'I009'
),
(
    'S009',
    'Meesho',
    2015,
    'Series C',
    'Bangalore',
    'Karnataka',
    'India',
    'I004'
),

-- Mobility
(
    'S010',
    'Ola',
    2010,
    'Series C',
    'Bangalore',
    'Karnataka',
    'India',
    'I008'
),

-- HealthTech
(
    'S011',
    'PharmEasy',
    2015,
    'Series C',
    'Mumbai',
    'Maharashtra',
    'India',
    'I002'
),
(
    'S012',
    'Practo',
    2008,
    'Series B',
    'Bangalore',
    'Karnataka',
    'India',
    'I002'
),

-- EdTech
(
    'S013',
    'BYJU\'S',
    2011,
    'Series C',
    'Bangalore',
    'Karnataka',
    'India',
    'I003'
),
(
    'S014',
    'Unacademy',
    2015,
    'Series C',
    'Bangalore',
    'Karnataka',
    'India',
    'I003'
),

-- Your custom startups
(
    'S015',
    'QuickPay',
    2023,
    'Seed',
    'Mumbai',
    'Maharashtra',
    'India',
    'I001'
),
(
    'S016',
    'MedAssist',
    2024,
    'Pre-Seed',
    'Pune',
    'Maharashtra',
    'India',
    'I002'
);

-- ──────────────────────────────────────────────
-- 4. FOUNDERS (Real Founders of Real Startups)
-- ──────────────────────────────────────────────
INSERT IGNORE INTO
    FOUNDER
VALUES
    -- Zomato
    (
        'F001',
        'Deepinder Goyal',
        'deepinder@gmail.com',
        'CEO & Founder',
        51.00,
        'S005',
        5
    ),

-- Razorpay
(
    'F002',
    'Harshil Mathur',
    'harshil@gmail.com',
    'CEO & Co-Founder',
    30.00,
    'S001',
    6
),
(
    'F003',
    'Shashank Kumar',
    'shashank@gmail.com',
    'CTO & Co-Founder',
    30.00,
    'S001',
    NULL
),

-- CRED
(
    'F004',
    'Kunal Shah',
    'kunal@gmail.com',
    'Founder & CEO',
    12.00,
    'S002',
    7
),

-- Ola
(
    'F005',
    'Bhavish Aggarwal',
    'bhavish@gmail.com',
    'CEO & Co-Founder',
    35.00,
    'S010',
    NULL
),
(
    'F006',
    'Ankit Bhati',
    'ankit.bhati@gmail.com',
    'CTO & Co-Founder',
    10.00,
    'S010',
    NULL
),

-- Zerodha
(
    'F007',
    'Nithin Kamath',
    'nithin@gmail.com',
    'CEO & Co-Founder',
    50.00,
    'S003',
    8
),
(
    'F008',
    'Nikhil Kamath',
    'nikhil@gmail.com',
    'Co-Founder',
    50.00,
    'S003',
    NULL
),

-- Nykaa
(
    'F009',
    'Falguni Nayar',
    'falguni@gmail.com',
    'Founder & CEO',
    53.50,
    'S008',
    NULL
),

-- Swiggy
(
    'F010',
    'Sriharsha Majety',
    'sriharsha@gmail.com',
    'CEO & Co-Founder',
    25.00,
    'S006',
    NULL
),
(
    'F011',
    'Nandan Reddy',
    'nandan@gmail.com',
    'Co-Founder',
    15.00,
    'S006',
    NULL
),

-- Flipkart
(
    'F012',
    'Kalyan Krishnamurthy',
    'kalyan@gmail.com',
    'CEO',
    5.00,
    'S007',
    NULL
),

-- Your custom startups
(
    'F015',
    'Vaishnavi Karve',
    'vaishnavi@gmail.com',
    'CEO & Founder',
    60.00,
    'S015',
    1
),
(
    'F016',
    'Tejal Udgave',
    'tejal@gmail.com',
    'CTO & Founder',
    55.00,
    'S016',
    2
);

-- ──────────────────────────────────────────────
-- 5. INVESTORS (Real Indian VCs & Angels)
-- ──────────────────────────────────────────────
INSERT IGNORE INTO
    INVESTOR
VALUES
    -- Team investors
    (
        'INV001',
        'Trupti Mete',
        'Mete Ventures',
        'Angel',
        'India'
    ),
    (
        'INV002',
        'Rohit Singh',
        'Singh Capital',
        'VC',
        'India'
    ),

-- Real VCs
(
    'INV003',
    'Rajan Anandan',
    'Peak XV Partners',
    'VC',
    'India'
),
(
    'INV004',
    'Shailendra Singh',
    'Peak XV Partners',
    'VC',
    'India'
),
(
    'INV005',
    'Lee Fixel',
    'Tiger Global',
    'VC',
    'USA'
),
(
    'INV006',
    'Subrata Mitra',
    'Accel India',
    'VC',
    'India'
),
(
    'INV007',
    'Karthik Reddy',
    'Blume Ventures',
    'VC',
    'India'
),
(
    'INV008',
    'Kunal Bahl',
    'Titan Capital',
    'Angel',
    'India'
),
(
    'INV009',
    'Prosus Ventures',
    'Prosus (Naspers)',
    'Corporate',
    'Netherlands'
),
(
    'INV010',
    'SoftBank Vision',
    'SoftBank Group',
    'VC',
    'Japan'
),
(
    'INV011',
    'Masayoshi Son',
    'SoftBank Group',
    'VC',
    'Japan'
),
(
    'INV012',
    'Avnish Bajaj',
    'Matrix Partners India',
    'VC',
    'India'
),
(
    'INV013',
    'Sachin Bansal',
    'BAC Acquisitions',
    'Angel',
    'India'
),
(
    'INV014',
    'Binny Bansal',
    'xto10x Technologies',
    'Angel',
    'India'
),
(
    'INV015',
    'General Atlantic',
    'General Atlantic',
    'Private Equity',
    'USA'
),
(
    'INV016',
    'DST Global',
    'DST Global',
    'VC',
    'Hong Kong'
),
(
    'INV017',
    'Steadview Capital',
    'Steadview Capital',
    'Hedge Fund',
    'UK'
),
(
    'INV018',
    'Ribbit Capital',
    'Ribbit Capital',
    'VC',
    'USA'
),
(
    'INV019',
    'Anupam Mittal',
    'Shaadi.com Ventures',
    'Angel',
    'India'
),
(
    'INV020',
    'Namita Thapar',
    'Emcure Ventures',
    'Angel',
    'India'
),
;

-- ──────────────────────────────────────────────
-- 6. INVESTOR FOCUS INDUSTRIES
-- ──────────────────────────────────────────────
INSERT IGNORE INTO
    INVESTOR_FOCUS_INDUSTRY
VALUES
    -- Trupti & Rohit
    ('INV001', 'I001'),
    ('INV001', 'I002'),
    ('INV002', 'I003'),
    ('INV002', 'I004'),

-- Peak XV (Sequoia)
('INV003', 'I001'),
('INV003', 'I005'),
('INV003', 'I004'),
('INV004', 'I001'),
('INV004', 'I005'),
('INV004', 'I008'),

-- Tiger Global
('INV005', 'I001'), ('INV005', 'I004'), ('INV005', 'I005'),

-- Accel
('INV006', 'I001'), ('INV006', 'I005'), ('INV006', 'I010'),

-- Blume
('INV007', 'I001'), ('INV007', 'I002'), ('INV007', 'I010'),

-- Titan Capital
('INV008', 'I001'), ('INV008', 'I005'), ('INV008', 'I004'),

-- Prosus
('INV009', 'I005'), ('INV009', 'I004'),

-- SoftBank
('INV010', 'I008'),
('INV010', 'I004'),
('INV010', 'I005'),
('INV011', 'I008'),
('INV011', 'I004'),

-- Matrix
('INV012', 'I001'), ('INV012', 'I005'),

-- Angels (Sachin & Binny)
('INV013', 'I001'),
('INV013', 'I004'),
('INV014', 'I001'),
('INV014', 'I010'),

-- General Atlantic & DST
('INV015', 'I001'),
('INV015', 'I004'),
('INV015', 'I009'),
('INV016', 'I005'),
('INV016', 'I004'),

-- Steadview & Ribbit
('INV017', 'I001'), ('INV017', 'I005'), ('INV018', 'I001'),
('INV019', 'I004'), ('INV019', 'I010'),
('INV020', 'I002'), ('INV020', 'I003');


-- ──────────────────────────────────────────────
-- 7. FUNDING ROUNDS (Real-inspired data)
-- ──────────────────────────────────────────────
INSERT IGNORE INTO
    FUNDING_ROUND
VALUES
    -- Razorpay
    (
        'R001',
        'Seed',
        '2015-05-20',
        50000000,
        9000000,
        'S001'
    ),
    (
        'R002',
        'Series A',
        '2016-10-12',
        500000000,
        120000000,
        'S001'
    ),
    (
        'R003',
        'Series B',
        '2018-06-15',
        2500000000,
        500000000,
        'S001'
    ),
    (
        'R004',
        'Series C',
        '2020-10-08',
        10000000000,
        1000000000,
        'S001'
    ),

-- CRED
(
    'R005',
    'Seed',
    '2018-11-01',
    300000000,
    250000000,
    'S002'
),
(
    'R006',
    'Series A',
    '2019-08-20',
    2500000000,
    600000000,
    'S002'
),
(
    'R007',
    'Series B',
    '2020-12-15',
    8000000000,
    1500000000,
    'S002'
),
(
    'R008',
    'Series C',
    '2021-10-08',
    50000000000,
    3500000000,
    'S002'
),

-- Zerodha (bootstrapped - only initial)
(
    'R009',
    'Initial',
    '2010-08-15',
    1000000,
    500000,
    'S003'
),

-- PhonePe
(
    'R010',
    'Series A',
    '2017-04-10',
    5000000000,
    1500000000,
    'S004'
),
(
    'R011',
    'Series B',
    '2019-12-20',
    55000000000,
    5600000000,
    'S004'
),
(
    'R012',
    'Series C',
    '2022-01-10',
    100000000000,
    7000000000,
    'S004'
),

-- Zomato
(
    'R013',
    'Seed',
    '2010-01-15',
    5000000,
    1000000,
    'S005'
),
(
    'R014',
    'Series A',
    '2013-02-20',
    500000000,
    168000000,
    'S005'
),
(
    'R015',
    'Series B',
    '2015-04-10',
    10000000000,
    3500000000,
    'S005'
),
(
    'R016',
    'Series C',
    '2018-10-25',
    30000000000,
    4100000000,
    'S005'
),

-- Swiggy
(
    'R017',
    'Seed',
    '2015-04-12',
    25000000,
    2500000,
    'S006'
),
(
    'R018',
    'Series A',
    '2016-01-18',
    500000000,
    150000000,
    'S006'
),
(
    'R019',
    'Series B',
    '2017-05-29',
    5000000000,
    800000000,
    'S006'
),
(
    'R020',
    'Series C',
    '2021-07-20',
    55000000000,
    12000000000,
    'S006'
),

-- Flipkart
(
    'R021',
    'Seed',
    '2009-06-01',
    10000000,
    1000000,
    'S007'
),
(
    'R022',
    'Series A',
    '2010-04-15',
    250000000,
    100000000,
    'S007'
),
(
    'R023',
    'Series B',
    '2012-08-20',
    10000000000,
    1500000000,
    'S007'
),
(
    'R024',
    'Series C',
    '2014-07-29',
    120000000000,
    10000000000,
    'S007'
),

-- Nykaa
(
    'R025',
    'Seed',
    '2012-10-01',
    50000000,
    25000000,
    'S008'
),
(
    'R026',
    'Series A',
    '2015-03-20',
    800000000,
    200000000,
    'S008'
),
(
    'R027',
    'Series C',
    '2020-05-10',
    70000000000,
    2600000000,
    'S008'
),

-- Ola
(
    'R028',
    'Seed',
    '2011-04-01',
    30000000,
    3000000,
    'S010'
),
(
    'R029',
    'Series A',
    '2013-07-15',
    500000000,
    200000000,
    'S010'
),
(
    'R030',
    'Series B',
    '2015-04-20',
    30000000000,
    4200000000,
    'S010'
),
(
    'R031',
    'Series C',
    '2017-10-10',
    50000000000,
    11000000000,
    'S010'
),

-- BYJU'S
(
    'R032',
    'Seed',
    '2013-09-01',
    100000000,
    50000000,
    'S013'
),
(
    'R033',
    'Series A',
    '2016-03-28',
    5000000000,
    750000000,
    'S013'
),
(
    'R034',
    'Series C',
    '2019-07-25',
    100000000000,
    5400000000,
    'S013'
),

-- Unacademy
(
    'R035',
    'Seed',
    '2016-08-15',
    50000000,
    10000000,
    'S014'
),
(
    'R036',
    'Series A',
    '2018-06-12',
    700000000,
    175000000,
    'S014'
),
(
    'R037',
    'Series C',
    '2021-08-30',
    30000000000,
    4400000000,
    'S014'
),

-- Your startups
(
    'R038',
    'Pre-Seed',
    '2024-06-15',
    5000000,
    1200000,
    'S015'
),
(
    'R039',
    'Seed',
    '2025-01-10',
    30000000,
    8000000,
    'S015'
),
(
    'R040',
    'Pre-Seed',
    '2025-03-01',
    3000000,
    800000,
    'S016'
);

-- ──────────────────────────────────────────────
-- 8. INVESTMENTS (Who invested in which round)
-- ──────────────────────────────────────────────
INSERT IGNORE INTO
    INVESTMENT
VALUES
    -- Razorpay investments
    (
        'IV001',
        'INV005',
        'R002',
        80000000,
        8.00
    ), -- Tiger Global → Razorpay Series A
    (
        'IV002',
        'INV012',
        'R002',
        40000000,
        4.00
    ), -- Matrix → Razorpay Series A
    (
        'IV003',
        'INV004',
        'R003',
        250000000,
        5.00
    ), -- Peak XV → Razorpay Series B
    (
        'IV004',
        'INV005',
        'R003',
        250000000,
        5.00
    ), -- Tiger Global → Razorpay Series B
    (
        'IV005',
        'INV018',
        'R004',
        500000000,
        3.00
    ), -- Ribbit Capital → Razorpay Series C
    (
        'IV006',
        'INV004',
        'R004',
        300000000,
        2.00
    ), -- Peak XV → Razorpay Series C
    (
        'IV007',
        'INV015',
        'R004',
        200000000,
        1.50
    ), -- General Atlantic → Razorpay Series C

-- CRED investments
(
    'IV008',
    'INV004',
    'R005',
    150000000,
    25.00
), -- Peak XV → CRED Seed
(
    'IV009',
    'INV005',
    'R006',
    300000000,
    8.00
), -- Tiger Global → CRED Series A
(
    'IV010',
    'INV016',
    'R007',
    800000000,
    6.00
), -- DST Global → CRED Series B
(
    'IV011',
    'INV005',
    'R008',
    2000000000,
    3.00
), -- Tiger Global → CRED Series C
(
    'IV012',
    'INV017',
    'R008',
    1500000000,
    2.00
), -- Steadview → CRED Series C

-- Zomato investments
(
    'IV013',
    'INV003',
    'R013',
    500000,
    5.00
), -- Peak XV → Zomato Seed
(
    'IV014',
    'INV004',
    'R014',
    84000000,
    8.00
), -- Peak XV → Zomato Series A
(
    'IV015',
    'INV006',
    'R014',
    84000000,
    8.00
), -- Accel → Zomato Series A
(
    'IV016',
    'INV005',
    'R015',
    1500000000,
    7.00
), -- Tiger Global → Zomato Series B
(
    'IV017',
    'INV013',
    'R016',
    400000000,
    1.00
), -- Sachin Bansal → Zomato Series C

-- Swiggy investments
(
    'IV018',
    'INV006',
    'R017',
    1500000,
    3.00
), -- Accel → Swiggy Seed
(
    'IV019',
    'INV009',
    'R019',
    500000000,
    6.00
), -- Prosus → Swiggy Series B
(
    'IV020',
    'INV010',
    'R020',
    5000000000,
    5.00
), -- SoftBank → Swiggy Series C
(
    'IV021',
    'INV009',
    'R020',
    4000000000,
    4.00
), -- Prosus → Swiggy Series C

-- Flipkart investments
(
    'IV022',
    'INV006',
    'R021',
    500000,
    10.00
), -- Accel → Flipkart Seed
(
    'IV023',
    'INV005',
    'R022',
    60000000,
    12.00
), -- Tiger Global → Flipkart Series A
(
    'IV024',
    'INV009',
    'R023',
    800000000,
    5.00
), -- Prosus → Flipkart Series B
(
    'IV025',
    'INV005',
    'R024',
    5000000000,
    3.00
), -- Tiger Global → Flipkart Series C
(
    'IV026',
    'INV016',
    'R024',
    3000000000,
    2.00
), -- DST Global → Flipkart Series C
(
    'IV027',
    'INV010',
    'R024',
    2000000000,
    1.50
), -- SoftBank → Flipkart Series C

-- Nykaa investments
(
    'IV028',
    'INV015',
    'R026',
    100000000,
    6.00
), -- General Atlantic → Nykaa Series A
(
    'IV029',
    'INV017',
    'R027',
    1200000000,
    1.50
), -- Steadview → Nykaa Series C

-- Ola investments
(
    'IV030',
    'INV005',
    'R029',
    100000000,
    8.00
), -- Tiger Global → Ola Series A
(
    'IV031',
    'INV010',
    'R030',
    2000000000,
    5.00
), -- SoftBank → Ola Series B
(
    'IV032',
    'INV010',
    'R031',
    7000000000,
    10.00
), -- SoftBank → Ola Series C

-- BYJU'S investments
(
    'IV033',
    'INV004',
    'R032',
    30000000,
    15.00
), -- Peak XV → BYJU'S Seed
(
    'IV034',
    'INV005',
    'R033',
    500000000,
    5.00
), -- Tiger Global → BYJU'S Series A
(
    'IV035',
    'INV015',
    'R034',
    2000000000,
    1.50
), -- General Atlantic → BYJU'S Series C
(
    'IV036',
    'INV009',
    'R034',
    1500000000,
    1.00
), -- Prosus → BYJU'S Series C

-- Unacademy investments
(
    'IV037',
    'INV007',
    'R035',
    5000000,
    5.00
), -- Blume → Unacademy Seed
(
    'IV038',
    'INV004',
    'R036',
    100000000,
    7.00
), -- Peak XV → Unacademy Series A
(
    'IV039',
    'INV010',
    'R037',
    2000000000,
    4.00
), -- SoftBank → Unacademy Series C
(
    'IV040',
    'INV015',
    'R037',
    1500000000,
    3.00
), -- General Atlantic → Unacademy Series C

-- Your startup (QuickPay) investments
(
    'IV041',
    'INV001',
    'R038',
    800000,
    8.00
), -- Trupti → QuickPay Pre-Seed
(
    'IV042',
    'INV002',
    'R038',
    400000,
    4.00
), -- Rohit → QuickPay Pre-Seed
(
    'IV043',
    'INV001',
    'R039',
    4000000,
    6.00
), -- Trupti → QuickPay Seed
(
    'IV044',
    'INV007',
    'R039',
    4000000,
    6.00
), -- Blume → QuickPay Seed

-- MedAssist investment
(
    'IV045',
    'INV002',
    'R040',
    500000,
    10.00
), -- Rohit → MedAssist Pre-Seed
(
    'IV046',
    'INV008',
    'R040',
    300000,
    6.00
);
-- Titan Capital → MedAssist Pre-Seed

-- ──────────────────────────────────────────────
-- 9. EQUITY HISTORY (Ownership snapshots)
-- ──────────────────────────────────────────────
INSERT IGNORE INTO
    EQUITY_HISTORY (
        ownership_id,
        startup_id,
        round_id,
        stakeholder_type,
        stakeholder_id,
        equity_percentage
    )
VALUES
    -- Razorpay after Series C
    (
        'EH001',
        'S001',
        'R004',
        'Founder',
        'F002',
        22.00
    ),
    (
        'EH002',
        'S001',
        'R004',
        'Founder',
        'F003',
        22.00
    ),
    (
        'EH003',
        'S001',
        'R004',
        'Investor',
        'INV005',
        13.00
    ),
    (
        'EH004',
        'S001',
        'R004',
        'Investor',
        'INV004',
        7.00
    ),
    (
        'EH005',
        'S001',
        'R004',
        'Investor',
        'INV018',
        3.00
    ),
    (
        'EH006',
        'S001',
        'R004',
        'Investor',
        'INV012',
        4.00
    ),
    (
        'EH007',
        'S001',
        'R004',
        'Investor',
        'INV015',
        1.50
    ),

-- CRED after Series C
(
    'EH008',
    'S002',
    'R008',
    'Founder',
    'F004',
    12.00
),
(
    'EH009',
    'S002',
    'R008',
    'Investor',
    'INV004',
    25.00
),
(
    'EH010',
    'S002',
    'R008',
    'Investor',
    'INV005',
    11.00
),
(
    'EH011',
    'S002',
    'R008',
    'Investor',
    'INV016',
    6.00
),
(
    'EH012',
    'S002',
    'R008',
    'Investor',
    'INV017',
    2.00
),

-- Zerodha (bootstrapped)
(
    'EH013',
    'S003',
    'R009',
    'Founder',
    'F007',
    50.00
),
(
    'EH014',
    'S003',
    'R009',
    'Founder',
    'F008',
    50.00
),

-- Zomato after Series C
(
    'EH015',
    'S005',
    'R016',
    'Founder',
    'F001',
    4.70
),
(
    'EH016',
    'S005',
    'R016',
    'Investor',
    'INV003',
    5.00
),
(
    'EH017',
    'S005',
    'R016',
    'Investor',
    'INV004',
    8.00
),
(
    'EH018',
    'S005',
    'R016',
    'Investor',
    'INV005',
    7.00
),
(
    'EH019',
    'S005',
    'R016',
    'Investor',
    'INV006',
    8.00
),
(
    'EH020',
    'S005',
    'R016',
    'Investor',
    'INV013',
    1.00
),

-- Swiggy after Series C
(
    'EH021',
    'S006',
    'R020',
    'Founder',
    'F010',
    5.00
),
(
    'EH022',
    'S006',
    'R020',
    'Founder',
    'F011',
    3.00
),
(
    'EH023',
    'S006',
    'R020',
    'Investor',
    'INV009',
    10.00
),
(
    'EH024',
    'S006',
    'R020',
    'Investor',
    'INV010',
    5.00
),
(
    'EH025',
    'S006',
    'R020',
    'Investor',
    'INV006',
    3.00
),

-- Flipkart after Series C
(
    'EH026',
    'S007',
    'R024',
    'Founder',
    'F012',
    5.00
),
(
    'EH027',
    'S007',
    'R024',
    'Investor',
    'INV005',
    15.00
),
(
    'EH028',
    'S007',
    'R024',
    'Investor',
    'INV006',
    10.00
),
(
    'EH029',
    'S007',
    'R024',
    'Investor',
    'INV009',
    5.00
),
(
    'EH030',
    'S007',
    'R024',
    'Investor',
    'INV016',
    2.00
),
(
    'EH031',
    'S007',
    'R024',
    'Investor',
    'INV010',
    1.50
),

-- Nykaa after Series C
(
    'EH032',
    'S008',
    'R027',
    'Founder',
    'F009',
    53.50
),
(
    'EH033',
    'S008',
    'R027',
    'Investor',
    'INV015',
    6.00
),
(
    'EH034',
    'S008',
    'R027',
    'Investor',
    'INV017',
    1.50
),

-- Ola after Series C
(
    'EH035',
    'S010',
    'R031',
    'Founder',
    'F005',
    10.00
),
(
    'EH036',
    'S010',
    'R031',
    'Founder',
    'F006',
    5.00
),
(
    'EH037',
    'S010',
    'R031',
    'Investor',
    'INV005',
    8.00
),
(
    'EH038',
    'S010',
    'R031',
    'Investor',
    'INV010',
    15.00
),

-- QuickPay after Seed
(
    'EH039',
    'S015',
    'R039',
    'Founder',
    'F015',
    46.00
),
(
    'EH040',
    'S015',
    'R039',
    'Investor',
    'INV001',
    14.00
),
(
    'EH041',
    'S015',
    'R039',
    'Investor',
    'INV002',
    4.00
),
(
    'EH042',
    'S015',
    'R039',
    'Investor',
    'INV007',
    6.00
),

-- MedAssist after Pre-Seed
(
    'EH043',
    'S016',
    'R040',
    'Founder',
    'F016',
    39.00
),
(
    'EH044',
    'S016',
    'R040',
    'Investor',
    'INV002',
    10.00
),
(
    'EH045',
    'S016',
    'R040',
    'Investor',
    'INV008',
    6.00
);
