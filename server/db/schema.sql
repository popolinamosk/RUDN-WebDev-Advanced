DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id           INTEGER     GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email        TEXT        NOT NULL UNIQUE,
  display_name TEXT        NOT NULL
);

CREATE TABLE cards (
  id         INTEGER     GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title      TEXT        NOT NULL,
  is_done    BOOLEAN     NOT NULL DEFAULT false,
  is_urgent  BOOLEAN     NOT NULL DEFAULT false,
  owner_id   INTEGER     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX cards_owner_id_idx ON cards(owner_id);
