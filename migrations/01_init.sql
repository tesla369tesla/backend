CREATE SEQUENCE IF NOT EXISTS userprofile_user_id_seq;

CREATE TABLE userprofile (
    user_id integer NOT NULL DEFAULT nextval('userprofile_user_id_seq'::regclass),
    firstname character varying(255) COLLATE pg_catalog."default" NOT NULL,
    lastname character varying(255) COLLATE pg_catalog."default" NOT NULL,
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    password character varying(255) COLLATE pg_catalog."default" NOT NULL,
    created_time timestamp(6) with time zone,
    last_updated_time timestamp(6) with time zone,
    is_valid_domain boolean DEFAULT false,
    confirmation_token character varying(255) COLLATE pg_catalog."default",
    confirmed_email boolean DEFAULT false,
    CONSTRAINT userprofile_pkey PRIMARY KEY (user_id)
);