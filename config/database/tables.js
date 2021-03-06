export const usersTable = `
  CREATE TABLE IF NOT EXISTS
  users (
    user_id           BIGSERIAL NOT NULL PRIMARY KEY,
    email             VARCHAR(150) NOT NULL CONSTRAINT unique_email UNIQUE,
    first_name        VARCHAR(150) NOT NULL,
    last_name         VARCHAR(150) NOT NULL,
    password          VARCHAR(250) NOT NULL,
    avatar            VARCHAR(250),
    phone_number      VARCHAR(20),
    address           VARCHAR(250),
    bio               VARCHAR(250),
    role              VARCHAR(10) DEFAULT 'user' CONSTRAINT valid_role CHECK(role = 'user' OR role = 'agent' OR role = 'admin'),
    date_registered   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    active            BOOLEAN DEFAULT true CONSTRAINT active_values CHECK(active = true OR active = false),
    verified          BOOLEAN DEFAULT false CONSTRAINT verified_values CHECK(active = true OR active = false),
    hashed_token      VARCHAR(200),
    token_expires_in  TIMESTAMPTZ,
    password_changed_at TIMESTAMPTZ
  );

  CREATE INDEX IF NOT EXISTS hashed_token_index ON users(hashed_token);
`;

export const propertyTable = `
  CREATE TABLE IF NOT EXISTS
  properties (
    property_id     BIGSERIAL NOT NULL PRIMARY KEY,
    owner           BIGINT REFERENCES users(user_id) ON DELETE RESTRICT NOT NULL,
    status          VARCHAR(10) DEFAULT 'available' CONSTRAINT verified_status CHECK(status = 'available' OR status = 'sold' OR status = 'rent'),
    type            VARCHAR(100) NOT NULL,
    price           MONEY NOT NULL,
    state           VARCHAR(50) NOT NULL,
    city            VARCHAR(50) NOT NULL,
    address         VARCHAR(250) NOT NULL,
    created_on      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_on      TIMESTAMPTZ,
    property_image  VARCHAR(250)
  );
`;

export const flagsTable = `
  CREATE TABLE IF NOT EXISTS
  flags (
    flag_id         BIGSERIAL NOT NULL PRIMARY KEY,
    property        BIGINT REFERENCES properties(property_id) ON DELETE RESTRICT,
    created_on      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    reason          VARCHAR(100) NOT NULL,
    description     TEXT
  );

  CREATE INDEX IF NOT EXISTS reason_index ON flags(reason);
`;
