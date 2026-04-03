
CREATE DATABASE IF NOT EXISTS SFITS_DBMS_PRJ;
USE SFITS_DBMS_PRJ;

-- Table 1: INDUSTRY
CREATE TABLE IF NOT EXISTS INDUSTRY (
    industry_id VARCHAR(5) PRIMARY KEY,
    industry_name VARCHAR(100) NOT NULL UNIQUE
);

-- Table 2: STARTUP
CREATE TABLE IF NOT EXISTS STARTUP (
    startup_id VARCHAR(5) PRIMARY KEY,
    startup_name VARCHAR(100) NOT NULL UNIQUE,
    founded_year YEAR NOT NULL,
    stage ENUM('Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C') NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    country VARCHAR(50) NOT NULL,
    industry_id VARCHAR(5) NOT NULL,
    FOREIGN KEY (industry_id) REFERENCES INDUSTRY(industry_id)
);

-- Table 3: FOUNDER
CREATE TABLE IF NOT EXISTS FOUNDER (
    founder_id VARCHAR(5) PRIMARY KEY,
    founder_name VARCHAR(100) NOT NULL,
    founder_role VARCHAR(50) NOT NULL,
    initial_equity DECIMAL(5,2) NOT NULL,
    CONSTRAINT chk_initial_equity CHECK (initial_equity > 0 AND initial_equity <= 100),
    startup_id VARCHAR(5) NOT NULL,
    FOREIGN KEY (startup_id) REFERENCES STARTUP(startup_id)
);

-- Table 4: INVESTOR
CREATE TABLE IF NOT EXISTS INVESTOR (
    investor_id VARCHAR(6) PRIMARY KEY,
    investor_name VARCHAR(100) NOT NULL,
    firm_name VARCHAR(100) NOT NULL,
    investor_type ENUM('VC', 'Angel', 'Corporate', 'Private Equity', 'Hedge Fund', 'Family Office', 'Government', 'Accelerator', 'Incubator', 'Crowdfunding') NOT NULL,
    country VARCHAR(50) NOT NULL
);

-- Table 5: FUNDING_ROUND
CREATE TABLE IF NOT EXISTS FUNDING_ROUND (
    round_id VARCHAR(5) PRIMARY KEY,
    round_type ENUM('Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C') NOT NULL,
    round_date DATE NOT NULL,
    valuation BIGINT UNSIGNED NOT NULL,
    total_amount_raised BIGINT UNSIGNED NOT NULL,
    startup_id VARCHAR(5) NOT NULL,
    FOREIGN KEY (startup_id) REFERENCES STARTUP(startup_id)
);

-- Table 6: INVESTOR_FOCUS_INDUSTRY
CREATE TABLE IF NOT EXISTS INVESTOR_FOCUS_INDUSTRY (
    investor_id VARCHAR(6) NOT NULL,
    industry_id VARCHAR(5) NOT NULL,
    PRIMARY KEY (investor_id, industry_id),
    FOREIGN KEY (investor_id) REFERENCES INVESTOR(investor_id) ON DELETE CASCADE,
    FOREIGN KEY (industry_id) REFERENCES INDUSTRY(industry_id) ON DELETE CASCADE
);

-- Table 7: INVESTMENT
CREATE TABLE IF NOT EXISTS INVESTMENT (
    investment_id VARCHAR(6) PRIMARY KEY,
    investor_id VARCHAR(6) NOT NULL,
    round_id VARCHAR(5) NOT NULL,
    amount_invested BIGINT UNSIGNED NOT NULL,
    equity_acquired DECIMAL(5,2) NOT NULL,
    CONSTRAINT chk_equity_acquired CHECK (equity_acquired > 0 AND equity_acquired <= 100),
    CONSTRAINT unique_investor_round UNIQUE (investor_id, round_id),
    FOREIGN KEY (investor_id) REFERENCES INVESTOR(investor_id),
    FOREIGN KEY (round_id) REFERENCES FUNDING_ROUND(round_id)
);

-- Table 8: EQUITY_HISTORY
CREATE TABLE IF NOT EXISTS EQUITY_HISTORY (
    ownership_id VARCHAR(6) PRIMARY KEY,
    startup_id VARCHAR(5) NOT NULL,
    round_id VARCHAR(5) NOT NULL,
    stakeholder_type ENUM('Founder', 'Investor') NOT NULL,
    stakeholder_id VARCHAR(6) NOT NULL,
    equity_percentage DECIMAL(5,2) NOT NULL,
    CONSTRAINT chk_equity_percentage CHECK (equity_percentage > 0 AND equity_percentage <= 100),
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (startup_id) REFERENCES STARTUP(startup_id),
    FOREIGN KEY (round_id) REFERENCES FUNDING_ROUND(round_id)
);

SHOW TABLES;

    
    
    